import React, { Component } from 'react'
import Link from 'next/link'
import CompleteDoc from 'components/mypage/complete_doc'
import User from 'utils/user'
import MobileNav from 'components/mypage/mobileNav'
import helper_url from 'helper/helper_url'

// import 'scss/mypage/userdocument.scss'
// import 'scss/magazine.scss'
// import 'scss/page/lawyer/contract.scss'

class Mydocument extends Component {
    constructor (props) {
        super(props)
        this.state = {
            addClass: false,
            reviewOpen: false,
            reviewableDocs: [],
            starSelectorShow: 'none',
            selectedScore: 100,
            showListFor: 'A' /** A:all, L:변호사 , P:패키지 */,
            userPackage: null,
            listType: 'all',
            category: 1,
            ui: {
                tab: 1,
                categoryTab: 1
            }
        }

        let userInfo = User.getInfo()
        if (!userInfo || userInfo.account_type !== 'A') {
            alert('변호사 로그인 후에 이용해 주세요.')
            window.location = '/'
        }
    }

    setTabs = (tab) => {

    }

    setCategoryTabs = (tab) => {
        let state = this.state
        state.ui.categoryTab = tab
        this.setState(state)
    }

    render () {

        const bg = {
            paddingTop: 0,
            paddingBottom: 48,
            margin: '0 auto 0'
        }

        const category = [
            {category: 1, name: '내용증명'},
            {category: 2, name: '위임장'},
            {category: 3, name: '지급명령'},
            {category: 4, name: '합의서'},
            {category: 99, name: '기업문서'}
        ]

        // for(var i=20;i<=100;i+=20) {
        //     starSelector.push(i)
        // }

        return (
            <div className="main">
                <div className="visual">
                    <h2>내 문서 보관함</h2>
                    <h3 className="mobile_hide">법률문서자동작성으로 구매한 문서 리스트입니다.</h3>
                </div>

                <div className="container-blog lawyer-contract-review contents">
                    <ul className="tabs">
                        <li className={'active'}><Link href={helper_url.service.member.document_list} as={helper_url.service.member.document_list}><a>구매한 문서</a></Link></li>
                        <li><Link href={helper_url.service.member.purchasehistory} as={helper_url.service.member.purchasehistory}><a>구매내역</a></Link></li>
                        <li><Link href={helper_url.service.member.myquestion} as={helper_url.service.member.myquestion}><a>1:1 문의 내역</a></Link></li>
                    </ul>

                    <div className='my_document_wrap lawyer-contract-wrap'>
                        <MobileNav active = {1}/>
                        <div className="lists">
                            <ul className="list-for">
                                {
                                    category.map((item, key) => {
                                        return (
                                            <li className={this.state.ui.categoryTab === item.category ? 'active' : null} onClick={() => this.setCategoryTabs(item.category)}><a>{item.name}</a></li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="wrap_writingdoc">

                                <div className="writingdoc_top">
                                    {this.state.showListFor === 'A' && /** 전체 */
                                    <div className="document_guide">
                                        <ul>
                                            <li>문서는 구매 후 7일 동안 작성 가능하며, 6개월 동안 자동으로 보관됩니다.</li>
                                            <li>정기권 및 이벤트를 통해 구매한 문서는 작성기간과 보관기간이 상이할 수 있습니다.</li>
                                            <li>작성기간 내에는 언제든지 작성과 편집이 가능합니다.</li>
                                            <li>보관기간 내에는 언제든지 다운로드 또는 인쇄가 가능합니다.</li>
                                            <li>작성기간 및 보관기간이 만료된 경우에는 기간연장을 통해 편집 또는 보관이 가능합니다.</li>
                                        </ul>
                                    </div>
                                    }
                                </div>

                                <div className='complete_section'>
                                    <CompleteDoc openReview={this.openReview} page={this.state.docPage} listType={this.state.listType} category={this.state.ui.categoryTab}/>
                                    {this.state.listType === 'package' &&
                                    <ul className="package-cautions">
                                        <li>선택한 문서는 위의 문서리스트에서 관리됩니다 (정기권이 아닌 별도 구매 문서는 "내 문서 보관함 > 전체 문서"를 확인해주세요)</li>
                                        <li>선택한 문서에 따라 다양한 부가서비스를 활용 가능합니다.</li>
                                    </ul>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Mydocument