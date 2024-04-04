import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import API from '../../utils/apiutil';
import Modal from '../common/modal';
import User from '../../utils/user';
import Analystics from '../../utils/analytics'

const defaultState = {
    name:'스타트업 필수문서',
    price:330000,
    discount:0,
    pay_method: 'card',
    
}

class Plans extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState
    }

    componentWillUpdate( nextProps ) {
        if( nextProps.method !== this.state.pay_method)
            this.setState({
                pay_method: nextProps.method
            })
    }
    

    onPayment = (id) => {
        const IMP = window.IMP
        IMP.init('imp91690618')
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후 구매하여 주세요.')
            const refererPath = encodeURIComponent(window.location.pathname)
            window.location.href = '/auth/signin?referer=' + refererPath
            ReactGA.pageview(window.location.pathname + '#signin', null, '로그인')

        } else {
            /**ga*/
            let discount = this.state.discount
            if (this.state.firstPayment === true) {
                discount = this.state.surveyDiscount
            }
            let event = this.state.paymentEvent
            if (this.state.surveyCheck === true) event = 'firstPayment_survey'
            let gaDocData = {
                sku: '정기권',
                price: this.state.price,
                discount: discount,
                planIdx: 13,
            }
            /**ga*/


            
            let temp = {
                bindData: {},
                paycode: new Date().getTime(),
                pay_method: this.state.pay_method,
                name: "정기권",
                iddocument: null,
                amount:  this.state.price - discount,
                payment_event: null,
                docData: null,
                product_type: 'plan',
                plan:13
            }
            API.sendPost('/payments/temp', temp).then((res) => {

            let thisClass = this
            let m_host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : window.location.protocol + '//' + window.location.hostname
            let m_redirect_url = m_host + '/paymentplan?paid_amount=' + (this.state.price - discount) + '&plan=' + 13 + '&name=' + this.state.name
            let paymentOpt = {
                pg: 'kicc.IM000020',
                pay_method: this.state.pay_method,
                merchant_uid: 'merchant_' + temp.paycode,
                name: this.state.name,
                amount:  this.state.price - discount,
                buyer_email: userInfo.email,
                buyer_name: userInfo.username,
                buyer_tel: '02-6925-0227',
                buyer_addr: '서울특별시 강남구 테헤란로 126 GT 대공빌딩 11층',
                buyer_postcode: '123-456',
                m_redirect_url: m_redirect_url
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
                    let msg = '결제가 취소되었습니다.'
                    if (rsp.success) {
                        msg = '결제가 완료되었습니다.'
                        let param = rsp
                            param.discount = gaDocData.discount
                            param.plan = gaDocData.planIdx
                            API.sendPost('/payments/plan', param).then((res) => {
                                if( res.data.status === 'ok' ) {
                                /** Ga */
                                    let analyticsData = {
                                        id: rsp.merchant_uid,
                                        name: rsp.name,
                                        sku: gaDocData.sku,
                                        price: gaDocData.price,
                                        category: 'plan',
                                        quantity: '1',
                                        revenue:rsp.paid_amount
                                    }
                                    Analystics.userSubscribe(analyticsData).then(()=>{
                                            alert(msg)
                                            window.location.href = '/mydocument#subscription'
                                    })
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                    } else {
                        alert(msg)
                    }

                }
            )
            })
        }
        
    }

    handleClose = () => {
        this.setState({

        })
    }
    render() {
        return(
            <Fragment>
                <div className="plan">
                    {this.props.children}
                    <button onClick={()=>this.onPayment(this.props.plan)}>
                    {!!this.props.btnLabel?this.props.btnLabel:'결제'   }
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default Plans;