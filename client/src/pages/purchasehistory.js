import React, { Component, Fragment } from 'react'
import dynamic from 'next/dynamic'
import User from 'utils/user'

const Header = dynamic(() => import('components/common/header_new'), { ssr: false })
const Common = dynamic(() => import('components/mypage/common'), { ssr: false })
const PurchaseDocument = dynamic(() => import('components/mypage/purchase_document'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })
const MobileNav = dynamic(() => import('components/mypage/mobileNav'), { ssr: false })

class Purchasehistory extends Component {
    constructor (props) {
        super(props)
        this.state = { addClass: false }
        this.userInfo = User.getInfo()
    }

    render () {
        const field = {
            // width: 998,
            // float: 'left',
            // paddingBottom: '48px'
            clear: 'both'
        }

        return (
            <div className="mypage">
                <Header theme='dark' styles={{ position: 'absolute' }}/>
                <div className='purchase_history_wrap'>
                    <div>
                        <Common active="purchasehistory"/>
                        <MobileNav active={2}/>
                    </div>
                    {(!!this.userInfo) &&
                    <>
                        <div style={field}>
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
                    </>
                    }
                </div>
                <div>
                    <Footer/>
                </div>
            </div>
        )
    }
}

export default Purchasehistory