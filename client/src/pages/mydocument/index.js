import React, { Component, Fragment } from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
// import 'scss/mypage/userdocument.scss'
import User from 'utils/user'
import API from 'utils/apiutil'

const Header = dynamic(() => import('components/common/header_new'), { ssr: false })
const Common = dynamic(() => import('components/mypage/common'), { ssr: false })
const CompleteDoc = dynamic(() => import('components/mypage/complete_doc'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })
const Stars = dynamic(() => import('components/common/stars'), { ssr: false })
const Modal = dynamic(() => import('components/common/modal'), { ssr: false })
const MobileNav = dynamic(() => import('components/mypage/mobileNav'), { ssr: false })
const Pacakge = dynamic(() => import('components/mypage/package'), { ssr: false })
const Subscription = dynamic(() => import('components/mypage/subscription'), { ssr: false })
const MemberDocumentRequest = dynamic(() => import('components/member/member_document_request'), { ssr: false })

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
            subscriptionEnddate: null
        }
        this.userInfo = User.getInfo()
        if (!!this.userInfo && this.userInfo.account_type === 'A') {
            window.location = '/lawyer/mydocument'
        }
    }

    handleChange = (e, t) => {
        if (t === 'reviewWrite') {
            let value = e.target.value
            this.setState({
                reviewWrite: value
            })
        }

        if (t === 'selectDocument') {
            let value = e.target.value.split('|')
            this.setState({
                    selectedCategory: value[0],
                    selectedDocument: value[1]
                }, () => {
                    // console.log( value, this.state.selectedCategory, this.state.selectedDocument )
                }
            )

        }
    }

    starSelectorShow = (e) => {
        if (this.state.starSelectorShow === 'none') {
            this.setState({ starSelectorShow: 'inline-block' })
        } else {
            this.setState({ starSelectorShow: 'none' })
        }
    }

    selectStar (e, score, text) {
        this.setState({
            selectedScore: score,
            selectedScoreText: text
        }, () => {
            this.setState({
                starSelectorShow: 'none'
            })
        })

    }

    writeReview () {

        let userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후에 이용해 주세요.')
            return false
        }
        if (!this.state.reviewWrite) {
            alert('후기 내용을 입력해주세요.')
            this.textArea.focus()
            return false
        }
        if (this.state.reviewWrite.length < 1) {
            alert('후기 내용을 입력해주세요.1')
            this.textArea.focus()
            return false
        }
        if (!this.state.selectedDocument) {
            alert('문서를 선택해주세요.')
            this.inputSelect.focus()
            return false
        }
        if (!this.state.selectedCategory) {
            alert('문서를 선택해주세요.')
            this.inputSelect.focus()
            return false
        }

        let params = {
            content: this.state.reviewWrite,
            score: this.state.selectedScore,
            document: this.state.selectedDocument,
            category: this.state.selectedCategory
        }

        API.sendPost('/user/reviewWrite', params).then((result) => {

            this.setState({
                reviewWrite: '',
                reviewOpen: false
            }, function () {
                alert('등록되었습니다.')
            })

        })
    }

    componentDidMount () {

        let params = {
            sort: 'desc'
        }
        API.sendPost('/user/reviewableDocs', params).then((result) => {
            if (result.status === 'ok') {
                if (result.data.data.length > 0) {
                    this.setState({
                        reviewOpen: false,
                        reviewableDocs: result.data.data
                    })
                }
            }
        })

        const location_hash = window.location.hash.replace('#', '')
        if (location_hash === 'package') {
            this.setState({ showListFor: 'P', listType: 'package' })
        }
        if (location_hash === 'subscription') {
            this.setState({ showListFor: 'S', listType: 'subscription' })
        }
    }

    toggle1 () {
        this.setState({ addClass: true })
    }

    toggle2 () {
        this.setState({ addClass: false })
    }

    openReview = () => {
        this.setState({
            reviewOpen: true
        })
    }
    closeReview = () => {
        this.setState({
            reviewOpen: false
        })
    }

    setDocsPage = (page) => {
        this.setState({
            docPage: page
        })
    }

    setPackageEnddate = (date) => {
        this.setState({
            packageEnddate: date
        })
    }

    setSubscriptionEnddate = (date) => {
        this.setState({
            subscriptionEnddate: date
        })
    }

    render () {

        const bg = {
            paddingTop: 0,
            paddingBottom: 48,
            margin: '0 auto 0'
        }
        const common = {}
        const field = {
            // width: 998,
            // float: 'left',
            // paddingBottom: '48px',
        }

        const starSelector = [20, 40, 60, 80, 100]
        const starSelectorDesc = ['아주 좋아요', '좋아요', '보통이에요', '그저 그래요', '별로에요']

        let category = { 1: '내용증명', 2: '위임장', 3: '지급명령', 4: '합의서', 99: '기업문서' }

        // for(var i=20;i<=100;i+=20) {
        //     starSelector.push(i)
        // }

        return (
            <div className="mypage">
                <Header theme='dark' styles={{ position: 'absolute' }}/>
                <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                {/* <div> */}
                <div style={bg} className='my_document_wrap'>
                    <Common active="mydocument"/>
                    <MobileNav active={1}/>
                    {(!!this.userInfo) &&
                    <div className="lists">
                        <ul className="list-for">
                            <li className={this.state.showListFor === 'A' ? 'active' : ''} onClick={() => this.setState({ showListFor: 'A', listType: 'all' })}>전체 문서</li>
                            {/* <li className={this.state.showListFor === 'P' ? 'active' : ''} onClick={() => this.setState({ showListFor: 'P', listType: 'package' })}>정기권 문서</li> */}
                            <li className={`${this.state.showListFor === 'S' ? 'active' : ''}`} onClick={() => this.setState({ showListFor: 'S', listType: 'subscription' })}>정기권 문서</li>
                            <li className={`mobile_hide ${this.state.showListFor === 'L' ? 'active' : ''}`}
                                onClick={() => this.setState({ showListFor: 'L', listType: 'lawyer' })}>변호사 서비스 신청 문서
                            </li>
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
                                {this.state.showListFor === 'P' && <Pacakge setDocsPage={this.setDocsPage} setPackageEnddate={this.setPackageEnddate}/> /** 패키지 */}
                                {this.state.showListFor === 'S' && <Subscription setDocsPage={this.setDocsPage} setSubscriptionEnddate={this.setSubscriptionEnddate}/> /** 정기권 */}
                                {this.state.showListFor === 'L' && <MemberDocumentRequest/> /** 변호사첨삭 */}

                            </div>

                            <div className='complete_section'>
                                <CompleteDoc openReview={this.openReview} page={this.state.docPage} listType={this.state.listType} subscriptionEnddate={this.state.subscriptionEnddate}/>
                                {this.state.listType === 'package' &&
                                <ul className="package-cautions">
                                    <li>선택한 문서는 위의 문서리스트에서 관리됩니다 (정기권이 아닌 별도 구매 문서는 "내 문서 보관함 > 전체 문서"를 확인해주세요)</li>
                                    <li>선택한 문서에 따라 다양한 부가서비스를 활용 가능합니다.</li>
                                </ul>
                                }
                            </div>

                        </div>
                    </div>
                    }
                </div>

                <Modal
                    open={this.state.reviewOpen}
                    onClose={(e) => this.setState({ reviewOpen: false })}
                    width={700}
                    height={655}
                    className="show-write-review"
                    scroll="body"
                >
                    <div className="default-dialog-title" style={{ textAlign: 'left' }}>이용 후기
                        <span className="close" onClick={(e) => this.setState({ reviewOpen: false })}><img src="/common/close-white.svg"/></span>
                    </div>
                    <div className="content">
                        <h4>로폼의 문서를 구매 후 이용 후기를 작성해주시면, 커피쿠폰을 보내드립니다 !</h4>
                        <div className="write">
                            <select className="selectDocument" onChange={(e) => this.handleChange(e, 'selectDocument')} ref={(input) => { this.inputSelect = input }}>
                                <option value="">문서 선택</option>
                                {
                                    this.state.reviewableDocs.map((item, key) =>
                                        <option value={item.idcategory_1 + '|' + item.iddocuments} key={key}>{item.title}</option>
                                    )
                                }
                            </select>
                            <div className="selectScore" onClick={(e) => this.starSelectorShow(e)} ref={this.setWrapperRef}>
                                <Stars score={this.state.selectedScore} text={this.state.selectedScoreText}/>
                                <ul className="starSelector" style={{ display: this.state.starSelectorShow }}>
                                    {
                                        // !!userInfo &&
                                        starSelector.reverse().map((item, key) =>
                                            <li onClick={(e) => this.selectStar(e, item, starSelectorDesc[key])} key={key}><Stars score={item} text={starSelectorDesc[key]}/></li>
                                        )
                                    }
                                </ul>
                            </div>
                            <textarea onChange={(e) => this.handleChange(e, 'reviewWrite')} value={this.state.reviewWrite} id="reviewWrite"
                                      ref={(input) => { this.textArea = input }}/>
                            <button type="button" onClick={() => this.writeReview()}>후기 작성</button>
                        </div>
                        <div className="cautions">
                            <h3>기타사항</h3>
                            <ol>
                                <li>중복 참여가 불가능합니다.</li>
                                <li>개인 정보 수집 및 이용은 회원 가입 시 동의하신 내용을 바탕으로 하며, 자세한 사항은 개인정보 처리방침을 참고해주세요.</li>
                                <li>이벤트 경품 발송을 위해 회원님의 이름과 전화번호를 이용합니다. 문의사항은 고객센터로 연락 주시기 바랍니다.</li>
                                <li>관련없는 내용 및 고의적인 비방글은 삭제될 수 있습니다.</li>
                                <li>위임장 등의 무료문서 작성 및 문서 작성이벤트 참여 고객은 경품에서 제외됩니다.</li>
                            </ol>
                        </div>
                    </div>
                </Modal>


                <Footer/>

            </div>
        )
    }
}

export default Mydocument