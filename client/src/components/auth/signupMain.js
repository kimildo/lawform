import React, { Component } from 'react'
import PersonalSignup from './personalSignup'
import CompanySignup from './companySignup'
import LawyerSignup from './lawyerSignup'
// import '../../scss/common/signup.scss';
import Agreement from '../auth/agreement'
import Api from '../../utils/apiutil'
import Analystics from '../../utils/analytics'
import Cookies from 'js-cookie'
import jQuery from 'jquery'

window.$ = window.jQuery = jQuery

class SignupMain extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tab: this.props.tab || 1,
            phoneCheck: 'N',
            signupPath: '',
            signupPathExtra: ''
        }
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    shouldComponentUpdate (nextProps, nextState) {

        return true
    }

    phoneCheck = (data) => {
        this.setState({
            phoneCheck: data
        })
    }

    chkEmail (str) {
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        return regExp.test(str)
    }

    handleSubmit = (event) => {
        let data = new FormData(event.target)
        let params = {}
        params['tab'] = this.state.tab
        params['agree_service'] = window.$('#agree1').is(':checked') ? 'on' : 'off'
        params['agree_info'] = window.$('#agree2').is(':checked') ? 'on' : 'off'
        params['agree_msg'] = window.$('#agree3').is(':checked') ? 'on' : 'off'
        let referer_url = document.referrer
        let referer_domain = referer_url.split('/')[2]
        let hostname = window.location.hostname
        // if( !!referer_url && referer_url !== '/signup' && hostname === referer_domain ) {
        //    console.log('match!');
        // }
        if (this.state.tab === 1) {
            params['email'] = window.$('#join_email').val()
            params['email_domain'] = window.$('#join_email_domain').val()
            params['email_domain_selector'] = window.$('#join_email_domain_selector').val()
            params['password'] = window.$('#join_password').val()
            params['password_re'] = window.$('#join_password_re').val()
            params['phonenumber'] = window.$('#join_phonenumber').val()
            params['name'] = window.$('#join_name').val()
            params['birthdate'] = window.$('#join_birthdate').val()
            if (params['email'] === '' || params['email_domain'] === '' || this.chkEmail(params['email'] + '@' + params['email_domain']) === false) {
                event.preventDefault()
                alert('이메일을 확인해주세요.')
                return false
            }
            if (params['password'].length < 8) {
                event.preventDefault()
                alert('비밀번호를 확인해주세요.')
                return false
            }

            if (params['password'] === '' || (params['password'] !== params['password_re'])) {
                event.preventDefault()
                alert('비밀번호를 확인해주세요.')
                return false
            }
            if (params['name'].trim() === '') {
                event.preventDefault()
                alert('이름을 확인해주세요.')
                return false
            }

            let date_pattern = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/
            if (params['birthdate'] !== '' && !date_pattern.test(params['birthdate'])) {
                event.preventDefault()
                alert('생년월일을 확인해주세요. (ex.19850423)')
                return false
            }

        } else if (this.state.tab === 2) {
            params['login_id'] = window.$('#join_login_id').val()
            params['c_password'] = window.$('#join_c_password').val()
            params['c_password_re'] = window.$('#join_c_password_re').val()
            params['c_name'] = window.$('#join_c_name').val()
            params['c_phonenumber'] = window.$('#join_c_phonenumber').val()
            params['c_email'] = window.$('#join_c_email').val()
            params['c_email_domain'] = window.$('#join_c_email_domain').val()
            params['company_number'] = window.$('#join_company_number').val()
            params['company_name'] = window.$('#join_company_name').val()
            params['company_owner'] = window.$('#join_company_owner').val()
            params['referer'] = window.$('#join_referer').val()

            if (params['login_id'] === '') {
                event.preventDefault()
                alert('아이디를 입력해주세요.')
                return false
            }

            if (params['c_password'].length < 8) {
                event.preventDefault()
                alert('비밀번호를 확인해주세요.')
                return false
            }

            if (params['c_password'] === '' || (params['c_password'] !== params['c_password_re'])) {
                event.preventDefault()
                alert('비밀번호를 확인해주세요.')
                return false
            }

            if (params['c_name'] === '') {
                event.preventDefault()
                alert('비밀번호를 확인해주세요.')
                return false
            }
            if (params['c_email'] === '' || params['c_email_domain'] === '') {
                event.preventDefault()
                alert('이메일을 확인해주세요.')
                return false
            }
            if (params['company_number'] === '') {
                event.preventDefault()
                alert('사업자번호를 입력해주세요.')
                return false
            }
            if (params['company_name'] === '') {
                event.preventDefault()
                alert('회사명을 입력해주세요.')
                return false
            }
            if (params['company_owner'] === '') {
                event.preventDefault()
                alert('대표자 명을 입력해주세요.')
                return false
            }
        }

        if (this.state.phoneCheck !== 'Y') {
            event.preventDefault()
            alert('휴대전화 인증을 완료해주세요.')
            return false
        }

        if (this.state.signupPath === 'etc' && this.state.signupPathExtra === '') {
            event.preventDefault()
            alert('가입경로를 입력해주세요.')
            return false
        } else if (this.state.signupPath === 'etc' && this.state.signupPathExtra !== '') {
            params['signuppath'] = this.state.signupPathExtra
        } else {
            params['signuppath'] = this.state.signupPath
        }

        if (params['agree_service'] !== 'on' && params['agree_info'] !== 'on') {
            event.preventDefault()
            alert('약관에 동의해주세요.')
            return false
        }

        event.preventDefault()
        Api.sendPost('/user/join', params).then((result) => {
            if (result.status === 'ok') {
                let token = result.data.token
                Cookies.set('token', token, { expires: 7, path: '/' })
                let redirect = Cookies.get('signInReferrer')
                let analyticsData = {}
                Analystics.userSignUp(analyticsData).then(() => {
                    alert('회원가입이 완료되었습니다.')
                    if (!!redirect) {
                        window.location = redirect
                        Cookies.remove('signInReferrer')
                    } else if (!!referer_url && referer_url !== '/signup' && hostname === referer_domain) {
                        window.location = referer_url
                    } else {
                        window.location = '/'
                    }
                })
            }
        })
    }

    onclick_change_tab = (event) => {
        let tab = Number(event.target.id)
        window.location.hash = '#' + tab
        this.setState({ tab: tab })
    }

    render () {

        let tab_id = this.state.tab
        let tabs = ['signup-tabs-items', 'signup-tabs-items', 'signup-tabs-items']
        tabs[parseInt(tab_id) - 1] += ' signup-tabs-items-active'

        // tab status
        let personal = { display: 'none' }
        let company = { display: 'none' }
        let lawyer = { display: 'none' }
        let agreement = { display: 'none' }

        if (tab_id === 1) {
            agreement = { display: 'block' }
            personal = { display: 'block' }
        }

        if (tab_id === 2) {
            agreement = { display: 'block' }
            company = { display: 'block' }
        }

        if (tab_id === 3) {
            agreement = { display: 'none' }
            lawyer = { display: 'block' }
        }

        return (
            <div className="wrap_signup">
                <div className="signup">
                    <div className="wrap_signup_header">
                        <div className="signup_header_symbol">
                            <img src='/header_img/symbol.svg' alt='symbol' height="60"/>
                        </div>
                    </div>
                    <div>
                        <div className="signup-tabs">
                            <div className={tabs[0]} id={1} onClick={this.onclick_change_tab}>개인회원가입</div>
                            <div className={tabs[1]} id={2} onClick={this.onclick_change_tab}>기업회원가입</div>
                            <div className={tabs[2]} id={3} onClick={this.onclick_change_tab}>변호사회원가입</div>
                        </div>
                    </div>
                    <form method="post" onSubmit={this.handleSubmit} style={agreement}>
                        <input type="hidden" name="tab" value={tab_id}/>
                        <div style={personal}>
                            <PersonalSignup phoneCheck={this.phoneCheck}/>
                        </div>
                        <div style={company}>
                            <CompanySignup phoneCheck={this.phoneCheck}/>
                        </div>
                        <div className="signup_company_basic">
                            <span>기타 정보</span>
                        </div>
                        <div className="signup-group signup-path">
                            <div className="group-title">가입경로</div>
                            <div className="input-box input-box-first-break input-box-row">
                                <select onChange={e => this.setState({ signupPath: e.target.value })} id="signuppath" className="signup-path-select">
                                    <option disabled selected>선택해주세요</option>
                                    <option>인터넷 검색</option>
                                    <option>블로그 등 SNS</option>
                                    <option>지인 추천</option>
                                    <option value='etc'>기타 직접입력</option>
                                </select>
                            </div>
                            <div><input style={{ display: this.state.signupPath === 'etc' ? null : 'none' }} type="text" id="signuppathextra" value={this.state.signupPathExtra}
                                        onChange={e => this.setState({ signupPathExtra: e.target.value })} placeholder="예 : 브로셔, 강의, 행사, 제휴사"
                                        className='signup_personal_pw signup-path-extra'/></div>
                        </div>
                        <Agreement agreeService={this.agreeService} agreeInfo={this.agreeInfo}/>
                    </form>
                    <div style={lawyer}>
                        <LawyerSignup phoneCheck={this.phoneCheck}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignupMain
