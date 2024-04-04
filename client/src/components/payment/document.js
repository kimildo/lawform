import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import API from '../../utils/apiutil';
import Modal from '../common/modal';
import User from '../../utils/user';
import Analystics from '../../utils/analytics'
import Router from 'next/router'
const defaultState = {
    discount:0,
    pay_method: 'card',
    iddocument:null,
    docData:{},
    paymentEvent: null,
    discountCode:""
}

class Document extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState
    }

    componentDidMount( ) {
        this.getDocData( this.props )
    }

    componentWillUpdate( nextProps ) {
        if( nextProps.method !== this.state.pay_method) {
            this.setState({
                pay_method: nextProps.method
            })
        }
        if( nextProps.discountCode !== this.props.discountCode) {
            // console.log("promotion code change", this.props.discountCode, nextProps.discountCode)
            this.payPromotion( nextProps.discountCode)
        }

    }
    getDocData (props) {
        API.sendGet('/documents/document/' + props.iddocument).then((res) => {
            // if( res.statusText==='OK' ){
                this.setState({docData:res.data[0]})
            // }
        })
    }

    payPromotion = ( promoCode ) => {
        // let promoCode = this.props.discountCode.trim()
        if(  !promoCode ) {
            alert('프로모션코드를 입력해주세요.')
            return
        }
        console.log( "promoCode" ,  promoCode )
        promoCode = promoCode.trim()
        if (promoCode === '') {
            alert('프로모션코드를 입력해주세요.')
            return
        }

        API.sendPost('/payments/usecode', {
            code: promoCode
        }).then((result) => {
            console.log( result )
            if (result.status === 'ok') {
                if(result.data.chk.status === 'ok'){
                    if( result.data.type === 'F' ) {
                        
                            this.setState({
                                discount: this.state.dcPrice,
                                freePromotion: true,
                                freePromotionCode: promoCode,
                                discountCode: promoCode,
                                discountPer: 100
                            })
                            alert('프로모션이 적용되었습니다. 결제버튼을 눌러 주세요')
                        
                    } else if( result.data.type === 'D' ) {
                        this.setState({
                            discount: result.data.discount,
                            freePromotion: false,
                            freePromotionCode: promoCode,
                            discountCode: promoCode
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
            return result
        }).then(r=>this.props.promotionComplete( r ))

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

    onPayment = () => {
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
            price: this.state.docData.price,
            category: this.state.docData.idcategory_1,
            discount: discount,
            discountCode: this.state.discountCode,
            packageId: this.state.packageId,
            iddocument: this.state.docData.iddocuments,
            paymentEvent: event

        }
        /**ga*/
        let temp = {
            bindData: bindData,
            paycode: new Date().getTime(),
            pay_method: this.state.pay_method,
            name: this.state.docData.title,
            iddocument: this.state.docData.iddocuments,
            amount: this.state.docData.dc_price,
            payment_event: event,
            docData: gaDocData,
            product_type: 'documents',
            discount: discount,
            discount_code: this.state.discountCode
        }

        API.sendPost('/payments/temp', temp).then((res) => {
            let thisClass = this
            let m_host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : window.location.protocol + '//' + window.location.hostname
            let m_redirect_url = m_host + '/payment?paid_amount=' + ( this.state.docData.dc_price - discount ) + '&iddocuments=' + this.state.docData.iddocuments + '&discount=' + discount + '&paycode=' + temp.paycode + '&payment_event=' + event
            console.log( "m_redirect_url" , m_redirect_url )
            let paymentOpt = {
                pg: 'kicc.IM000020',
                pay_method: this.state.pay_method,
                merchant_uid: 'merchant_' + temp.paycode,
                name: this.state.docData.title,
                amount: this.state.docData.dc_price - discount,
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
                    // test
                    if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') {
                    console.log( 'rsp' ,rsp )
                    API.sendPost('/payments/callback',{ imp_uid:rsp.imp_uid,  merchant_uid:rsp.merchant_uid, status:'paid' })
                    }
                    // /test
                    let msg = '결제가 완료되었습니다.'
                    if (rsp.success) {
                        let param = rsp
                        param.iddocuments = [gaDocData.iddocument]
                        param.discount = gaDocData.discount
                        param.discountCode = gaDocData.discountCode
                        param.packageId = gaDocData.packageId
                        param.bindData = bindData
                        param.iddocument = gaDocData.iddocument
                        param.paymentEvent = gaDocData.paymentEvent
                        console.log( "param", param )
                        API.sendPost('/payments', param).then((res) => {
                            console.log( "/payments",res )
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
                                if (typeof res.data.insertId !== "undefined" && !!res.data.insertId) {
                                    Router.push( "/autoform/[document]", '/autoform/' + res.data.insertId  )
                                } else {
                                    Router.push( "/mydocument")
                                }
                            })
                        }).catch((err) => {
                            console.log(err)
                        })
                    } else {
                        msg = '결제가 취소되었습니다.'
                        // window.location.href = '/preview/' + this.state.docData.iddocuments
                    }
                    alert(msg)
                }
            )

        }).catch((err) => {
            console.log(err)
        })

    }

    handleClose = () => {
        this.setState({

        })
    }
    render() {
        return(
            <Fragment>
                <div className="payment-document">
                    {this.props.children}
                    <button onClick={()=>this.state.freePromotion===true?this.onPromotion():this.onPayment()}>
                    {!!this.props.btnLabel?this.props.btnLabel:'결제'   }
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default Document;