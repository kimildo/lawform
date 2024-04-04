const db = require('../utils/rdb')
const logger = require('../utils/winston_logger')
const etcString = 'LS'

let legalsolution = {

    setSolutiondata: async (params) => {
        return new Promise(async (resolve, reject) => {

            let bindDataJson = {}
            let dataType = 0

            if (!!params.dataType) {
                dataType = Number(params.dataType)
            }

            if (!!params.data) {
                bindDataJson = JSON.stringify(params.data)
            }

            let columName = getColumName(dataType)
            if (columName === 'solution_step_data') {
                bindDataJson = JSON.stringify(params.solution_step_data)
            }

            let sql = `INSERT INTO legal_solution (idusers, ${columName}) VALUES (?, ?) ON DUPLICATE KEY UPDATE ${columName} = ?`
            logger.debug(sql)
            await db.query(sql, [params.userInfo.idusers, bindDataJson, bindDataJson]).then(() => {
                return resolve(true)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getSolutiondata: async (params) => {
        return new Promise(async (resolve, reject) => {

            let dataType = 0
            if (!!params.dataType) {
                dataType = Number(params.dataType)
            }

            let columName = getColumName(dataType)
            let sql = `SELECT ${columName} AS col FROM legal_solution WHERE idusers = ?`
            await db.query(sql, [params.userInfo.idusers]).then((row) => {
                return resolve(row)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })

        })
    },

    delSolutiondata: async (params) => {
        return new Promise(async (resolve, reject) => {
            let sql = `DELETE
                       FROM legal_solution
                       WHERE idusers = ?`
            await db.query(sql, [params.userInfo.idusers]).then((row) => {
                return resolve(true)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getAnswerData: async (params) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
            SELECT 
                pc.company_name,
                pc.company_owner,
                pc.head_office_addr,
                pc.tel,
                pc.main_business
            FROM 
                prospective_customers pc
            WHERE pc.idusers = ?
            `

            await db.query(sql, [params.userInfo.idusers]).then((row) => {
                return resolve(row)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })

        })
    },

    addDocuments: async (params) => {
        return new Promise(async (resolve, reject) => {

            if (!params.userInfo.idusers) {
                return reject()
            }

            let selectSql = 'SELECT COUNT(1) AS count FROM writing WHERE idusers = ? AND etc = ?'
            await db.query(selectSql, [params.userInfo.idusers, etcString]).then((rows) => {
                // console.log( 'fail', selectSql )
                // console.log( 'fail', rows[0].count )
                if (!!rows[0].count) {
                    return resolve({ status: 'fail', reason: 'already_add' })
                } else {
                    let expireDate = getFormatDate(6)
                    let editableDate = getFormatDate(7, 'd')
                    let addColums = ['idusers', 'idpayments', 'iddocuments', 'template_id', 'title', 'etc', 'status', 'expiredate', 'editabledate']
                    let matchValue = [params.userInfo.idusers, 0, 'iddocuments', 'template_id', 'title', '\'' + etcString + '\'', 1, '\'' + expireDate + '\'', '\'' + editableDate + '\'']
                    let where = `idcategory_1 = 99 AND iddocuments IN (${params.addDocs})`
                    let sql = `INSERT INTO writing (${addColums}) SELECT ${matchValue} FROM documents WHERE ${where}`
                    db.query(sql).then(() => {
                        return resolve({ status: 'ok', reason: '' })
                    }).catch((err) => {
                        logger.error(err)
                        return reject(err)
                    })
                }
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getDocuments: async (params) => {
        return new Promise(async (resolve, reject) => {
            await db.query('SELECT idwriting, iddocuments, title, view, binddata FROM writing WHERE idusers = ? AND etc = ? ORDER BY title'
                , [params.userInfo.idusers, etcString]).then((row) => {
                return resolve(row)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getAvailableSoutionUser: async (idusers) => {
        return new Promise(async (resolve, reject) => {

            let sql = `
                SELECT u.idusers AS idusers,
                       pc.group_text,
                       pc.solution_use_period_start,
                       pc.solution_use_period_end
                FROM users u
                         JOIN prospective_customers pc on u.idusers = pc.idusers
                WHERE u.idusers = ?
                  AND pc.solution_use = 'Y'
                  AND pc.solution_use_period_start IS NOT NULL
                  AND pc.solution_use_period_end IS NOT NULL
                  AND pc.solution_use_period_start <= CURDATE()
                  AND pc.solution_use_period_end >= CURDATE()
            `

            await db.query(sql
                , [idusers]).then((row) => {
                return resolve(row)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getQuestionData: async (params) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT
                    *
                FROM legal_solution_questions
                WHERE status = 1
                    AND type = ?
                    AND section = ?
                ORDER BY type, question_group, depth, order_seq
            `

            await db.query(sql, [params.q_type, params.section]).then((row) => {
                return resolve(row)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })

        })
    },

    addSolutionAnswers: async (params, idusers) => {
        return new Promise(async (resolve, reject) => {

            if (!!params.answers) {
                params.answers = JSON.stringify(params.answers)
            }

            let sql = `
                INSERT INTO legal_solution_answers (idusers, question_type, answer, section, status) VALUES (?, ?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE answer = ?, status = ?
            `

            await db.query(sql, [idusers, params.answerType, params.answers, params.section, params.status, params.answers, params.status]).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getSubQuestions: async (params) => {
        return new Promise(async (resolve, reject) => {

            let idxs = params.idxs
            idxs = idxs.join(', ')

            let sql = `
                SELECT
                    *
                FROM legal_solution_questions
                WHERE status = 1
                    AND type = 'B'
                    AND section = ?
                    AND dep_lsq_idx IN (${idxs}) 
                ORDER BY dep_lsq_idx, order_seq
            `

            await db.query(sql, [params.section]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getUserSolutionAnswers: async (params, idusers) => {
        return new Promise(async (resolve, reject) => {
            let section = params.section?` AND section = ${params.section} `:``
            let sql = `
                SELECT
                    *
                FROM legal_solution_answers
                    WHERE idusers = ?
                    ${section}
            `

            await db.query(sql, [idusers]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },


    resetUserAnswers: async (idusers, section) => {
        return new Promise(async (resolve, reject) => {

            let sql = `DELETE FROM legal_solution_answers WHERE idusers = ? AND section = ?`
            await db.query(sql, [idusers, section]).then((result) => {
                return resolve(result.affectedRows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getUserLastModify: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
            SELECT 
                section,
                COUNT(*) as count,
                if( ( SELECT section FROM legal_solution_answers WHERE idusers = ? AND status = 0 ORDER BY modify_datetime ) = section , 'Y', 'N' ) AS lastmodifiedtemp
            FROM 
                legal_solution_answers lsa
            WHERE
                lsa.idusers = ?
            AND status = 1
            GROUP BY
                lsa.section
            ORDER BY lastmodifiedtemp desc`
            await db.query(sql, [idusers, idusers]).then((result) => {
                return resolve(result)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getLawissueData: async (category) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT 
                    idx
                    , category
                    , tag
                    , sub_tag
                    , title
                    , replace(replace(contents, char(13), ''), char(10), '') AS contents
                    , guide_text
                    , guide_link_no
                    , reference_text
                    , reference_link
                    , writer
                    , status
                    , regist_date
                    , modify_date
                FROM law_issue 
                    WHERE status = 'Y'
                    AND category = ?
            `

            await db.query(sql, [category]).then((rows) => {
                return resolve(rows)
            }).catch((err) => {
                logger.error(err)
                return reject(err)
            })
        })
    },

    getUserSolutionCompleted: async (idusers) => {
        return new Promise(async (resolve, reject) => {
            let sql = `
            SELECT 
            GROUP_CONCAT( if( question_types = 'A,B', section , NULL ) ) AS completed 
        FROM 
            ( SELECT 
                *,GROUP_CONCAT( question_type ) AS question_types 
                FROM legal_solution_answers WHERE
                STATUS =1 GROUP BY idusers, section) answers
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


}

const getColumName = (dataType) => {

    let columName = ''
    switch (dataType) {
        case 1 :
            columName = 'articles_incorporation'
            break
        case 2 :
            columName = 'stock'
            break
        case 3 :
            columName = 'sharehoders_agreement'
            break
        case 4 :
            columName = 'employee_agreement'
            break
        case 5 :
            columName = 'labor_contract'
            break
        case 6 :
            columName = 'partnership_agreement'
            break
        case 7 :
            columName = 'executive_employment'
            break
        case 8 :
            columName = 'mou'
            break
        case 9 :
            columName = 'joint_arrangement'
            break
        case 10 :
            columName = 'service_agreement'
            break
        case 11 :
            columName = 'nda'
            break
        case 99 :
            columName = '*'
            break
        default :
            columName = 'solution_step_data'
    }

    return columName

}

const getFormatDate = (addDate = 0, type = 'm') => {
    let date = new Date()
    if (!!addDate) {
        if (type === 'm') date.setMonth(date.getMonth() + addDate)
        else date.setDate(date.getDate() + addDate)
    }

    let year = date.getFullYear() //yyyy
    let month = (1 + date.getMonth())
    month = (month >= 10) ? month : '0' + month
    let day = date.getDate()
    day = (day >= 10) ? day : '0' + day

    return year + '-' + month + '-' + day + ' 23:59:29'
}



module.exports = legalsolution