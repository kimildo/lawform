let db = require('../utils/rdb')

module.exports = {
    create: async (payload) => {

        payload.original_bind_data = payload.writing_idx

        let sql = `INSERT INTO writing_peer_reviews
                   SET writing_idx = ?,
                       document_idx = ?,
                       category_idx = ?,
                       payment_idx = ?,
                       service_idx = ?,
                       question_1 = ?,
                       question_2 = ?,
                       question_3 = ?,
                       request_type = ?,
                       user_idx = ?,
                       lawyer_idx = ?,
                       status = ?,
                       processing_status = ?,
                       apply_end_date_time = ?,
                       request_date_time = ?,
                       review_complete_date = ?,
                       lawyer_edit_content = ?,
                       original_bind_data = (SELECT binddata FROM writing WHERE idwriting = ?)
        `

        console.log('sql', sql)
        console.log('values', payload)

        return new Promise(async (resolve, reject) => {
            await db.query(sql, Object.values(payload)).then((result) => {
                let lastId = result.insertId
                //return resolve(lastId)

                let sql = `
                    SELECT wpr.idx,
                           CONCAT(LEFT(u.name, 1), '***') as user_name,
                           wpr.document_idx,
                           d.title,
                           s.name                         AS service_name,
                           (
                               SELECT GROUP_CONCAT(DISTINCT mobile_number SEPARATOR ',')
                               FROM users
                               WHERE mobile_number IS NOT NULL
                                 AND mobile_number != ''
                                 AND type = 'A'
                                 AND LENGTH(mobile_number) >= 10
                                 AND status = 1
                                 AND is_approved = 0
                           )                              AS receiver
                    FROM users u
                             JOIN writing_peer_reviews wpr ON wpr.user_idx = u.idusers
                             JOIN documents d ON wpr.document_idx = d.iddocuments
                             JOIN service s on wpr.service_idx = s.idx
                    WHERE u.idusers = ?
                      AND wpr.idx = ?
                `
                db.query(sql, [payload.user_idx, lastId]).then((row) => {
                    return resolve({ status: 'ok', data: row[0], receiver: row[0].receiver })
                }).catch((err) => {
                    logger.error(err)
                    return reject(err)
                })

            }).catch((err) => {
                return reject(err)
            })
        })

    },
    cancel: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let params = [payload.idx]

            await db.query(`SELECT idx, payment_idx
                            FROM writing_peer_reviews
                            WHERE idx = ?
                              AND status IN (1, 2)`, params).then((result) => {

                if (!!result[0].idx) {
                    return result[0]
                }

                return reject()
                //return resolve(result.affectedRows)
            })
                .then((result) => {
                    let payIdx = result.payment_idx
                    db.query('UPDATE writing_peer_reviews SET status = 0 WHERE idx = ?', params).then((result) => {
                        return payIdx
                    }).catch((err) => {
                        return reject(err)
                    })
                })
                .then((payIdx) => {
                    db.query(`
                        SELECT wpr.idx,
                               u.name AS user_name,
                               wpr.service_idx,
                               s.name AS service_name,
                               p.idpayments,
                               p.imp_uid,
                               wpr.modify_date_time
                        FROM writing_peer_reviews wpr
                                 JOIN users u ON u.idusers = wpr.user_idx
                                 JOIN service s ON wpr.service_idx = s.idx
                                 LEFT JOIN payments p ON p.idpayments = wpr.payment_idx
                        WHERE wpr.idx = ?`, params).then((result) => {
                        return resolve(result[0])
                    }).catch((err) => {
                        return reject(err)
                    })
                })
                .catch((err) => {
                    return reject(err)
                })

            // await db.query('UPDATE writing_peer_reviews SET lawyer_idx = 0, processing_status = 1, status = 0 WHERE idx = ?', params).then((result) => {
            //     return resolve(result.affectedRows)
            // }).catch((err) => {
            //     return reject(err)
            // })
        })
    },
    delete: async (payload) => {
        return new Promise(async (resolve, reject) => {
            await db.query(`UPDATE writing_peer_reviews SET status = 0 WHERE idx IN (${payload.ids})`).then((result) => {
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    accept: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let params = [payload.user_idx, 2, payload.review_deadline, payload.idx]
            await db.query(`UPDATE writing_peer_reviews
                            SET lawyer_idx        = ?,
                                processing_status = ?,
                                review_deadline   = ?
                            WHERE idx = ?`, params).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    accept_check: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let params = [payload.user_idx, payload.idx]
            let sql = `
                SELECT
                    wpr.idx,
                    wpr.lawyer_idx,
                    wpr.payment_idx,
                    wpr.service_idx,
                    CONCAT(LEFT(u.name, 1), '**') as user_name,
                    up.phonenumber AS mobile_number,
                    (SELECT mobile_number FROM users WHERE idusers = ?) AS lawyer_mobile_number,
                    s.period
                FROM writing_peer_reviews wpr
                     JOIN service s on wpr.service_idx = s.idx
                     JOIN users u on wpr.user_idx = u.idusers
                     LEFT JOIN users_personal up on u.idusers = up.idusers
                WHERE wpr.idx = ?
                  AND wpr.status = 1
            `

            //console.log(sql)
            //console.log(params)

            await db.query(sql, params).then((result) => {
                console.log('accept result', result)
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    save: async (payload) => {
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE writing_peer_reviews SET lawyer_edit_content = ? WHERE idx = ? ', [payload.content, payload.idx]).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    tempsave: async (payload) => {
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE writing_peer_reviews SET lawyer_edit_content = ? WHERE idx = ? AND lawyer_idx = ?', [payload.content, payload.idx, payload.user_idx]).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    complete: async (payload) => {
        return new Promise(async (resolve, reject) => {

            let sql = `
                UPDATE writing_peer_reviews
                    SET lawyer_edit_content = ?,
                        review_complete_date = ?,
                        processing_status = ?
                    WHERE idx = ?
            `

            await db.query(sql, [payload.content, payload.review_complete_date, 3, payload.idx])
                .then((result) => {
                    //return resolve(result.affectedRows)
                    return result.affectedRows
                }).then((result) => {
                    if (result > 0) {
                        db.query(`
                            SELECT 
                                   u.name,
                                   u.mobile_number,
                                   wpr.retouch_request_timestamp
                                FROM writing_peer_reviews wpr
                                JOIN users u on wpr.lawyer_idx = u.idusers
                                WHERE wpr.idx = ?
                        `, [payload.idx]).then((rr)=>{
                            return resolve(rr)
                        })
                    }
                }).catch((err) => {
                    return reject(err)
                })
        })
    },
    retouch: async (payload) => {

        return new Promise(async (resolve, reject) => {
            await db.query(`
                    UPDATE writing_peer_reviews 
                        SET retouch_request_text = ?, 
                            retouch_deadline = ?,
                            retouch_request_timestamp = NOW(),
                            processing_status = 2
                    WHERE idx = ?`, [payload.request_retouch_text, payload.retouch_deadline, payload.peer_idx])
            .then((result) => {

                if (result.affectedRows > 0) {
                    db.query(`
                        SELECT u.name,
                               u.mobile_number
                        FROM lawform.writing_peer_reviews wpr
                                 JOIN users u on wpr.lawyer_idx = u.idusers
                        WHERE wpr.idx = ?
                    `, [payload.peer_idx]).then((rr) => {
                        console.log('rr', rr)
                        return resolve(rr)
                    })
                }
                //console.log('result.affectedRows', result.affectedRows)
                //return resolve(result.affectedRows)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    lawyer_content: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT wpr.lawyer_idx,
                       u.name AS lawyer_name,
                       wpr.original_bind_data,
                       wpr.lawyer_edit_content,
                       wpr.processing_status,
                       wpr.apply_end_date_time,
                       wpr.review_deadline,
                       wpr.review_complete_date,
                       wpr.retouch_deadline,
                       s.type AS service_type,
                       wpr.file_name,
                       wpr.status
                FROM writing_peer_reviews wpr
                    JOIN service s on wpr.service_idx = s.idx
                    LEFT JOIN users u on wpr.lawyer_idx = u.idusers
                WHERE wpr.idx = ?
            `

            await db.query(sql, [payload.idx]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    renew: async (payload) => {
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE writing_peer_reviews SET status = 0 WHERE idx = ? ', [payload.idx])
                .then((result) => {
                    return true
                })
                .then((result) => {
                    if (result === true) {
                        let addColumn = [
                            'user_idx',
                            'writing_idx',
                            'document_idx',
                            'category_idx',
                            'payment_idx',
                            'service_idx',
                            'request_date_time',
                            'apply_end_date_time',
                            'request_type',
                            'processing_status',
                            'question_1',
                            'question_2',
                            'question_3',
                            'original_bind_data',
                            'status'
                        ]

                        let matchValue = [
                            'user_idx',
                            'writing_idx',
                            'document_idx',
                            'category_idx',
                            'payment_idx',
                            'service_idx',
                            '\'' + payload.request_date_time + '\'',
                            '\'' + payload.apply_end_date_time + '\'',
                            'request_type',
                            1,
                            'question_1',
                            'question_2',
                            'question_3',
                            'original_bind_data',
                            1
                        ]

                        let sql = `INSERT INTO writing_peer_reviews (${addColumn}) SELECT ${matchValue} FROM writing_peer_reviews WHERE idx = ?`

                        db.query(sql, [payload.idx]).then((result) => {
                            //console.log(result.insertId)
                            return resolve({ status: 'ok', data: result.insertId })
                        }).catch((err) => {
                            logger.error(err)
                            return reject(err)
                        })
                    }
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    },
    renew_check: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let params = [payload.idx]
            let sql = 'SELECT COUNT(*) as cnt FROM writing_peer_reviews WHERE idx = ? AND status = 1'
            //console.log('sql', sql)
            //console.log('payload', payload)
            await db.query(sql, params).then((result) => {
                //return resolve(result.affectedRows)
                return resolve(result)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    update_status: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let params = [payload.status, payload.idx, payload.user_idx]
            await db.query('UPDATE writing_peer_reviews SET status = ? WHERE idx = ? AND user_idx = ? ', params).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                return reject(err)
            })
        })
    },
    get: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT
                    r.idx
                    , r.writing_idx
                    , r.request_date_time
                    , r.request_type
                    , r.service_idx
                    , s.name as service_name
                    , s.type AS service_type
                    , s.period
                    , r.apply_end_date_time
                    , r.processing_status
                    , r.question_1 as question
                    , r.question_2
                    , r.question_3
                    , r.user_check_new_document
                    , r.retouch_request_timestamp
                    , r.retouch_deadline
                    , r.retouch_request_text
                    , r.lawyer_idx
                    , u.name as lawyer
                    , u.office_name
                    , u.school_name
                    , u.attorney_exam
                    , u.work_field
                    , u.profile_img
                    , w.idwriting as writing_idx
                    , w.iddocuments as document_idx
                    , c.name as category_name
                    , c.idcategory_1 as category_idx
                    , v.peer_idx as review_idx
                    , w.binddata
                    , r.file_name
                    , r.review_deadline
                    , r.review_complete_date
                    , r.status
                FROM
                    writing_peer_reviews r
                        JOIN writing w ON w.idwriting = r.writing_idx
                        JOIN category_1 c on r.category_idx = c.idcategory_1
                        JOIN service s on r.service_idx = s.idx
                        LEFT JOIN users u ON r.lawyer_idx = u.idusers 
                        LEFT JOIN reviews v ON r.idx = v.peer_idx
                WHERE
                    r.idx = ${payload.peer_idx} AND r.status = 1
            `
            await db.query(sql).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    get2: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT
                    r.idx,
                    r.writing_idx,
                    r.request_date_time,
                    r.apply_end_date_time,
                    r.processing_status,
                    r.question_1 as question,
                    r.retouch_request_timestamp,
                    r.retouch_deadline,
                    r.retouch_request_text,
                    r.status
                FROM
                    writing_peer_reviews r
                WHERE
                    r.idx = ${payload.peer_idx}
            `
            await db.query(sql).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    get_waiting_lawyer_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let SELECT = ('count' in payload && payload.count)
                ? ` count(wpr.idx) as cnt `
                : `
                    wpr.idx
                    , wpr.writing_idx
                    , wpr.request_date_time
                    , wpr.apply_end_date_time
                    , wpr.processing_status
                    , wpr.lawyer_idx
                    , wpr.service_idx
                    , s.type
                    , s.period
                    , w.title
                    , c.name as category_name
                    , p.idpayments
                    , p.paid_amount
                `
            let PAGINATION = ('count' in payload && payload.count)
                ? ``
                : `
                    LIMIT ?
                    OFFSET ?
                `
            let sql = `
                SELECT
                    ${SELECT}
                FROM
                    writing_peer_reviews AS wpr
                        JOIN writing AS w ON wpr.writing_idx = w.idwriting
                        JOIN category_1 AS c ON wpr.category_idx = c.idcategory_1
                        JOIN service s on wpr.service_idx = s.idx
                        LEFT JOIN payments AS p ON wpr.payment_idx = p.idpayments
                WHERE wpr.processing_status = 1
                  AND wpr.status = 1
                  AND wpr.apply_end_date_time >= NOW()
                  AND wpr.lawyer_idx = 0
                ORDER BY wpr.request_date_time DESC
                ${PAGINATION}
            `

            //console.log(sql)
            //console.log(payload)

            let processing_status = 1
            let lawyer_idx = 0
            let status = 1
            //let params = [processing_status, lawyer_idx, status, payload.request_type]
            let params = []

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

    get_processing_document_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let SELECT = ('count' in payload && payload.count)
                ? ` count(r.idx) as cnt `
                : `
                    r.idx,
                    r.writing_idx,
                    r.request_date_time,
                    r.review_complete_date,
                    r.apply_end_date_time,
                    r.retouch_deadline,
                    r.processing_status,
                    w.title,
                    c.name as category_name,
                    r.review_deadline,
                    r.status
                `
            let PAGINATION = ('count' in payload && payload.count) ? ` ` : `
                LIMIT ?
                OFFSET ?
            `

            let ORDER = `ORDER BY r.request_date_time DESC`
            let FILTER = ('filter' in payload && payload.filter && payload.filter !== '1') ? `AND r.processing_status = ${payload.filter}` : ``

            let sql = `
                SELECT
                    ${SELECT}
                FROM
                    writing_peer_reviews r
                    JOIN writing w ON w.idwriting = r.writing_idx
                    JOIN category_1 c on r.category_idx = c.idcategory_1
                WHERE
                    r.lawyer_idx = ?
                    ${FILTER}
                    ${ORDER}
                ${PAGINATION}
            `

            let params = []
            params.push(payload.user_idx)
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

    get_documents_requested_service_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let SELECT = ('count' in payload && payload.count)
                ? ` count(r.idx) as cnt `
                : `
                    r.idx,
                    r.user_idx,
                    r.writing_idx,
                    r.request_date_time,
                    r.apply_end_date_time,
                    r.review_deadline,
                    r.retouch_deadline,
                    r.processing_status,
                    w.title,
                    w.file,
                    r.lawyer_idx,
                    CONCAT(LEFT(u.name, 1), '**') as lawyer,
                    u.office_name,
                    u.school_name,
                    u.attorney_exam,
                    u.work_field,
                    u.profile_img,
                    c.name as category_name,
                    r.review_deadline,
                    r.review_complete_date,
                    r.status,
                    r.file_name
                `
            let PAGINATION = ('count' in payload && payload.count)
                ? ``
                : `
                    LIMIT ?
                    OFFSET ?
                `
            let sql = `
                SELECT
                    ${SELECT}
                FROM
                    writing_peer_reviews r 
                    JOIN writing w ON w.idwriting = r.writing_idx
                    JOIN category_1 c on r.category_idx = c.idcategory_1
                    LEFT JOIN users u ON r.lawyer_idx = u.idusers
                WHERE
                    r.user_idx = ?
                    AND w.status = ?
                    AND r.status = ?
                ORDER BY r.request_date_time DESC
                ${PAGINATION}
            `

            let params = [payload.user_idx, 1, 1]
            if (!('count' in payload) || !payload.count) {
                params.push(payload.limit)
                params.push(payload.offset)
            }

            // console.log(sql)
            // console.log('params', params)

            await db.query(sql, params).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    get_list: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let SELECT = '', FROM = '', WHERE = '', ORDER = 'ORDER BY r.request_date_time DESC'

            if ('member_document_request' in payload && payload.member_document_request) {
                SELECT = `
                    r.idx,
                    r.writing_idx,
                    r.request_date_time,
                    r.apply_end_date_time,
                    r.processing_status,
                    w.title,
                    w.file,
                    u.name as lawyer,
                    u.office_name,
                    u.school_name,
                    u.attorney_exam,
                    u.work_field,
                    u.profile_img,
                    c.name as category_name
                `

                FROM = `
                    writing_peer_reviews r 
                    JOIN writing w ON w.idwriting = r.writing_idx
                    JOIN category_1 c on r.category_idx = c.idcategory_1
                    LEFT JOIN users u ON r.lawyer_idx = u.idusers
                `
                WHERE = `
                    r.user_idx = ${payload.user_idx}
                    AND w.status = 1 AND r.status = 1
                `
            } else if ('lawyer_sale' in payload && payload.lawyer_sale) {
                SELECT = `
                    r.idx,
                    r.writing_idx,
                    r.review_complete_date,
                    r.payment_expect_date,
                    r.payment_status,
                    w.title,
                    c.name as category_name,
                    s.price,
                    s.fee,
                    s.display,
                    s.name as service_name,
                    r.status
                `
                FROM = `
                    writing_peer_reviews r
                    JOIN service s ON r.service_idx = s.idx
                    JOIN writing w ON w.idwriting = r.writing_idx
                    JOIN category_1 c ON r.category_idx = c.idcategory_1
                    JOIN users u ON r.lawyer_idx = u.idusers
                `
                WHERE = `
                    r.lawyer_idx = ${payload.user_idx}
                    AND r.status = 1
                    AND r.review_complete_date IS NOT NULL
                    AND r.review_complete_date != '0000-00-00 00:00:00'
                    ${'search' in payload && payload.search && payload.type ? `AND (r.${payload.type} BETWEEN '${payload.sdate} 00:00:00' AND '${payload.edate} 23:59:59')` : ``}
                `
            }

            if ('count' in payload && payload.count) {
                SELECT = ` count(r.idx) as cnt `
            }

            let pagination = ('count' in payload && payload.count) ? ` ` : `
                LIMIT ?
                OFFSET ?
            `
            let sql = `
                SELECT
                    ${SELECT}
                FROM
                    ${FROM}
                WHERE
                    ${WHERE}
                ${ORDER}
                ${pagination}
            `

            let params = []
            if (!('count' in payload) || !payload.count) {
                params.push(payload.limit)
                params.push(payload.offset)
            }

            //console.log(sql)
            // console.log(params)

            await db.query(sql, params).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    get_count: async (payload) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT
                    count(r.idx) as cnt
                FROM
                    writing_peer_reviews r
                WHERE r.lawyer_idx = ? 
                  AND r.processing_status = 3
                  AND r.status = 1
            `

            await db.query(sql, [payload.idusers]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateNewCompleted: async (payload) => {
        return new Promise(async (resolve, reject) => {

            let sql = `UPDATE writing_peer_reviews SET user_check_new_document = 'Y' WHERE user_idx = ? AND idx = ?`
            await db.query(sql, [payload.user_idx, payload.peer_idx]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getNewCompleted: async (payload) => {
        return new Promise(async (resolve, reject) => {

            let sql = `
                    SELECT user_check_new_document
                    FROM writing_peer_reviews
                    WHERE user_idx = ?
                    AND idx = ?
            `

            await db.query(sql, [payload.user_idx, payload.peer_idx]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    /*get_list: async (payload) => {
        return new Promise(async(resolve, reject)=> {
            let SELECT = ''
            let FROM = ''
            let WHERE = ''
            if ("count" in payload && payload.count){
                SELECT = ` count(w.idx) as cnt `;
            } else if("contract_request" in payload && payload.contract_request){

            } else if("contract_review" in payload && payload.contract_review){

            } else if("member_document_reqeust" in payload && payload.member_document_reqeust){
                SELECT =
                `
                r.idx,
                r.writing_idx,
                r.request_date_time,
                r.apply_end_date_time,
                r.processing_status
                w.title,
                w.file
                u.name as lawyer,
                c.name as category_name
                `
            }
            let SELECT = ("count" in payload && payload.count) ? ` count(w.idx) as cnt ` : `
                w.idx,
                u.name as lawyer,
                c.name as category_name,
                w.request_date_time,
                w.apply_end_date_time,
                w.processing_status
            `;
            let pagination = ("count" in payload && payload.count) ? ` ` : `
                LIMIT ?
                OFFSET ?
            `;
            let sql = `
                SELECT
                    ${SELECT}
                FROM
                    ${FROM}
                    users u,
                    documents d,
                    writing w,
                    writing_peer_reviews r,
                    category_1 c
                WHERE
                    ${WHERE}
                        w.document_idx = d.iddocuments AND
                    w.category_idx = c.idcategory_1 AND
                    w.lawyer_idx = u.idusers AND
                    w.user_idx = ? AND
                    w.status = ?
                ORDER BY w.request_date_time DESC
                ${pagination}
            `;
            let params = [payload.user_idx, 1];
            if (!("count" in payload) || !payload.count) {
                params.push(payload.limit);
                params.push(payload.offset);
            }
            await db.query(sql, params).then((result)=> {
                return resolve( result );
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },*/
}
