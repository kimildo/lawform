import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import '../../scss/common/findpw.scss';
import Api from '../../utils/apiutil'
import Cookies from 'js-cookie'
import moment from 'moment'
import ReactGA from 'react-ga'

class Findpw extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pw1: '',
            pw2: '',
            tab: '1',
            phoneCheck: 'N', // 전화번호 인증 스위치
            sendCode: 'N',
            countdown: 120 * 10000,
            timer: '2:00',
            sendSmsBtn: '전송',
            view: '',
            findedUserId: '',
            findedUserName: '',
            findedUsers: [],
            findedCount: 0,
            nameLabel: '아이디(이메일)',
            popTitle: '비밀번호 찾기'
        }
    }

    componentDidMount () {
        this.startCountDown()
        this.setState({
            view: this.form
        })

        // let findreault =ReactDOM.findDOMNode(this.refs.findreault)
        // let findform =ReactDOM.findDOMNode(this.refs.findform)
        // findform.style.display = 'none'
        // findreault.style.display = 'block'
    }

    startCountDown () {
        clearInterval(setTimer)
        let setTime = 120 * 10000
        var setTimer = setInterval(() => {
            setTime = this.state.countdown - 10000
            if (setTime <= 0) {
                setTime = 0
                this.setState({
                    sendCode: 'N',
                    timer: '0:00'
                })
            }
            var m = parseInt(((setTime * 0.0001) % 3600) / 60)
            var s = (setTime * 0.0001) % 60
            s = ('0' + s).slice(-2)
            // console.log( "countdown: " , this.state.countdown , m, s , setTimer)
            this.setState({
                countdown: setTime,
                timer: m + ':' + s
            })
        }, 1000)
    }

    phoneAuthCode = () => {
        var receiver = ReactDOM.findDOMNode(this.refs.phonenumber).value
        const params = {
            'receiver': receiver
        }
        let phone_true = ReactDOM.findDOMNode(this.refs.phone_true)
        let phone_false = ReactDOM.findDOMNode(this.refs.phone_false)
        let phone_send = ReactDOM.findDOMNode(this.refs.phone_send)
        Api.sendPost('/user/sendphone', params)
            .then(res => {
                if (res.status === 'ok') {
                    this.setState({
                        sendCode: 'Y',
                        countdown: 120 * 10000,
                        sendSmsBtn: '재전송'
                    }, () => {
                        phone_true.style.display = 'none'
                        phone_false.style.display = 'none'
                        phone_send.style.display = 'inline'
                        alert('인증번호가 전송되었습니다.')
                    })
                } else {
                    this.setState({
                        sendCode: 'N'
                    })
                }
            })
    }

    checkAuthCode = () => {
        var rcode = ReactDOM.findDOMNode(this.refs.rcode).value
        var receiver = ReactDOM.findDOMNode(this.refs.phonenumber).value
        let phone_true = ReactDOM.findDOMNode(this.refs.phone_true)
        let phone_false = ReactDOM.findDOMNode(this.refs.phone_false)
        let phone_send = ReactDOM.findDOMNode(this.refs.phone_send)

        const params = {
            'rcode': rcode,
            'receiver': receiver
        }
        Api.sendPost('/user/authphone', params)
            .then(res => {
                let status = res.data.status
                if (status === 'ok' && this.state.sendCode === 'Y') {
                    phone_true.style.display = 'inline'
                    phone_false.style.display = 'none'
                    phone_send.style.display = 'none'
                    this.setState({
                        phoneCheck: 'Y'
                    })
//            this.props.phoneCheck("Y");
                } else {
                    phone_false.style.display = 'inline'
                    phone_true.style.display = 'none'
                    phone_send.style.display = 'none'
                    // this.props.phoneCheck("N");
                }
            })

    }

    findpw = () => {
        if (this.state.phoneCheck !== 'Y') {
            alert('전화인증을 완료해주십시오.')
            return false
        }
        let findreault = ReactDOM.findDOMNode(this.refs.findreault)
        let findform = ReactDOM.findDOMNode(this.refs.findform)

        let userid = ReactDOM.findDOMNode(this.refs.userid).value.trim()
        let username = ReactDOM.findDOMNode(this.refs.username).value.trim()
        let companynumber = ReactDOM.findDOMNode(this.refs.companynumber).value.trim()
        let phonenumber = ReactDOM.findDOMNode(this.refs.phonenumber).value.trim()

        if (userid === '') {
            alert('아이디를 입력해주세요.')
            return false
        }
        let usertype = 'P'
        if (this.state.tab == '1') {
            usertype = 'P'
            if (username === '') {
                alert('이름을 입력해주세요.')
                return false
            }
            if (phonenumber === '') {
                alert('전화번호를 확인해주세요.')
                return false
            }
        } else if (this.state.tab == '2') {
            usertype = 'C'
            if (companynumber === '') {
                alert('사업자 등록번호를 입력해주세요.')
                return false
            }
            if (phonenumber === '') {
                alert('전화번호를 확인해주세요. -1')
                return false
            }
        }

        var params = {
            username: username,
            userid: userid,
            phonenumber: phonenumber,
            usertype: usertype,
            companynumber: companynumber
        }
        Api.sendPost('/user/findpw', params).then((res) => {
            if (res.status === 'ok') {
                this.setState({
                    findedUserId: res.data.data,
                    popTitle: '비밀번호 재설정'
                })
                findform.style.display = 'none'
                findreault.style.display = 'block'
            } else {
                alert('일치하는 정보가 없습니다..')
                findform.style.display = 'block'
                findreault.style.display = 'none'

            }
        })

    }

    changePassword = () => {
        let password = ReactDOM.findDOMNode(this.refs.password).value.trim()
        let password_re = ReactDOM.findDOMNode(this.refs.password_re).value.trim()

        if (password == '' || (password !== password_re)) {
            alert('비밀번호를 확인해주세요.')
            return false
        }
        // if( this.state.findedUserId === '' ) {
        //     alert( "사용자를 확인할 수 없습니다." )
        //     return false
        // }

        var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/
        if (this.state.pw1.length >= 8) {
            if (!check.test(this.state.pw1)) {

                alert('비밀번호를 확인해주세요.')
                return false
            }
        } else {
            alert('비밀번호를 확인해주세요.')
            return false

        }

        var params = {
            password: password,
            idusers: this.state.findedUserId
        }
        Api.sendPost('/user/resetpw', params).then((res) => {
            if (res.status === 'ok') {
                alert('비밀번호가 재설정되었습니다. 로그인 후 이용하세요.')
                window.location = '#signin'
            } else {
                alert('재설정 오류입니다. 다시 시도해주십시오.')

            }
        })

    }

    section_personal = () => {
        if (this.state.tab !== '1') {
            this.setState({
                tab: '1',
                nameLabel: '아이디(이메일)'
            })
            ReactDOM.findDOMNode(this.refs.userid).value = ''
            ReactDOM.findDOMNode(this.refs.username).value = ''
            ReactDOM.findDOMNode(this.refs.companynumber).value = ''
            ReactDOM.findDOMNode(this.refs.phonenumber).value = ''
            ReactDOM.findDOMNode(this.refs.rcode).value = ''
        }
    }

    section_company = () => {
        if (this.state.tab !== '2') {
            this.setState({
                tab: '2',
                nameLabel: '아이디'
            })
            ReactDOM.findDOMNode(this.refs.userid).value = ''
            ReactDOM.findDOMNode(this.refs.username).value = ''
            ReactDOM.findDOMNode(this.refs.companynumber).value = ''
            ReactDOM.findDOMNode(this.refs.phonenumber).value = ''
            ReactDOM.findDOMNode(this.refs.rcode).value = ''
        }
    }

    reset_find = () => {
        ReactDOM.findDOMNode(this.refs.userid).value = ''
        ReactDOM.findDOMNode(this.refs.username).value = ''
        ReactDOM.findDOMNode(this.refs.companynumber).value = ''
        ReactDOM.findDOMNode(this.refs.phonenumber).value = ''
        ReactDOM.findDOMNode(this.refs.rcode).value = ''
    }

    close_find = () => {
        ReactDOM.findDOMNode(this.refs.findreault).style.display = 'none'
        ReactDOM.findDOMNode(this.refs.findform).style.display = 'block'
        ReactDOM.findDOMNode(this.refs.userid).value = ''
        ReactDOM.findDOMNode(this.refs.username).value = ''
        ReactDOM.findDOMNode(this.refs.phonenumber).value = ''
        ReactDOM.findDOMNode(this.refs.companynumber).value = ''
        ReactDOM.findDOMNode(this.refs.rcode).value = ''
        ReactGA.pageview(window.location.pathname + '#finduser', null, '아이디 찾기')
    }

    pwcheck_step1 = (e) => {
        this.setState({
            pw1: e.target.value,
        })
    }

    pwcheck_step2 = (e) => {
        this.setState({
            pw2: e.target.value,
        })
    }

    render () {

        var tab_check = this.state.tab

        if (tab_check === '1') {
            var personal = {
                display: 'block'
            }
            var company = {
                display: 'none'
            }
            var lawyer = {
                display: 'none'
            }
            var personal_tab = {
                borderColor: '#15376c',
                color: '#15376c'
            }
            var company_tab = {
                borderColor: 'gray',
                color: 'gray'
            }
        } else if (tab_check === '2') {
            personal = {
                display: 'none'
            }
            company = {
                display: 'block'
            }
            lawyer = {
                display: 'none'
            }
            personal_tab = {
                borderColor: 'gray',
                color: 'gray'
            }
            company_tab = {
                borderColor: '#15376c',
                color: '#15376c'
            }
        }

        var bottom = {
            borderBottom: 'solid black 3px '
        }

        var check_true = {}
        var check_false = {}
        var check_false1 = {}
        var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/

        if (this.state.pw1.length >= 8) {
            if (!check.test(this.state.pw1)) {

                check_false1 = {
                    display: 'inline'
                }
            } else {

                check_false1 = {
                    display: 'none'
                }
            }
        } else {
            check_false1 = {
                display: 'inline'
            }
        }

        if (this.state.pw1 === '' || this.state.pw2 === '') {
            if (this.state.pw1 === this.state.pw2) {
                check_true = {
                    display: 'none'
                }
                check_false = {
                    display: 'none'
                }
            }
        } else {
            if (this.state.pw1 !== this.state.pw2) {
                check_true = {
                    display: 'none'
                }
                check_false = {
                    display: 'inline'
                }
            } else if (this.state.pw1 === this.state.pw2) {
                check_true = {
                    display: 'inline'
                }
                check_false = {
                    display: 'none'
                }
            }
        }

        return (
            <div className="wrap_findpw" style={{ adding: ' 9px 47px', position: 'relative' }}>
                <a className="close" href="#close" onClick={this.close_find} style={{ right: 20 }}>
                    <img src="/autoform_img/x_btn.png" width="48" height="48" alt="x_btn"></img>
                </a>
                <div className="wrap_findpw_findid">
                    {this.state.popTitle}
                </div>
                <div className="findPassword"><a href="#finduser" style={{ color: '#000' }} onClick={this.close_find}>아이디 찾기</a></div>
                <div className="findform" ref="findform">
                    <div>
                        <table className="wrap_signup_section">
                            <tbody>
                            <tr style={bottom}>
                                <td style={personal_tab} className="signup_section" id="signup_personal_section" onClick={this.section_personal}>개인회원</td>
                                <td style={company_tab} className="signup_section" id="signup_company_section" onClick={this.section_company}>기업회원</td>
                                <td className="signup_section_lawyer"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='find_pw'>
                        <div className="wrap_findpw_title" style={{ marginTop: 20 }}>
                            <span>{this.state.nameLabel}*</span>
                        </div>
                        <div className="wrap_signup_personal_pw_section">
                            <input placeholder="abcd1234@naver.com" className="signup_personal_pw" type="text" name="userid" ref="userid"></input>
                        </div>
                        <div style={{ display: (this.state.tab === '1') ? 'block' : 'none' }}>
                            <div className="wrap_finduser_title" style={{ marginTop: 20 }}>
                                <span>이름*</span>
                            </div>
                            <div className="wrap_signup_personal_pw_section">
                                <input placeholder="홍길동" className="signup_personal_pw" type="text" name="name" ref="username"></input>
                            </div>
                        </div>
                        <div style={{ display: (this.state.tab === '2') ? 'block' : 'none' }}>
                            <div className="wrap_finduser_title" style={{ marginTop: 20 }}>
                                <span>사업자 등록번호</span>
                            </div>
                            <div className="wrap_signup_personal_pw_section">
                                <input placeholder="00-00-0000" className="signup_personal_pw" type="text" name="companynumber" ref="companynumber"></input>
                            </div>
                        </div>

                        <div className="wrap_findpw_title">
                            <span>휴대폰 번호*</span>
                        </div>
                        <div className="wrap_signup_personal_inputphone">
                            <div className="wrap_signup_personal_phone_section">
                                <input placeholder="'_' 없이 입력" className="signup_personal_phone" type="text" name="phonenumber" ref="phonenumber"></input>
                            </div>
                            <div className="blank"></div>
                            <div className="wrap_signup_personal_phone_btn" onClick={this.phoneAuthCode}>
                                <span>인증번호 {this.state.sendSmsBtn}</span>
                            </div>
                        </div>
                        <div className="wrap_findpw_title">
                            <span>인증번호*</span>
                            <span ref="phone_send" className="personal_pw_false"> ({this.state.timer})이내에 입력해주십시오. </span><span ref="phone_true" className="personal_pw_false">인증되었습니다.</span><span
                            ref="phone_false" className="personal_pw_false">인증번호가 올바르지 않습니다.</span>
                        </div>
                        <div className="wrap_signup_personal_inputphone">
                            <div className="wrap_signup_personal_phone_section">
                                <input placeholder="인증번호 입력" className="signup_personal_phone" type="text" ref="rcode"></input>
                            </div>
                            <div className="blank"></div>
                            <div className="wrap_signup_personal_phone_btn" onClick={this.checkAuthCode}>
                                <span>확인</span>
                            </div>
                        </div>

                        <button type="button" className="wrap_findpw_btn" onClick={this.findpw}>비밀번호 찾기</button>
                        <div className="findpw_foot">
                            위 방법으로 계정을 찾을 수 없다면 1:1문의를 이용해주세요.
                        </div>
                    </div>
                </div>
                <div className="findreault" ref="findreault">
                    <div>
                        <div className="searched"></div>
                        <div className="wrap_findpw_title">
                            <span>비밀번호 입력*</span>
                            <span style={check_false1} className="personal_pw_false">영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</span>
                        </div>
                        <div className="wrap_signup_personal_pw_section">
                            <input className="signup_personal_pw" type="password" name="password" ref="password" onChange={this.pwcheck_step1}></input>
                        </div>
                        <div className="wrap_findpw_title">
                            <span>비밀번호 재입력*</span>
                            <span style={check_true} className="personal_re_pw_true">일치합니다.</span><span style={check_false} className="personal_re_pw_false">일치하지 않습니다.</span>
                        </div>
                        <div className="wrap_signup_personal_pw_section">
                            <input className="signup_personal_pw" type="password" name="password_re" ref="password_re" onChange={this.pwcheck_step2}></input>
                        </div>
                        <button type="button" className="wrap_findpw_btn" onClick={this.changePassword}>확인</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Findpw
