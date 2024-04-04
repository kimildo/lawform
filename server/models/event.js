let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

let event = {
    setData: async ( params ) => {
        if( !params.idusers ) params.idusers = null
        return new Promise(async (resolve, reject) => {
            var sql  = `INSERT INTO event_data ( event, data, idusers ) VALUES ( ${params.event} , '${JSON.stringify( params.data ).replace(/\\/g,"\\\\") }' , ${ params.idusers } )`;
            await db.query( sql ).then((rows) => {
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
    },

    checkOne: async ( params ) => {
        var where = ` WHERE \`event\` = ${params.event} AND  idusers = ${params.idusers}`;
        var sql = `SELECT * FROM event_data ${where} `;
        return new Promise(async (resolve, reject) => {
            await db.query(sql).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })
        })
    },

    checkDupe: async ( params, dupe ) => {
        var data = JSON.parse( params.data );
        var where = ` WHERE \`event\` = ${params.event} `;
        for(var i in dupe) {
            if( Number(i) === 0  ) where += ` AND ( `;
            where += ` JSON_EXTRACT(data, "$.${dupe[i]}") = '${data[dupe[i]]}' `;
            if( i < ( dupe.length -1 ) ) where += ` OR `;
            if( Number( i ) ===  ( dupe.length -1 ) ) where += ` )`;
        }
        var sql = `SELECT * FROM event_data ${where} `;
        return new Promise(async (resolve, reject) => {
            await db.query(sql).then((rows) => {
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
    },

    checkFirstPaymentSurvey: async ( params, dupe ) => {
        return new Promise(async (resolve, reject) => {
            await db.query(`SELECT if( ( SELECT COUNT(*) FROM event_data ed WHERE event = 3 AND idusers = p.idusers  ) > 0 , 'Y' , 'N' ) AS result, ( SELECT idwriting FROM writing WHERE idpayments = p.idpayments  )	as idwriting FROM payments p WHERE  p.idusers = ? AND p.status = 'Y' AND p.event = 'firstPayment_survey'`,[params.idusers]).then((rows) => {
                if (db.isEmpty(rows)) {
                    return resolve(null);
                } else {
                    return resolve(rows[0]);
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            })
        })
    }


};

module.exports = event;