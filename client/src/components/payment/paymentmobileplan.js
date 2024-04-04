import React, { Component } from 'react';
import ReactGA from 'react-ga';
import jQuery from "jquery";
import User from '../../utils/user'
import API from '../../utils/apiutil'
import Analystics from '../../utils/analytics'

window.$ = window.jQuery = jQuery;

class Paymentmobileplan extends Component {

    constructor(props) {
        super(props)
        this.userInfo = User.getInfo()
        ReactGA.initialize('UA-93064531-2' ,{
            titleCase: false,
            gaOptions: {
                userId: !!this.userInfo?this.userInfo.idusers:null
            }
        })
    }

    getParameter(param) {
        let returnValue;
        let url = window.location.href;
        let parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
        for (let i = 0; i < parameters.length; i++) {
            let varName = parameters[i].split('=')[0];
            if (varName.toUpperCase() === param.toUpperCase()) {
                returnValue = parameters[i].split('=')[1];
                return decodeURIComponent(returnValue);
            }
        }
    }

    parseData() {

        let imp_uid = this.getParameter('imp_uid');
        let name = this.getParameter('name');
        let merchant_uid = this.getParameter('merchant_uid');
        let imp_success = this.getParameter('imp_success');
        let paid_amount = this.getParameter('paid_amount');
        let plan = this.getParameter('plan');
        let discount = this.getParameter('discount');
        let paycode = this.getParameter('paycode');
        let payment_event = this.getParameter('payment_event');
        let param = {};

        const doc = async ( iddocuments ) => {
            return await API.sendGet('/documents/document/' + iddocuments).then( (res) => {
                return res
            });
        }

        const payment = async ( param ) => {
            return await API.sendPost('/payments/plan', param).then((res) => {
                return res
            });
        }

        if((imp_success === 'true') && (imp_uid !== undefined)) {
            param ={
                imp_uid:imp_uid,
                merchant_uid: merchant_uid,
                imp_success: imp_success,
                paid_amount: paid_amount,
                plan: plan,
                discount: discount,
                paymentEvent : payment_event,
                paycode : paycode
            }

            let gaDocData = {
                sku: '정기권',
                price: paid_amount,
                discount: discount,
                planIdx: 13,
            }

            payment(param).then((res) => {
                if( res.data.status === 'ok' ) {
                    /** Ga */
                        let analyticsData = {
                            id: merchant_uid,
                            name: name,
                            sku: gaDocData.sku,
                            price: gaDocData.price,
                            category: 'plan',
                            quantity: '1',
                            revenue:paid_amount
                        }
                        Analystics.userSubscribe(analyticsData).then((result)=>{
                            alert("결제가 완료되었습니다.")
                            window.location.href = "/startup" ;
                        })
                    }

            }).catch((err) => {
                console.log(err);
            });

        } else {
            alert('결제가 취소되었습니다.');
            window.history.back();
        }
    }

    render() {
        return(<div>{this.parseData()}</div>);
    }
}

export default Paymentmobileplan;