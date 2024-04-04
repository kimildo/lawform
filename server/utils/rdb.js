const mysql = require('mysql2')
let db_host = 'ami-lawform.cpw48majncyb.ap-northeast-2.rds.amazonaws.com'
// var db_host = 'dev-lawform.cpw48majncyb.ap-northeast-2.rds.amazonaws.com';
let db_user = 'amicuslex'
let db_password = 'amilex123!'
let db_database = 'lawform'

if (process.env.SERVER_DB_HOST) db_host = process.env.SERVER_DB_HOST
if (process.env.SERVER_DB_USER) db_user = process.env.SERVER_DB_USER
if (process.env.SERVER_DB_PASSWORD) db_password = process.env.SERVER_DB_PASSWORD
if (process.env.SERVER_DB_DATABASE) db_database = process.env.SERVER_DB_DATABASE

console.log('db_host : ', db_host)

const pool = mysql.createPool({
    connectionLimit: 10,
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database,
    dateStrings: 'date'
})

const DB = (function () {
    function _query (query, params) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release()
                    return reject(err)
                }

                connection.query(query, params, function (err, rows) {
                    connection.release()
                    if (!err) return resolve(rows)
                    else return reject(err)
                })

                connection.on('error', function (err) {
                    connection.release()
                    return resolve(err)
                })
            })
        })
    }

    function _isEmpty (rows) {
        return !rows || rows.length === 0
    }

    return {
        query: _query,
        isEmpty: _isEmpty
    }
})()

module.exports = DB