import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// import '../../scss/common/signupagreement.scss';
class Agreement extends Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    agreeAll = (e) => {

        console.log(e.target.checked)

        if (e.target.checked === '') {
            ReactDOM.findDOMNode(this.refs.agree_service).checked = ''
            ReactDOM.findDOMNode(this.refs.agree_info).checked = ''
            ReactDOM.findDOMNode(this.refs.agree_msg).checked = ''
        } else {
            ReactDOM.findDOMNode(this.refs.agree_service).checked = 'checked'
            ReactDOM.findDOMNode(this.refs.agree_info).checked = 'checked'
            ReactDOM.findDOMNode(this.refs.agree_msg).checked = 'checked'
        }
    }

    render () {
        return (
            <div className="signup_agreement">
                {/*<div className="signup_agreement_basic">*/}
                {/*    <span>약관 동의</span>*/}
                {/*</div>*/}
                <div className="wrap_agreement_all">
                    <div className="wrap_agreement_checkbox">
                        <span>
                            <input type="checkbox" id="agree_all" className="agreement_checkbox" onChange={this.agreeAll}/>
                            <label htmlFor="agree_all"><span className="agreement_section"> 전체동의</span></label>
                        </span>
                    </div>
                </div>
                <div className="wrap_agreement_section">
                    <div className="wrap_agreement_checkbox">
                        <span>
                            <input type="checkbox" id="agree1" className="agreement_checkbox" name="agree_service" ref="agree_service"/>
                            <label htmlFor="agree1"><span className="agreement_section"> 서비스 이용약관 동의</span></label>
                        </span>
                        <span className="agreement_float_right"><a href="/legalnotice#terms" target="new" style={{ color: 'grey' }}>자세히보기</a></span>
                    </div>
                </div>
                <div className="wrap_agreement_section">
                    <div className="wrap_agreement_checkbox">
                        <span>
                            <input type="checkbox" id="agree2" className="agreement_checkbox" name="agree_info" ref="agree_info"/>
                            <label htmlFor="agree2"><span className="agreement_section"> 개인정보 수집 및 제 3자 제공동의</span></label>
                        </span>
                        <span className="agreement_float_right"><a href="/legalnotice#privacy" target="new" style={{ color: 'grey' }}>자세히보기</a></span>
                    </div>
                </div>
                <div className="wrap_agreement_section">
                    <div className="wrap_agreement_checkbox">
                        <span>
                            <input type="checkbox" id="agree3" className="agreement_checkbox" name="agree_msg" ref="agree_msg"></input>
                            <label htmlFor="agree3"><span className="agreement_section"> 로폼 정보수신 동의(선택)</span></label>
                        </span>

                    </div>
                </div>

                <div className="wrap_agreement_section">
                    <button type="submit" className="wrap_agreement_complete" onClick={this.props.handleSubmit}>회원가입 완료</button>
                </div>
            </div>
        )
    }
}

export default Agreement
