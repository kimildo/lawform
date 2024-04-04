let db = require('../utils/rdb');

module.exports = {
    get: async (payload) => {
        console.log(payload)
        return new Promise(async(resolve, reject)=> {
            var sql = `
                SELECT
                    idx
                FROM
                    reviews r
                WHERE
                    r.idx = ${payload.peer_idx}
            `;
            await db.query(sql).then((result)=> {
                return resolve( result );
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    get_review_list: async (payload) => {
        return new Promise(async(resolve, reject)=> {
            var SELECT = ''
            var FROM = ''
            var WHERE = ''

            if ("count" in payload && payload.count){
                SELECT = ` count(r.idx) as cnt `;
            } else{
                SELECT =
                `
                r.idx,
                r.idusers,
                r.content,
                r.score
                `;
            }
            FROM =
            `
            reviews r,
            writing_peer_reviews wp
            `;
            WHERE =
            `
            r.peer_idx = wp.idx AND
            wp.lawyer_idx = ${payload.user_idx} AND
            wp.processing_status = 3 AND
            r.status = 'Y'
            `;

            var sql = `
                SELECT
                    ${SELECT}
                FROM
                    ${FROM}
                WHERE
                    ${WHERE}
                ORDER BY r.registerdate DESC

            `;


            await db.query(sql).then((result)=> {
                return resolve( result );
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    create: async(payload) => {
        return new Promise(async(resolve, reject)=> {
            await db.query("INSERT INTO reviews SET ?", payload).then((result)=> {
                return resolve(result.insertId);
            }).catch((err) => {
                return reject(err);
            });
        });
    },
};
