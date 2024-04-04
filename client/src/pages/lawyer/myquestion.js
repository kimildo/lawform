import React, { Component } from 'react'
import Seo from '../../components/common/seo'
import { metaDataService } from '../../components/common/metas'
import Link from 'next/link'
import helper_url from '../../helper/helper_url'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../../components/common/header_new'),{ssr:false})
const Userquestion = dynamic(() => import('../../components/mypage/userquestion'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})

class LawyerMyquestion extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {

        return (

            <div className="magazine lawyer">
                <Seo metaData={metaDataService}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} />

                <div className="main">
                    <div className="visual">
                        <h2>내 문서 보관함</h2>
                        <h3 className="mobile_hide">법률문서자동작성으로 구매한 문서 리스트입니다.</h3>
                    </div>

                    <div className="container-blog lawyer-contract-review contents">
                        <ul className="tabs">
                            <li><Link href={helper_url.service.member.document_list} as={helper_url.service.member.document_list}>구매한 문서</Link></li>
                            <li><Link href={helper_url.service.member.purchasehistory} as={helper_url.service.member.purchasehistory}>구매내역</Link></li>
                            <li className={'active'}><Link href={helper_url.service.member.myquestion} as={helper_url.service.member.myquestion}>1:1 문의 내역</Link></li>
                        </ul>

                        <div className='my_question_wrap lawyer-contract-wrap'>
                            <Userquestion/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

}

export default LawyerMyquestion