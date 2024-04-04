let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

let log = {
    write: async (params) => {
        return new Promise(async(resolve, reject)=> {
            db.query(`INSERT INTO log ( idusers, action, data ) VALUES (?,?,?) `,
                [params.idusers, params.action, JSON.stringify(params.data) ]
            ).then((rows) => {
                return resolve(rows.insertId);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    }
};

module.exports = log;