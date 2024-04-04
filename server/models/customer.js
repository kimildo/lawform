const axios = require('axios')
const jwt = require('jsonwebtoken')

let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');
let sha512 = require('../utils/salt_sha512');

let salt = 'sobongamicus123!'
let customer = {
    getNotice: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            let where = ( !!params.idx )?` AND idx = ${params.idx}`:``;
            let sql = "SELECT * FROM notice WHERE status = 'Y' "+where+" order by idx desc;";
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null);
                else {
                    return resolve(rows);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    getFaq: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            let where = ( !!params.category )?` AND category = ${params.category}`:``;
            let sql = "SELECT * FROM faq WHERE status = 'Y' "+where+";";
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null);
                else {
                    return resolve(rows);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    
    getCounsel: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            let sql = "SELECT * FROM counsel WHERE status = 'Y' ";
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null);
                else {
                    return resolve(rows);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    writingQuestion: async ( question, email, phone, idusers, program_group, public ) => {
        let query_set =  {
            question, email, phone, idusers, program_group, public
        }
        return new Promise( async( resolve, reject ) => {
            await db.query("INSERT INTO users_qna SET ?", query_set).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error');
                else {
                   return resolve('ok');
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },



    listUserReviews: async ( params ) => {
        return new Promise( async( resolve, reject ) => {
            var where = " WHERE r.status = 'Y' ";
            if( !!params.document ) {
                where += ` AND document = ${params.document}`;
            }
            var orderBy = "";
            if(!!params.orderBy) orderBy = params.orderBy;
            var sql = `SELECT ${params.select} FROM reviews r LEFT JOIN documents as d ON r.document = d.iddocuments LEFT JOIN users AS u ON r.idusers = u.idusers ${where} ${orderBy} ${params.limit} `;
            await db.query(sql ).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error');
                else {
                   return resolve(rows);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

};

module.exports = customer;