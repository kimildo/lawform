import React, { Component, Fragment } from 'react'
import NumberFormat from 'react-number-format'
import API from '../../utils/apiutil'
// import '../../scss/payment.scss'
import User from '../../utils/user'
import ReactGA from 'react-ga'
import Router from 'next/router'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Analystics from '../../utils/analytics'

class Payment extends Component {

    constructor (props) {
        super(props)
        this.state = {
            iddocument: null,
            docData: {},
            discount: 0,
            discountCode: '',
            tabs: [true, false],
            pay_method: 'card',
            promotion: {
                PATENT83CH: {
                    discount: '5000',
                    display: '5,000'
                },
            },
            discountPer: 50,
            fullPrice: 0,
            dcPrice: 0,
            categoryDocs: [],
            addedDocs: [],
            foldSelector: true,
            descText: '다른 문서와 함께 구매하시면 더 저렴한 가격으로 구매하실 수 있습니다.',
            packageId: 0,
            userPackage: {},
            freePromotion: false,
            freePromotionCode: '',
            surveyCheck: false,
            firstPayment: true,
            firstPrice: 0,
            surveyDiscount: 0,
            paymentEvent: null

        }
    }

    surveyCheck (e) {
        if (this.state.surveyCheck === true) {
            this.setState({ surveyCheck: false, surveyDiscount: 0 })
        } else {
            this.setState({ surveyCheck: true, surveyDiscount: 1000 })
        }
    }

    getPayCount () {
        var params = {}
        API.sendPost('/payments/count', params).then((res) => {
            if (res.data.data.count < 1) {
                this.setState({
                    firstPayment: true,
                    firstPrice: 14900,
                    paymentEvent: null
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    componentDidMount () {
        User.getPackage().then(result => {
            if (!!result) {
                this.setState({
                    userPackage: result
                })
            }
        })
        this.getPayCount()

    }

    componentWillReceiveProps (nextProp) {
        this.setState({
            docData: nextProp.docData,
            addedDocs: [Number(nextProp.iddocument)],
            iddocument: nextProp.iddocument,
            fullPrice: nextProp.docData.price,
            dcPrice: nextProp.docData.dc_price
        })
        // this.getDocData(nextProp)
    }

    getDocData (props) {
        API.sendGet('/documents/category/' + props.docData.idcategory_1).then((res) => {
            // if( res.statusText === 'OK' ) {
            let categoryDocs = []
            let i = 0
            res.data.forEach((e) => {
                categoryDocs[String(e.iddocuments)] = e
                i++
                if (res.data.length === i) {
                    this.setState({
                        categoryDocs: categoryDocs,
                        docData: props.docData,
                        addedDocs: [Number(props.iddocument)],
                        iddocument: props.iddocument,
                        fullPrice: props.docData.price,
                        dcPrice: props.docData.dc_price
                    })
                }
            })
            // }
        })
    }

    onPayment = (id) => {
        let bindData = this.props.bindData
        const IMP = window.IMP
        IMP.init('imp91690618')
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            ReactGA.pageview(window.location.pathname + '#signin', null, '로그인')
        }

        /**ga*/
        var discount = this.state.discount
        if (this.state.firstPayment === true) {
            discount = this.state.surveyDiscount
        }
        var event = this.state.paymentEvent
        if (this.state.surveyCheck === true) event = 'firstPayment_survey'
        var gaDocData = {
            sku: this.state.docData.name,
            price: this.state.fullPrice,
            category: this.state.docData.idcategory_1,
            discount: discount,
            discountCode: this.state.discountCode,
            packageId: this.state.packageId,
            iddocument: this.state.iddocument,
            paymentEvent: event

        }
        console.log( gaDocData )
        /**ga*/
        let temp = {
            bindData: bindData,
            paycode: new Date().getTime()
        }

        API.sendPost('/payments/temp', temp).then((res) => {
            let thisClass = this
            let m_host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : window.location.protocol + '//' + window.location.hostname
            let m_redirect_url = m_host + '/payment?paid_amount=' + ( this.state.dcPrice - discount ) + '&iddocuments=' + this.state.iddocument + '&discount=' + discount + '&paycode=' + temp.paycode + '&payment_event=' + event
            let paymentOpt = {
                pg: 'kicc.IM000020',
                pay_method: this.state.pay_method,
                merchant_uid: 'merchant_' + new Date().getTime(),
                name: this.state.docData.h1,
                amount: this.state.dcPrice - gaDocData.discount ,
                buyer_email: userInfo.email,
                buyer_name: userInfo.username,
                buyer_tel: '02-6925-0227',
                buyer_addr: '서울특별시 강남구 테헤란로 126 GT 대공빌딩 11층',
                buyer_postcode: '123-456',
                m_redirect_url: m_redirect_url,
                payment_event: event
            }
            /**
             * 로컬이나 데브일경우 테스트 계정
             */
            if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') {
                paymentOpt.pg = 'kicc'
            }

            IMP.request_pay(paymentOpt,
                (rsp) => {
                    let msg = '결제가 완료되었습니다.'
                    if (rsp.success) {
                        let param = rsp
                        param.iddocuments = id
                        param.discount = gaDocData.discount
                        
                        param.discountCode = gaDocData.discountCode
                        param.packageId = gaDocData.packageId
                        param.bindData = bindData
                        param.iddocument = gaDocData.iddocument
                        param.paymentEvent = gaDocData.paymentEvent
                        console.log( 'param',param )
                        API.sendPost('/payments', param).then((res) => {
                            console.log( res )
                            let analyticsData = {
                                id: rsp.merchant_uid,
                                name: rsp.name,
                                sku: gaDocData.sku,
                                price: gaDocData.price,
                                category: gaDocData.category,
                                quantity: '1',
                                revenue:rsp.paid_amount
                            }
                            Analystics.userPayment(analyticsData).then(()=>{
                                if (!!res.data.result.insertId) {
                                    Router.push( "/autoform/[document]", '/autoform/' + res.data.result.insertId  )
                                } else {
                                    Router.push( "/mydocument")
                                }
                            })
                        }).catch((err) => {
                            console.log(err)
                        })
                    } else {
                        msg = '결제가 취소되었습니다.'
                        window.location.href = '/preview/' + id
                    }

                    alert(msg)
                }
            )

        }).catch((err) => {
            console.log(err)
        })

    }

    onPromotion = () => {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
        }
        let param = {
            code: this.state.freePromotionCode,
            iddocuments: this.props.iddocument,
            name: this.state.docData.title,
            bindData: this.props.bindData
        }
        API.sendPost('/payments/freepromotion', param).then((res) => {
            var msg
            if (res.status === 'ok') {
                this.setState({
                    discount: 0,
                    freePromotion: false,
                    freePromotionCode: '',
                    discountPer: 50,
                    discountCode: ''
                })
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
            window.location.href = '#promotion'
            ReactGA.pageview(window.location.pathname + '#promotion', null, '프로모션 코드 등록')
        }
    }

    payPromotion = () => {
        let promoCode = this.state.discountCode.trim()

        if (promoCode === '') {
            alert('프로모션코드를 입력해주세요.')
            return
        }


        API.sendPost('/payments/usecode', {
            code: promoCode
        }).then((result) => {
            if (result.status === 'ok') {
                if(result.data.chk.status === 'ok'){
                if( result.data.type === 'F' ) {
                    
                        this.setState({
                            discount: this.state.dcPrice,
                            freePromotion: true,
                            freePromotionCode: promoCode,
                            discountPer: 100
                        })
                        alert('프로모션이 적용되었습니다. 결제버튼을 눌러 주세요')
                    
                } else if( result.data.type === 'D' ) {
                    this.setState({
                        discount: result.data.discount,
                        freePromotion: false,
                        freePromotionCode: promoCode
                    })
                    alert('프로모션이 적용되었습니다. 결제버튼을 눌러 주세요')
                }
                // alert('프로모션이 적용되었습니다. 결제버튼을 눌러 주세요')
                } else {
                    alert('이미 사용된 코드입니다.')
                }
            } else {
                alert('사용할 수 없는 코드입니다.')
            }
        })

    }

    inputDiscountCode = (e) => {
        this.setState({ discountCode: e.target.value.toUpperCase() })
    }

    calcDocs = (addedDocs) => {
        let prices = 0
        let discountPer = 50 + ((addedDocs.length - 1) * 2)
        addedDocs.forEach((e) => {
            prices = prices + this.state.categoryDocs[e].price
        })
        let dcPrice = Math.round((prices - (prices * (discountPer / 100))) / 100) * 100
        this.setState({
            addedDocs: addedDocs,
            discountPer: discountPer,
            fullPrice: prices,
            dcPrice: dcPrice
        }, function () {
            // console.log(this.state.addedDocs, this.state.categoryDocs, prices, dcPrice, discountPer)
        })

    }

    handleChange = (e) => {
        if (e.target.name === 'method') {
            this.setState({
                pay_method: e.target.value
            })
        }
        if (e.target.name === 'docSelector') {
            var limit = (this.state.userPackage.count - this.state.userPackage.used)
            if (this.state.addedDocs.indexOf(Number(e.target.value)) < 0) {
                if (this.state.addedDocs.length >= limit) {
                    return false
                }
                let addedDocs = this.state.addedDocs
                addedDocs.push(Number(e.target.value))
                addedDocs.sort((a, b) => { return a - b })
                this.calcDocs(addedDocs)
            } else {
                let addedDocs = this.state.addedDocs
                let idx = addedDocs.indexOf(Number(e.target.value))
                if (idx > -1) addedDocs.splice(idx, 1)
                this.calcDocs(addedDocs)
            }
            // 
        }
    }

    setTabs = (t) => {
        let docsPackage = [20, 50, 31, 32, 33, 34, 35, 36, 37, 38, 39]
        let docsId = [this.state.iddocument]

        if (t === 0) {
            this.setState({
                tabs: [true, false],
                // descText:"다른 문서와 함께 구매하시면 더 저렴한 가격으로 구매하실 수 있습니다.",
                // packageId:0
            })
            this.calcDocs(docsId)
        } else if (t === 1) {
            this.setState({
                tabs: [false, true],
                // descText:"선택한 문서를 포함하여 아래 문서 전체 6개월간 무료 무제한 이용 가능",
                // addedDocs:docsPackage,
                // discountPer:80,
                // fullPrice:550000,
                // dcPrice:99000,
                // packageId:1
            })
        }
    }

    foldSelector = (e) => {
        if (this.state.foldSelector === true) {
            this.setState({
                foldSelector: false
            })
        } else {
            this.setState({
                foldSelector: true
            })
        }
    }

    addPackage () {
        var limit = (this.state.userPackage.count - this.state.userPackage.used)
        var docs = this.state.addedDocs
        if (docs.length > limit) {
            alert('문서를 추가할 수 없습니다.')
            return false
        }
        var pcp_idx = this.state.userPackage.pcp_idx
        var i = 0
        docs.forEach((item, index, array) => {
            var iddocuments = item
            if (!iddocuments) {
                // alert( " 선택된 문서가 없습니다. 문서를 선택해주세요." );
                // return false;
            } else {
                let params = { iddocuments: iddocuments, pcp_idx: pcp_idx }
                API.sendPost('/user/package/addDoc', params)
            }
            i++
            if (i === array.length) {
                window.location.href = '/mydocument'
            }
        },)
    }

    render () {
        let toggle_account
        let toggle_card
        let card_image
        let account_image

        if (this.state.pay_method === 'trans') {
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

        if (this.state.pay_method === 'card') {
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

        return (
            <div id="payment" className="white_content">
                <div className="payment_modal">
                    <div className="title">문서 결제</div>
                    <a className="xbtn" href="#close" onClick={(e) => { this.setState({ discountCode: '', discount: 0 }) }}>
                        <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"></img>
                    </a>
                    <div className="info">
                        결제 정보
                    </div>
                    <div className="price">
        <div className="text">결제 금액</div>
                        <div className="num">
                            {
                                (this.state.firstPayment === true) ?
                                    <div className="">
                                        <NumberFormat value={this.state.docData.dc_price - this.state.surveyDiscount - this.state.discount} displayType={'text'} thousandSeparator={true}></NumberFormat>원
                                        {/* <u>첫 구매 할인 적용</u> */}
                                    </div>
                                    :
                                    <Fragment>
                                        <NumberFormat value={this.state.docData.dc_price - this.state.discount } displayType={'text'} thousandSeparator={true}></NumberFormat>원
                                        {this.state.docData.dc_price - this.state.discount}
                                    </Fragment>
                            }

                        </div>
                    </div>
                    {
                        (this.state.firstPayment === true) ?
                            <div className="survey-agree">

                                <div><input type="checkbox" checked={this.state.surveyCheck === true ? 'checked' : ''} onChange={(e) => this.surveyCheck(e)}/>
                                    설문 및 후기 참여시 1,000원 추가 할인!
                                </div>
                                *문서 작성 후 인쇄, 다운로드 수정요청 시에 작성 할 수 있습니다.
                            </div> : null

                    }
                    <div className="way">결제 수단</div>
                    <div className="waycontent">
                        <div style={toggle_account} className="account" onClick={(e) => this.setState({ pay_method: 'trans' })}>
                            <div>
                                <img src={account_image} width="96" height="96" alt="account"/>
                            </div>
                            계좌이체
                        </div>
                        <div style={toggle_card} className="card" onClick={(e) => this.setState({ pay_method: 'card' })}>
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
                        <div className="caution">이벤트, 제휴 등을 통해 할인코드를 보유하고 계시면 입력해주세요. 결제금액이 할인가격보다 높은 경우 사용할 수 있습니다.</div>
                    </div>
                    <div className="pay_btn_block">
                        <a href="#close"><img src="/detail_img/cancel_btn.png" alt="card"/></a>
                        {this.state.freePromotion === true ?
                            <img className="pay_btn" src="/detail_img/pay_btn.png" alt="card" onClick={() => this.onPromotion([this.props.iddocument])}/>
                            :
                            <img className="pay_btn" src="/detail_img/pay_btn.png" alt="card" onClick={() => this.onPayment([this.props.iddocument])}/>
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default Payment