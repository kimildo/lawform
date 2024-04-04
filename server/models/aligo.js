/** aligo.sendMessage( { sender,receiver*,msg*,testmode_yn } ) */

const axios = require('axios')
let aligoHost = 'https://apis.aligo.in'
let aligoApiKey = '9bvpd2qrcd38dhiwuspy7pjj4bqledqs'
let aligoApiId = 'amicuslex'
let aligoTestMode = 'N'
let aligoSender = '0269250227'

if (!!process.env.SERVER_ALIGO_HOST) aligoHost = process.env.SERVER_ALIGO_HOST
if (!!process.env.SERVER_ALIGO_APIID) aligoApiId = process.env.SERVER_ALIGO_APIID
if (!!process.env.SERVER_ALIGO_APIKEY) aligoApiKey = process.env.SERVER_ALIGO_APIKEY
if (!!process.env.SERVER_ALIGO_TESTMODE) aligoTestMode = process.env.SERVER_ALIGO_TESTMODE
if (!!process.env.SERVER_ALIGO_SENDER) aligoTestMode = process.env.SERVER_ALIGO_SENDER

let aligo = {
    sendMessage: async (params) => {
        return new Promise(async (resolve, reject) => {
            let sendUrl = aligoHost + '/send/'
            let config = {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }

            let aligoParams = new URLSearchParams()
            aligoParams.append('key', aligoApiKey)
            aligoParams.append('user_id', aligoApiId)
            aligoParams.append('sender', (params.sender) ? params.sender : aligoSender)
            aligoParams.append('receiver', params.receiver)
            aligoParams.append('msg', params.msg)
            aligoParams.append('testmode_yn', (params.testmode_yn) ? params.testmode_yn : aligoTestMode)

            console.log('aligo', aligoParams)

            axios.post(sendUrl, aligoParams, config)
                .then(res => {
                    console.log(res.data)
                    return (res.data.result_code === '1') ? resolve(res.data) : resolve('sendMessageFail')
                    // if (res.data.result_code === '1') return resolve(res.data)
                    // else return resolve('sendMessageFail')
                })
        })
    }
}

module.exports = aligo