import React, { Component } from 'react';
// import '../../scss/common/signup.scss';
import ReactDOM from "react-dom";
import Api from '../../utils/apiutil';


class CompanySignup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            check: '0',
            pw1: '',
            pw2: '',
            countdown: 120*10000,
            timer: '2:00',
            sendSmsBtn : '전송'
        }
    }

    componentDidMount() {
        this.startCountDown()
    }

    checkLoginId = (e) => {
        var loginid_true = ReactDOM.findDOMNode(this.refs.loginid_true);
        var loginid_false = ReactDOM.findDOMNode(this.refs.loginid_false);
        var loginId = e.target.value;
        const params = {
            "loginId": loginId
        };

        Api.sendPost('/user/checkloginid', params)
            .then(res => {
                let status = res.data.status;
                if (status === "ok") {
                    loginid_true.style.display = "inline";
                    loginid_false.style.display = "none";
                    return true;
                } else {
                    loginid_false.style.display = "inline";
                    loginid_true.style.display = "none";
                    return false;
                }
            })
    }

    startCountDown() {
        clearInterval( setTimer )
        let setTime = 120*10000;
        var setTimer = setInterval(()=>{ 
            setTime = this.state.countdown - 10000
            if( setTime <= 0 ) {
                setTime  = 0
                this.setState({
                    sendCode: 'N',
                    timer: '0:00'
                })
            }
            var m = parseInt(( ( setTime *0.0001) %3600)/60);
            var s = ( setTime*0.0001 )%60;
            s = ("0" + s).slice(-2)
            this.setState({
                countdown : setTime,
                timer : m+':'+s
            })
        }, 1000);
    }

    phoneAuthCode = () => {
        var receiver = ReactDOM.findDOMNode(this.refs.phonenumber).value;

        const params = {
            "receiver": receiver
        };
        let phone_true =ReactDOM.findDOMNode(this.refs.phone_true);
        let phone_false =ReactDOM.findDOMNode(this.refs.phone_false);
        let phone_send =ReactDOM.findDOMNode(this.refs.phone_send);
        Api.sendPost('/user/sendphone', params)
            .then(res => {
                if( res.status === 'ok' ) {
                    this.setState({
                        sendCode: 'Y',
                        countdown: 120*10000,
                        sendSmsBtn: '재전송'
                    },()=>{
                        phone_true.style.display = "none";
                        phone_false.style.display = "none";
                        phone_send.style.display = "inline";
                        alert("인증번호가 전송되었습니다.")
                    })

                  } else {
                    this.setState({
                        sendCode: 'N'
                    })
                  }
            })
    }

    checkAuthCode = () => {
        var rcode = ReactDOM.findDOMNode(this.refs.rcode).value;
        var receiver = ReactDOM.findDOMNode(this.refs.phonenumber).value;
        var phone_true = ReactDOM.findDOMNode(this.refs.phone_true);
        var phone_false = ReactDOM.findDOMNode(this.refs.phone_false);
        let phone_send =ReactDOM.findDOMNode(this.refs.phone_send);

        const params = {
            "rcode": rcode,
            "receiver": receiver
        };

        Api.sendPost('/user/authphone', params)
            .then(res => {
                let status = res.data.status;
                if (status === "ok") {
                    phone_true.style.display = "inline";
                    phone_false.style.display = "none";
                    phone_send.style.display = "none";
                    this.setState({
                        phoneCheck: "Y"
                    })
                    this.props.phoneCheck("Y");
                } else {
                    phone_false.style.display = "inline";
                    phone_true.style.display = "none";
                    phone_send.style.display = "none";
                    this.props.phoneCheck("N");
                }
            })

    }

    pwcheck_step1 = (e) => {
        this.setState({
            pw1: e.target.value,
        });
    }


    pwcheck_step2 = (e) => {
        this.setState({
            pw2: e.target.value,
        });
    }

    emailDomainSelector = (e) => {
        let email_domain =ReactDOM.findDOMNode(this.refs.c_email_domain);
        email_domain.value = e.target.value
    }

    chkEmail(str) {
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (regExp.test(str)) return true;
        else return false;
    }

    checkEmail = () => {
        var email_true =ReactDOM.findDOMNode(this.refs.email_true);
        var email_false =ReactDOM.findDOMNode(this.refs.email_false);
        var email_domain =ReactDOM.findDOMNode(this.refs.c_email_domain).value.trim();
        var email = "";
        var email1 = ReactDOM.findDOMNode(this.refs.c_email).value.trim();
        if( !email_domain || !email1 ) {
            email_false.innerHTML = "이메일을 정확히 입력해주십시오."
            email_false.style.display = "inline";
            email_true.style.display = "none";
            return false;
        } else {
            email = email1+"@"+email_domain;
        }
        const params = {
            "email": email
        };
        Api.sendPost('/user/checkemail', params)
        .then(res => {
            let status = res.data.status;
            
            if( status === "ok" && email1 !== '' && email_domain !== '' && this.chkEmail( email ) === true ) {
                email_true.style.display = "inline";
                email_false.style.display = "none";
                return true
            } 
            else if( email1 === '' || email_domain === ''  || this.chkEmail( email ) === false ) { 
                email_false.innerHTML = "이메일을 정확히 입력해주십시오."
                email_false.style.display = "inline";
                email_true.style.display = "none";
             }
            else {
                email_false.innerHTML = "이미 사용중인 이메일입니다."
                email_false.style.display = "inline";
                email_true.style.display = "none";
                return false
            }
        })
    }

    render() {
        var check_true = {}
        var check_false = {}
        var check_false1 = {}
        var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/;

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
        }
        else {
            if (this.state.pw1 !== this.state.pw2) {
                check_true = {
                    display: 'none'
                }
                check_false = {
                    display: 'inline'
                }
            }
            else if (this.state.pw1 === this.state.pw2) {
                check_true = {
                    display: 'inline'
                }
                check_false = {
                    display: 'none'
                }
            }
        }


        return (
            <div className='company_wrap'>
                <div className="wrap_signup_personal_need" style={{marginTop:20,display:'block'}}>
                    <span>*필수입력정보 입니다.</span>
                </div>
                <div className="signup_company_basic">
                    <span>기본정보</span>
                </div>
                <div className="wrap_signup_company_id">
                    <span>아이디*</span> <span className="personal_id_true" ref="loginid_true">사용가능합니다.</span> <span className="personal_id_false" ref="loginid_false" >이미 사용중인 아이디입니다.</span>
                </div>
                <div className="wrap_signup_personal_inputid">
                    <div className="wrap_signup_personal_id_section">
                        <input placeholder=" 4~20자 영문, 숫자만 입력 가능" className="signup_company_id" id="join_login_id" name="login_id" type="text" onChange={this.checkLoginId} required={this.sta}></input>
                    </div>
                </div>
                <div className="wrap_signup_personal_pw">
                    <span>비밀번호 입력*</span> <span style={check_false1} className="personal_pw_false">영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</span>
                </div>
                <div className="wrap_signup_personal_pw_section">
                    <input className="signup_personal_pw" type="password" name="c_password" id="join_c_password" onChange={this.pwcheck_step1}></input>
                </div>
                <div className="wrap_signup_personal_pw">
                    <span>비밀번호 재입력*</span> <span style={check_true} className="personal_re_pw_true">일치합니다.</span><span style={check_false} className="personal_re_pw_false">일치하지 않습니다.</span>
                </div>
                <div className="wrap_signup_personal_pw_section">
                    <input className="signup_personal_pw" type="password" name="c_password_re" id="join_c_password_re" onChange={this.pwcheck_step2}></input>
                </div>
                {/* <div className="signup_company_auth">
                    <span>휴대폰 본인인증</span>
                </div> */}
                <div className="signup_company_basic">
                    <span>담당자 정보</span>
                </div>
                <div className="wrap_signup_personal_pw">
                    <span>이름*</span>
                </div>
                <div className="wrap_signup_personal_pw_section">
                    <input placeholder="홍길동" className="signup_personal_pw" name="c_name" id="join_c_name" type="text"></input>
                </div>
                <div className="wrap_signup_personal_pw">
                    <span>휴대폰 번호*</span>
                </div>
                <div className="wrap_signup_personal_inputphone">
                    <div className="wrap_signup_personal_phone_section">
                        <input placeholder="'_' 없이 입력" className="signup_personal_phone" type="text" name="c_phonenumber" id="join_c_phonenumber" ref="phonenumber"  ></input>
                    </div>
                    <div className="blank"></div>
                    <div className="wrap_signup_personal_phone_btn" onClick={this.phoneAuthCode}>
                        <span >인증번호  {this.state.sendSmsBtn}</span>
                    </div>
                </div>
                <div className="wrap_signup_personal_pw">
                    <span>인증번호*</span> 
                    <span ref="phone_send" className="personal_pw_false"> ({this.state.timer})이내에 입력해주십시오. </span><span ref="phone_true" className="personal_pw_false">인증되었습니다.</span><span ref="phone_false" className="personal_pw_false">인증번호가 올바르지 않습니다.</span>
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
                <div className="wrap_signup_company_email">
                    <span>이메일*</span> <span ref="email_true" className="personal_id_true">사용가능합니다.</span> <span ref="email_false" className="personal_id_false">이미 사용중인 이메일입니다.</span>
                </div>
                <div className="wrap_signup_personal_inputid">
                    <input placeholder="abcd1234" className="signup_personal_id" name="c_email" id="join_c_email" ref="c_email"  type="text" onChange={this.checkEmail}></input>
                    <div className="wrap_signup_personal_at_section"><span>@</span></div>
                    <input placeholder="naver.com" className="signup_personal_id" type="text" name="c_email_domain" id="join_c_email_domain" ref="c_email_domain" onChange={this.checkEmail} style={{width:147}}  ></input>
                </div>
                <div style={{margin:'0 auto', width:437}} className='signup_personal_domain_wrap'>
                    <div style={{display:'block', clear:'both', textAlign:'right'}}>
                    <select className="signup_personal_domain" name="email_domain_selector" ref="email_domain_selector" onChange={this.emailDomainSelector}>
                            <option>naver.com</option>
                            <option>hanmail.net</option>
                            <option>nate.com</option>
                            <option>gmail.com</option>
                            <option>daum.net</option>
                            <option>hotmail.com</option>
                            <option>lycos.co.kr</option>
                            <option>korea.com</option>
                            <option>dreamwiz.com</option>
                            <option>yahoo.com</option>
                            <option value="" selected>직접입력</option>
                        </select>
                    </div>
                </div>
                <div className="signup_company_basic">
                    <span>회사 정보</span>
                </div>
                <div className="wrap_signup_company_id">
                    <span>사업자 등록번호*</span>
                </div>
                <div className="wrap_signup_personal_inputid">
                    <div className="wrap_signup_personal_id_section">
                        <input placeholder="00-00-0000" className="signup_company_id" type="text" name="company_number" id="join_company_number"></input>
                    </div>
                </div>
                <div className="wrap_signup_company_id">
                    <span>회사명*</span>
                </div>
                <div className="wrap_signup_personal_inputid">
                    <div className="wrap_signup_personal_id_section">
                        <input placeholder="아미쿠스렉스" className="signup_company_id" type="text" name="company_name" id="join_company_name" ></input>
                    </div>
                </div>
                <div className="wrap_signup_company_id">
                    <span>대표자 명*</span>
                </div>
                <div className="wrap_signup_personal_inputid">
                    <div className="wrap_signup_personal_id_section">
                        <input placeholder="홍길동" className="signup_company_id" type="text" name="company_owner"  id="join_company_owner"></input>
                    </div>
                </div>
            </div>
        );
    }
}

export default CompanySignup;
