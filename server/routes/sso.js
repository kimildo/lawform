const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const decode = require('jwt-decode')
const salt = 'sobongamicus123!'
const sso = require('../models/sso')
const log = require('../models/log')
const axios = require('axios')
const ua = require('ua-parser-js')

function userLog (req, action, idusers = null, logdata = null) {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(':')
    let agent = ua(req.headers['user-agent'])
    let data = {
        agent: agent,
        ip: !!ip[ip.length - 1].split(',')[0] ? ip[ip.length - 1].split(',')[0].trim() : null
    }
    if (!!logdata) data = Object.assign(data, logdata)
    log.write({
        idusers: idusers,
        action: action,
        data: data
    })
}

router.post('/signin', (req, res) => {

    let params = req.body
    console.log(params)

    sso.ssoSignUp(params).then((result) => {

        const getToken = (result) => {
            return jwt.sign({
                idusers: result.data.idusers,
                username: params.name,
                account_type: 'P',
                email: params.email,
                sso: result.data.sso_idx
            }, req.app.get('jwt-secret'), {
                expiresIn: '12h',
                issuer: 'lawform',
            })
        }

        if (result.status === 'ok') {
            return sso.signin(params).then((result) => {
                console.log('signin result :: ', result)
                userLog(req, 'login', result.data.idusers)
                res.json({ stauts: 'ok', data: result, token: getToken(result) })
            })
        }

        res.json({ stauts: 'fail', data: result })

    }).catch((err) => {
        console.log(err);
        res.json({ stauts: 'error', reason: 'unknown' })
    })

})

router.post('/checkJoin', (req, res) => {

    let params = req.body
    console.log(params)

    sso.checkSsoJoin(params).then((result) => {
        if (result.status === 'ok') {
            res.json({ stauts: 'fail', data: result })
        }
    })

})

router.get('/nvCallback', (req, res) => {

    let params = req.query
    console.log(params)
    console.log(req)

    res.json({ status: 'ok' })

})

module.exports = router