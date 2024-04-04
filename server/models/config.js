let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

let config = {
    values: async (params) => {
        return new Promise(async (resolve, reject) => {
            var where = `where name = '${params.name}'`;
            var limit = `LIMIT 1`;
            await db.query(`select * from config ${where} ${limit}`).then((rows) => {
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

module.exports = config;