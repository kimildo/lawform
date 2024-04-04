let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');
let writing = {
    register: async (wi) => { // wi = writingInfo
        console.log( 'wi' , wi )
        return new Promise(async (resolve, reject) => {
            var bindData = JSON.stringify(wi.binddata);
            if( wi.binddata === null ) bindData = null;
            db.query(
                'INSERT INTO writing (idusers, iddocuments, idpayments, template_id, title, binddata, editabledate, expiredate, etc) VALUES (?,?,?,?,?,?,?,?,?)',
                [wi.idusers, wi.iddocuments, wi.idpayments, wi.template_id, wi.title, bindData, wi.editabledate, wi.expiredate, wi.etc])
                .then((rows) => {
                    return resolve(rows);
                }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    getByIdusers: async(idusers, params) => {
        return new Promise(async (resolve, reject) => {
            let order = ( params.order ) ? ` ORDER BY ${params.order} ${params.sort}` : ``;
            let offset = ( params.offset ) ? ` limit ${params.offset} ` : ``;
            let where = ( params.where ) ? ` AND ${params.where} ` : ``;
            let select = ( params.select ) ? params.select : ` * `
            let sql = `
                SELECT ${select} FROM writing as w 
                    JOIN documents as d ON w.iddocuments = d.iddocuments
                    JOIN category_1 c on d.idcategory_1 = c.idcategory_1
                    LEFT JOIN writing_peer_reviews AS wpr ON (wpr.user_idx = w.idusers AND wpr.writing_idx = w.idwriting AND wpr.status = 1)
                WHERE w.view = 'Y'
                  AND w.status = 1 
                  AND w.idusers = ${idusers}
                      ${where} 
                      ${order} 
                      ${offset} 
            `

            db.query(sql).then((rows)=> {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    saveBindData: async (bindData, idusers, idwriting, file) => {
        let bindDataJson = JSON.stringify(bindData)
        if(bindData === null ) bindDataJson = null;
        return new Promise(async (resolve, reject) => {
            var query_file = ''
            if (!!file){
                query_file = ` , file = '${file}' `;
            }
            db.query('UPDATE writing SET binddata = ?  '+query_file+'  WHERE idusers = ? AND idwriting = ?', [bindDataJson, idusers, idwriting ]).then((rows) => {
                return resolve(true);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    loadBindData: async (idusers, idwriting) => {
        return new Promise(async (resolve, reject) => {
            db.query('SELECT w.idwriting, w.idusers, w.iddocuments, d.template_data, w.title, w.binddata FROM writing as w JOIN document_template as d ON w.template_id = d.template_id WHERE w.idusers = ? AND w.idwriting = ?', [idusers, idwriting]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    loadInfo: async (idusers, idwriting) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT now()                 AS sysdate,
                       d.title,
                       d.description,
                       d.idcategory_1,
                       w.idwriting,
                       w.iddocuments,
                       w.file,
                       w.expiredate,
                       w.binddata,
                       ISNULL(w.binddata)    AS emptybindata,
                       wpr.idx               AS writing_peer_idx,
                       wpr.processing_status AS writing_peer_processing_status,
                       dt.template_data,
                       wpr.file_name,
                       wpr.user_check_new_document,
                       (SELECT COUNT(*) FROM writing_review wr WHERE wr.idwriting = w.idwriting AND wr.status IN ('Y', 'N')) AS WR_CNT
                FROM writing as w
                         JOIN users AS u on u.idusers = w.idusers
                         JOIN documents AS d ON w.iddocuments = d.iddocuments
                         JOIN document_template as dt ON w.template_id = dt.template_id
                         LEFT JOIN writing_peer_reviews AS wpr ON (wpr.user_idx = w.idusers AND wpr.writing_idx = w.idwriting AND wpr.status = 1)
                WHERE w.idusers = ?
                  AND w.idwriting = ?
                  AND w.status = 1
            `

            db.query(sql, [idusers, idwriting]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateTitleData: async (title, idusers, idwriting) => {
        return new Promise(async (resolve, reject) => {
            db.query('UPDATE writing SET title = ? WHERE idusers = ? AND idwriting = ?', [title, idusers, idwriting]).then((rows) => {
                return resolve(true);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    deleteData: async (idusers, idwriting) => {
        return new Promise(async (resolve, reject) => {
            db.query('UPDATE writing SET view = \'N\' WHERE idwriting = ? AND idusers = ?', [idwriting, idusers]).then((rows) => {
                return resolve(true);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    extensionOfTerm: async ( idusers, idwriting , type ) => {
        return new Promise(async (resolve, reject) => {
            if( !type ) return resolve(false)
            let setValue;
            if( type ==='edit' ) setValue = ` editabledate = DATE_ADD(NOW(), INTERVAL 7 DAY) `;
            if( type ==='expire' ) setValue = ` expiredate = DATE_ADD(NOW(), INTERVAL 7 DAY) `;
            let sql = `UPDATE writing SET ${setValue} WHERE idwriting = ? AND idusers = ?`;
            db.query(sql, [idwriting, idusers]).then((rows) => {
                return resolve(true);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    review: async ( idusers, idwriting , email, content ) => {
        return new Promise(async (resolve, reject) => {
            let sql = `INSERT INTO writing_review (idusers, idwriting, email, content ) VALUES (?,?,?,?)`;
            db.query(sql, [idusers, idwriting, email, content]).then((rows) => {
                return resolve(true);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    useredit: async ( idusers, idwriting , content ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT COUNT(*) as exist FROM  writing_edit WHERE idusers = ? AND idwriting = ? `, [idusers, idwriting]).then((rows) => {

                let sql;
                if( rows[0].exist > 0 ) {
                    sql = `UPDATE writing_edit SET content = ? WHERE idusers = ? AND idwriting = ?`;
                    // console.log( 'update' )
                }else {
                    sql = `INSERT INTO writing_edit ( content, idusers, idwriting ) VALUES (?,?,?)`;
                    // console.log( 'INSERT' )
                }
                db.query(sql, [content, idusers, idwriting]).then((rows) => {
                    return resolve(true);
                }).catch((err) => {
                    logger.error(err);
                    return reject(err);
                });
            })
        });
    },
    loadedit: async ( idusers, idwriting ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT content  FROM  writing_edit WHERE idusers = ? AND idwriting = ? `, [idusers, idwriting]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
}

module.exports = writing;