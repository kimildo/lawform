const axios = require('axios')
const jwt = require('jsonwebtoken')
const db = require('../utils/rdb')
const logger = require('../utils/winston_logger')
const sha512 = require('../utils/salt_sha512')
const payments = require('./payments')
const salt = 'sobongamicus123!'

const sso = {


    ssoSignUp: async (params) => {

        return new Promise(async (resolve, reject) => {

            let checkEmail = await db.query(`SELECT email FROM users WHERE email = ?`, [params.email]).then((rows) => {
                return (db.isEmpty(rows)) ? null : rows
            })

            let checkSso = await db.query('SELECT sso_idx FROM users_sso WHERE sso_idx = ?', [params.idx]).then((rows) => {
                return (db.isEmpty(rows)) ? null : rows
            })

            console.log('checkEmail ::', checkEmail)
            console.log('checkSso ::', checkSso)

            // 로폼에 가입된 회원일 경우 (이메일 중복)
            if (!!checkEmail && !checkSso) {
                console.log('already_email')
                return resolve({ status: 'fail', data: {}, reason: 'already_email' })
            }

            // 이미 가입된
            if (!!checkSso) {
                console.log('joined')
                return resolve({ status: 'ok', data: {} })
            }

            // 가입필요
            if (!checkEmail && !checkSso) {
                console.log('need_joined')
                let signUpSql = `INSERT INTO users
                    SET type          = 'P',
                        login_id      = null,
                        email         = ?,
                        name          = ?,
                        password      = ?,
                        signup_path   = ?,
                        is_approved   = 1,
                        agree_service = 'Y',
                        agree_info    = 'Y',
                        agree_msg     = 'Y',
                        tester        = 'N'
                `

                await db.query(signUpSql,
                    [params.email, params.name, '2afc1f079b104bcc4386709d75d10a80decbf6d8d7947e6322062df397aa603588dbf86b89b5f9449dcc15a267a3a8c0f6c2792060e9bf2751c59b42669a085c', params.source])
                    .then((result) => {

                        if (!result.affectedRows) return reject('SSO JOIN Error :: users')

                        let idusers = result.insertId
                        return db.query(`INSERT INTO users_personal (idusers, phonenumber, birthdate, sns_id, sns_service) VALUES (?, ?, ?, null, null)`
                            , [idusers, params.phonenumber, params.birthdate]).then((row) => {

                                if (!row.affectedRows) return reject('SSO JOIN Error :: users_personal')
                                return {
                                    idusers: idusers,
                                    row: row.affectedRows
                                }
                        })

                    }).then(r => {
                        let sso_params = [r.idusers, params.idx, params.source, params.source_data]
                        return db.query(`INSERT INTO users_sso SET idusers = ?, sso_idx = ?, source = ?, source_data = ?`, sso_params)
                            .then((r) => {
                                if (!r.affectedRows) return reject('SSO JOIN Error :: users_sso')
                                return resolve({ status: 'ok', data: r.idusers })
                        })

                    })
            }

        })

    },

    checkSsoJoin: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query(`
                        SELECT us.sso_idx as sso_idx FROM users_sso us
                        WHERE sso_idx = ?
            `, [params.idx]).then((rows) => {

                let data = rows[0]
                let result = null

                if (db.isEmpty(rows)) { // 회원가입이 필요한 경우
                    result = 'need_join'
                } else if (!!data.sso_idx) { // 이미 소셜로 가입된 경우
                    result = 'aleady_joined'
                }

                return resolve({ status: 'ok', data: result })
            })
        })
    },

    signup: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query(`
                INSERT INTO users
                SET type          = 'P',
                    login_id      = null,
                    email         = ?,
                    name          = ?,
                    password      = '2afc1f079b104bcc4386709d75d10a80decbf6d8d7947e6322062df397aa603588dbf86b89b5f9449dcc15a267a3a8c0f6c2792060e9bf2751c59b42669a085c',
                    signup_path   = ?,
                    is_approved   = 1,
                    agree_service = 'Y',
                    agree_info    = 'Y',
                    agree_msg     = 'Y',
                    tester        = 'N'
            `, [params.email, params.name, params.source])
                .then((result) => {
                    let idusers = result.insertId
                    console.log('idusers ::', idusers)
                    db.query(`INSERT INTO users_personal (idusers, phonenumber, birthdate, sns_id, sns_service)
                              VALUES (?, ?, ?, null, null)`, [idusers, null, params.birthdate]).then((result) => {
                        return idusers
                    }).then(idusers => {
                        let sso_params = [idusers, params.idx, params.source, params.source_data]
                        console.log('params', params)
                        db.query(`INSERT INTO users_sso
                                  SET idusers     = ?,
                                      sso_idx     = ?,
                                      source      = ?,
                                      source_data = ?`, sso_params).then((result) => {
                            return resolve({ status: 'ok', data: idusers })
                        })
                    })
                })
        })
    },

    signin: async (params) => {
        return new Promise(async (resolve, reject) => {
            console.log('signin', 11)
            await db.query(`
                SELECT u.*, uss.sso_idx
                FROM users_sso uss
                         JOIN users u on uss.idusers = u.idusers
                WHERE uss.sso_idx = ?
            `, [params.idx])
                .then((rows) => {
                    if (db.isEmpty(rows)) return resolve({ status: 'error', data: {}, reason: 'notmatch' })
                    return resolve({ status: 'ok', data: rows[0] })
                })

        })

    },

}

module.exports = sso