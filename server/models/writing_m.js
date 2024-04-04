let db = require('../utils/rdb')

module.exports = {
    renew: async (payload) => {
        return new Promise(async (resolve, reject) => {
            var params = [payload.editabledate, payload.idwriting]

            await db.query('UPDATE writing SET editabledate = ? WHERE idwriting = ? ', params).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    renew_check: async (payload) => {
        return new Promise(async (resolve, reject) => {
            var params = [payload.idwriting]

            await db.query('SELECT COUNT(*) as cnt FROM writing WHERE idwriting = ? AND editabledate < NOW() ', params).then((result) => {
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    get_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            var SELECT = ('count' in payload && payload.count) ? ` count(w.idwriting) as cnt ` : `
                w.idwriting as idx,
                c.name as category_name,
                c.idcategory_1 as category,
                r.idx as peer_idx,
                r.lawyer_idx,
                r.processing_status,
                w.title,
                w.editabledate,
                w.expiredate,
                w.file
            `
            var pagination = ('count' in payload && payload.count) ? `  ` : `
                LIMIT ?
                OFFSET ?
            `
            var sql = `
                SELECT
                    ${SELECT}
                FROM
                    writing w LEFT JOIN
                    (SELECT * FROM writing_peer_reviews WHERE status = 1) r ON w.idwriting = r.writing_idx,
                    category_1 c,
                    documents d
                WHERE
                    d.idcategory_1 = c.idcategory_1 AND
                    w.iddocuments = d.iddocuments   AND
                    w.idusers = ?  AND
                    w.status = 1
                ORDER BY w.registerdate DESC
                ${pagination}
            `

            //w.iddocuments NOT IN ( SELECT document FROM reviews WHERE idusers = ? ) AND

            var params = [payload.idusers]

            if (!('count' in payload) || !payload.count) {
                params.push(payload.limit)
                params.push(payload.offset)
            }

            await db.query(sql, params).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    get: async (payload) => {
        return new Promise(async (resolve, reject) => {
            var sql = `
                SELECT w.idwriting    as idx,
                       c.idcategory_1 as category_idx,
                       d.iddocuments  as document_idx
                FROM category_1 c,
                     documents d,
                     writing w
                WHERE d.idcategory_1 = c.idcategory_1
                  AND w.iddocuments = d.iddocuments
                  AND w.idwriting = ?
            `
            await db.query(sql, [payload.idwriting]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                // logger.error(err);
                return reject(err)
            })
        })
    },
    delete: async (payload) => {
        return new Promise(async (resolve, reject) => {
            var params = [payload.ids]

            await db.query(`DELETE FROM writing WHERE idwriting IN (${payload.ids})`).then((result) => {
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    get_document_element_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT w.idwriting,
                       w.idusers,
                       w.iddocuments,
                       d.template_data,
                       w.title,
                       w.binddata
                FROM writing as w
                         JOIN
                     document_template as d
                     ON
                         w.template_id = d.template_id
                WHERE w.idwriting = ?
            `
            await db.query(sql, [payload.writing_idx]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    get_peer_date_passed: async () => {
        return new Promise(async (resolve, reject) => {
            await db.query(`
                SELECT
                    idx AS peer_idx, wpr.user_idx, u.name AS user_name,
                    request_date_time, apply_end_date_time,
                    now() AS cur_date_time,
                    date_add(request_date_time, interval 6 hour ) as matching_limit_date_time,
                    processing_status, payment_idx,
                    idpayments, imp_uid, paid_amount AS refund_amount, p.status, wpr.status AS peer_status
                FROM writing_peer_reviews wpr
                         JOIN users u ON wpr.user_idx = u.idusers
                         LEFT JOIN payments p on wpr.payment_idx = p.idpayments AND p.status = 'Y'
                WHERE processing_status = 1
            `).then((result) => {
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },

    peer_cancel: async (idx) => {
        return new Promise(async (resolve, reject) => {
            console.log('cancel peer :: ', idx)
            await db.query('UPDATE writing_peer_reviews SET status = ? WHERE idx = ? ', [0, idx]).then((result) => {
                return resolve(true)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
}
