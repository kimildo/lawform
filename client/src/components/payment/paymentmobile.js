import React, { Component } from 'react';
import ReactGA from 'react-ga';
import jQuery from "jquery";
import User from '../../utils/user'
import API from '../../utils/apiutil'
import Analystics from '../../utils/analytics'

window.$ = window.jQuery = jQuery;

class Paymentmobile extends Component {

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
        let merchant_uid = this.getParameter('merchant_uid');
        let imp_success = this.getParameter('imp_success');
        let paid_amount = this.getParameter('paid_amount');
        let iddocuments = this.getParameter('iddocuments');
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
            return await API.sendPost('/payments', param).then((res) => {
                return res
            });
        }

        if((imp_success === 'true') && (imp_uid !== undefined)) {
            param ={
                imp_uid:imp_uid,
                merchant_uid: merchant_uid,
                imp_success: imp_success,
                paid_amount: paid_amount,
                iddocuments: [iddocuments],
                iddocument: iddocuments,
                discount: discount,
                paymentEvent : payment_event,
                paycode : paycode
            }
            payment(param).then((res) => {
                // if( res.status === 'ok' ) {
                    doc( iddocuments ).then( (result) => {
                        let docData = result.data[0];
                        /** /Ga */
                        let analyticsData = {
                            id: merchant_uid,
                            name: docData.title,
                            sku: docData.name,
                            price: docData.price,
                            category: docData.idcategory_1,
                            quantity: '1',
                            revenue:paid_amount
                        }
                        Analystics.userPayment(analyticsData).then(()=>{
                            if (window.confirm('결제가 완료되었습니다.')) window.location.href = "/mydocument" ;
                            else window.location.href = "/mydocument" ;
                        })
                    } )
                // } else {
                    
                // }

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

export default Paymentmobile;