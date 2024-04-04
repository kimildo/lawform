import React, { Fragment, Component } from 'react'
import Kakao from '../sso/kakao.min'
//import KakaoLogin from 'react-kakao-login'

const REACT_KKO_SSO_JVSC_KEY = (!!process.env.REACT_KKO_SSO_JVSC_KEY) ? process.env.REACT_KKO_SSO_JVSC_KEY : null
const KAKAO_SDK_URL = ''

export default class KakaoLogin extends Component {

    constructor (props) {
        super(props)
    }

    handleClick = () => {

        let onSuccess = this.props.onSuccess, onFailure = this.props.onFailure
        Kakao.Auth.login({
            success: function (response) {
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res) {
                        //console.log(JSON.stringify(res))
                        return onSuccess(res)
                        //this.props.onSuccess(res)
                    },
                    fail: function (error) {
                        return onFailure(error)
                    }
                })
            },
            fail: function (error) {
                console.log(error)
            },
        })
    }

    componentDidMount () {
        if (!Kakao.isInitialized()) {
            Kakao.init(REACT_KKO_SSO_JVSC_KEY)
        }
        //console.log(Kakao.isInitialized())
    }

    render () {
        return (
            <Fragment>
                <button type="button" onClick={this.handleClick} className="signin_kakao"/>
            </Fragment>
        )
    }

}