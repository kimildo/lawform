let express = require('express')
let router = express.Router()
let upload = require('../utils/fileupload')
let multer = require('multer')
let user = require('../models/user')
let log = require('../models/log')
let documents = require('../models/documents')
let aligo = require('../models/aligo')
let jwt = require('jsonwebtoken')
let decode = require('jwt-decode')
let salt = 'sobongamicus123!'
const axios = require('axios')
var aligoApiKey = '9bvpd2qrcd38dhiwuspy7pjj4bqledqs'
var aligoApiId = 'amicuslex'
var lawformSender = '01062500164'
const ua = require('ua-parser-js')

function userLog (req, action, idusers = null, logdata = null) {
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(':')
    let agent = ua(req.headers['user-agent'])
    var data = {
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

router.post('/sendphone', (req, res) => {
    try {
        let receiver = req.body.receiver
        let rcode = Math.floor(Math.random() * (999999 - 100000)) + 100000
        let msg = '[로폼] 인증번호 ' + rcode + '을 입력해주세요.'
        let params = {
            receiver: receiver,
            msg: msg
        }

        user.sendPhoneAuthCode(params).then((result) => {
            if (result.result_code !== '1') res.json({ stauts: 'error', data: result.result_code, reason: 'send_fail' })
            else user.setPhoneAuthCode(receiver, rcode, result.msg_id).then((result) => {
                    res.json({ stauts: 'ok', data: result, reason: 'send_ok' })
                }
            )
        }).catch((err) => {
            // console.log(err);
            res.json({ stauts: 'error', reason: 'unknown' })
        })
    } catch (err) {
        // console.log(err);
        res.json({ status: 'error' })
    }
})

router.post('/authphone', (req, res) => {
    let rcode = req.body.rcode
    let receiver = req.body.receiver
    try {
        user.getPhoneAuthCode(receiver).then((scode) => {
            console.log(rcode)
            console.log(scode)
            return (rcode == scode) ? res.json({ status: 'ok' }) : res.json({ status: 'error' })
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/checkemail', (req, res) => {
    let email = req.body.email
    try {
        user.getIdusersByEmail(email).then((result) => {
            console.log(result)
            if (result != null) res.json({ status: 'error' })
            else res.json({ status: 'ok' })
        })
    } catch (err) {
        res.json({ status: 'ok' })
    }
})

router.post('/checkloginid', (req, res) => {
    let loginId = req.body.loginId
    try {
        user.getIdusersByLoginID(loginId).then((result) => {
            if (!!result) res.json({ status: 'error' })
            else res.json({ status: 'ok' })
        })
    } catch (err) {
        res.json({ status: 'ok' })
    }
})

router.post('/info', (req, res) => {


    let idusers = null

    if (!req.userinfo) {
        res.json({ status: 'error' })
        return
    }

    if (!!req.userinfo) {
        if (!!req.userinfo.idusers) {
            idusers = req.userinfo.idusers
        }
    }

    try {
        user.getUserInfoByIdusers(idusers).then((result) => {

            console.log('info', result)

            if (result != null) {
                var userData = {}
                userData.login_id = result[0].login_id
                userData.email = result[0].email
                userData.type = result[0].type
                userData.name = result[0].name
                userData.tester = result[0].tester
                if (userData.type === 'P') {
                    user.getPersonalInfoByIdusers(idusers).then((p_res) => {
                        console.log(p_res)
                        if (p_res !== null) {
                            userData.phonenumber = p_res[0].phonenumber
                            userData.birthdate = p_res[0].birthdate
                            userData.sns_id = p_res[0].sns_id
                            userData.sns_service = p_res[0].sns_service
                            res.json({ status: 'ok', userData: userData })
                        } else {
                            res.json({ status: 'error' })
                        }
                    })
                } else if (userData.type === 'C') {
                    user.getCompanyInfoByIdusers(idusers).then((c_res) => {
                        var c_data = {}
                        if (c_res !== null) {
                            userData.phonenumber = c_res[0].phonenumber
                            userData.company_name = c_res[0].company_name
                            userData.company_number = c_res[0].company_number
                            userData.company_owner = c_res[0].company_owner
                            userData.referer = c_res[0].referer
                            res.json({ status: 'ok', userData: userData })
                        } else {
                            res.json({ status: 'error' })
                        }
                    })
                } else if (userData.type === 'A') {

                    userData.office_name = result[0].office_name
                    userData.office_number = result[0].office_number
                    userData.mobile_number = result[0].mobile_number
                    userData.self_introduction = result[0].self_introduction
                    userData.work_field = result[0].work_field
                    userData.profile_img = result[0].profile_img
                    userData.bank_name = result[0].bank_name
                    userData.bank_acc_no = result[0].bank_acc_no
                    userData.bank_acc_owner = result[0].bank_acc_owner
                    // console.log("idusers")
                    // console.log(idusers);

                    user.getExperienceInfoByIdusers(idusers).then((e_res) => {
                        if (e_res !== null) {
                            userData.experience = e_res
                        } else {
                            userData.experience = []
                        }
                        res.json({ status: 'ok', userData: userData })
                    })
                }
            } else {
                res.json({ status: 'error' })
            }
        })
    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.get('/info', (req, res) => {
    if (!!req.userinfo) {
        if (!!req.userinfo.idusers) {
            var idusers = req.userinfo.idusers
        }
    } else {
        res.json({ status: 'error' })
    }
    try {
        user.getUserInfoByIdusers(idusers).then((result) => {
            if (result != null) {
                var userData = {}
                userData.login_id = result[0].login_id
                userData.email = result[0].email
                userData.type = result[0].type
                userData.name = result[0].name
                userData.tester = result[0].tester
                if (userData.type === 'P') {
                    user.getPersonalInfoByIdusers(idusers).then((p_res) => {
                        console.log(p_res)
                        if (p_res !== null) {
                            userData.phonenumber = p_res[0].phonenumber
                            userData.birthdate = p_res[0].birthdate
                            userData.sns_id = p_res[0].sns_id
                            userData.sns_service = p_res[0].sns_service
                            res.json({ status: 'ok', userData: userData })
                        } else {
                            res.json({ status: 'error' })
                        }
                    })
                } else if (userData.type === 'C') {
                    user.getCompanyInfoByIdusers(idusers).then((c_res) => {
                        var c_data = {}
                        if (c_res !== null) {
                            userData.phonenumber = c_res[0].phonenumber
                            userData.company_name = c_res[0].company_name
                            userData.company_number = c_res[0].company_number
                            userData.company_owner = c_res[0].company_owner
                            userData.referer = c_res[0].referer
                            res.json({ status: 'ok', userData: userData })
                        } else {
                            res.json({ status: 'error' })
                        }
                    })
                } else if (userData.type === 'A') {

                    userData.office_name = result[0].office_name
                    userData.office_number = result[0].office_number
                    userData.mobile_number = result[0].mobile_number
                    userData.self_introduction = result[0].self_introduction
                    userData.work_field = result[0].work_field
                    userData.profile_img = result[0].profile_img
                    userData.bank_name = result[0].bank_name
                    userData.bank_acc_no = result[0].bank_acc_no
                    userData.bank_acc_owner = result[0].bank_acc_owner

                    // console.log("idusers")
                    // console.log(idusers);

                    user.getExperienceInfoByIdusers(idusers).then((e_res) => {
                        if (e_res !== null) {
                            userData.experience = e_res
                        } else {
                            userData.experience = []
                        }
                        res.json({ status: 'ok', userData: userData })
                    })
                }
            } else {
                res.json({ status: 'error' })
            }
        })
    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.get('/status', (req, res) => {
    let token = req.cookies.token
    let decoded = jwt.verify(token, req.app.get('jwt-secret'))

    if (decoded) {
        res.json({ status: 'USER_LOGIN' })
    } else {
        res.json({ status: 'USER_LOGOUT' })
    }
})

router.post('/get_new_completed', (req, res) => {
    if (!!req.userinfo) {
        if (!!req.userinfo.idusers) {
            var idusers = req.userinfo.idusers
        }
    } else {
        res.json({ status: 'error' })
    }
    try {
        user.getNewCompleted(idusers).then((result) => {
            if (result != null) {
                res.json({ status: 'ok', result: result[0].new_completed })
            } else {
                res.json({ status: 'error' })
            }
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/login', (req, res) => {
    let userid = req.body.userid
    let password = req.body.password
    try {
        user.processLogin(userid, password).then((result) => {
            if (result.status === 'ok') {
                let signup_source = result.data.signup_source
                if (signup_source === 'naver' || signup_source === 'kakao' || signup_source === 'google') {
                    res.json({ status: 'error', reason: 'already_sso_signup' })
                    return
                }

                // 승인된 계정인지 확인
                let is_approved = result.data.is_approved
                if (is_approved === 1) {
                    res.json({ status: 'error', reason: 'not_approved' })
                    return
                }

                if (is_approved === 2) {
                    res.json({ status: 'error', reason: 'denied' })
                    return
                }

                let username = result.data.name
                if (result.data.usertype === 'C') {
                    username = result.data.company_name
                }

                const token = jwt.sign({
                    idusers: result.data.idusers,
                    username: username,
                    account_type: result.data.usertype,
                    email: result.data.email,
                    company_name: result.data.company_name
                }, req.app.get('jwt-secret'), {
                    expiresIn: '12h',
                    issuer: 'lawform',
                })

                //console.log('login', result.data)
                userLog(req, 'login', result.data.idusers)
                return res.json({status: 'ok', data: result.data, token})
            }

            res.json({
                status: 'error',
                reason: 'notmatch'
            })
        })
    } catch (err) {

    }

})

router.get('/logout', (req, res) => {
    res.send('User Logout')
    logger.info('User Logout Api')
    userLog(req, 'logout', req.userinfo.idusers)
})

router.post('/join', (req, res) => {

    //res.send("User Join");
    const registerInfo = {}
    const memberInfo = {}

    registerInfo.email = req.body.email.trim()
    registerInfo.password = req.body.password.trim()
    registerInfo.name = req.body.name.trim()
    registerInfo.agree_service = (req.body.agree_service === 'on') ? 'Y' : 'N'
    registerInfo.agree_info = (req.body.agree_info === 'on') ? 'Y' : 'N'
    registerInfo.agree_msg = (req.body.agree_msg === 'on') ? 'Y' : 'N'
    registerInfo.signup_path = ''
    registerInfo.type = (req.body.member_type === 2) ? 'C' : 'P'

    try {
        user.register(registerInfo).then((result) => {
            let idusers = result
            const token = jwt.sign({
                idusers: idusers,
                username: registerInfo.name,
                account_type: registerInfo.type,
                email: registerInfo.email
            }, req.app.get('jwt-secret'), {
                expiresIn: '12h',
                issuer: 'lawform',
            })

            memberInfo.phonenumber = req.body.phonenumber.trim()
            memberInfo.birthdate = null
            memberInfo.idusers = idusers

            if (registerInfo.type === 'C') {
                delete memberInfo.birthdate
                memberInfo.company_name = req.body.company_name.trim()
                memberInfo.company_number = req.body.company_number.trim()
                memberInfo.company_owner = req.body.company_owner.trim()
            }

            console.log('memberInfo', memberInfo)

            if (req.body.member_type === 1) {
                user.personal(memberInfo).then((result) => {
                    // console.log(token);
                    res.json({ status: 'ok', data: result, token: token })
                })
            } else {
                user.company(memberInfo).then((result) => {
                    res.json({ status: 'ok', data: result, token: token })
                })
            }

            userLog(req, 'join', idusers)

        })
    } catch (err) {
        res.json({ status: 'error', reason: 'join fail' })
    }
    //res.redirect('http://localhost:3000/');
})

router.post('/joinnew/', (req, res) => {

    // get posted data!
    var payload = req.body

    // 변호사 가입은 승인 대기열이 있으니깐
    // is_approved 변수를 1로 default 지정
    // 참고: 	0 - 승인 / 1 - 대기 / 2 - 거절
    payload.base.is_approved = 1

    // DB 넣어 보자
    try {
        user.register(payload.base).then((user_idx) => {

            // create session token
            const session_token = jwt.sign({ idusers: user_idx, username: payload.base.name }, req.app.get('jwt-secret'), { expiresIn: '12h', issuer: 'lawform', })

            // holds new experiment list for multiple db insert

            let experience_list = []

            for (var i = 0; i < payload.experience.length; i++) {
                var item = payload.experience[i]
                if (item != null) {
                    experience_list.push(item)
                }
            }

            experience_list = experience_list.map(function (item) {
                if ('type' in item) {
                    return [user_idx, item.type, item.sdate, item.edate, item.description, 1]  // 마지막 1은 status 삭제여부 용
                } else {
                    return [user_idx, 1, item.sdate, item.edate, item.description, 1]  // 마지막 1은 status 삭제여부 용
                }
            })

            // insert user experience
            if (experience_list.length > 0) {
                user.experience(experience_list).then((response) => {
                    res.json({ 'status': 'ok' })
                })
            } else {
                res.json({ 'status': 'ok' })
            }

        })
    } catch (err) {
        res.json({ status: 'error', reason: 'join fail' })
    }
})

router.post('/lawyer_update/', (req, res) => {

    // get posted data!
    var payload = req.body

    // get user id
    var user_idx = req.userinfo.idusers

    // DB 넣어 보자
    try {
        // 기본 정보 업데이트
        user.update(payload.base, user_idx).then((temp) => {

            // 삭제 기존 아이들
            user.removeExperienceAll(user_idx).then((temp) => {
                var update = []
                var create = []
                for (var i = 0; i < payload.experience.length; i++) {
                    var item = payload.experience[i]
                    if (typeof item !== 'undefined' && item != null) {
                        // console.log(item);
                        if (item.idx == '') {
                            create.push(item)
                            continue
                        }
                        user.updateExperience({
                            'sdate': item.sdate.toString(),
                            'edate': item.edate.toString(),
                            'description': item.description,
                            'status': 1
                        }, item.idx).then(r => {})
                    }
                }

                // insert user experience
                if (create.length >= 1) {
                    create.map((item) => {
                        delete item.idx
                        item.user_idx = user_idx
                        item.status = 1
                        user.experience(item).then((response) => {
                            res.json({ 'status': 'ok' })
                        }).catch(e => {
                            return res.json({ status: 'error', reason: e.message })
                        })
                    })
                } else {
                    res.json({ 'status': 'ok' })
                }
            })
        })
    } catch (err) {
        res.json({ status: 'error', reason: 'update fail' })
    }
})

router.post('/update', (req, res) => {
    //res.send("User Join");
    const updateInfo = {}
    const personalInfo = {}
    const companyInfo = {}
    var idusers = req.userinfo.idusers

    updateInfo.name = req.body.name
    // updateInfo.phonenumber = req.body.phonenumber
    // updateInfo.agree_service = ( req.body.agree_service == 'on' )?'Y':'N' ,
    // updateInfo.agree_info = ( req.body.agree_info == 'on' )?'Y':'N',
    // updateInfo.agree_msg = ( req.body.agree_msg == 'on' )?'Y':'N'
    // if( req.body.type === 'C' ) {
    //     updateInfo.company_name = req.body.company_name,
    //     updateInfo.company_number = req.body.company_number,
    //     updateInfo.company_owner = req.body.company_owner
    // } else if ( req.body.type === 'P' ) {
    // }
    try {
        user.update(updateInfo, idusers).then((result) => {
            if (req.body.type === 'P') {
                personalInfo.phonenumber = req.body.phonenumber
                user.updatePersonal(personalInfo, idusers).then((result) => {
                    res.json({ status: 'personal_update_ok' })
                })
            } else if (req.body.type === 'C') {
                companyInfo.phonenumber = req.body.phonenumber,
                    companyInfo.company_name = req.body.company_name,
                    companyInfo.company_number = req.body.company_number,
                    companyInfo.company_owner = req.body.company_owner,
                    user.updateCompany(companyInfo, idusers).then((result) => {
                        res.json({ status: 'company_update_ok' })
                    })

            }
        })
    } catch (err) {

    }
    //res.redirect('http://localhost:3000/');
})

router.post('/update_new_completed', (req, res) => {
    //res.send("User Join");
    var idusers = -1
    if ('idusers' in req.body && req.body.idusers != null) {
        idusers = req.body.idusers
    } else {
        idusers = req.userinfo.idusers
    }

    var newCompleted = req.body.new_completed

    // }
    try {
        user.updateNewCompleted(newCompleted, idusers).then((result) => {
            if (!!result) {
                res.json({ 'result': 'ok' })
            } else {
                res.json({ 'result': 'error' })
            }
        })
    } catch (err) {

    }
    //res.redirect('http://localhost:3000/');
})

router.post('/changepassword', (req, res) => {
    let idusers = req.userinfo.idusers
    let current_password = req.body.current_password
    let password = req.body.password
    let password_re = req.body.password_re
    if (password !== password_re) {
        res.json({ status: 'error', reason: 'RE_NOTMATCH' })
        return false
    }
    try {
        user.checkPassword(current_password, idusers).then((result) => {
            // console.log("체크결과 : ",result);
            if (result === 'ok') {
                try {
                    user.changePassword(password, idusers).then((result) => {
                        // console.log("수정결과 : ",result);
                        if (result != null) res.json({ status: 'ok' })
                        else res.json({ status: 'error' })
                    })
                } catch (err) {
                    res.json({ status: 'error' })
                }
            } else {
                // console.log('불일치')
                res.json({ status: 'error' })
            }
        })
    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/writeqna', (req, res) => {
    let idusers = req.userinfo.idusers
    if (!idusers) {
        res.json({ status: 'error', reason: 'userid_lost' })
    }
    try {
        user.writingQuestion(req.body.question, idusers).then((result) => {
            // console.log( result )
            //res.json({ status: "ok" });

            if (result === 'ok') {
                let msg = `[${req.userinfo.username}]님께서 1:1 문의를 등록 하였습니다.`
                var params = new URLSearchParams()
                params.append('key', aligoApiKey)
                params.append('user_id', aligoApiId)
                params.append('sender', '0269250227')
                params.append('receiver', lawformSender)
                params.append('msg', msg)
                params.append('testmode_yn', 'N')
                user.sendAligoToAdmin(params)
                res.json({ status: 'ok' })
            } else {
                res.json({ status: 'error' })
            }

        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/updateqna', (req, res) => {
    let idusers = req.userinfo.idusers
    if (!idusers) res.json({ status: 'error' })
    // console.log(req.body);
    try {
        user.updateQuestion(req.body.question, req.body.idx, idusers).then((result) => {
            // console.log( result )
            res.json({ status: 'ok', data: req.body.question })
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.delete('/deleteqna', (req, res) => {
    let idusers = req.userinfo.idusers
    if (!idusers) res.json({ status: 'error' })
    // console.log(req.query);
    try {
        user.deleteQuestion(req.query.idx, idusers).then((result) => {
            // console.log( result )
            res.json({ status: 'ok' })
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/listqna', (req, res) => {
    let idusers = req.userinfo.idusers
    if (!idusers) res.json({ status: 'error', reason: 'require_login' })
    var program_group = req.body.program_group
    var where = " WHERE status != \'D\' " /** 삭제된 문의 제외 */
    if( !!program_group )
        where = where + ` AND program_group = ${req.body.program_group}`
    else
        where = where + ` AND idusers = ${idusers}`
    
    let total_params = {
        where: where,
        select: ' count(*) as total ',
        program_group
    }
    var total = 0
    user.listingQuestion(total_params, idusers).then((result) => {
        total = result[0].total
        // console.log('total : ',result[0].total);
        if (!total) {
            return res.json({ status: 'error', reason: 'documents_notfound' })
        } else {
            var params = req.body
            if (!params.page) params.page = 1
            if (!params.per) params.per = 15
            var start = 0
            start = ((params.page - 1) * params.per)
            if (!params.offset) params.offset = start + ',' + params.per
            params.where = where
            params.select = `idx,idusers,
            email,
            phone,
            if ( public='N' AND idusers!='${idusers}', IF(CHAR_LENGTH( answer ) > 20 , CONCAT( left(answer, 20),"..."), answer ) , answer ) AS answer,
            answertype,
            if ( public='N' AND idusers!='${idusers}', IF(CHAR_LENGTH( question ) > 20 , CONCAT( left(question, 20),"..."), question ) , question ) AS question,
            questiontype,
            registerdate,
            answerdate,
            modifieddate,
            program_group,
            public,
            status
            `
            try {
                user.listingQuestion(params, idusers).then((result) => {
                    res.json({ status: 'ok', data: result, total: total })
                })
            } catch (err) {
                res.json({ status: 'error' })
            }
        }
    })
})

router.post('/listWriteReview', (req, res) => {

    let idusers = req.userinfo.idusers
    if (!idusers) {
        res.json({ status: 'error', reason: 'require_login' })
        return
    }

    let params = {
        offset: (!!req.body.offset) ? req.body.offset : 0,
        limit: (!!req.body.limit) ? req.body.limit : 15,
    }

    try {
        user.listingWritingReview(params, idusers).then((result) => {
            //console.log('result', result)
            res.json({ status: 'ok', data: result.data, total: result.total })
        })
    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/writingdata', (req, res) => {
    let idusers = req.userinfo.idusers
    try {
        user.writingData(req.body.bindData, idusers).then((result) => {
            if (result != null) res.json({ status: 'ok' })
            else res.json({ status: 'error' })
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/finduser', (req, res) => {
    let params = {}

    params.name = req.body.name
    params.phonenumber = req.body.phonenumber
    params.usertype = req.body.usertype
    user.getUserinfoByFindInfo(params).then((result) => {
        // console.log( result )
        if (result !== 'empty') {
            res.json({ status: 'ok', data: result })
        } else {
            res.json({ status: 'error', data: result })
        }
    })
})

router.post('/findpw', (req, res) => {
    let params = req.body
    user.getUserinfoByNameAndNumber(params).then((result) => {
        if (result !== 'error') res.json({ status: 'ok', data: result })
        else res.json({ status: 'error' })
    })
})

router.post('/resetpw', (req, res) => {
    let params = req.body
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.updatePasswordByResetPass(params).then((result) => {
        if (result != null) res.json({ status: 'ok', data: result })
    })
})

router.post('/state', (req, res) => {
    let idusers = req.userinfo.idusers
    let userEmail = req.userinfo.email
    let host = req.body.host
    if (!idusers) {
        res.json({ status: 'error' })
    } else {
        user.getUserInfoByIdusers(idusers).then((result) => {
            if (result[0].tester === 'Y') {
                if (host === 'dev.lawform.io' || host === 'localhost') {
                    res.json({ status: 'ok', isDev: true })
                } else if (userEmail === 'test1@amicuslex.net' || userEmail === 'test2@amicuslex.net' || userEmail === 'xell@amicuslex.net') {
                    res.json({ status: 'ok', isDev: true })
                } else {
                    res.json({ status: 'error' })
                }
            } else {
                res.json({ status: 'error' })
            }
        })
    }
})

router.post('/reviews', (req, res) => {
    let params = req.body
    let category = ''
    // if( !params.idusers ) {
    //     res.json({ status:"error" })
    // }
    user.getCategoryReviews({ select: ' count(*) as total ', category: params.category, document: params.document }).then((result) => {
        let total = result[0].total
        if (total > 0) {
            params.limit = (!!req.body.limit) ? req.body.limit : 5
            params.offset = (!!req.body.offset) ? req.body.offset : 0
            user.getCategoryReviews(params).then((result) => {
                if (!!result) {
                    res.json({ result: 'ok', data: result, total: total })
                } else {
                    res.json({ status: 'error' })
                }
            })
        } else {
            res.json({ status: 'error', reason: 'nodata' })
        }
    })

})

router.post('/reviews/:category', (req, res) => {
    let params = req.body
    params.category = req.params.category
    // if( !params.idusers ) {
    //     res.json({ status:"error" })
    // }
    user.getCategoryReviews({ select: ' count(*) as total ', category: params.category, document: params.document }).then((result) => {
        let total = result[0].total
        if (total > 0) {
            params.limit = (!!req.body.limit) ? req.body.limit : 5
            params.offset = (!!req.body.offset) ? req.body.offset : 0
            user.getCategoryReviews(params).then((result) => {
                if (!!result) {
                    res.json({ result: 'ok', data: result, total: total })
                } else {
                    res.json({ status: 'error' })
                }
            })
        } else {
            res.json({ status: 'error', reason: 'nodata' })
        }
    })

})

router.post('/reviewableDocs', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers

    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.getReviewableDocs(params).then((result) => {
        if (!!result) {
            res.json({ result: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }
    })
})

router.post('/reviewWrite', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers

    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.setDocumentReview(params).then((result) => {
        if (!!result) {
            res.json({ result: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }
    })
})

/** 패키지 제거 예정 */
router.post('/package', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.getPackage(params).then(result => {
        if (!!result) {
            res.json({ status: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }

    })
})

router.post('/package/register', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers
    if (!params.idusers) {
        res.json({ status: 'error', resaon: 'NOT_LOGIN' })
    }
    user.setPackage(params).then((result) => {
        console.log('r result', result)
        if (result.status === 'ok') {
            res.json({ status: 'ok' })
            userLog(req, 'package_register', params.idusers, { package: { code: params.code } })
        } else {
            res.json({ status: 'error', reason: result.reason })
        }
    })
})

router.post('/package/adddoc', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers
    if (!params.idusers) {
        res.json({ status: 'error' })
    }

    user.getPackage(params).then(result => {
        if (!!result) {
            var categorys = result.categorys.split(',')
            var used_documents = result.used_documents ? result.used_documents.split(',') : []
            if (result.pcp_idx === params.pcp_idx && result.idusers === params.idusers && (result.count > result.used || used_documents.includes(String(params.iddocuments)))) {
                documents.getDetailInfo(params.idusers, params.iddocuments).then((docResult) => {
                    const category_sub = String(docResult[0].category_sub).replace(/[\[\]']+/g, '').split(',')
                    const category_intersect = categorys.filter(v => -1 !== category_sub.indexOf(v))
                    if (category_intersect.length > 0) {
                        params.template_id = docResult[0].template_id
                        params.title = docResult[0].title
                        var editabledate = expiredate = new Date()
                        editabledate = new Date(editabledate.setDate(editabledate.getDate() + 30))
                        expiredate = new Date(expiredate.setDate(expiredate.getDate() + 180))
                        params.editabledate = editabledate
                        params.expiredate = expiredate
                        user.addPackageDoc(params).then(addResult => {
                            console.log('result adddoc', addResult)
                            if (!!addResult) {
                                res.json({ status: 'ok', idwriting: addResult.insertId })
                            } else {
                                res.json({ status: 'error', resaon: 'record error' })
                            }
                        })
                    }
                })

            } else {
                res.json({ status: 'error' })
            }

        } else {
            res.json({ status: 'error' })
        }
    })

})
/** /패키지 제거 예정 */

/** 정기권 */
router.post('/subscription', (req, res) => {
    let params = req.body
    if( !!req.userinfo ) params.idusers = req.userinfo.idusers;
    if (!params.idusers || params.idusers === undefined ) {
        res.json({ status: 'error' })
    }
    user.getSubscription(params).then(result => {
        if (!!result) {
            res.json({ status: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }

    })
})

router.post('/subscription/adddoc', (req, res) => {
    let params = req.body
    params.idusers = req.userinfo.idusers
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.getSubscription(params).then(result => {
        if (!!result) {
            var categorys = result.categorys.split(',')
            if (result.idx === params.sub_idx && result.idusers === params.idusers) {
                documents.getDetailInfo(params.idusers, params.iddocuments).then((docResult) => {
                    const category_sub = String(docResult[0].category_sub).replace(/[\[\]']+/g, '').split(',')
                    const category_intersect = categorys.filter(v => -1 !== category_sub.indexOf(v))
                    if (category_intersect.length > 0) {
                        params.template_id = docResult[0].template_id
                        params.title = docResult[0].title
                        var editabledate = expiredate = new Date()
                        editabledate = new Date(editabledate.setDate(editabledate.getDate() + 30))
                        expiredate = new Date(expiredate.setDate(expiredate.getDate() + 180))
                        params.editabledate = editabledate
                        params.expiredate = expiredate
                        user.addSubscriptionDoc(params).then(addResult => {
                            if (!!addResult) {
                                res.json({ status: 'ok', idwriting: addResult.insertId })
                            } else {
                                res.json({ status: 'error', resaon: 'record error' })
                            }
                        })
                    }
                })

            } else {
                res.json({ status: 'error' })
            }

        } else {
            res.json({ status: 'error' })
        }
    })

})
/** /정기권 */

/** 프로그램 그룹 */
router.post('/program', (req, res) => {
    let params = req.body
    if( !!req.userinfo ) params.idusers = req.userinfo.idusers;
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.getProgram(params).then(result => {
        if (!!result) {
            res.json({ status: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }

    })
})
/** /프로그램 그룹 */

/** 제휴사 전용 게시판 권한 */
router.post('/boardpermission', (req, res) => {
    let params = req.body
    if( !!req.userinfo ) params.idusers = req.userinfo.idusers;
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.getBoardUse(params).then(result => {
        if (!!result.length > 0) {
            res.json({ status: 'ok', permission: true })
        } else {
            res.json({ status: 'error', permission: false })
        }
    })
})
/** /제휴사 전용 게시판 권한 */

/** 프로그램 권한 신청 */
router.post('/programrequest', (req, res) => {
    let params = req.body
    console.log( 'prgreq', params)
    if( !!req.userinfo ) params.idusers = req.userinfo.idusers;
    if (!params.idusers) {
        res.json({ status: 'error' })
    }
    user.setProgramRequest(params).then(result => {
        if (!!result) {
            res.json({ status: 'ok', data: result })
        } else {
            res.json({ status: 'error' })
        }
    })
})

/** /프로그램 권한 신청 */



router.post('/devcheck', (req, res) => {
    let devToken = req.body.token
    try {
        let tokenValue = decode(devToken)
        now = Math.round(new Date().getTime() / 1000)
        if (tokenValue.level === 'dev' && (tokenValue.exp > now)) {
            res.json({ status: 'ok', data: tokenValue })
        } else {
            res.json({ status: 'error' })
        }
    } catch (error) {
        res.json({ status: 'error' })
    }
})

router.post('/devlogin', (req, res) => {
    var userid = req.body.userid
    var password = req.body.password
    if (userid === 'amicusdev' && password === 'dami0011!!') {
        const token = jwt.sign({
            level: 'dev',
            id: 'amicusdev'
        }, req.app.get('jwt-secret'), {
            expiresIn: '12h',
            issuer: 'lawform',
        })
        res.json({
            status: 'ok',
            token
        })
    } else {
        res.json({
            status: 'error',
            reason: 'notmatch'
        })
    }
})

router.post('/upload_profile', (req, res, next) => {
    // FormData의 경우 req로 부터 데이터를 얻을수 없다.
    // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

    try {

        upload(req, res, function (err) {
            //console.log(req.res.req.file)
            //req.res.req.file.path = "../client/public/profiles/"
            //console.log(req.res.req.file)
            if (err instanceof multer.MulterError) {
                console.log('multer err 1', err)
                return res.json({ result: 'error' })
            } else if (err) {
                //return next(err)
                console.log('multer err 2', err)
                return res.json({ result: 'error' })
            } else {
                // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
                return res.json({ result: 'ok' })
            }
        })

    } catch (e) {
        console.log(e.message)
        return res.json({ result: 'error' })
    }

})

router.post('/profile_update/', (req, res) => {
    let payload = req.body

    // insert to database
    user.updateProfile(payload).then((result) => {
        if (!!result) {
            res.json({ 'result': 'ok' })
        } else {
            res.json({ 'status': 'error' })
        }
    })

})

module.exports = router
