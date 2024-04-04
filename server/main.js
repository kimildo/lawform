let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let authToken = require('./utils/authtoken')
global.logger = require('./utils/winston_logger')
require('dotenv').config()
require('events').EventEmitter.defaultMaxListeners = 25

let serverPort = 8000
if (!!process.env.SERVER_PORT) {
    serverPort = process.env.SERVER_PORT // in .env. SERVER_PORT=[port number]
}
let argvPort = process.argv.find(str => str.includes('--PORT:'))
if (argvPort) {
    serverPort = argvPort.split(':')[1] // with CLI 'nodemon start --PORT:[port number]'
}

let jwtSecretKey = 'sobongamicus123!'
if (!!process.env.SERVER_JWT_SECRET) {
    jwtSecretKey = process.env.SERVER_JWT_SECRET
}

let app = express()
app.get('/', (req, res) => {
    // res.send("Hello World!");
    res.sendStatus(404)
    logger.info(`404 NOT FOUND @ :${serverPort}/ - ${req.connection.remoteAddress}`)
})

app.set('jwt-secret', jwtSecretKey) // DEBUG!! export env

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authToken)

app.use('/api/documents', require('./routes/documents'))
app.use('/api/user', require('./routes/user'))
app.use('/api/sso', require('./routes/sso'))
app.use('/api/print', require('./routes/print'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/writing', require('./routes/writing'))
app.use('/api/customer', require('./routes/customer'))
app.use('/api/board', require('./routes/board'))
app.use('/api/event', require('./routes/event'))
app.use('/api/solution', require('./routes/solution'))
app.use('/api/config', require('./routes/config'))
app.use('/api/v2/user', require('./routes/v2/user'))
app.use('/api/v2/writing', require('./routes/v2/writing'))
app.use('/api/v2/writing_peer_review', require('./routes/v2/writing_peer_review'))
app.use('/api/v2/review', require('./routes/v2/review'))

app.listen(serverPort, (req, res) => {
    logger.info(`Sever is running on port ${serverPort}!`)
})

logger.info('App Start')