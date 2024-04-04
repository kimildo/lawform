import React, { Component } from 'react'
import { isMobile, isIE } from 'react-device-detect'
import NaverLogin from 'components/auth/sso/naver'
import Api from 'utils/apiutil'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('components/common/header'), { ssr: false })
const SigninMain = dynamic(() => import('components/auth/signin'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })

class NvSigninCallback extends Component {

    constructor (props) {
        super(props)

        let query = {}
        if (process.browser) {
            //console.log('window.location.search', window.location.search)
            //console.log('window.location.hash', window.location.hash)

            let queryString = window.location.search.substr(1).split('&')
            if (queryString.length === 0) {
                window.location = '/'
            }

            if (!!queryString.length) {
                queryString.map(item => {
                    let pair = item.split('=', 2)
                    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
                })
            }
        }

        this.state = {
            ssoStatus: null,
            ssoData: null,
            query: query,
        }

    }

    componentDidMount () {

    }

    handleJoinedCheck = userData => {

        Api.sendPost('/sso/checkJoin', userData).then(res => {
            let status = res.status
            let data = res.data.data
            let result = data.data

            if (status === 'ok') {
                if (result === 'aleady_joined') {
                    this.handleSsoSubmit(userData)
                    return
                }

                this.setState({
                    ssoData: userData,
                    ssoStatus: result
                })
            }
        })

    }

    handleSsoSubmit = payload => {

        const { query } = this.state

        if (!payload.email) {
            alert('소셜계정에 이메일이 없어 회원가입 및 로그인을 할 수 없습니다.\n계정에 이메일주소를 설정해 주세요')
            window.location.href = (!!query.referer) ? query.referer : '/'
            return
        }

        Api.sendPost('/sso/signin', payload).then(res => {

            let status = res.status
            let data = res.data.data

            if (status === 'ok' && data.status === 'ok') {
                let token = res.data.token
                if (token) {
                    Cookies.set('token', token, { expires: 7, path: '/' })
                    alert('소셜계정으로 로그인에 성공하였습니다. (1)')
                } else {
                    alert('소셜 로그인에 실패하였습니다.')
                }

            } else {

                let msg = data.reason || ''
                if (data.reason === 'already_email') {
                    msg = '[' + payload.email + '] 은 이미 회원으로 가입된 이메일 입니다.\n소셜계정의 이메일을 수정하시거나 아이디/비밀번호찾기 메뉴를 이용해 주세요.'
                }
                alert(msg)
            }

            window.location.href = (!!query.referer) ? query.referer : '/'

        }).catch(e => {
            alert('로그인/가입중 오류가 발생했습니다. 잠시후 다시시도해주세요\n\n' + e.message)
            window.location.href = (!!query.referer) ? '/auth/signin?referer=' + query.referer : '/auth/signin'
        })

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

    render () {

        const { ssoData, ssoStatus, query } = this.state

        return (<>

            {(!ssoData) &&
            <div id={'signin'}>
                <div className="signin_signup signin_social">
                    <NaverLogin
                        showButton={false}
                        onSuccess={(result, e) => this.handleNvSubmit(result, e)}
                        onFailure={(result) => {
                            console.error(result)
                            alert('네이버 로그인에 실패하였습니다.')
                        }}
                    />
                </div>
            </div>
            }

            {(!!ssoData && ssoStatus !== 'aleady_joined') && <>
                <Header/>
                <div id={'signin'}>
                    <SigninMain ssoData={ssoData} ssoStatus={ssoStatus} referer={query.referer} />
                </div>
                <Footer/>
            </>}

        </>)
    }
}

export default NvSigninCallback