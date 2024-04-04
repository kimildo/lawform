let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

let board = {

    list : async (params) => {
        return new Promise(async (resolve, reject) => {
            var where = `where status = 'Y' AND board= ${params.board} `
            var per = !!params.per?params.per:12;
            var limit = `LIMIT ${!!params.page?(params.page-1)*per:0} , ${per} `;
            var order = "order by idx desc";
            var sql = `select * from board_data ${where} ${order} ${limit}`
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(null);
                } else {
                    db.query(`SELECT COUNT(*) as total FROM board_data ${where} `).then((totalRows) => {
                        return resolve({rows:rows,total:totalRows[0].total});
                    });
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })

        })
    },

    magazine: async (params) => {
        return new Promise(async (resolve, reject) => {
            var where = "where status = 'Y' AND viewdatetime <= NOW()";
            var per = !!params.per?params.per:12;
            var limit = `LIMIT ${!!params.page?(params.page-1)*per:0} , ${per} `;
            if( !!params.nolimit && params.nolimit === true ) limit = ''
            if( !!params.category){
                where += ` AND category = '${params.category}' `;
            }
            if( !!params.tag ){
                where += ` AND find_in_set( '${params.tag}' , tags ) `;
            }
            var order = "order by sort desc, viewdatetime desc, idx desc";
            var sql = `select * from magazine ${where} ${order} ${limit}`
            if( !!params.idx ) {
                sql = ` SELECT 
                        m.* 
                        FROM
                        magazine m
                        JOIN 
                        (
                            ( SELECT idx FROM magazine WHERE status = 'Y' AND idx < ${params.idx} ORDER BY idx DESC LIMIT 3 )
                            union 
                            ( SELECT idx FROM magazine WHERE status = 'Y' AND idx >= ${params.idx} ORDER BY idx LIMIT 3 )
                        ) l
                        ON m.idx = l.idx
                        ${order}
                        `
            }
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(null);
                } else {
                    db.query(`SELECT COUNT(*) as total FROM magazine ${where} `).then((totalRows) => {
                        return resolve({rows:rows,total:totalRows[0].total});
                    });
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })
        })
    },

    magazineView: async (params) => {
        return new Promise(async (resolve, reject) => {
            var where = "where status = 'Y' AND viewdatetime <= NOW()";
            if( params.idx ) {
                where += ` AND idx = '${params.idx}'`
            }
            var per = !!params.per?params.per:12;
            var limit = `LIMIT ${!!params.page?(params.page-1)*per:0} , ${per} `;
            if( !!params.category){
                where += ` AND category = '${params.category}' `;
            }
            if( !!params.tag ){
                where += ` AND find_in_set( '${params.tag}' , tags ) `;
            }
            var order = "order by sort desc, viewdatetime desc";
            await db.query(`select * from magazine ${where} ${order} ${limit}`).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(null);
                } else {
                    db.query(`SELECT COUNT(*) as total FROM magazine ${where} `).then((totalRows) => {
                        return resolve({rows:rows,total:totalRows[0].total});
                    });
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })
        })
    },



    magazineTags:async ( params ) => {
        return new Promise(async (resolve, reject) => {
            var sql = "SELECT GROUP_CONCAT( DISTINCT(tags) SEPARATOR ',') as tags FROM magazine m WHERE tags != '' AND status = 'Y' ;"
            await db.query(sql)
                .then((result) => {
                    return resolve(result[0]);
                }).catch((err) => {
                    logger.error(err);
                    return reject(err);
            });
        })
    },

    press: async (params) => {
        return new Promise(async (resolve, reject) => {
            var where = "where status = 'Y' ";
            var order = "order by idx desc";
            if( params.type === 'main' ){
                where += " AND `main` IS NOT NULL ";
                order = "order by main asc";
            }
            await db.query(`select * from press ${where} ${order}`).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(null);
                } else {
                    return resolve(rows);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })
        })
    }
};

module.exports = board;