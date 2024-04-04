import React, { Component } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import helper_url from 'helper/helper_url'

import Seo from 'components/common/seo'
import { metaDataService } from 'components/common/metas'

const Header = dynamic(() => import('components/common/header_new'),{ssr:false})
const Footer = dynamic(() => import('components/common/footer'),{ssr:false})
const Qna = dynamic(() => import('components/customer/qna'),{ssr:false})

class LawyerQna extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div className="magazine lawyer">
                <Seo metaData={metaDataService}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} active={'lawyer_qna'}/>
                <div className="main">
                    <div className="visual">
                        <h2>로폼 고객센터</h2>
                    </div>
                    <div className="container-blog lawyer-contract-review contents">
                        <ul className="tabs">
                            <li className={'active'}><Link href={helper_url.service.member.qna} as={helper_url.service.member.qna}>1:1 이용문의</Link></li>
                        </ul>
                        <div className='my_question_wrap lawyer-contract-wrap'>
                            <Qna lawyer_view={true}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}
export default LawyerQna