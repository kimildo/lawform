import React, { Component } from 'react'
// import '../../scss/common/finduser.scss';
import Api from '../../utils/apiutil'
import ReactGA from 'react-ga'

let setTimer

class Finduser extends Component {
    constructor (props) {
        super(props)
        this.state = {
            findType: this.props.tab,
            sendCode: 'N',
            countdown: 120 * 10000,
            showTimer: false,
            timer: '2:00',
            sendSmsBtn: '전송',
            sendingSms: false,
            allowEmail: false,
            allowAuthCode: false,
            allowPassword: false,
            findName: '',
            findEmail: '',
            cellPhone: '',
            email_warn: '이메일을 입력해 주세요.',
            name_warn: '이름을 입력해주세요',
            pw_warn: '비밀번호를 입력해 주세요',
            pw_same_warn: '비밀번호를 한번더 입력해 주세요',
            cell_warn: '',
            cell_auth_warn: '',
            findedUsers: [],
        }

        let url = (this.props.tab === 'id') ? '/auth/finduser' : '/auth/findpw'
        ReactGA.pageview(url, null, '아이디 찾기')
    }

    componentDidMount () {

    }

    handleTabChange = (tab) => {
        // this.setState({
        //     findType: tab || 'id'
        // })
        window.location.href = (tab === 'id') ? '/auth/finduser' : '/auth/findpw'

    }

    chkEmail (str) {
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        return regExp.test(str)
    }

    checkEmail = (e) => {
        let email = e.target.value
        let email_warn = ''

        if (!!e.target.value) {
            if (!this.chkEmail(email)) {
                email_warn = '올바른 이메일을 입력해 주세요'
            }
        } else {
            email_warn = '이메일을 입력해 주세요'
        }

        this.setState({
            findEmail: email,
            email_warn: email_warn
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

    sendAuthCode = () => {

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

    checkName = (e) => {
        let findName = e.target.value
        let email_warn = ''

        if (!e.target.value) {
            email_warn = '이름을 입력해 주세요'
        }

        this.setState({
            findName: findName,
            name_warn: email_warn
        })
    }

    pwcheck_step1 = (e) => {

        let pw1 = e.target.value.trim()
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

        let pw2 = e.target.value.trim()
        let pw_same_warn = ''
        let allowPassword = true
        if (pw2 !== this.state.pw1) {
            pw_same_warn = '비밀번호가 일치하지 않습니다.'
            allowPassword = false
        }

        this.setState({
            pw2: pw2,
            pw_same_warn: pw_same_warn,
            allowPassword: allowPassword
        })
    }

    handleSubmit = () => {

        const { findType, allowAuthCode, findEmail, findName, cellPhone } = this.state

        if (findType === 'pw' && !findEmail) {
            return
        }

        if (!findName) {
            return
        }

        if (!allowAuthCode) {
            alert('휴대폰 인증을 완료해주세요.')
            return
        }

        let params = {
            userid: findEmail.trim(),
            name: findName.trim(),
            phonenumber: cellPhone.trim(),
            usertype: findType
        }

        let url = (findType === 'id') ? '/user/finduser' : '/user/findpw'

        Api.sendPost(url, params).then((res) => {

            console.log(res.data)

            if (res.status === 'ok') {
                this.setState({
                    findedUsers: res.data.data,
                    findedCount: res.data.data.length || 1,
                    findedfindName: findName
                })
            } else {
                this.setState({
                    findedUsers: [],
                    findedCount: 0,
                })
                alert('일치하는 정보가 없습니다.')
            }
        })
    }

    changePassword = () => {

        if (!this.state.allowPassword || !this.state.allowAuthCode) {
            return
        }

        let params = {
            password: this.state.pw1,
            idusers: this.state.findedUsers
        }

        Api.sendPost('/user/resetpw', params).then((res) => {
            if (res.status === 'ok') {
                alert('비밀번호가 재설정되었습니다. 로그인 후 이용하세요.')
                window.location = '/auth/signin'
            } else {
                alert('재설정 오류입니다. 다시 시도해주십시오.')
            }
        })
    }

    render () {

        const { findType, error_status } = this.state

        return (
            <div className="wrap_finduser">
                <div className="wrap_find_header">
                    <div className="find_header_name">
                        <span>계정찾기</span>
                    </div>
                    <div className="find_header_tab_wrap">
                        <ul>
                            <li className={`${(findType === 'id') && 'active'}`} onClick={() => this.handleTabChange('id')}>아이디찾기</li>
                            <li className={`${(findType === 'pw') && 'active'}`} onClick={() => this.handleTabChange('pw')}>비밀번호찾기</li>
                        </ul>
                    </div>
                </div>


                {(!this.state.findedCount) &&
                <div className="signup_form">
                    <div className="signup_inputs">
                        {(findType === 'pw') &&
                        <div className="wrap_signup_personal_inputid signup_label">
                            <input placeholder="이메일" className="signup_personal_id" type="text" name="email" id="join_email" ref="email" onChange={(e) => this.checkEmail(e)}/>
                            <label className={`input_warning`}>{(!!this.state.email_warn) && this.state.email_warn}</label>
                        </div>
                        }

                        <div className="wrap_signup_personal_pw_section signup_label">
                            <input placeholder="이름" className="signup_personal_pw" id="join_name" type="text" name="name" onChange={(e) => this.checkName(e)}/>
                            <label className='input_warning'>{(!!this.state.name_warn) && this.state.name_warn}</label>
                        </div>

                        <div className="wrap_signup_personal_inputphone signup_label">
                            <div className="divided">
                                <input placeholder="핸드폰 번호 (숫자만입력)" className="signup_personal_phone" type="number" name="phonenumber" id="join_phonenumber" ref="phonenumber"
                                       onChange={(e) => this.checkCellPhone(e)}/>
                                <label className='input_warning'>{(!!this.state.cell_warn) && this.state.cell_warn}</label>
                            </div>
                            <div className="blank"></div>
                            <div className={`buttons ${(!!this.state.sendingSms) && 'disable'}`} onClick={this.sendAuthCode}>
                                <span>인증번호 {this.state.sendSmsBtn}</span>
                            </div>
                        </div>

                        <div className="wrap_signup_personal_inputphone signup_label">
                            <div className="divided">
                                <input placeholder="인증번호 입력" className="signup_personal_phone" type="text" ref="rcode" onChange={(e) => this.setAuthCode(e)}/>
                                <label className={`input_warning ${(this.state.allowAuthCode === true) && 'allow-email'}`}>{(!!this.state.cell_auth_warn) && this.state.cell_auth_warn}</label>
                                <label className='input_warning timer'>{(this.state.sendCode === 'Y' && this.state.allowAuthCode === false) && this.state.timer}</label>
                            </div>
                            <div className="blank"></div>
                            <div className="buttons" onClick={this.checkAuthCode}>
                                <span>확인</span>
                            </div>
                        </div>

                        <div className="find_button">
                            <button onClick={this.handleSubmit}>{(findType === 'id') ? '아이디찾기' : '비밀번호찾기'}</button>
                        </div>
                    </div>
                </div>
                }

                {(!!this.state.findedCount && findType === 'id') &&
                <div className="find-reault">
                    <div className="find-text">
                        <span>회원님의 정보로 가입되어 있는 아이디 입니다.</span>
                        <span>총 {this.state.findedCount}개</span>
                    </div>
                    <ul className="finded-list">
                        {
                            this.state.findedUsers.map((item, index) =>
                                <li key={index}>
                                    <div>{item.email}</div>
                                    {/*<div>{moment(item.registerdate).format('YYYY.MM.DD')}</div>*/}
                                </li>
                            )
                        }
                    </ul>
                    <a href="/auth/finduser">
                        <button type="button" className="wrap_finduser_btn">다시찾기</button>
                    </a>
                    <a href="/auth/signin">
                        <button type="button" className="wrap_finduser_btn">로그인</button>
                    </a>
                </div>
                }

                {(!!this.state.findedCount && findType === 'pw') &&
                <div className="find-reault">
                    <div className="find-text">
                        <span>회원님 계정의 비밀번호를 재설정해주세요.</span>
                        <span></span>
                    </div>

                    <div className="personal_wrap signup_inputs">

                        <div className="wrap_signup_personal_pw_section signup_label">
                            <input placeholder="비밀번호" className="signup_personal_pw" type="password" name="password" id="join_password" onChange={(e) => this.pwcheck_step1(e)}/>
                            <label htmlFor="agree_all" className='input_warning'>{(!!this.state.pw_warn) && this.state.pw_warn}</label>
                        </div>

                        <div className="wrap_signup_personal_pw_section signup_label">
                            <input placeholder="비밀번호 확인" className="signup_personal_pw" type="password" name="password_re" id="join_password_re" onChange={(e) => this.pwcheck_step2(e)}/>
                            <label className='input_warning'>{(!!this.state.pw_same_warn) && this.state.pw_same_warn}</label>
                        </div>

                        <div>
                            <button type="button" className="wrap_finduser_btn" onClick={this.changePassword}>비밀번호 변경</button>
                        </div>

                    </div>

                </div>
                }

                <div className="find-footer">
                    <span>위 방법으로 찾으실 수 없다면 고객센터로 연락 주세요.</span>
                    <span>
                        로폼 고객센터<br/>
                        (오전 10시~오후 7시, 점심시간 : 12시 30분 ~ 오후 2시)<br/><br/>
                        02-6925-0227
                    </span>
                </div>


            </div>
        )
    }
}

export default Finduser
