let express = require('express')
let router = express.Router()
const Axios = require('axios')
const { Iamporter, IamporterError } = require('iamporter')

let writing_peer_review_m = require('../../models/writing_peer_review_m')
let writing_m = require('../../models/writing_m')

let helper_security = require('../../helper/helper_security')

router.post('/get_list', (req, res) => {
    let payload = req.body

    // set default values
    payload.idusers = req.userinfo.idusers

    // check login
    if (!payload.idusers) res.json({ status: 'error' })

    // return list
    let return_list = []

    // get document list
    writing_m.get_list(payload).then((result) => {
        if (!!result) {

            // encode idx
            return_list = result.map(function (item) {
                item.idx = helper_security.encode(item.idx)
                return item
            })

            // set count to true
            payload.count = true
            writing_m.get_list(payload).then((result2) => {
                if (!!result2) {
                    res.json({ 'result': 'ok', 'data': return_list, 'cnt': result2[0].cnt })
                } else {
                    res.json({ 'status': 'error' })
                }
            })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/get', (req, res) => {
    let payload = req.body

    // set default values
    payload.idwriting = payload.idx
    payload.idusers = req.userinfo.idusers

    // check login
    if (!payload.idusers) return res.json({ status: 'error' })

    // get document list
    writing_m.get(payload).then((result) => {
        if (!!result && result.length === 1) {
            return res.json({ result: 'ok', data: result[0] })
        }
        return res.json({ status: 'error' })
    })
})

router.post('/get_document_element_list', (req, res) => {
    let payload = req.body

    // set default values
    payload.writing_idx = payload.idx
    payload.user_idx = req.userinfo.idusers

    // check login
    if (!req.userinfo.idusers) res.json({ status: 'error' })

    // get document list
    writing_m.get_document_element_list(payload).then((result) => {
        if (!!result) {
            res.json(result)
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/delete', (req, res) => {
    let payload = req.body

    // insert to database
    writing_m.delete(payload).then((result) => {
        if (!!result) {
            res.json({ 'result': 'ok' })
        }
        res.json({ 'status': 'error' })
    })
})

router.post('/renew', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers

    writing_m.renew_check(payload).then((result) => {

        if (!!result && result[0].cnt > 0) {
            // insert to database
            writing_m.renew(payload).then((result2) => {
                if (!!result2) {
                    res.json({ 'result': 'ok' })
                } else {
                    res.json({ 'status': 'error' })
                }
            })
        } else if (!!result && result[0].cnt == 0) {
            res.json({ 'result': '409' })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

/** 3일지난 요청건 삭제 (요청상태 == 1) */
router.get('/delWritingPeer', (req, res) => {

    // For Test
    //const IMP = new Iamporter()

    // For Production
    const IMP = new Iamporter({
        apiKey: '2635832336210506',
        secret: '4OvnVlW90jHRHXa4DrgIXmpSv3OxFZoJNT6Ie2Sfmz63xh8bJoTGLizglnN0nbJa5QSkTLzflGjSXr4G'
    })

    let imResults = []
    let cancelOrder = (row) => {
        return new Promise(function (resolve, reject) {
            let imRes = {}
            IMP.findByImpUid(row.imp_uid).then((result) => {
                //console.log(result);
                //console.log('data', result.data);
                if (result.status === 200) {
                    if (result.data.status === 'paid' && result.data.pay_method === 'card') {
                        //console.log('peer_idx', row.peer_idx);
                        //console.log('data', result.data)
                        imRes = {
                            imp_uid: row.imp_uid,
                            pay_idx: row.idpayments,
                            peer_idx: row.peer_idx,
                            pay_status: result.data.status,
                            pay_service: result.data.name,
                            imp_buyer_name: result.data.buyer_name,
                            buyer_name: row.user_name,
                        }
                        //console.log('imRes', imRes);
                        console.log('Exist IMP ::', row.imp_uid)
                        imResults.push(imRes)
                        return true
                    }
                }

                console.log('Not Exist IMP', row.peer_idx)
                return false
                //console.log('imRes', imRes);
                //return resolve(true);
            })
                .then((result2) => { // 실제 취소

                    if (!!result2) {
                        IMP.cancelByImpUid(row.imp_uid).then(() => {
                            return resolve(writing_m.peer_cancel(row.peer_idx))
                        })
                    } else {
                        console.log('No Data', row.peer_idx)
                        return resolve(true)
                    }

                })

                // .then((result3) => { // DB 업데이트
                //     if (!!result3) {
                //         console.log(row.imp_uid + ' result3', result3)
                //         return resolve(writing_m.peer_cancel(row.peer_idx))
                //     }
                //
                //     return resolve(true)
                // })

                .catch((err) => {
                    console.log(err.status) // HTTP STATUS CODE
                    console.log(err.message) // 아임포트 API 응답 메시지 혹은 Iamporter 정의 메시지
                    console.log(err.data) // 아임포트 API 응답 데이터
                    console.log(err.raw) // 아임포트 API RAW DATA
                    return reject(err)
                })
        })
    }

    writing_m.get_peer_date_passed().then((rows) => {
        //console.log(rows)
        if (!!rows && rows.length > 0) {
            Promise.all(rows.map(row => cancelOrder(row))).then(() => {
                res.json({ status: 'ok', data: imResults })
            }).catch((err) => {
                res.json({ status: 'err', data: err })
            })
        }
    })

})

module.exports = router
