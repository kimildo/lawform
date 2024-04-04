import React, { Component } from 'react'
import Link from 'next/link'
import { Helmet } from 'react-helmet'
import dynamic from 'next/dynamic'
import User from '../../../utils/user'

const Header = dynamic(() => import('../../../components/common/header_new'),{ssr:false})
const ContractReview = dynamic(() => import('../../../components/lawyer/contract_review'),{ssr:false})
const Footer = dynamic(() => import('../../../components/common/footer'),{ssr:false})



class LawyerContractReview extends Component {

    constructor (props) {
        super(props)
        this.state = {
            ui: {},
            data: {},
            msg: {}
        }

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
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} active={3}/>
                <ContractReview/>
                <Footer/>
            </div>
        )
    }
}

export default LawyerContractReview
