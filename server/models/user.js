const axios = require('axios')
const jwt = require('jsonwebtoken')
let db = require('../utils/rdb')
let logger = require('../utils/winston_logger')
let sha512 = require('../utils/salt_sha512')
let payments = require('./payments')
const aligo = require('../models/aligo')

let salt = 'sobongamicus123!'
let user = {
    getIdusersByLoginID: async (login_id) => {
        return new Promise(async (resolve, reject) => {
            if (!login_id || login_id == '') return resolve(null)
            await db.query('SELECT idusers FROM users WHERE login_id = ?', [login_id]).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null)
                else {
                    let idusers = rows[0].idusers
                    return resolve(idusers)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getIdusersByEmail: async (email) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT idusers FROM users WHERE email = ?', [email]).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null)
                else {
                    let idusers = rows[0].idusers
                    return resolve(idusers)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getUserInfoByIdusers: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT idusers
                     , login_id
                     , email
                     , name
                     , type
                     , tester
                     , office_name
                     , office_number
                     , mobile_number
                     , work_field
                     , self_introduction
                     , profile_img
                     , bank_name
                     , bank_acc_no
                     , bank_acc_owner
                FROM users
                WHERE idusers = ?
            `

            await db.query(sql, [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getPersonalInfoByIdusers: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT phonenumber, birthdate, sns_id, sns_service FROM users_personal WHERE idusers = ?', [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getCompanyInfoByIdusers: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT phonenumber, company_name, company_number, company_owner, referer FROM users_company WHERE idusers = ?', [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getExperienceInfoByIdusers: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT * FROM user_experience WHERE user_idx = ? and status = 1', [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getNewCompleted: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT new_completed FROM users WHERE idusers = ?', [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    register: async (registerInfo) => {
        return new Promise(async (resolve, reject) => {
            try {
                //let idUsersByLoginId = await user.getIdusersByLoginID(registerInfo.login_id);
                //if (idUsersByLoginId != null ) return reject(`Illegal try to register User, There is already same login_id:${registerInfo.login_id} `);
                //let idUsersByEmail = await user.getIdusersByEmail(registerInfo.email);
                //if (idUsersByEmail != null) return reject(`Illegal try to register User, There is already same email:${registerInfo.email}`);
            } catch (err) {
                //logger.error(err)
                //return reject(err)
            }
            //console.log(registerInfo);
            registerInfo.password = sha512(registerInfo.password, salt)

            await db.query('INSERT INTO users SET ?', registerInfo).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    personal: async (personalInfo) => {
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO users_personal SET ?', personalInfo).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    company: async (companyInfo) => {
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO users_company SET ?', companyInfo).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    experience: async (experienceInfo) => {
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO user_experience SET ?', [experienceInfo]).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    update: async (updateInfo, idusers) => {
        // console.log(updateInfo);
        return new Promise(async (resolve, reject) => {

            // console.log('UPDATE users SET ? WHERE idusers = ?')
            // console.log(updateInfo)
            // console.log(idusers)

            await db.query('UPDATE users SET ? WHERE idusers = ?', [updateInfo, idusers]).then((result) => {
                return resolve()
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateNewCompleted: async (newCompleted, idusers) => {
        // console.log(updateInfo);
        return new Promise(async (resolve, reject) => {

            // console.log('UPDATE users SET ? WHERE idusers = ?')
            // console.log(updateInfo)
            // console.log(idusers)
            await db.query('UPDATE users SET new_completed = ? WHERE idusers = ?', [newCompleted, idusers]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateProfile: async (payload) => {
        return new Promise(async (resolve, reject) => {
            // console.log('updateprofile')
            await db.query('UPDATE users SET profile_img = ? WHERE idusers = ?', [payload.path, payload.idx]).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updatePersonal: async (personalInfo, idusers) => {
        // console.log(personalInfo);
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE users_personal SET ? WHERE idusers = ?', [personalInfo, idusers]).then((result) => {
                return resolve()
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateCompany: async (companyInfo, idusers) => {
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE users_company SET ? WHERE idusers = ?', [companyInfo, idusers]).then((result) => {
                return resolve()
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    removeExperienceAll: async (user_idx) => {
        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE user_experience SET status = 0 WHERE user_idx = ?', [user_idx]).then((result) => {
                return resolve()
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updateExperience: async (payload, idx) => {
        return new Promise(async (resolve, reject) => {
            //console.log('UPDATE user_experience SET ? WHERE idx = ?')
            //console.log(payload)
            //console.log(idx)
            await db.query('UPDATE user_experience SET ? WHERE idx = ?', [payload, idx]).then((result) => {
                return resolve()
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    changePassword: async (password, idusers) => {
        return new Promise(async (resolve, reject) => {
            let hashed_password = sha512(password, salt)
            await db.query('UPDATE users SET password = ? WHERE idusers = ?', [hashed_password, idusers]).then((result) => {
                return resolve('ok')
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    checkPassword: async (password, idusers) => {
        return new Promise(async (resolve, reject) => {
            let rtn_password = ''
            rtn_password = await db.query('SELECT password FROM users WHERE idusers = ?', idusers).then((rows) => {
                if (!db.isEmpty(rows)) return rows[0].password
            }).then((result) => {
                if (sha512(password, salt) === result) {
                    return resolve('ok')
                } else {
                    return resolve('no')
                }

            }).catch((err) => {
                return reject(err)
            })
            //console.log(rtn_password)
            //console.log( sha512(password, salt) )

        })
    },

    processLogin: async (loginid, password) => {
        return new Promise(async (resolve, reject) => {

            const rtn_error = { status: 'error', data: {}, reason: 'notmatch' }
            if (!loginid) {
                return resolve(rtn_error)
            }

            let sql = `
                SELECT u.idusers,
                       u.type,
                       u.password,
                       u.name,
                       u.is_approved,
                       u.email,
                       u.signup_path,
                       us.source,
                       c.company_name
                FROM users u
                         LEFT JOIN users_company c ON u.idusers = c.idusers
                         LEFT JOIN users_sso us ON u.idusers = us.idusers
                WHERE (login_id = ? OR email = ?)
                limit 1
            `
            await db.query(sql, [loginid, loginid]).then((rows) => {

                if (db.isEmpty(rows)) {
                    return resolve(rtn_error)
                }

                let rtn_password = rows[0].password
                let idusers = rows[0].idusers
                let name = rows[0].name
                let email = rows[0].email
                let company_name = rows[0].company_name
                let usertype = rows[0].type
                let is_approved = rows[0].is_approved
                let signup_path = rows[0].signup_path
                let signup_source = rows[0].source

                if (signup_source === 'naver' || signup_source === 'kakao' || signup_source === 'google') {
                    return resolve({ status: 'ok', data: { signup_source }})
                }

                if (!rtn_password) {
                    return reject(`Something was wrong in user:checkLogin login_id:${loginid}, email:${email}`)
                }

                if (sha512(password, salt) !== rtn_password) {
                    return resolve(rtn_error)
                }

                return resolve({ status: 'ok', data: { idusers, name, email, company_name, usertype, is_approved, signup_source } })

            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })

        })
    },

    checkLogin: async (login_id, email, password) => {
        return new Promise(async (resolve, reject) => {
            let rtn_password = ''
            let idusers = 0
            if (!!login_id) {
                await db.query('SELECT idusers, password FROM users WHERE login_id = ?', [login_id]).then((rows) => {
                    if (db.isEmpty(rows)) return reject(`There is not matched userdata for login_id:${login_id}`)
                    else {
                        rtn_password = rows[0].password
                        idusers = rows[0].idusers
                    }
                }).catch((err) => {
                    logger.error(err)
                    return reject(err)
                })
            } else if (!!email) {
                await db.query('SELECT idusers, password FROM users WHERE email = ?', [email]).then((rows) => {
                    if (db.isEmpty(rows)) return reject(`There is not matched userdata for email:${email}`)
                    else {
                        rtn_password = rows[0].password
                        idusers = rows[0].idusers
                    }

                }).catch((err) => {
                    logger.error(err)
                    return reject(err)
                })
            } else {
                return reject('There is no email and login_id for user:checkLogin')
            }
            if (!!rtn_password) {
                if (sha512(password, salt) === rtn_password) {
                    return resolve(idusers)
                } else return reject('Password is not matched')
            } else {
                return reject(`Something was wrong in user:checkLogin login_id:${login_id}, email:${email}`)
            }
        })
    },
    sendPhoneAuthCode: async (params) => {
        return new Promise(async (resolve, reject) => {
            aligo.sendMessage(params).then((aligoResult) => {
                if (aligoResult.result_code === '1') return resolve(aligoResult)
                else return reject(aligoResult.result_code)
            }).catch((err) => {
                return reject(false)
            })
        })
    },
    setPhoneAuthCode: async (receiver, rcode, msg_id) => {
        let rcode_set = {
            receiver, rcode, msg_id
        }
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO phone_auth SET ?', rcode_set).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error')
                else {
                    return resolve('sql success')
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getPhoneAuthCode: async (receiver, rcode) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT rcode FROM phone_auth WHERE receiver = ?  ORDER BY idx DESC limit 1', [receiver, rcode]).then((rows) => {
                if (db.isEmpty(rows)) return resolve(null)
                else {
                    return resolve(rows[0].rcode)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    setJWT: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            const token = jwt.sign({
                idusers: idusers
            }, salt, {
                expiresIn: '12h',
                issuer: 'lawform',
            })
            resolve(token)
        })
    },
    writingQuestion: async (question, idusers) => {
        let query_set = {
            question, idusers
        }
        // console.log( query_set )
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO users_qna SET ?', query_set).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error')
                else {
                    return resolve('ok')
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    updateQuestion: async (question, idx, idusers) => {

        return new Promise(async (resolve, reject) => {
            await db.query('UPDATE users_qna SET question =? WHERE idx =? AND idusers =?', [question, idx, idusers]).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error')
                else {
                    return resolve('ok')
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    deleteQuestion: async (idx, idusers) => {

        return new Promise(async (resolve, reject) => {

            await db.query('UPDATE users_qna SET status =\'D\' WHERE idx =? AND idusers =?', [idx, idusers]).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error')
                else {
                    return resolve('ok')
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    listingQuestion: async (params, idusers) => {
        let order = (params.order) ? ` ORDER BY ${params.order} ${params.sort}` : ``
        let offset = (params.offset) ? ` limit ${params.offset} ` : ``
        let where = (params.where) ? ` ${params.where} ` : ``
        let select = (params.select) ? params.select : ` * `
        let sql = `SELECT ${select} FROM users_qna ${where} ${order} ${offset}`
        return new Promise(async (resolve, reject) => {
            await db.query(sql).then((rows) => {
                // console.log( sql )
                if (db.isEmpty(rows)) return resolve('empty')
                else {
                    return resolve(rows)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    listingWritingReview: async (params, idusers) => {

        let order = ` ORDER BY wr.idx desc`
        let limit = (!!params.limit) ? ` limit ${params.limit} ` : ``
        let offset = (!!params.offset) ? ` offset ${params.offset} ` : ``
        let whereArray = [idusers]

        let sql = `
            SELECT 
                wr.idx, 
                wr.idusers,
                u.name AS name,
                wr.email AS email,
                u.\`type\` AS \`type\`,
                w.idwriting AS idwriting,
                wr.content AS content ,
                wr.\`status\` AS \`status\`,
                wr.registerdate,
                wr.replydate,
                wr.reply,
                wr.reply_filename
            FROM writing_review wr
                JOIN users u ON wr.idusers = u.idusers
                JOIN writing w ON wr.idwriting = w.idwriting
            WHERE wr.idusers = ?
            ${order} 
            ${limit} 
            ${offset}
        `

        console.log('sql', sql)

        let total = `SELECT COUNT(*) as total FROM writing_review wr WHERE wr.idusers = ?`

        return new Promise(async (resolve, reject) => {
            await db.query(total, whereArray).then((result) => {
                let total = result[0].total
                db.query(sql, whereArray).then((rows) => {
                    if (db.isEmpty(rows)) {
                        return resolve('empty')
                    } else {
                        return resolve({data: rows, total: total})
                    }
                })

            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getUserinfoByFindInfo: async (params, idusers) => {

        let name = params.name
        let phonenumber = params.phonenumber
        let usertype = params.usertype
        let sql = `
            SELECT u.email, u.type, u.registerdate FROM users u 
                LEFT JOIN users_personal p ON u.idusers = p.idusers
                LEFT JOIN users_company c ON u.idusers = c.idusers 
            WHERE u.name = ? AND (p.phonenumber = ? OR c.phonenumber = ?)
        `

        // if (usertype === 'P') {
        //     sql = `SELECT u.email, u.type, u.registerdate FROM users u JOIN users_personal p ON u.idusers = p.idusers WHERE u.name = '${name}' AND p.phonenumber = '${phonenumber}' `
        // } else {
        //     sql = `SELECT u.email, u.type, u.registerdate FROM users u JOIN users_company c ON u.idusers = c.idusers WHERE u.name = '${name}' AND c.phonenumber = '${phonenumber}' `
        // }

        return new Promise(async (resolve, reject) => {
            await db.query(sql, [name, phonenumber, phonenumber]).then((rows) => {
                if (db.isEmpty(rows)) return resolve('empty')
                else {
                    return resolve(rows)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getUserinfoByNameAndNumber: async (params, idusers) => {

        let userid = params.userid
        let username = params.name
        let phonenumber = params.phonenumber
        let company_number = params.companynumber || null
        let usertype = params.usertype

        let sql = `
            SELECT u.idusers FROM users u 
                LEFT JOIN users_personal p ON u.idusers = p.idusers
                LEFT JOIN users_company c ON u.idusers = c.idusers
            WHERE
                u.email = ?
              AND u.name = ? 
              AND (p.phonenumber = ? OR c.phonenumber = ?) 
        `

        // if (usertype === 'P') {
        //     sql = `SELECT u.idusers FROM users u JOIN users_personal p ON u.idusers = p.idusers WHERE u.email = '${userid}' AND u.name = '${username}' AND  p.phonenumber = '${phonenumber}'`
        // } else {
        //     sql = `SELECT u.idusers FROM users u JOIN users_company c ON u.idusers = c.idusers WHERE u.login_id = '${userid}' AND c.company_number = '${company_number}'  AND  c.phonenumber = '${phonenumber}'`
        // }

        return new Promise(async (resolve, reject) => {
            await db.query(sql, [userid, username, phonenumber, phonenumber]).then((rows) => {
                if (db.isEmpty(rows)) return resolve('error')
                else {
                    // console.log(rows)
                    return resolve(rows[0].idusers)
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    updatePasswordByResetPass: async (params) => {
        let password = params.password
        let idusers = params.idusers
        return new Promise(async (resolve, reject) => {
            let hashed_password = sha512(password, salt)
            await db.query('UPDATE users SET password = ? WHERE idusers = ?', [hashed_password, idusers]).then((result) => {
                return resolve('ok')
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    sendAligoToAdmin: async (params) => {
        return new Promise(async (resolve, reject) => {
            let sendto
            let aligo = 'https://apis.aligo.in'
            let sendUrl = aligo + '/send/'
            let config = {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(sendUrl, params, config)
                .then(res => {
                    if (res.data.result_code === '1') return resolve(res.data)
                    else return reject(res.data.result_code)
                })
        })
    },

    getCategoryReviews: async (params) => {
        return new Promise(async (resolve, reject) => {
            let select = (!!params.select) ? params.select : ' r.idx, r.score, r.score, r.category, r.document, r.content, r.reply, r.registerdate, u.email, d.title '
            let where = ` WHERE r.status = 'Y' `
            if (!!params.category) where += ` AND category = ${params.category} `
            if (!!params.document && params.document !== 0) where += ` AND document = ${params.document} `
            let order = ' ORDER BY idx desc '
            let limit = (!!params.limit) ? ' LIMIT ' + params.offset + ',' + params.limit : ''
            let sql = 'SELECT ' + select + ' FROM reviews r LEFT JOIN users u ON r.idusers = u.idusers LEFT JOIN documents d ON r.document = d.iddocuments ' + where + order + limit
            await db.query(sql).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getReviewableDocs: async (params) => {
        return new Promise(async (resolve, reject) => {
            // let sql = `SELECT w.iddocuments, d.idcategory_1, d.title FROM writing w LEFT JOIN documents d ON w.iddocuments = d.iddocuments WHERE w.idusers = '${params.idusers}' GROUP BY w.iddocuments ORDER BY w.registerdate desc `;
            let sql = `SELECT w.iddocuments, d.idcategory_1, d.title
            FROM writing w
            LEFT JOIN documents d ON w.iddocuments = d.iddocuments
            WHERE w.idusers = '${params.idusers}' AND w.iddocuments
                NOT IN (
                    SELECT document FROM reviews WHERE idusers = '${params.idusers}'
                )
            GROUP BY w.iddocuments
            ORDER BY w.registerdate DESC`
            await db.query(sql).then((result) => {
                // console.log( result )
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    setDocumentReview: async (params) => {
        let query_set = {
            idusers: params.idusers,
            content: params.content,
            score: params.score,
            document: params.document,
            category: params.category
        }
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO reviews SET ?', query_set).then((rows) => {
                if (db.isEmpty(rows)) return reject('sql error')
                else {
                    return resolve('ok')
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    /** 패키지 제거 예정 */
    getPackage: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT pcp.idusers, pcp.idx as pcp_idx, p.idx AS `package` , p.`name` AS `packagename`, p.categorys , p.`count`, p.`period` , DATEDIFF(  DATE_ADD( pcp.usedatetime, INTERVAL p.period DAY ) , CURDATE()  ) AS `dayleft` , DATE_FORMAT( pcp.usedatetime,\'%Y.%m.%d\' ) AS `usedate`, COUNT( DISTINCT w.iddocuments ) AS used, GROUP_CONCAT( DISTINCT iddocuments) AS used_documents FROM package_codes_publish pcp LEFT JOIN package p ON pcp.package = p.idx LEFT JOIN writing w ON pcp.idx = w.pcp_idx WHERE pcp.idusers = ? AND DATE( pcp.usedatetime ) <= DATE( CURDATE() ) AND DATE_ADD( pcp.usedatetime, INTERVAL p.period DAY ) >= DATE( CURDATE() ) AND pcp.active = \'Y\' ', params.idusers).then((rows) => {
                return resolve(rows[0])
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    setPackage: async (params) => {
        return new Promise(async (resolve, reject) => {
            var sql = `SELECT pcp.status,
                              if(p.status = 'N' OR DATE(p.expiredate) < DATE(NOW()), 'Y', 'N') expired,
                              p.plan
                       FROM package_codes_publish pcp
                                LEFT JOIN
                            package p
                            ON pcp.package = p.idx
                       WHERE pcp.code = ? `
            var use = await db.query(sql, params.code).then((rows) => {
                if (rows[0].status === 'Y') return { status: 'error', reason: 'code_used' }
                else if (rows[0].expired === 'Y') return { status: 'error', reason: 'package_expired' }
                else return { status: 'ok', data: rows[0] }
            }).catch((err) => {
                return { status: 'error', reason: 'code_not_found' }
            })
            if (use.status === 'error') return resolve(use)
            if (use.status === 'ok') {
                // console.log('use',use, use.data.plan)
                await db.query('UPDATE package_codes_publish SET active = \'N\' WHERE idusers = ? ', params.idusers).then((rows) => {
                    // console.log(params.idusers, 'package deactivated')
                })
                if (!!use.data.plan) {
                    await payments.planDisable(params).then()
                    var planParams = {
                        idusers: params.idusers,
                        plan: use.data.plan,
                        payment: null
                    }
                    params.sub_idx = await payments.planRegister(planParams).then(planResult => {
                        return planResult.insertId
                    })
                } else {
                    params.sub_idx = null
                }
                var bind = {
                    status: 'Y',
                    idusers: params.idusers,
                    usedatetime: new Date(),
                    active: 'Y',
                    sub_idx: params.sub_idx
                }
                await db.query('UPDATE package_codes_publish SET ? WHERE code = ? ', [bind, params.code]).then((rows) => {
                    return resolve({ status: 'ok' })
                }).catch((err) => {
                    logger.error(err)
                    return reject(err)
                })
            }
        })
    },

    addPackageDoc: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO writing (idusers, iddocuments, template_id, title, editabledate, expiredate, pcp_idx ) VALUES (?,?,?,?,?,?,?)', [params.idusers, params.iddocuments, params.template_id, params.title, params.editabledate, params.expiredate, params.pcp_idx]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    /** /패키지 제거 예정 */

    getSubscription: async (params) => {
        return new Promise(async (resolve, reject) => {
            const sql = `
            SELECT 
                s.idx,
                s.idusers,
                s.plan,
                s.status,
                s.regdatetime AS regdatetime,
                p.name,
                p.period,
                p.categorys,
                DATE_ADD( s.regdatetime, INTERVAL p.period DAY) AS enddate,
                DATEDIFF( DATE_ADD( s.regdatetime, INTERVAL p.period DAY) , DATE(CURDATE())) AS dayleft
            FROM
                plans_subscription s
            LEFT JOIN
                plans p
                ON s.plan =  p.idx
            WHERE 
                s.idusers = ${params.idusers}
            AND
                s.status = 'Y'
            `
            await db.query(sql).then((rows) => {
                return resolve(rows[0])
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    addSubscriptionDoc: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query('INSERT INTO writing (idusers, iddocuments, template_id, title, editabledate, expiredate, sub_idx ) VALUES (?,?,?,?,?,?,?)', [params.idusers, params.iddocuments, params.template_id, params.title, params.editabledate, params.expiredate, params.sub_idx]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },
    getProgram: async (params) => {
        return new Promise(async (resolve, reject) => {
            const sql = `
            SELECT 
                u.idusers ,
                pg.idx AS group_idx,
                pg.name AS group_name,
                p.idx AS program_idx,
                p.name AS program_name,
                p.board AS program_board
            FROM 
                program_group pg
            JOIN
                users u
            ON 
                JSON_CONTAINS(u.program_group, CONVERT(pg.idx, CHAR)) = 1
            LEFT JOIN
                program p
            ON
                pg.program = p.idx	
            WHERE
                u.idusers = ${params.idusers}
            `
            await db.query(sql).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getBoardUse: async (params) => {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM prospective_customers WHERE idusers = ? AND board_use = 'Y' AND CURDATE() between board_use_period_start and board_use_period_end`
            await db.query(sql, [params.idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    setProgramRequest: async (params) => {
        return new Promise(async (resolve, reject) => {

            await db.query('INSERT INTO program_request (idusers,keyword,owner_name,owner_phonenumber, owner_email  ) VALUES (?,?,?,?,?)', [params.idusers, params.keyword, params.owner_name, params.owner_phonenumber, params.owner_email]).then((result) => {
                return resolve(result.insertId)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

}

module.exports = user
