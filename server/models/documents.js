let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');
let documents = {
    getAllOrderByCategory: async () => {
        return new Promise(async (resolve, reject) => {
            db.query('SELECT a.iddocuments, a.description as des, a.title, b.name FROM documents AS a JOIN category_1 AS b ON a.idcategory_1 = b.idcategory_1 ORDER BY a.idcategory_1').then((rows) => {

                if (db.isEmpty(rows)) { return reject('There is no documents info data.'); }
                resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    getDocumentsByParams: async (params) => {
        var order = "";
        var limit = "";
        var doc_like = ""
        if( !!params.order )    order = "ORDER BY a."+ params.order;
        if( !!params.sort )     order = order +" "+ params.sort;
        if( !!params.max )      limit = " limit "+params.max;
        if( !!params.idusers )  doc_like = ", if( ( SELECT iddocuments_like FROM documents_like WHERE idusers = "+params.idusers+" AND iddocuments = a.iddocuments ), TRUE, FALSE )AS `like`";
        var sql = 'SELECT a.iddocuments, a.description as des, a.title, a.idcategory_1, b.name '+doc_like+' FROM documents AS a JOIN category_1 AS b ON a.idcategory_1 = b.idcategory_1 '+order+limit;
        return new Promise(async (resolve, reject) => {
            db.query(sql ).then((rows) => {

                if (db.isEmpty(rows)) { return reject('There is no documents info data.'); }
                resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    likeDocument: async (idusers, iddocuments) => {
        return new Promise(async (resolve, reject) => {
            documents.getLikedDocument( idusers, iddocuments ).then( (rows) => {
                if( rows[0] ) {
                    // console.log("DELETED : ", idusers , iddocuments )
                    db.query('DELETE FROM documents_like WHERE idusers = ? AND iddocuments = ? ', [idusers, iddocuments]).then((rows) => {
                        return resolve(false);
                    }).catch((err) => {
                        logger.error(err);
                        return reject(err);
                    });
                } else {
                    // console.log("INSERTED : ", idusers , iddocuments )
                    db.query('INSERT INTO documents_like (idusers, iddocuments) VALUES (?,?)', [idusers, iddocuments]).then((rows) => {
                        return resolve(true);
                    }).catch((err) => {
                        logger.error(err);
                        return reject(err);
                    });
                }
            } )


        });
    },
    getLikedDocument: async (idusers , iddocuments = null) => {
        return new Promise(async (resolve, reject) => {
            var set = [idusers];
            var sql = 'SELECT iddocuments FROM documents_like WHERE idusers = ?';
            if( !!iddocuments ) {
                set = [idusers, iddocuments];
                var sql = 'SELECT iddocuments FROM documents_like WHERE idusers = ? AND iddocuments = ?';
            }
            db.query(sql, set).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    getDetailInfo: async (idusers, iddocuments) => {

        return new Promise(async (resolve, reject) => {
            try {

                let docuInfo = await db.query('SELECT b.name, a.idcategory_1, a.iddocuments, a.template_id, a.title, a.price, a.dc_price, a.dc_rate, a.description , a.category_sub FROM documents AS a JOIN category_1 AS b ON a.idcategory_1 = b.idcategory_1 WHERE iddocuments = ? group by b.name', [iddocuments]);
                let docuList = await db.query('SELECT b.name, a.idcategory_1, a.iddocuments, a.title, a.price, a.dc_price, a.dc_rate, a.description FROM documents AS a JOIN category_1 AS b ON a.idcategory_1 = b.idcategory_1 WHERE b.idcategory_1 = ? AND iddocuments != ? ', [docuInfo[0].idcategory_1,iddocuments]);
                docuInfo[0].doculist = docuList;
                // console.log(docuList);
                if (db.isEmpty(docuInfo)) return resolve(null);
                docuInfo.liked = false; //DEBUG!!
                docuInfo.others = { title :'양해각서에 필요한 법률문서', iddocuments : [1,2,3,4]}; //DEBUG!!
                return resolve(docuInfo);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    getCategory: async (iddcategory) => {

        return new Promise(async (resolve, reject) => {
            try {

                let cateInfo = await db.query('SELECT a.title, a.iddocuments, a.description as des, a.idcategory_1, a.price, a.dc_price, b.description_1, b.name, b.definition, b.description FROM documents AS a JOIN category_1 AS b ON a.idcategory_1 = b.idcategory_1 WHERE a.status = "Y" AND  b.idcategory_1 = ? ORDER BY title asc', [iddcategory]);
                let cateList = await db.query('select * from category_1');

                cateInfo[0].cateList = cateList;
                if (db.isEmpty(cateInfo)) return resolve(null);
                // cateInfo.liked = false; //DEBUG!!
                // cateInfo.others = { title :'양해각서에 필요한 법률문서', iddocuments : [1,2,3,4]}; //DEBUG!!
                return resolve(cateInfo);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    getCategoryDocs: async (category) => {

        return new Promise(async (resolve, reject) => {
            try {
                let cateInfo = await db.query(`SELECT 
                                                    title, 
                                                    iddocuments, 
                                                    idcategory_1, 
                                                    price, 
                                                    dc_price
                                                    FROM documents
                                                where JSON_CONTAINS( category_sub, '[${category}]' ) AND status = 'Y' ORDER BY title asc
                                                `);
                let cateList = await db.query(`SELECT * FROM category_sub ORDER BY idx`);

                cateInfo[0].cateList = cateList;
                if (db.isEmpty(cateInfo)) return resolve(null);
                return resolve(cateInfo);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },


    getTemplateInfo: async (iddocuments) => {

        return new Promise(async (resolve, reject) => {
            try {

                let templateInfo = await db.query('SELECT b.* FROM documents AS a JOIN document_template AS b ON a.template_id = b.template_id WHERE a.iddocuments = ?', [iddocuments]);

                if (db.isEmpty(templateInfo)) return resolve(null);
                return resolve(templateInfo);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    isFree: async (iddocuments) => {
        return new Promise(async (resolve, reject) => {
            try {
                let docuInfo = await db.query('SELECT iddocuments FROM documents WHERE dc_price = 0 AND iddocuments = ?', [iddocuments]);

                if (db.isEmpty(iddocuments)) return resolve(false);
                else return resolve(true);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    checkTester: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            try {
                let tester = await db.query('SELECT tester FROM users WHERE idusers = ?', [idusers]);
                // let docuInfo = await db.query('SELECT iddocuments FROM documents WHERE iddocuments = ?', [iddocuments]);

                if (db.isEmpty(idusers)) return resolve(false);
                else return resolve(tester);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    getTemplatePreview: async (iddocuments) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.query("SELECT JSON_EXTRACT(t.template_data, '$.title') AS title,  d.title AS h1, d.h2 AS h2, d.desc1 as desc1, d.desc2 as desc2, JSON_EXTRACT(t.template_data, '$.outputTitle') AS outputTitle,JSON_EXTRACT(t.template_data,'$.outputTitle_underline') AS outputTitle_underline, JSON_EXTRACT(t.template_data, '$.inputSections') AS inputSections, JSON_EXTRACT(d.description, '$[0].context') AS `context`,d.price AS price, d.dc_price AS dc_price, d.idcategory_1 AS idcategory_1, d.description AS description, d.dc_rate AS dc_rate FROM documents AS d JOIN document_template AS t ON d.template_id = t.template_id JOIN category_1 AS c ON d.idcategory_1 = c.idcategory_1 WHERE d.iddocuments = ?", [iddocuments]);
                if (db.isEmpty(data)) return resolve(null);
                return resolve(data);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

    getTemplatePreWrite: async (iddocuments) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.query("SELECT d.title AS h1, d.h2 AS h2, d.desc1 as desc1, d.desc2 as desc2, t.template_data AS template_data, d.price AS price, d.dc_price AS dc_price, d.idcategory_1 AS idcategory_1, d.description AS description, d.dc_rate AS dc_rate FROM documents AS d JOIN document_template AS t ON d.template_id = t.template_id JOIN category_1 AS c ON d.idcategory_1 = c.idcategory_1 WHERE d.iddocuments = ?", [iddocuments]);
                if (db.isEmpty(data)) return resolve(null);
                return resolve(data);
            }
            catch(err) {
                logger.error(err);
                return reject(err);
            }
        });
    },

}

module.exports = documents;
