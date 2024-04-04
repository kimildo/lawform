import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Api from '../../../utils/apiutil'
import Agreement from '../agreement'
import PersonalSignup from '../signup/person'
import CompanySignup  from '../signup/company'
import LawyerSignup  from '../signup/lawyer'

import Cookies from 'js-cookie'
import Analystics from '../../../utils/analytics'
import jQuery from 'jquery'

let setTimer
window.$ = window.jQuery = jQuery

class SignupPerson extends Component {

    constructor (props) {
        super(props)
        this.state = {
            check: '0',
            pw1: '',
            pw2: '',
            userName: '',
            ceoName: '',
            companyName: '',
            companyNo: '',
            cellPhone: null,
            authCode: null,
            sendCode: 'N',
            countdown: 120 * 10000,
            showTimer: false,
            timer: '2:00',
            sendSmsBtn: '전송',
            sendingSms: false,
            allowPassword: false,
            allowEmail: false,
            allowAuthCode: false,
            email_warn: '이메일을 입력해 주세요.',
            pw_warn: '비밀번호를 입력해 주세요',
            pw_same_warn: '비밀번호를 한번더 입력해 주세요',
            name_warn: '이름을 입력해주세요',
            cell_warn: '',
            cell_auth_warn: '',
            com_name_warn: '회사명을 입력해 주세요',
            com_ceo_warn: '대표자 이름을 입력해 주세요',
            com_no_warn: '',
        }

        this.checkEmail = this.checkEmail.bind(this)


    }

    componentDidMount () {

    }

    pwcheck_step1 = (e) => {

        let pw1 = e.target.value
        let check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/
        let state = this.state

        if (!pw1) {
            this.setState({
                pw_warn: '비밀번호를 입력해 주세요',
            })
            return
        }

        if (!check.test(pw1) || pw1.length < 8) {
            this.setState({
                pw_warn: '영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.',
            })
            return
        }

        this.setState({
            pw1: pw1,
            pw_warn: '',
        })
    }

    pwcheck_step2 = (e) => {

        let pw2 = e.target.value
        let pw_same_warn = ''
        if (pw2 !== this.state.pw1) {
            pw_same_warn = '비밀번호가 일치하지 않습니다.'
        }

        this.setState({
            pw2: pw2,
            pw_same_warn: pw_same_warn,
            allowPassword: true
        })
    }

    isEmail (str) {
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        return regExp.test(str)
    }

    checkEmail = (e) => {
        let email = e.target.value
        let email_warn = ''

        if (!!e.target.value) {
            if (!this.isEmail(email)) {
                email_warn = '올바른 이메일을 입력해 주세요'
            }
        } else {
            email_warn = '이메일을 입력해 주세요'
        }

        this.setState({
            email_warn: email_warn
        })

        if (!!email_warn) {
            return
        }

        const params = {
            'email': email
        }

        Api.sendPost('/user/checkemail', params).then(res => {
            let status = res.data.status

            if (status === 'ok' && this.isEmail(email) === true) {
                this.setState({
                    allowEmail: true,
                    email_warn: '사용가능한 이메일 입니다.'
                })
                return
            }

            this.setState({
                allowEmail: false,
                email_warn: '이미 사용중인 이메일 입니다.'
            })
        })

    }

    startCountDown () {

        clearInterval(setTimer)
        let setTime = 120 * 10000
        setTimer = setInterval(() => {
            setTime = this.state.countdown - 10000
            if (setTime <= 0) {
                setTime = 0
                this.setState({
                    sendCode: 'N',
                    timer: '0:00'
                })
            }
            let m = parseInt(((setTime * 0.0001) % 3600) / 60)
            let s = (setTime * 0.0001) % 60
            s = ('0' + s).slice(-2)
            this.setState({
                countdown: setTime,
                timer: m + ':' + s
            })
        }, 1000)
    }

    checkCellPhone = (e) => {
        this.setState({
            cellPhone: e.target.value
        })
    }

    sendAuthCode = (e) => {

        if (!!this.state.sendingSms) {
            alert('메세지 발송중 입니다. 잠시만 기다려 주세요.')
            return
        }

        let receiver = this.state.cellPhone
        if (!receiver) {
            this.setState({
                cell_warn: '휴대폰번호를 입력해 주세요.'
            })
            return
        }

        this.setState({
            cell_warn: '',
            allowAuthCode: false,
            sendingSms: true,
            cell_auth_warn: ''
        })

        const params = {
            'receiver': receiver
        }

        Api.sendPost('/user/sendphone', params)
            .then(res => {
                if (res.status === 'ok') {
                    this.setState({
                        sendCode: 'Y',
                        countdown: 120 * 10000,
                        sendSmsBtn: '재전송',
                        sendingSms: false,
                    }, () => {
                        this.startCountDown()
                        alert('인증번호가 전송되었습니다.')
                    })
                } else {
                    this.setState({
                        sendCode: 'N'
                    })
                }
            })
    }

    setAuthCode = (e) => {
        this.setState({
            authCode: e.target.value
        })
    }

    checkAuthCode = (e) => {

        let receiver = this.state.cellPhone
        let rcode = this.state.authCode

        if (this.state.sendCode === 'N') {
            this.setState({
                cell_warn: '휴대폰번호를 입력하시고 인증번호를 전송해주세요.'
            })
            return
        }

        if (!receiver) {
            this.setState({
                cell_warn: '휴대폰번호를 입력해 주세요.'
            })
            return
        }

        if (!rcode) {
            this.setState({
                cell_auth_warn: '인증번호를 입력해 주세요.'
            })
            return
        }

        const params = {
            'rcode': rcode,
            'receiver': receiver
        }

        Api.sendPost('/user/authphone', params).then(res => {
            let status = res.data.status
            if (status === 'ok' && this.state.sendCode === 'Y') {
                this.setState({
                    allowAuthCode: true,
                    cell_auth_warn: '인증에 성공하였습니다.'
                })
            } else {
                this.setState({
                    allowAuthCode: false,
                    cell_auth_warn: '인증에 실패하였습니다.'
                })
            }
        })

    }

    checkEmpty = (e, warnTarget = '') => {
        let val = e.target.value
        let state = this.state

        if (!val) {
            switch (warnTarget) {
                case 'userName':
                    state.name_warn = '이름을 입력해 주세요'
                    break
                case 'ceoName':
                    state.com_ceo_warn = '대표자 이름을 입력해 주세요'
                    break
                case 'companyName':
                    state.com_name_warn = '회사명을 입력해 주세요'
                    break
            }
        } else {
            switch (warnTarget) {
                case 'userName':
                    state.name_warn = ''
                    break
                case 'ceoName':
                    state.com_ceo_warn = ''
                    break
                case 'companyName':
                    state.com_name_warn = ''
                    break
            }
        }

        state[warnTarget] = val
        this.setState(state)

    }

    checkName = (e) => {
        let userName = e.target.value
        let email_warn = ''

        if (!e.target.value) {
            email_warn = '이름을 입력해 주세요'
        }

        this.setState({
            userName: userName,
            name_warn: email_warn
        })
    }


    handleSubmit = (event) => {

        event.preventDefault()

        let params = {}
        params['tab'] = this.state.tab
        params['agree_service'] = window.$('#agree1').is(':checked') ? 'on' : 'off'
        params['agree_info'] = window.$('#agree2').is(':checked') ? 'on' : 'off'
        params['agree_msg'] = window.$('#agree3').is(':checked') ? 'on' : 'off'

        let referer_url = document.referrer
        let referer_domain = referer_url.split('/')[2]
        let hostname = window.location.hostname

        console.log('referer_url', referer_url)

        params['email'] = window.$('#join_email').val().trim()
        params['password'] = window.$('#join_password').val().trim()
        params['password_re'] = window.$('#join_password_re').val().trim()
        params['phonenumber'] = window.$('#join_phonenumber').val().trim()
        params['name'] = window.$('#join_name').val().trim()
        params['birthdate'] = ''

        if (params['email'] === '' || this.isEmail(params['email']) === false || this.state.allowEmail === false) {
            alert('이메일을 확인해주세요.')
            return false
        }

        if (params['password'].length < 8) {
            alert('비밀번호를 확인해주세요.')
            return false
        }

        if (params['password'] === '' || !this.state.allowPassword) {
            alert('비밀번호를 확인해주세요.')
            return false
        }
        if (params['name'].trim() === '') {
            alert('이름을 확인해주세요.')
            return false
        }

        if (this.state.allowAuthCode !== true) {
            alert('휴대전화 인증을 완료해주세요.')
            return false
        }

        if (this.props.type === 'company') {
            params['company_number'] = window.$('#company_number').val().trim()
            params['company_name'] = window.$('#company_name').val().trim()
            params['company_owner'] = window.$('#company_owner').val().trim()
            params['referer'] = 'site'

            if (params['company_name'] === '') {
                alert('회사명을 입력해주세요.')
                return false
            }

            if (params['company_owner'] === '') {
                alert('대표자 명을 입력해주세요.')
                return false
            }
        }

        if (params['agree_service'] !== 'on' || params['agree_info'] !== 'on') {
            alert('약관에 동의해주세요.')
            return false
        }

        params.member_type = (this.props.type === 'person') ? 1 : 2

        Api.sendPost('/user/join', params).then((result) => {
            if (result.status === 'ok') {
                let token = result.data.token
                Cookies.set('token', token, { expires: 7, path: '/' })
                let redirect = Cookies.get('signInReferrer')
                let analyticsData = {

                }

                alert('회원가입이 완료되었습니다.')
                Analystics.userSignUp( analyticsData ).then( () => {
                    if (!!redirect) {
                        window.location = redirect
                        Cookies.remove('signInReferrer')
                    } else if (!!referer_url && referer_url !== '/signup' && hostname === referer_domain) {
                        window.location = referer_url
                    } else {
                        window.location = '/'
                    }
                }).catch(err => {
                    console.log(err.message)
                    window.location = '/'
                })
            }
        })


    }

    render () {

        return (
            <div className={`wrap_signup`}>
                <div className="wrap_signup_header">
                    <div className="signup_header_name">
                        <span>회원가입</span>
                    </div>

                    <div className="signup_header_choose_title">
                        <div>
                            {(this.props.type === 'person') ? '일반' : ((this.props.type === 'company') ? '기업' : '변호사')} 회원가입
                        </div>
                        <div>* 모든 정보는 필수 입력 정보입니다.</div>
                    </div>

                </div>
                <div className="signup_form">
                    {/** 개인회원 */}
                    {(this.props.type === 'person') && <PersonalSignup
                        state={this.state}
                        checkEmail={this.checkEmail}
                        checkCellPhone={this.checkCellPhone}
                        pwcheck_step1={this.pwcheck_step1}
                        pwcheck_step2={this.pwcheck_step2}
                        sendAuthCode={this.sendAuthCode}
                        checkAuthCode={this.checkAuthCode}
                        setAuthCode={this.setAuthCode}
                        checkEmpty={this.checkEmpty}
                    />}

                    {/** 기업회원 */}
                    {(this.props.type === 'company') && <CompanySignup
                        state={this.state}
                        checkEmail={this.checkEmail}
                        checkCellPhone={this.checkCellPhone}
                        pwcheck_step1={this.pwcheck_step1}
                        pwcheck_step2={this.pwcheck_step2}
                        sendAuthCode={this.sendAuthCode}
                        checkAuthCode={this.checkAuthCode}
                        setAuthCode={this.setAuthCode}
                        checkEmpty={this.checkEmpty}
                    />}

                    {/** 변호사회원 */}
                    {(this.props.type === 'lawyer') && <LawyerSignup/>}
                    {(this.props.type !== 'lawyer') && <Agreement handleSubmit={this.handleSubmit}/>}

                </div>
            </div>
        )
    }
}

export default SignupPerson