import React, { Component } from 'react'
import LawyerSignupForm from '../lawyerSignup'

class LawyerSignup extends Component {

    constructor (props) {
        super(props)
    }

    componentDidMount () {

    }

    render () {

        return (
            <>
                <LawyerSignupForm />

                {/*<div className="personal_wrap signup_inputs">*/}
                {/*    <div className="wrap_signup_personal_inputid signup_label">*/}
                {/*        <input placeholder="이메일" className="signup_personal_id" type="text" name="email" id="join_email" ref="email" onChange={(e) => this.props.checkEmail(e)}/>*/}
                {/*        <label className={`input_warning ${(this.props.state.allowEmail === true) && 'allow-email'}`}>{(!!this.props.state.email_warn) && this.props.state.email_warn}</label>*/}
                {/*    </div>*/}

                {/*    <div className="wrap_signup_personal_pw_section signup_label">*/}
                {/*        <input placeholder="비밀번호" className="signup_personal_pw" type="password" name="password" id="join_password" onChange={(e) => this.props.pwcheck_step1(e)}/>*/}
                {/*        <label htmlFor="agree_all" className='input_warning'>{(!!this.props.state.pw_warn) && this.props.state.pw_warn}</label>*/}
                {/*    </div>*/}

                {/*    <div className="wrap_signup_personal_pw_section signup_label">*/}
                {/*        <input placeholder="비밀번호 확인" className="signup_personal_pw" type="password" name="password_re" id="join_password_re" onChange={(e) => this.props.pwcheck_step2(e)}/>*/}
                {/*        <label className='input_warning'>{(!!this.props.state.pw_same_warn) && this.props.state.pw_same_warn}</label>*/}
                {/*    </div>*/}

                {/*    <div className="wrap_signup_personal_pw_section signup_label">*/}
                {/*        <input placeholder="이름" className="signup_personal_pw" id="join_name" type="text" name="name" onChange={(e) => this.props.checkEmpty(e, 'userName')}/>*/}
                {/*        <label className='input_warning'>{(!!this.props.state.name_warn) && this.props.state.name_warn}</label>*/}
                {/*    </div>*/}

                {/*    <div className="wrap_signup_personal_inputphone signup_label">*/}
                {/*        <div className="divided">*/}
                {/*            <input placeholder="핸드폰 번호 (숫자만입력)" className="signup_personal_phone" type="number" name="phonenumber" id="join_phonenumber" ref="phonenumber" onChange={(e) => this.props.checkCellPhone(e)}/>*/}
                {/*            <label className='input_warning'>{(!!this.props.state.cell_warn) && this.props.state.cell_warn}</label>*/}
                {/*        </div>*/}
                {/*        <div className="blank"></div>*/}
                {/*        <div className="buttons" onClick={this.props.sendAuthCode}>*/}
                {/*            <span>인증번호 {this.props.state.sendSmsBtn}</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="wrap_signup_personal_inputphone signup_label">*/}
                {/*        <div className="divided">*/}
                {/*            <input placeholder="인증번호 입력" className="signup_personal_phone" type="text" ref="rcode" onChange={(e) => this.props.setAuthCode(e)}/>*/}
                {/*            <label className='input_warning'>{(!!this.props.state.cell_auth_warn) && this.props.state.cell_auth_warn}</label>*/}
                {/*            <label className='input_warning timer'>{(this.props.state.sendCode === 'Y' && this.props.state.allowAuthCode === false) && this.props.state.timer}</label>*/}
                {/*        </div>*/}
                {/*        <div className="blank"></div>*/}
                {/*        <div className="buttons" onClick={this.props.checkAuthCode}>*/}
                {/*            <span>확인</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </>
        )
    }
}

export default LawyerSignup