import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import '../../scss/common/signin.scss'
import Api from '../../utils/apiutil'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'
import NaverLogin from 'react-naver-login'
import KakaoLogin from 'react-kakao-login'
import GoogleLogin from 'react-google-login'
import { isMobile, isIE } from 'react-device-detect'

const allowSso = (!!process.env.REACT_SSO)
//const allowSso = false
const nvClientId = (!!process.env.REACT_NV_SSO_CLIENT_ID) ? process.env.REACT_NV_SSO_CLIENT_ID : null
const kkoJsKey = (!!process.env.REACT_KKO_SSO_JVSC_KEY) ? process.env.REACT_KKO_SSO_JVSC_KEY : null
const googleClientId = (!!process.env.REACT_GG_SSO_CLIENT_ID) ? process.env.REACT_GG_SSO_CLIENT_ID : null

const apiHost = (!!process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'
const apiHostIp = (!!process.env.REACT_APP_HOST_IP) ? process.env.REACT_APP_HOST_IP : apiHost
const nvCallBackUrl = apiHostIp + '/sso/nvSigninCallback'
//const nvCallBackUrl = apiHostIp + '/nvSigninCallback'

class Signin extends Component {

    constructor (props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        console.log('isIE', isIE)
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
            if (status === 'ok') {
                let token = res.data.token
                if (token) Cookies.set('token', token, { expires: 7, path: '/' })

                if (res.data.acc_type === 'A') {
                    window.location.href = '/lawyer/contract/request'
                    return
                }

                if (!!this.props.referer) {
                    window.location.href = window.location.origin + this.props.referer
                } else {
                    window.location.href = window.location.href.split('#')[0]
                }

            } else {
                if (res.reason === 'not_approved') {
                    alert('가입 심사 중입니다. 심사는 영업일 기준 1~2일 소요됩니다.')
                } else if (res.reason === 'denied') {
                    alert('내부 기준에 의해 가입이 승인되지 않았습니다.\n문의가 있으신 경우 고객센터로 연락 주세요.')
                } else {
                    alert('회원정보가 일치하지 않습니다.')
                }
            }
        })
    }

    handleKakaoSsoSubmit = (res = null) => {

        if (res === null) {
            alert('IE에서 현재 기능을 이용하실 수 없습니다.\n\n크롬 혹은 엣지브라우저를 이용해 주세요')
            return
        }

        const profile = res.profile
        const profileDetail = profile.kakao_account

        const userData = {
            idx: profile.id,
            email: profileDetail.email || null,
            name: profileDetail.profile.nickname,
            birthdate: (profileDetail.birthday || null),
            source: 'kakao',
            source_data: JSON.stringify(profile)
        }

        this.handleSsoSubmit(userData)
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

        this.handleSsoSubmit(userData)
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

        this.handleSsoSubmit(userData)
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
                    window.location.reload(true)
                } else {
                    alert('로폼 로그인에 실패하였습니다.')
                }

            } else {
                let msg = data.reason || ''
                if (data.reason === 'already_email') {
                    msg = '[' + payload.email + ']은 이미 회원으로 가입된 이메일 입니다.\n소셜계정의 이메일을 수정하시거나 아이디/비밀번호찾기 메뉴를 이용해 주세요.'
                }
                alert(msg)
            }

        }).catch(e => {
            console.log('SSO FAIL :: ', e.message)
        })

    }

    handleAlertSso = () => {
        if (!window.confirm('aaaaaaaaaaaaaaaaaaaa')) {
            return false
        }
    }

    render () {
        return (
            <div className={`wrap_signin ${(!allowSso) ? 'no-sso' : ''}`}>
                <div className="close">
                    <a href={!!this.props.closeUrl ? this.props.closeUrl : 'javascript:history.back();'}>
                        <img src="/autoform_img/x_btn.png" width="48" height="48" alt="x_btn"/>
                    </a>
                </div>
                <div className="wrap_signin_header">
                    <div className="signin_header_symbol">
                        <img src='/header_img/symbol.svg' alt='symbol' height="50"/>
                    </div>
                    {/* <div className="signin_header_name">
                        <span>LAW FORM</span>
                    </div> */}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="wrap_signin_input">
                        <div className="signin_input_id">
                            <input type="text" name="userid" placeholder="아이디 or 이메일" className="signin_id_area" ref="userid"/>
                        </div>
                        <div className="signin_input_pw">
                            <input type="password" name="password" placeholder="비밀번호" className="signin_pw_area" ref="password"/>
                        </div>
                        <button type="submit" className="signin_submit">
                            <span>확인</span>
                        </button>

                        <div className="signin_find"><a href="#finduser" style={{ color: '#15376c' }}
                                                        onClick={(e) => ReactGA.pageview(window.location.pathname + '#finduser', null, '아이디 비밀전호 찾기')}>아이디 비밀번호 찾기</a></div>
                    </div>
                </form>

                {(allowSso === true) &&
                <div className="signin_signup signin_social">
                    {(!!nvClientId) &&
                    <NaverLogin
                        clientId={nvClientId}
                        callbackUrl={nvCallBackUrl}
                        render={(props) => <button type="button" onClick={props.onClick} className="signin_naver"/>}
                        onSuccess={(result, e) => this.handleNvSubmit(result, e)}
                        //onSuccess={(naverUser) => console.log(naverUser)}
                        onFailure={(result) => {
                            console.error(result)
                            alert('네이버 로그인에 실패하였습니다.')
                        }}
                    />
                    }

                    {(!!kkoJsKey && !isIE) &&
                    <KakaoLogin
                        jsKey={kkoJsKey}
                        render={(props) => <button type="button" onClick={props.onClick} className="signin_kakao"><span></span></button>}
                        getProfile={true}
                        onSuccess={(result) => this.handleKakaoSsoSubmit(result)}
                        onFailure={(result) => {
                            console.error(result)
                            alert('카카오 로그인에 실패하였습니다.')
                        }}
                    />
                    }

                    {(!!isIE) && <button type="button" onClick={() => this.handleKakaoSsoSubmit()} className="signin_kakao"/>}

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


                <div className="signin_signup">로폼 회원이 아니세요?
                    <label>
                        <a href="/signup" className="signin_signup_link">회원가입</a>
                    </label>
                </div>
            </div>
        )
    }
}

export default Signin
