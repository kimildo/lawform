import React, { Component } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { metaDataService } from 'components/common/metas'
import { Helmet } from 'react-helmet'
import User from 'utils/user'

const Header = dynamic(() => import('components/common/header_new'),{ssr:false})
const Footer = dynamic(() => import('components/common/footer'),{ssr:false})
const ContractRequest = dynamic(() => import('components/lawyer/contract_request'),{ssr:false})

class Request extends Component {

    constructor (props) {
        super(props)
        const user = User.getInfo()
        if (process.browser) {
            if (!user) {
                alert('로그인 후에 이용해 주세요.')
                window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
                return
            }
            if (user.account_type !== 'A') {
                alert('접근 권한이 없습니다.')
                window.location.href = '/'
            }
        }
    }

    render () {
        return (
            <div className="magazine lawyer">
                <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} active={'lawyer_contract_request'}/>
                <ContractRequest/>
                <Footer/>
            </div>
        )
    }
}

export default Request
