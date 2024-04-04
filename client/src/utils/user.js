let decode = require('jwt-decode')
let Cookies = require('js-cookie')
const API = require('./apiutil')

module.exports = {

    getInfo (subToken = null) {
        let token = Cookies.get('token')
        if (token) {
            let userInfo = decode(token)
            //console.log('userInfo', userInfo)
            let now = Math.floor(Date.now() / 1000)
            if (userInfo.exp < now) {
                Cookies.remove('token')
                return null
            }

            return userInfo
        }

        return null
    },

    getPackage () {
        return new Promise(resolve => {
            API.sendPost('/user/package').then((result) => {
                if (result.status === 'ok') {
                    return resolve(result.data.data)
                } else {
                    return null
                }
            })
        })
    },

    getSubscription () {
        return new Promise(resolve => {
            API.sendPost('/user/subscription').then((result) => {
                if (result.status === 'ok') {
                    return resolve(result.data.data)
                } else {
                    return resolve(null)
                }
            })
        })
    },

    getProgram () {
        return new Promise(resolve => {
            API.sendPost('/user/program').then((result) => {
                if (result.status === 'ok') {
                    return resolve(result.data.data)
                } else {
                    return null
                }
            })
        })
    },

    getAvailableSoutionUser () {
        return new Promise(resolve => {
            API.sendPost('/solution/getAvailableSoutionUser').then((result) => {
                if (result.status === 'ok' && result.data.status === 'ok') {
                    return resolve(result.data.data[0])
                }
                return resolve(null)
            })
        })
    },


    
}

