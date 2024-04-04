let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');
let writing = {
    register: async (di, pi) => { // pi = paymentsInfo
        return new Promise(async (resolve, reject) => {
            db.query(`INSERT INTO payments
                      (idusers, product_type, iddocuments, apply_num, bank_name, buyer_addr, buyer_email,
                       buyer_name, buyer_postcode, buyer_tel, card_name, currency, custom_data, imp_uid,
                       merchant_uid, name, paid_amount, paid_at, pay_method, pg_provider, pg_tid, pg_type, receipt_url, event)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [di.idusers, di.product_type, Array.isArray(di.iddocuments) ? null : di.iddocuments, pi.apply_num, pi.bank_name, pi.buyer_addr, pi.buyer_email,
                    pi.buyer_name, pi.buyer_postcode, pi.buyer_tel, pi.card_name, pi.currency, pi.custom_data, pi.imp_uid,
                    pi.merchant_uid, pi.name, pi.amount, pi.paid_at, pi.pay_method, pi.pg_provider, pi.pg_tid, di.pg_type, pi.receipt_url, di.paymentEvent]).then((rows) => {
                return resolve(rows.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    history: async (idusers, params) => {
        return new Promise(async (resolve, reject) => {
            // console.log(idusers)
            let order = ( params.order ) ? ` ORDER BY ${params.order} ${params.sort}` : ``;
            let offset = ( params.offset ) ? ` limit ${params.offset} ` : ``;
            let where = ( params.where ) ? ` AND ${params.where} ` : ``;
            let select = ( params.select ) ? params.select : ` * `
            let sql = `
                SELECT ${select} FROM payments p
                    LEFT JOIN writing w ON p.idpayments = w.idpayments
                    LEFT JOIN documents d ON w.iddocuments = d.iddocuments
                WHERE p.status IN ('Y', 'R') 
                  AND p.idusers = ${idusers} 
                  ${order} 
                  ${offset}
            `;

            //console.log( 'sql', sql )
            db.query(sql, [idusers]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    imp_uid_check: async (impuid) => {
        return new Promise(async (resolve, reject) => {
            db.query('SELECT p.idpayments, p.`status`, w.idwriting FROM payments p LEFT JOIN writing w ON p.idpayments = w.idpayments WHERE imp_uid = ? LIMIT 1', [impuid]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    amount_check: async (iddocuments) => {
        return new Promise(async (resolve, reject) => {
            db.query('SELECT dc_price as dataRow FROM documents WHERE iddocuments = ?', [iddocuments]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    promotion: async (params) => { /**  프로모션 할인, 무료 코드 */
        return new Promise(async (resolve, reject) => {
            db.query("SELECT `type`, `discount`, `common` FROM promotion WHERE `code` = ? AND `status` = 'Y'", [params.code] ).then((rows) => {
                if( rows.length > 0 ){
                    return resolve( { status:true,data:rows} );
                } else {
                    return resolve({ status:false});
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    promotion_check: async (params) => {
        return new Promise(async (resolve, reject) => {
            db.query("SELECT `code`, `use` FROM coupons WHERE `code` = ? AND  `promotion` = ? AND `use` = 'N'", [params.code,params.promotion] ).then((rows) => {
                if( rows.length > 0 ){
                    if( rows[0].use === 'N' ) {
                        writing.promotion_use( {code:rows[0].code, idusers:params.idusers} );
                        return resolve(rows)
                    } else {
                        return resolve('error')
                    }
                } else {
                    return resolve('error')
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
    promotion_use: async (params) => {
        return new Promise(async (resolve, reject) => {
            // console.log( 'use :',params.idusers )
            db.query("UPDATE coupons SET `use`='Y', `idusers` = ? WHERE `code` = ? ", [params.idusers, params.code]).then((rows) => {
                return resolve('ok');
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    freePromotion_check: async (params) => {/** 문서 무료지급 체크*/
        return new Promise(async (resolve, reject) => {
            var sql = ""
            if( params.common === 'Y' ) {
                sql = `SELECT count(*) as count FROM promotion_use WHERE code = '${params.code}' AND  idusers = '${params.idusers}' `
            } else {
                sql = `SELECT count(*) as count FROM promotion_use WHERE code = '${params.code}' `
            }
            // console.log(sql)
            db.query( sql ).then((rows) => {
                // console.log( 'cnt',rows[0].count, params )
                if( rows[0].count > 0  ) {
                    // console.log( 'fail' )
                    return resolve( { status:'fail', reason:'code_used' } )
                } else {
                    // console.log( 'ok' )
                    return resolve( { status:'ok', reason:'code_not_used' } )
                }
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    freePromotion_use: async (params) => { /** 문서 무료지급 시 추가 */
        return new Promise(async (resolve, reject) => {
            // console.log( 'use :',params.idusers , params.code  )
            /**INSERT INTO payments_temp
                      (paycode,idusers,binddata)
                            VALUES (?,?,?) */
            db.query("INSERT INTO promotion_use ( code , idusers ) valueS ( ?, ? ) ", [params.code, params.idusers]).then((rows) => {
                // console.log( rows )
                if( !!rows.insertId )
                    return resolve(rows.insertId);
                    else resolve('fail');
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    primeAmount: async (params) => {
        return new Promise(async (resolve, reject) => {
            db.query(
                "SELECT SUM(price) as price, SUM(extra_dc_price) as extraDcPrice from documents where iddocuments in (?);",
                [params]
            ).then((rows) => {
                if (rows[0] === null) throw new Error('error');
                return resolve(rows[0]);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        })
    },

    temp: async (params) => {
        return new Promise(async (resolve, reject) => {
            db.query(`INSERT INTO payments_temp
                      (paycode,idusers,binddata,iddocument,docname,amount,paymethod,product_type,plan,discount,discount_code)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
                [params.paycode, params.idusers, params.bindData,params.iddocument,params.name,params.amount,params.pay_method,params.product_type,params.plan, params.discount, params.discount_code]).then((rows) => {
                    return resolve(rows.insertId);
                }).catch((err) => {
                    logger.error(err);
                    return reject(err);
                });
        });
    },

    get_temp: async (params) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT * FROM payments_temp WHERE paycode = ? Limit 1`,
                [params.paycode]).then((rows) => {
                    return resolve(rows[0]);
                }).catch((err) => {
                    logger.error(err);
                    return reject(err);
                });
        });
    },

    count: async (params) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT count(idpayments) as count FROM payments WHERE status = 'Y' AND idusers = ?`,
                [params.idusers]).then((rows) => {
                return resolve(rows[0]);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    serviceInfo: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT * FROM service WHERE idx = ? Limit 1`,
                [ params.idx ]).then((rows) => {
                // console.log( 'rows' ,rows )
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    serviceOptions: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT * FROM service WHERE type = ?`,
                [ params.type ]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    planInfo: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`SELECT * FROM plans WHERE idx = ? Limit 1`,
                [ params.idx ]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    planDisable: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`UPDATE plans_subscription SET status='N' WHERE idusers = ?`,
                [ params.idusers ]).then((rows) => {
                return resolve('ok');
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },

    planRegister: async ( params ) => {
        return new Promise(async (resolve, reject) => {
            db.query(`INSERT INTO plans_subscription
            ( idusers, plan, status, payment )
            VALUES (?, ?, 'Y', ?)`,
                [ params.idusers, params.plan, params.payment ]).then((rows) => {
                return resolve(rows);
            }).catch((err) => {
                logger.error(err);
                return reject(err);
            });
        });
    },
}

module.exports = writing;