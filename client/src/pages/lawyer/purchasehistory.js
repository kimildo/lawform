import React, { Component } from 'react'
import { metaDataService } from '../../components/common/metas'
import Seo from '../../components/common/seo'
import Link from 'next/link'
import helper_url from '../../helper/helper_url'
import MobileNav from '../../components/mypage/mobileNav'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../../components/common/header_new'),{ssr:false})
const PurchaseDocument = dynamic(() => import('../../components/mypage/purchase_document'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})


export default class LawyerPurchasehistory extends Component {

    constructor (props) {
        super(props)
        this.state = {
            'ui': {},
            'data': {
                // 'request_type': props.match.params.request_type
            },
            'msg': {}
        }
    }

    render () {
        return (
            <div className="magazine lawyer">
                <Seo metaData={metaDataService}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true}/>

                <div className="main">
                    <div className="visual">
                        <h2>내 문서 보관함</h2>
                        <h3 className="mobile_hide">법률문서자동작성으로 구매한 문서 리스트입니다.</h3>
                    </div>

                    <div className="container-blog lawyer-contract-review contents">

                        <ul className="tabs">
                            <li><Link href={helper_url.service.member.document_list} as={helper_url.service.member.document_list}><a>구매한 문서</a></Link></li>
                            <li className={'active'}><Link href={helper_url.service.member.purchasehistory} as={helper_url.service.member.purchasehistory}><a>구매내역</a></Link></li>
                            <li><Link href={helper_url.service.member.myquestion} as={helper_url.service.member.myquestion}><a>1:1 문의 내역</a></Link></li>
                        </ul>

                        <div className='purchase_history_wrap lawyer-contract-wrap'>
                            <div>
                                <MobileNav active = {2}/>
                            </div>
                            <div style={{clear:'both'}}>
                                <div className="wrap_writingdoc">
                                    <div className="writingdoc_top">
                                        <div className="document_guide">
                                            <ul>
                                                <li>구매한 문서는 구입시점으로부터 7일동안 자유로운 편집이 가능하며 6개월동안 자동으로 보관됩니다.</li>
                                                <li>문서는 "내 문서 보관함 > 작성하기" 를 통해 작성해주세요.</li>
                                                <li>환불 및 기타 영수증(세금계산서) 발급 문의는 1:1 문의를 이용해주세요.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <PurchaseDocument/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}