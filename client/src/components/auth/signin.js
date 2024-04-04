import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import Router from 'next/router'
import Api from 'utils/apiutil'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'

import NaverLogin from './sso/naver'
import KakaoLogin from './sso/kakao'
import GoogleLogin from 'react-google-login'
import Agreement from './agreement'
import jQuery from 'jquery'
import AttoneySVC from '../event/attoneysvc'

const allowSso = (!!process.env.REACT_SSO)
const googleClientId = (!!process.env.REACT_GG_SSO_CLIENT_ID) ? process.env.REACT_GG_SSO_CLIENT_ID : null

window.$ = window.jQuery = jQuery

class Signin extends Component {

    constructor (props) {
        super(props)
        this.state = {
            signin_member_type: 'person',
            ssoStatus: (!!this.props.ssoStatus) ? this.props.ssoStatus : null,
            ssoData: (!!this.props.ssoData) ? this.props.ssoData : null,
            error_status: null,
            name_warn: '이름을 입력해주세요',
            cell_warn: '',
            openAttoneySVC: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {

    }

    handleSubmit = (event) => {

        event.preventDefault()
        event.returnValue = false

        /** ie-error */
            // const data = new FormData(event.target);
            // let userid = data.get('userid');
            // let password = data.get('password');

        let userid = ReactDOM.findDOMNode(this.refs.userid).value
        let password = ReactDOM.findDOMNode(this.refs.password).value
        const params = {
            'userid': userid,
            'password': password
        }

        Api.sendPost('/user/login', params).then(res => {

            let status = res.data.status
            let error_status

            if (status === 'ok') {
                let token = res.data.token
                if (token) Cookies.set('token', token, { expires: 7, path: '/' })

                //console.log('res.data', res.data)
                if (res.data.data.usertype === 'A') {
                    window.location = '/lawyer/contract/request'
                    return
                }

                window.location = (!!this.props.referer) ? this.props.referer : '/'
                return
            }

            switch (res.reason) {
                case 'already_sso_signup':
                    error_status = '회원님은 소셜계정으로 가입되어 있습니다.\n화면 하단의 가입하신 소셜계정버튼을 클릭하여 로그인해 주세요.'
                    break
                case 'not_approved':
                    error_status = '가입 심사 중입니다. 심사는 영업일 기준 1~2일 소요됩니다.'
                    break
                case 'denied':
                    error_status = '내부 기준에 의해 가입이 승인되지 않았습니다.\n문의가 있으신 경우 고객센터로 연락 주세요.'
                    break
                default:
                    error_status = '회원정보가 일치하지 않습니다.'
            }

            this.setState({
                error_status: error_status
            })

        })
    }

    handleKakaoSsoSubmit = (res = null) => {

        if (res === null) {
            alert('현재 기능을 이용하실 수 없습니다.')
            return
        }

        const profile = res
        const profileDetail = profile.kakao_account

        const userData = {
            idx: profile.id,
            email: profileDetail.email || null,
            name: profileDetail.profile.nickname,
            birthdate: (profileDetail.birthday || null),
            source: 'kakao',
            source_data: JSON.stringify(profile)
        }

        this.handleJoinedCheck(userData)
    }

    handleNvSubmit = (res, e) => {

        const userData = {
            idx: res.id,
            email: res.email || null,
            name: res.name,
            birthdate: (res.birthdate || null),
            source: 'naver',
            source_data: JSON.stringify(res)
        }

        this.handleJoinedCheck(userData)
    }

    handleGoogleSsoSubmit = res => {

        const profile = res.profileObj

        const userData = {
            idx: profile.googleId,
            email: profile.email || null,
            name: profile.name,
            birthdate: null,
            source: 'google',
            source_data: JSON.stringify(profile)
        }

        this.handleJoinedCheck(userData)
    }

    handleJoinedCheck = userData => {

        Api.sendPost('/sso/checkJoin', userData).then(res => {
            let status = res.status
            let data = res.data.data
            let result = data.data

            //console.log('status', status)
            //console.log('result', result)

            if (status === 'ok') {
                if (result === 'aleady_joined') {
                    this.handleSsoSubmit(userData)
                    return
                }

                //Router.push('/auth/signin?new_sso=1')
                //Router.push({ pathname: '/auth/signin', query: { ssoData: this.state.ssoData, ssoStatus: this.state.ssoStatus } })

                this.setState({
                    ssoData: userData,
                    ssoStatus: result
                })
            }
        })

    }

    handleSsoSignupSubmit = () => {

        let params = this.state.ssoData

        params['agree_service'] = window.$('#agree1').is(':checked') ? 'on' : 'off'
        params['agree_info'] = window.$('#agree2').is(':checked') ? 'on' : 'off'
        params['agree_msg'] = window.$('#agree3').is(':checked') ? 'on' : 'off'

        params['phonenumber'] = window.$('#join_phonenumber').val().trim()
        params['name'] = window.$('#join_name').val().trim()
        params['birthdate'] = ''

        if (params['name'].trim() === '') {
            alert('이름을 입력해 해주세요.')
            return
        }

        if (params['phonenumber'].trim() === '') {
            alert('휴대전화번호를 입력해주세요.')
            return
        }

        if (params['agree_service'] !== 'on' || params['agree_info'] !== 'on') {
            alert('약관에 동의해주세요.')
            return
        }

        this.handleSsoSubmit(params)

    }


    handleSsoSubmit = payload => {

        if (!payload.email) {
            alert('소셜계정에 이메일이 없어 회원가입 및 로그인을 할 수 없습니다.\n계정에 이메일주소를 설정해 주세요')
            return
        }

        Api.sendPost('/sso/signin', payload).then(res => {

            let status = res.status
            let data = res.data.data

            if (status === 'ok' && data.status === 'ok') {
                let token = res.data.token
                if (token) {
                    Cookies.set('token', token, { expires: 7, path: '/' })
                    alert('소셜계정으로 로그인에 성공하였습니다.')
                    window.location.href = (!!this.props.referer) ? this.props.referer : '/'
                } else {
                    alert('로폼 로그인에 실패하였습니다.')
                }
            } else {
                let msg = data.reason || ''
                if (data.reason === 'already_email') {
                    msg = '[' + payload.email + '] 은 이미 회원으로 가입된 이메일 입니다.\n소셜계정의 이메일을 수정하시거나 아이디/비밀번호찾기 메뉴를 이용해 주세요.'
                }
                alert(msg)
            }

        }).catch(e => {
            alert('로그인/가입중 오류가 발생했습니다. 잠시후 다시시도해주세요\n\n' + e.message)
            console.log('SSO FAIL :: ', e.message)
        })

    }

    handleTabChange = (tab) => {
        this.setState({
            signin_member_type: tab || 'person',
            error_status: null
        })
    }

    handleAlertSso = () => {
        if (!window.confirm('aaaaaaaaaaaaaaaaaaaa')) {
            return false
        }
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

    checkCellPhone = (e) => {
        this.setState({
            cellPhone: e.target.value
        })
    }

    closeAttoneySVC = () => {
        this.setState({
            openAttoneySVC: false
        })
    }

    completeAttoneySVC = () => {
        this.setState({
            openAttoneySVC: false
        })
    }

    render () {

        const { signin_member_type, error_status, ssoStatus } = this.state

        return (
            <>
                <AttoneySVC open={this.state.openAttoneySVC} close={this.closeAttoneySVC} onComplete={this.completeAttoneySVC}/>

                {(!ssoStatus) &&
                <div className={`wrap_signin ${(!allowSso) ? 'no-sso' : ''}`}>
                    <div className="wrap_signin_header">
                        <div className="signin_header_name">
                            <span>로그인</span>
                        </div>

                        <div className="wrap_signin_header_tab_wrap">
                            <ul>
                                <li className={`${(signin_member_type === 'person') && 'active'}`} onClick={() => this.handleTabChange('person')}>개인/기업회원</li>
                                <li className={`${(signin_member_type === 'lawyer') && 'active'}`} onClick={() => this.handleTabChange('lawyer')}>변호사 회원</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="wrap_signin_input">
                            <div className="signin_input_id">
                                <input type="text" name="userid" placeholder="아이디 or 이메일" className="signin_id_area" ref="userid"/>
                            </div>
                            <div className="signin_input_pw">
                                <input type="password" name="password" placeholder="비밀번호" className="signin_pw_area" ref="password"/>
                            </div>
                            <div className="signin_input_err">
                                {error_status}
                            </div>
                            <button type="submit" className="signin_submit">
                                <span>로그인</span>
                            </button>
                            {/*<div className="signin_find"><a href="#finduser" style={{ color: '#15376c' }}*/}
                            {/*                                onClick={(e) => ReactGA.pageview(window.location.pathname + '#finduser', null, '아이디 비밀전호 찾기')}>아이디 비밀번호 찾기</a></div>*/}
                        </div>
                    </form>

                    <div className="wrap_signin_menu">
                        <ul>
                            <li><a href={`${(signin_member_type === 'lawyer') ? '/auth/signup/lawyer' : '/auth/signup'}`}>회원가입</a></li>
                            <li><a href="/auth/finduser">아이디 찾기</a></li>
                            <li><a href="/auth/findpw">비밀번호 찾기</a></li>
                        </ul>
                    </div>


                    {(allowSso === true && signin_member_type === 'person') &&
                    <div className="signin_social">
                        <NaverLogin showButton={true} referer={(!!this.props.referer) ? this.props.referer : '/'} />

                        <KakaoLogin
                            onSuccess={(result) => this.handleKakaoSsoSubmit(result)}
                            onFailure={(result) => {
                                console.error(result)
                                alert('카카오 로그인에 실패하였습니다.')
                            }}
                        />

                        {(!!googleClientId) &&
                        <GoogleLogin
                            clientId={googleClientId}
                            render={(props) => <button type="button" onClick={props.onClick} className="signin_google"/>}
                            onSuccess={(result) => this.handleGoogleSsoSubmit(result)}
                            onFailure={(result) => {
                                console.error(result)
                            }}
                            cookiePolicy={'single_host_origin'}
                        />
                        }

                    </div>
                    }

                    {signin_member_type === 'lawyer' &&
                    <div className="signin_lawyer_wrap">
                        <div className="signin_lawyer_header">의뢰인들이 변호사님을 기다립니다.</div>
                        <div className="signin_lawyer_info"><a href="#" onClick={() => this.setState({ openAttoneySVC: true })}>변호사 서비스 안내</a></div>
                    </div>
                    }
                </div>
                }

                {/** 소셜로그인 이메일 중복 */}
                {(ssoStatus === 'aleady_email') &&
                <div className={`wrap_signin ${(!allowSso) ? 'no-sso' : ''}`}>
                    <div className="wrap_signin_header">
                        <div className="signin_header_name underline">
                            <span>로그인</span>
                        </div>
                        <div className="signin_header_sub">
                            <span>동일한 이메일로 가입되어 있는 계정이 있습니다.</span>
                        </div>
                    </div>

                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="wrap_signin_input">
                            <div className="signin_input_id">
                                <input type="text" name="userid" placeholder="아이디 or 이메일" className="signin_id_area" ref="userid" value={this.state.ssoData.email}/>
                            </div>
                            <div className="signin_input_pw">
                                <input type="password" name="password" placeholder="비밀번호" className="signin_pw_area" ref="password"/>
                            </div>
                            <div className="signin_input_err">
                                {error_status}
                            </div>
                            <button type="submit" className="signin_submit">
                                <span>로그인</span>
                            </button>
                        </div>
                    </form>

                    <div className="signin_lawyer_wrap">
                        <div className="signin_lawyer_header">비밀번호가 기억나지 않으세요?</div>
                        <div className="signin_lawyer_info"><a href="/auth/findpw">비밀번호 찾기</a></div>
                        <div className="signin_lawyer_info"><a href="#" onClick={e => window.location.reload()} >다른 계정으로 로그인</a></div>
                    </div>
                </div>
                }

                {/** 소셜로그인 신규 회원 가입일 경우 추가정보 입력 */}
                {(ssoStatus === 'need_join') &&
                <div id={'signup'}>
                    <div className={`wrap_signup`}>
                        <div className="wrap_signin_header">
                            <div className="signin_header_name">
                                <span>회원가입</span>
                            </div>
                            <div className="signup_header_choose_title">
                                <div>추가정보 입력</div>
                                <div>원활한 서비스 이용을 위한 추가 정보 입력 후 가입이 완료 됩니다.</div>
                            </div>
                        </div>
                        <div className="signup_form">
                            <div className="personal_wrap signup_inputs">
                                <div className="wrap_signup_personal_pw_section signup_label">
                                    <input placeholder="이름" className="signup_personal_pw" id="join_name" type="text" name="name" onChange={(e) => this.checkName(e)}/>
                                    <label className='input_warning'>{(!!this.state.name_warn) && this.state.name_warn}</label>
                                </div>
                                <div className="wrap_signup_personal_inputphone signup_label">
                                    <input placeholder="핸드폰 번호 (숫자만입력)"
                                           className="signup_personal_phone"
                                           name="phonenumber"
                                           type="number"
                                           pattern={'[0-9]*'}
                                           inputMode={'decimal'}
                                           id="join_phonenumber"
                                           ref="phonenumber"
                                           onChange={(e) => this.checkCellPhone(e)}/>
                                    <label className='input_warning'>{(!!this.state.cell_warn) && this.state.cell_warn}</label>
                                </div>
                            </div>
                            <Agreement handleSubmit={this.handleSsoSignupSubmit}/>
                        </div>
                    </div>
                </div>
                }

            </>
        )
    }
}

export default Signin
