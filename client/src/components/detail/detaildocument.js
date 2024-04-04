import React, { Component, Fragment } from 'react'
// import StarRatings from 'react-star-ratings';
// import ReactPlayer from 'react-player'
import NumberFormat from 'react-number-format'
// import '../../scss/detail/detaildocument.scss'
import Carousel from 'nuka-carousel'
import API from '../../utils/apiutil'
import User from '../../utils/user'
import jQuery from 'jquery'
import { Helmet } from 'react-helmet'
import Detailcontent from './detailcontent'
import ReactGA from 'react-ga'

window.$ = window.jQuery = jQuery

let docuPreviewUrl = 'https://s3.ap-northeast-2.amazonaws.com/lawform/document_preview/'
let detaPageUrl = 'https://s3.ap-northeast-2.amazonaws.com/lawform/detail_page/'

class Detaildocument extends Component {

    account = () => {
        this.setState({
            tab: '1',
        })
    }

    card = () => {
        this.setState({
            tab: '2',
        })
    }

    loginCheckBeforePayment = () => {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
        } else {
            let param = {
                host: window.location.hostname
            }
            API.sendPost('/user/state', param).then((res) => {
                if (this.state.docData.dc_price === 0) { // 무료 문서
                    let param = {
                        isFree: true,
                        iddocuments: this.props.doc,
                        name: this.state.docData.title
                    }
                    API.sendPost('/payments', param).then((res) => {
                    })
                    let r = window.confirm('내 문서함 보관함에 추가 되었습니다. \r\n내 문서 보관함으로 이동하시겠습니까?') // 사실은 payments 이후에 호출 되어야 하나 중복 클릭 방지 하기 위해 여기 위치
                    if (r === true) {
                        window.location.href = '/mydocument'
                    }
                } else {
                    window.location.href = '#payment'
                    ReactGA.pageview(window.location.pathname + '#payment', null, '문서 결제')
                }
            })
        }
    }

    inputDiscountCode = (e) => {
        this.setState({ discountCode: e.target.value.toUpperCase() })
        console.log('code :', this.state.discountCode)
    }

    payPromotion = () => {
        console.log('promo_code :', this.state.discountCode)
        let promoCode = this.state.discountCode.trim()
        if (promoCode === 'PATENT83CH') {
            this.setState({ discount: this.state.promotion.PATENT83CH.discount })
            alert(this.state.promotion.PATENT83CH.display + '원 할인 프로모션이 적용되었습니다.')
        } else if (promoCode === '') {
            alert('프로모션코드를 입력해주세요.')
        } else {
            alert('사용할 수 없는 코드입니다.')
        }
    }

    onPayment = (id) => {
        const IMP = window.IMP

        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
            ReactGA.pageview(window.location.pathname + '#signin', null, '로그인')
        }
        /**ga*/
        let gaDocData = {
            sku: this.state.docData.name,
            price: this.state.docData.price,
            category: this.state.docData.idcategory_1,
            discount: this.state.discount
        }

        /**ga*/
        let thisClass = this
        let type = (this.state.tab === '1') ? 'trans' : 'card'
        let paymentOpt = {
            pg: 'kicc.IM000020',
            pay_method: type,
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: this.state.docData.title,
            amount: this.state.docData.dc_price - this.state.discount,
            buyer_email: userInfo.email,
            buyer_name: userInfo.username,
            buyer_tel: '02-6925-0227',
            buyer_addr: '서울특별시 강남구 테헤란로 126 GT 대공빌딩 11층',
            buyer_postcode: '123-456',
            m_redirect_url: 'https://lawform.io/payment?paid_amount=' + (this.state.docData.dc_price - this.state.discount) + '&iddocuments=' + thisClass.props.doc
        }

        /**
         * 로컬이나 데브일경우 테스트 계정
         */
        if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') {
            paymentOpt.pg = 'kicc'
        }

        IMP.request_pay(paymentOpt,
            (rsp) => {
                let msg
                if (rsp.success) {
                    msg = '결제가 완료되었습니다.'
                    let param = rsp
                    param.iddocuments = thisClass.props.doc
                    param.discount = gaDocData.discount
                    API.sendPost('/payments', param).then((res) => {
                        window.location.href = '/mydocument'
                    }).catch((err) => {
                        console.log(err)
                    })
                    /** Ga */
                    ReactGA.plugin.require('ecommerce')
                    ReactGA.plugin.execute('ecommerce', 'addItem', {
                        id: rsp.merchant_uid,
                        name: rsp.name,
                        sku: gaDocData.sku,
                        price: gaDocData.price,
                        category: gaDocData.category,
                        quantity: '1',
                    })
                    ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                        id: rsp.merchant_uid,
                        revenue: rsp.paid_amount,
                    })
                    ReactGA.plugin.execute('ecommerce', 'send')
                    ReactGA.plugin.execute('ecommerce', 'clear')
                    /** /Ga */
                } else {
                    msg = '결제가 취소되었습니다.'
                    // window.location.href = "/detail/"+this.props.doc;
                    window.location.href = '/detail/' + id
                    // this.props.history.goBack();
                }
                alert(msg)
            }
        )
    }

    onPromotion = () => {
        // const IMP = window.IMP;
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
        }
        let code = window.$('.code_input').val().trim()
        let promotion = (this.props.doc === '20' || this.props.doc === '26') ? 'promotion1' : ''
        if (promotion === '') {
            alert('프로모션 상품이 아닙니다.')
            return false
        }
        let param = {
            code: code,
            promotion: promotion,
            iddocuments: this.props.doc,
            name: this.state.docData.title
        }
        API.sendPost('/payments/promotion', param).then((res) => {
            var msg
            if (res.status === 'ok') {
                msg = '내 문서함 보관함에 추가 되었습니다. \r\n내 문서 보관함으로 이동하시겠습니까?'
                let r = window.confirm(msg)
                if (r === true) {
                    window.location.href = '/mydocument'
                } else {
                    window.location.href = '#close'
                    window.$('.code_input').val('')
                }
            } else {
                msg = '사용할 수 없는 프로모션 코드입니다.'
                alert(msg)
            }
        })

    }

    promotion = () => {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
        } else {
            // alert('promotion');
            window.location.href = '#promotion'
            ReactGA.pageview(window.location.pathname + '#promotion', null, '프로모션 코드 등록')
        }
    }

    componentDidMount () {
        // API.sendGet('/user/info').then((res) => {
        //     if(res.data.status !== 'error'){
        //     const userData = res.data.userData;
        //     this.setState({ tester: userData.tester });
        //     }
        // });
        let doc = this.props.doc
        API.sendGet('/documents/document/' + doc)
            .then(res => {
                const documentData = res.data[0]
                if (documentData.idcategory_1 === 1) {
                    window.location.href = '/preview/' + doc
                }
                if (documentData.description) {
                    for (var i = 0; i < documentData.description.length; i++) {
                        documentData.description[i].descOpen = false
                    }
                    documentData.description[0].descOpen = true
                } else {
                    window.location.href = '/'
                }
                this.setState({ docData: documentData })
            })
        this.setState({
            tab: '2',
        })

        setTimeout(() => {
            this.setState({ balloonClass: 'balloon' })
            setInterval(() => {
                    if (this.state.balloonClass === 'balloon animated bounce') {
                        this.setState({ balloonClass: 'balloon' })
                    } else {
                        this.setState({ balloonClass: 'balloon animated bounce' })
                    }
                },
                2500
            )
        }, 1500)

    }

    constructor (props) {
        super(props)
        this.state = {
            playing: false,
            docData: {},
            balloonClass: 'balloon animated bounce',
            tester: '',
            discount: 0,
            discountCode: '',
            promotion: {
                PATENT83CH: {
                    discount: '5000',
                    display: '5,000'
                },
            }
        }
        const IMP = window.IMP
        IMP.init('imp91690618')
    }

    changeRating (newRating, name) {
        this.setState({
            rating: newRating
        })
    }

    btnToggleDesc = (e) => {
        if (!this.state.docData.description !== null) {
            let docData = this.state.docData
            if (docData.description[e.target.id].descOpen === true) docData.description[e.target.id].descOpen = false
            else {
                for (let i = 0; i < docData.description.length; i++) {
                    docData.description[i].descOpen = false
                }
                docData.description[e.target.id].descOpen = true
            }

            this.setState({ docData: docData })
        }
    }

    categoryLink (linkData) {
        window.location.href = '/detail/' + linkData
    }

    linkCategory (linkData) {
        window.location.href = '/categorydetail/' + linkData
    }

    subTitle (data) {
        if ((data.indexOf('(') != -1) && (data.indexOf(')') != -1)) {
            let title = data.split('(')[0]
            let desc = data.split('(')[1]
            desc = desc.split(')')[0]
            let startIndex = data.indexOf('(') + 1
            let endIndex = data.indexOf(')')
            return (
                <Fragment>
                    <div>{title}</div>
                    <div>({desc})</div>
                </Fragment>
            )
        } else {
            return data
        }
    }

    render () {
        let display = {}
        let toggle_account
        let toggle_card
        let card_image
        let account_image
        let s3Doc = [1, 3, 5, 7, 9, 10, 21, 22, 23, 24]

        if (this.state.playing === true) {
            display = {
                display: 'none',
                color: '#3949ab'
            }
        }

        let detail_description_a = ['detail_description_a']

        if (this.state.tab === '1') {
            toggle_card = {
                backgroundColor: 'white',
                color: '#4d5256',
                borderLeft: 'none'
            }

            toggle_account = {
                backgroundColor: '#f0f3f8',
                color: '#3949ab',
                borderRight: 'solid 1px'
            }

            card_image = '/detail_img/card_off.png'
            account_image = '/detail_img/account_on.png'
        }

        if (this.state.tab === '2') {
            toggle_card = {
                backgroundColor: '#f0f3f8',
                color: '#3949ab',
                borderLeft: 'solid 1px'
            }
            toggle_account = {
                backgroundColor: 'white',
                color: '#4d5256',
                borderRight: 'none'
            }
            card_image = '/detail_img/card_on.png'
            account_image = '/detail_img/account_off.png'
        }

        if (!!this.state.docData && this.state.docData !== null) {
            let meta_title
            let title
            let description
            let keyword
            switch (this.state.docData.idcategory_1) {
                case 1:
                    meta_title = '전문변호사가 만든 저렴한 내용증명 자동작성'
                    title = '로폼 - ' + meta_title
                    description = '전문 변호사가 작성한 각종 법률문서, 계약서 양식. 온라인상에서 저렴한 자동작성 가능!'
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈'
                    break

                case 2:
                    meta_title = '전문변호사가 만든 저렴한 위임장 자동작성'
                    title = '로폼 - ' + meta_title
                    description = '전문 변호사가 작성한 각종 위임장 양식, 온라인상에서 전문적인 자동작성, 무료 작성'
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈'
                    break

                case 3:
                    meta_title = '전문변호사가 만든 저렴한 지급명령 자동작성'
                    title = '로폼 - ' + meta_title
                    description = '전문 변호사가 작성한 각종 지급명령 양식! 온라인에서 쉽고 저렴한 자동작성! 50%할인 '
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈'
                    break

                case 4:
                    meta_title = '전문변호사가 만든 저렴한 합의서 자동작성'
                    title = '로폼 - ' + meta_title
                    description = '전문 변호사가 작성한 각종 합의서 양식, 온라인에서 전문적이고 저렴한 자동작성, 50%할인'
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈'
                    break
            }
            let startup
            if (!!this.state.docData) {
                startup = this.state.docData.idcategory_1
            }
            return (
                <div className="wrap_detaildocument">
                    <div className="detaildocument">
                        <div className="detail_preview">
                            <div className="preview_image">
                                {/* <img src="/detail_img/0djEPHz1S7E
                            .png" width="460" height="660" alt="detail-document"></img> */}
                                <img src={docuPreviewUrl + this.state.docData.idcategory_1 + '.svg'} width="290" height="390" alt="detail-document"></img>
                            </div>
                        </div>
                        <div className="detail_context">
                            <div className="detail_title">
                                {this.state.docData.title}
                            </div>
                            {/* <div className="detail_favorite">
                                <img src="/detail_img/favorite_on.png" alt="favorite_on"></img>
                            </div> */}
                            <div className="detail_rating">
                                {/* <StarRatings starRatedColor="#ffa400" rating={4.4} starDimension="20px" starSpacing="2px" /> */}
                                {/* <span>&nbsp;&nbsp;&nbsp;평점</span>  <span className="detail_rating_number">&nbsp;4.4</span> */}
                            </div>
                            <div className="detail_category">
                                <a href="/">
                                    <div className="detail_categoryhome">법률문서 자동작성</div>
                                </a>
                                <div className="wrap_detail_arrow">
                                    <div className="detail_arrow"><img src="/detail_img/ic-navigation-depth-20-px.png"></img></div>
                                </div>
                                <div className="detail_categorytext" onClick={() => this.linkCategory(this.state.docData.idcategory_1)}>{this.state.docData.name}</div>
                                {/* <div className="wrap_detail_arrow"><div className="detail_arrow"><img src="/detail_img/ic-navigation-depth-20-px.png"></img></div></div>
                                <div>{this.state.docData.category_2}</div> */}
                            </div>
                            {this.state.docData.dc_rate !== 0 &&
                            <div className="detail_saleprice">
                                <strike><NumberFormat value={this.state.docData.price} displayType={'text'} thousandSeparator={true}></NumberFormat> 원 </strike>
                            </div>
                            }
                            <div className="detail_price">
                                {this.state.docData.dc_price !== 0 && startup !== 99 &&
                                <span><NumberFormat value={this.state.docData.dc_price} displayType={'text'} thousandSeparator={true}></NumberFormat> 원</span>}
                                {this.state.docData.dc_price === 0 && startup !== 99 && <span>무료</span>}
                                {this.state.docData.dc_rate !== 0 && startup !== 99 && <span className="detail_discount">( {this.state.docData.dc_rate}% 할인 )</span>}
                                {startup === 99 &&
                                <div className="detail_promotion"><strong style={{ borderBottom: '1px solid' }}>‘스타트업 전용 회원 서비스’</strong> 입니다.<br></br>서비스 신청은 &apos;이용 문의&apos;에
                                    남겨주세요!</div>}
                                {/* <img className="detail_buy_doc" src="/detail_img/buy_doc.png" alt="buy_doc" onClick={this.loginCheckBeforePayment} ></img> */}
                                {startup !== 99 &&
                                <span className="buy_wrap"><img className={this.state.balloonClass} id="balloon_openevent" src="/detail_img/balloon_openevent_e0531.png"
                                                                alt="오픈기념 50%할인"></img><img className="detail_buy_doc" src="/detail_img/write_doc.png" alt="작성하기"
                                                                                            onClick={this.loginCheckBeforePayment}></img></span>}
                                {startup === 99 &&
                                <img style={{ marginTop: '-65px', paddingBottom: '40px' }} className="detail_buy_doc" width='182' height='48' src="/detail_img/promotion.png"
                                     alt="promotion" onClick={this.promotion}></img>}
                            </div>
                            <div className="detail_point">
                                {/* +포인트 <span className="detail_point_percent">10% 적립</span> */}
                            </div>

                            <div className="detail_description">
                                {
                                    this.state.docData.description && this.state.docData.description.map((Items, index) =>
                                        <div>
                                            <div className='detail_description_q'>
                                                <div id={index} className="detail_description_q_title" onClick={this.btnToggleDesc.bind(this)}>
                                                    {Items.title}
                                                </div>
                                                <div id={index} className="detail_description_q_tab" onClick={this.btnToggleDesc.bind(this)}>
                                                    {Items.descOpen === true &&
                                                    <img id={index} style={{ marginBottom: '-5px' }} className='detail_img_tab' alt="minus_btn" src="/detail_img/minus.png"></img>}
                                                    {Items.descOpen === false &&
                                                    <img id={index} style={{ marginBottom: '-5px' }} className='detail_img_tab' alt="plus_btn" src="/detail_img/plus.png"></img>}
                                                </div>
                                            </div>
                                            {Items.descOpen === true &&
                                            <div id={index} className={detail_description_a.join(' ')}>
                                                <div className="detail_description_a_context">
                                                        <span dangerouslySetInnerHTML={{ __html: Items.context }}>
                                                        </span>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="detailmiddle">
                        {
                            (s3Doc.indexOf(this.state.docData.iddocuments) !== -1) ?
                                <Detailcontent iddocuments={this.state.docData.iddocuments}></Detailcontent>
                                :
                                <Fragment>
                                    <img src={detaPageUrl + 'detail' + this.state.docData.iddocuments + '_1.jpg'} alt="detail-document"></img>
                                    {startup !== 99 && <div><img src={detaPageUrl + 'detail' + this.state.docData.iddocuments + '_2.jpg'} alt="detail-document"></img></div>}
                                    <div className="video_wrap">
                                        <img src={detaPageUrl + 'detail' + this.state.docData.iddocuments + '_3.jpg'} alt="detail-document"></img>
                                        <iframe style={{ top: 138, left: 777, position: 'absolute', border: 0 }} width="428" height="267"
                                                src="https://www.youtube.com/embed/0djEPHz1S7E?rel=0&amp;autoplay=1&amp;loop=1&amp;playlist=0djEPHz1S7E"
                                                allow="autoplay; encrypted-media"></iframe>

                                    </div>
                                </Fragment>
                        }
                    </div>
                    {startup !== 99 && <div className="detail_necessarydoc">
                        <div className="detail_necessarydoc_title">
                            <span>{this.state.docData.name}의 다른 문서</span>
                        </div>
                        <div className="detail_necessarydoc_contents">
                            <Carousel slidesToShow={4} wrapAround={false} cellAlign="left" cellSpacing={2}>
                                {this.state.docData.doculist && this.state.docData.doculist.map((list, listKey) =>
                                    <div className="item_image" key={listKey}>
                                        <div className="item_hover" onClick={() => this.categoryLink(list.iddocuments)}>
                                            <div className="contents">
                                                <div className="subject">{this.subTitle(list.title)}
                                                </div>
                                                <hr/>
                                                <div className="desc">
                                                    {list.description[0].context}
                                                </div>
                                                <a className="more" href={'/detail/' + list.iddocuments}><img src="/main_img/more-btn-tr.png" alt="더보기"/></a>
                                            </div>
                                            <a className="item_write_btn" href={'/detail/' + list.iddocuments}>법률문서 작성하기</a>
                                        </div>
                                        <img src={docuPreviewUrl + this.state.docData.idcategory_1 + '.svg'} alt="document_image" width="250" height="320"
                                             className="document_img"/>


                                        <div className="title" style={{ width: '250px' }}>
                                            {this.subTitle(list.title)}
                                        </div>
                                    </div>
                                )}
                            </Carousel>
                        </div>
                    </div>}
                    {/* <div className="wrap_detailreport">
                        <div className="detailreport">
                            <div className="add_detailreport">후기작성</div>
                            <table>
                                <thead className="head_detailreport">
                                    <tr>
                                        <th className="head_detailreport1">번호</th>
                                        <th className="head_detailreport2">만족도</th>
                                        <th className="head_detailreport3">이용후기</th>
                                        <th className="head_detailreport4">등록자</th>
                                        <th className="head_detailreport5">등록일</th>
                                    </tr>
                                </thead>
                                <tbody className="body_detailreport">
                                    <tr>
                                        <td className="body_detailreport1">33624</td>
                                        <td className="body_detailreport2">
                                            <StarRatings starRatedColor="#ffa400" rating={4.4} starDimension="20px" starSpacing="2px" /></td>
                                        <td className="body_detailreport3">매주 한번씩 필요한 서식있나 확인해보고 요긴하기 잘 쓰고 있습니다.</td>
                                        <td className="body_detailreport4">hsw1315**</td>
                                        <td className="body_detailreport5">2019-02-14</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> */}
                    <div id="payment" className="white_content">
                        <div className="payment_modal">
                            <div className="title">문서 결제</div>
                            <a className="xbtn" href="#close" onClick={(e) => { this.setState({ discountCode: '', discount: 0 }) }}>
                                <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"/>
                            </a>
                            <div className="info">
                                결제 정보
                            </div>
                            <div className="price">
                                <div className="text">결제 금액</div>
                                <div className="num"><NumberFormat value={this.state.docData.dc_price - this.state.discount} displayType={'text'}
                                                                   thousandSeparator={true}></NumberFormat>원
                                </div>
                            </div>
                            <div className="way">결제 수단</div>
                            <div className="waycontent">
                                <div style={toggle_account} className="account" onClick={this.account}>
                                    <div>
                                        <img src={account_image} width="96" height="96" alt="account"/>
                                    </div>
                                    계좌이체
                                </div>
                                <div style={toggle_card} className="card" onClick={this.card}>
                                    <div>
                                        <img src={card_image} width="96" height="96" alt="card"/>
                                    </div>
                                    카드결제
                                </div>
                            </div>
                            <div className="promotion">
                                <div className="info" style={{ paddingLeft: 0, display: 'inline-block', border: 0, width: 120 }}>
                                    프로모션 코드
                                </div>
                                <input className="payPromotionCode_input" placeholder="" value={this.state.discountCode} onChange={(e) => this.inputDiscountCode(e)}/>
                                <button type="button" className="promotion_submit_btn" onClick={(e) => this.payPromotion()}>등록</button>
                                <div className="caution">이벤트, 제휴 등을 통해 할인코드를 보유하고 계시면 입력해주세요. 결제금액이 할인가격보다 높은 경우 사용할 수 있습니다. </div>
                            </div>
                            <div className="pay_btn_block">
                                <a href="#close">
                                    <img src="/detail_img/cancel_btn.png" alt="card"/>
                                </a>
                                <img className="pay_btn" src="/detail_img/pay_btn.png" alt="card" onClick={() => this.onPayment(this.state.docData.iddocuments)}/>

                            </div>
                        </div>
                    </div>
                    <div id="promotion" className="white_content">
                        <div className="payment_modal">
                            <div className="title">프로모션 코드 등록
                                <a className="xbtn" href="#close">
                                    <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"/>
                                </a>
                            </div>
                            <div className="info">
                                프로모션 코드를 입력하세요.
                            </div>
                            <div className="promotion_form">
                                <input className="code_input" placeholder="프로모션 코드를 입력해주세요."/>
                                <button type="button" className="promotion_submit_btn" onClick={() => this.onPromotion(this.state.docData.iddocuments)}>등록</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

export default Detaildocument
