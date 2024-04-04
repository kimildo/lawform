import React, { Fragment, Component } from 'react'
import { isMobile, isIE } from 'react-device-detect'

const NAVER_ID_SDK_URL = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js'
const NAVER_CLIENT_ID = (!!process.env.REACT_NV_SSO_CLIENT_ID) ? process.env.REACT_NV_SSO_CLIENT_ID : null

const API_HOST = (!!process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'
const API_HOSTIP = (!!process.env.REACT_APP_HOST_IP) ? process.env.REACT_APP_HOST_IP : API_HOST
const NAVER_CALLBACK_URL = API_HOSTIP + '/sso/nvSigninCallback'

export default class NaverLogin extends Component {

    constructor (props) {
        super(props)
    }

    loadScript = () => {

        const script = document.createElement('script')
        script.src = NAVER_ID_SDK_URL
        script.async = true
        document.head.appendChild(script)
        const initLoop = setInterval(() => {
            if (window.naver) {
                this.initLoginButton()
                clearInterval(initLoop)
            }
        }, 300)

    }

    initLoginButton = () => {

        let { naver } = window
        const { onSuccess, onFailure } = this.props
        let naverOpt = {
            callbackUrl: NAVER_CALLBACK_URL + '?referer=' + this.props.referer,
            clientId: NAVER_CLIENT_ID,
            isPopup: false,
            loginButton: { color: 'green', type: 3, height: 60 },
        }

        let naverLogin = new naver.LoginWithNaverId(naverOpt)
        naverLogin.init()

        if (!!onSuccess) {
            naverLogin.getLoginStatus(function (status) {
                let email = naverLogin.user.getEmail()
                if (email === undefined || email === null) {
                    alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.')
                    naverLogin.reprompt()
                    return
                }

                if (!status || location.hash.indexOf('#access_token') === -1) {
                    return
                }

                naver.successCallback = () => { return onSuccess(naverLogin.user) }
                naver.FailureCallback = (!!onFailure) ? onFailure : () => { return alert('네이버 로그인 실패') }
                naver.successCallback()
            })
        }

    }

    handleClick = () => {
        return document.querySelector('#naverIdLogin').firstChild.click()
    }

    componentDidMount () {
        this.loadScript()
    }

    render () {

        const { showButton } = this.props

        return (
            <Fragment>
                <div id="naverIdLogin"></div>
                {(!!showButton) && <>
                    <button type="button" onClick={this.handleClick} className="signin_naver"/>
                </>}
            </Fragment>
        )
    }

}