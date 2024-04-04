let express = require('express')
let os = require('os')
let router = express.Router()
const aligo = require('../../models/aligo')

let writing_peer_review_m = require('../../models/writing_peer_review_m')
let writing_m = require('../../models/writing_m')

let helper_security = require('../../helper/helper_security')
let helper_date = require('../../helper/helper_date')

let moment = require('moment');

const this_hostname = (!!process.env.SERVER_HOST_NAME) ? process.env.SERVER_HOST_NAME : 'https://lawform.io'
const sandbox = (!!process.env.SERVER_ALIGO_TESTMODE) ? process.env.SERVER_ALIGO_TESTMODE : 'N'

router.post('/get', (req, res) => {
    let payload = req.body

    // set default values
    payload.peer_idx = payload.peer_idx
    payload.idusers = req.userinfo.idusers

    // check login
    if (!payload.idusers) res.json({ status: 'error' })

    // get document list
    writing_peer_review_m.get(payload).then((result) => {
        if (!!result && result.length === 1) {
            res.json({ 'result': 'ok', 'data': result[0] })
        } else {
            /////////////////////
            writing_peer_review_m.get2(payload).then((result) => {
                if (!!result && result.length === 1) {
                    res.json({ 'result': 'ok', 'data': result[0] })
                } else {
                    res.json({ 'status': 'error' })
                }
            })
            ////////////////////
        }
    })
})

router.post('/get_list', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    let return_list = []

    writing_peer_review_m.get_list(payload).then((result) => {
        if (!!result) {
            return_list = result.map(function (item) {
                item.idx = helper_security.encode(item.idx)
                return item
            })
            payload.count = true
            writing_peer_review_m.get_list(payload).then((result2) => {
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

router.post('/documents_requested_service', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    let return_list = []

    writing_peer_review_m.get_documents_requested_service_list(payload).then((result) => {
        if (!!result) {
            return_list = result.map(function (item) {
                item.idx = helper_security.encode(item.idx)
                return item
            })
            payload.count = true
            writing_peer_review_m.get_documents_requested_service_list(payload).then((result2) => {
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

router.post('/get_waiting_lawyer_list', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    let return_list = []

    writing_peer_review_m.get_waiting_lawyer_list(payload).then((result) => {
        if (!!result) {
            return_list = result.map(function (item) {
                item.idx = helper_security.encode(item.idx)
                return item
            })
            payload.count = true
            writing_peer_review_m.get_waiting_lawyer_list(payload).then((result2) => {
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

router.post('/get_processing_document_list', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    let return_list = []

    writing_peer_review_m.get_processing_document_list(payload).then((result) => {
        if (!!result) {
            return_list = result.map(function (item) {
                item.idx = helper_security.encode(item.idx)
                return item
            })
            payload.count = true
            writing_peer_review_m.get_processing_document_list(payload).then((result2) => {
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

router.post('/get_count', (req, res) => {
    let payload = req.body

    // set default values
    payload.idusers = req.userinfo.idusers

    // check login
    if (!payload.idusers) res.json({ status: 'error' })

    // get document list
    writing_peer_review_m.get_count(payload).then((result) => {
        if (!!result && result.length == 1) {
            res.json({ 'result': 'ok', 'data': result[0] })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/create_peer_review', (req, res) => {

    let payload = req.body

    // set default values
    payload.user_idx = req.userinfo.idusers
    payload.lawyer_idx = 0
    payload.status = 1
    payload.processing_status = 1
    payload.apply_end_date_time = helper_date.get_apply_deadline()
    payload.request_date_time = helper_date.get_date()
    payload.review_complete_date = null
    payload.lawyer_edit_content = null

    const service_name = (!!payload.question_2_len) ? '검토' : '직인'
    const service_url = '/lawyer/contract/request'
    //const service_url = '/lawyer/contract/request/#2' + ((!!payload.question_2_len) ? '/review/' : '/seal/')

    // 글자수 체크 관련 필드 제거
    delete payload.question_1_len
    delete payload.question_2_len
    delete payload.question_3_len

    // check login
    if (!payload.user_idx) res.json({ 'status': 'error' })

    //console.log('lawyer_create_return_payload', payload)

    // insert to database
    writing_peer_review_m.create(payload).then((result) => {

        if (!!result) {

            let retData = result.data
            let receivers = result.receiver
            // let msg = '안녕하세요. 로폼입니다. \n' +
            //     retData.user_name + ' 회원님으로부터 \n' +
            //     retData.title + ' [' + retData.service_name + '] 서비스 요청이 들어왔습니다. \n' +
            //     '확인하시겠습니까?\n' +
            //     this_hostname + service_url
            let msg = '안녕하세요 로폼입니다. 새로운 요청 사건이 있습니다.\n' + '자세히 보기\n' + this_hostname + service_url
            let aligoParams = {
                msg: msg,
                receiver: receivers,
                testmode_yn: sandbox
            }

            console.log('peer create aligo params :: ', aligoParams)

            try {
                aligo.sendMessage(aligoParams).then((aligoResult) => {
                    console.log('aligoResult', aligoResult)
                }).catch((err) => {
                    console.log(err.message)
                })
            } catch (e) {
                console.log(e.message)
            }

            res.json({ 'result': 'ok', 'data': helper_security.encode(retData) })
        }

        res.json({ 'status': 'error' })
    })
})

router.post('/cancel_peer_review', (req, res) => {
    let payload = req.body

    // set default values
    payload.idx = helper_security.decode(payload.writing_peer_review_idx)
    payload.user_idx = req.userinfo.idusers
    payload.status = 0

    // check login
    if (!payload.user_idx) res.json({ 'status': 'error' })

    // insert to database
    writing_peer_review_m.cancel(payload).then((result) => {

        let msg = result.user_name + ' 회원님으로부터 \n[' + result.idx + '][' + result.service_name + '] 서비스 취소요청이 발생했습니다.\n [' + result.imp_uid + ']'
        let receivers = '01062500164'

        try {
            aligo.sendMessage({
                msg: msg,
                receiver: receivers,
                testmode_yn: sandbox
            }).then((aligoResult) => {
                console.log('aligoResult', aligoResult)
            }).catch((err) => {
                console.log(err.message)
            })
        } catch (e) {
            console.log(e.message)
        }

        res.json({ 'result': 'ok' })
    })
})

router.post('/delete', (req, res) => {
    let payload = req.body

    // insert to database
    writing_peer_review_m.delete(payload).then((result) => {
        if (!!result) {
            res.json({ 'result': 'ok' })
        }
        res.json({ 'status': 'error' })
    })
})

router.post('/accept', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers

    writing_peer_review_m.accept_check(payload).then((result) => {

        if (!!result && result[0].lawyer_idx === 0) {

            //lawyer_idx, wpr.payment_idx, wpr.service_idx, s.period
            //payload.lawyer_idx = result[0].lawyer_idx
            payload.payment_idx = result[0].payment_idx
            payload.service_idx = result[0].service_idx
            payload.review_deadline = helper_date.get_date_added(result[0].period, '09:00:00')

            writing_peer_review_m.accept(payload).then((result2) => {
                if (!!result2) {

                    let aligoParams
                    if (!!result[0].mobile_number) {
                        aligoParams = {
                            msg: '로폼입니다. 변호사 매칭이 완료 되었습니다.\n' + '홈페이지에서 확인해주세요',
                            receiver: result[0].mobile_number,
                            testmode_yn: sandbox
                        }

                        console.log('peer accept aligo params :: ', aligoParams)

                        try {
                            aligo.sendMessage(aligoParams).then((aligoResult) => {
                                console.log('aligoResult', aligoResult)
                            }).catch((err) => {
                                console.log('aligoResultError', err.message)
                            })
                        } catch (e) {
                            console.log('aligoResultError', e.message)
                        }
                    }

                    if (!!result[0].lawyer_mobile_number) {

                        let reviewDeadline = moment( payload.review_deadline).format('Y/MM/DD H:mm')
                        aligoParams.msg = '로폼입니다. ' + result[0].user_name + '님의 사건을 수락하셨습니다.\n' +
                                    '마감기한은 '+ reviewDeadline +' 까지 입니다.\n' +
                                    '마감기한을 꼭 엄수해주세요.'
                        aligoParams.receiver = result[0].lawyer_mobile_number

                        console.log('peer accept aligo params :: ', aligoParams)

                        try {
                            aligo.sendMessage(aligoParams).then((aligoResult) => {
                                console.log('aligoResult', aligoResult)
                            }).catch((err) => {
                                console.log('aligoResultError', err.message)
                            })
                        } catch (e) {
                            console.log('aligoResultError', e.message)
                        }
                    }

                    res.json({ 'result': 'ok' })
                } else {
                    res.json({ 'status': 'error' })
                }
            })
        } else if (!!result && result[0].lawyer_idx !== 0) {
            res.json({ 'result': '409' })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/renew', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    payload.request_date_time = helper_date.get_date()
    payload.apply_end_date_time = helper_date.get_apply_deadline()

    writing_peer_review_m.renew_check(payload).then((result) => {
        if (!!result && result[0].cnt > 0) {
            // insert to database
            writing_peer_review_m.renew(payload).then((result2) => {
                if (!!result2) {
                    res.json({ 'result': 'ok', data: result2.data })
                } else {
                    res.json({ 'status': 'error', data: null })
                }
            })
        } else if (!!result && result[0].cnt === 0) {
            res.json({ 'result': '409', data: null })
        } else {
            res.json({ 'status': 'error', data: null })
        }
    })
})

/* 수정요청 */
router.post('/retouch', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers

    // insert to database
    writing_peer_review_m.retouch(payload).then((result) => {
        if (!!result) {

            console.log('result[0]', result[0])

            let receivers = result[0].mobile_number
            let msg = '로폼입니다. 완료하신 ' + result[0].name + '님의 사건에 수정요청이 있습니다.\n' +
                    '나의 사건관리에서 확인해주세요. PC에서만 가능합니다. 감사합니다.'

            let aligoParams = {
                msg: msg,
                receiver: receivers,
                testmode_yn: sandbox
            }

            console.log('peer retouch aligo params :: ', aligoParams)

            if (!!result[0].mobile_number) {
                try {
                    aligo.sendMessage(aligoParams).then((aligoResult) => {
                        console.log('aligoResult', aligoResult)
                    }).catch((err) => {
                        console.log('aligoResultError', err.message)
                    })
                } catch (e) {
                    console.log('aligoResultError', e.message)
                }
            }

            res.json({ 'result': 'ok' })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/save', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers

    // insert to database
    writing_peer_review_m.save(payload).then((result) => {
        const resObj = (!!result) ? { 'result': 'ok' } : { 'status': 'error' }
        res.json(resObj)
    })
})

/* 변호사 임시저장 */
router.post('/tempsave', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers

    // insert to database
    writing_peer_review_m.tempsave(payload).then((result) => {
        const resObj = (!!result) ? { 'result': 'ok' } : { 'status': 'error' }
        res.json(resObj)
    })
})

/* 변호사 최종완료 */
router.post('/complete', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    payload.review_complete_date = helper_date.get_date()

    console.log(req.userinfo)
    res.json({ 'result': 'ok' })

    // insert to database
    writing_peer_review_m.complete(payload).then((result) => {
        if (!!result) {

            let receivers = result[0].mobile_number
            let msg = '로폼입니다. 최종 검토를 완료 하셨습니다. \n' + '로폼에서 최종 검수 후 의뢰인에게 전달됩니다.\n'


            if (!!retouch_request_timestamp) {
                msg += '완료된 사건의 정산은 익월 25일에 진행됩니다.\n' + '감사합니다.'
            } else {
                msg += '익일 09:00까지 의뢰인이 1회 수정요청을 할 수 있습니다.\n' + '감사합니다.'
            }

            let aligoParams = {
                msg: msg,
                receiver: receivers,
                testmode_yn: sandbox
            }

            console.log('peer complete aligo params :: ', aligoParams)

            if (!!result[0].mobile_number) {
                try {
                    aligo.sendMessage(aligoParams).then((aligoResult) => {
                        console.log('aligoResult', aligoResult)
                    }).catch((err) => {
                        console.log('aligoResultError', err.message)
                    })
                } catch (e) {
                    console.log('aligoResultError', e.message)
                }
            }

            res.json({ 'result': 'ok' })

        } else {
            res.json({ 'status': 'error' })
        }
    })
})

router.post('/lawyer_content', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    writing_peer_review_m.lawyer_content(payload).then((result) => {
        if (!!result) {
            res.json({
                result: 'ok',
                data: result[0]
            })
        } else {
            res.json({ status: 'error' })
        }
    })
})

/** 문서확인 업데이트 */
router.post('/user_check_complete', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    writing_peer_review_m.updateNewCompleted(payload).then((result) => {
        if (!!result) {
            res.json({ 'result': 'ok' })
        } else {
            res.json({ 'status': 'error' })
        }
    })
})

/** 문서확인 정보 패치 */
router.post('/get_user_check_complete', (req, res) => {
    let payload = req.body
    payload.user_idx = req.userinfo.idusers
    writing_peer_review_m.getNewCompleted(payload).then((result) => {
        if (!!result) {
            res.json({ result: 'ok', data: result[0] })
        } else {
            res.json({ status: 'error' })
        }
    })
})

module.exports = router
