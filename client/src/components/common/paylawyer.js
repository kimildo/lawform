import React, { Component, Fragment } from 'react'
import NumberFormat from 'react-number-format'

import API from '../../utils/apiutil'
// import '../../scss/payment.scss'
import User from '../../utils/user'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { set } from 'date-fns'

//console.log('ENV', process.env.REACT_APP_IMPORT_INIT)

class Paylawyer extends Component {

    constructor (props) {
        super(props)
        this.state = {
            docData: {},
            serviceOptions: [],
            selectedService: 0,
            pay_method: 'card',
            discount: 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.userInfo = User.getInfo()
    }

    componentDidMount () {
        this.getServiceOptions(this.props.service.type)
        this.getDocData(this.props.iddocument)
        this.doc_type = this.props.doc_type
    }

    componentWillReceiveProps (nextProp) {
    }

    getServiceOptions (type) {
        API.sendPost('/payments/service/options', { type: type }).then((res) => {
            if (res.data.status === 'ok') {
                //console.log('get service', res.data.data )
                // var options = [];
                // for( var i in res.data.data ) {
                //     options[res.data.data[i].idx] = res.data.data[i]
                // }
                this.setState({
                    serviceOptions: res.data.data
                })
            }
        })
    }

    getDocData (iddocument) {
        API.sendGet('/documents/document/' + iddocument).then((res) => {
            if (res.statusText === 'OK') {
                this.setState({
                    docData: res.data[0]
                })
            }
        })
    }

    onPayment = (id) => {

        if (!this.userInfo) {
            alert('로그인 후 구매하여 주세요.')
            window.location.href = '#signin'
            return
        }

        const { serviceOptions, selectedService, docData, discount } = this.state

        let that = this
        let name = serviceOptions[selectedService].name
        let amount = serviceOptions[selectedService].price
        let idx = serviceOptions[selectedService].idx
        const callback = this.props.callback

        let m_host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : window.location.protocol + '//' + window.location.hostname
        let m_redirect_url = m_host + '/payment?paid_amount=' + amount + '&iddocuments=' + docData.iddocuments + '&service_idx=' + idx + '&discount=' + discount
        //let m_redirect_url = m_host + '/payment?paid_amount=' + (this.state.docData.dc_price - this.state.discount) + '&iddocuments=' + this.state.iddocument + '&discount=' + this.state.discount
        //let m_redirect_url = (!!isMobile) ? m_host + '/payment?paid_amount=' + amount + '&iddocuments=' + this.state.docData.iddocuments + '&service_idx=' + idx + '&discount=' + this.state.discount : null

        let paymentOpt = {
            pg: 'kicc.IM000020',
            pay_method: this.state.pay_method,
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: name,
            amount: amount,
            buyer_email: this.userInfo.email,
            buyer_name: this.userInfo.username,
            buyer_tel: '02-6925-0227',
            buyer_addr: '',
            buyer_postcode: '',
            m_redirect_url: m_redirect_url
        }

        /**
         * 로컬이나 데브일경우 테스트 계정
         */
        if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') {
            paymentOpt.pg = 'kicc'
        }

        // @todo env파일로 빼야 합니다.
        //IMP.init(process.env.REACT_APP_IMPORT_INIT)
        const IMP = window.IMP
        IMP.init('imp91690618')
        IMP.request_pay(paymentOpt, (rsp) => {

            if (rsp.success) {
                let params = rsp
                params.serviceidx = idx
                API.sendPost('/payments/service', params).then((res) => {

                    if (window.location.hostname !== 'lawform.io' && window.location.hostname !== 'www.lawform.io') {
                        console.log('/payments/service', params)
                    }

                    try {
                        /** Ga */
                        ReactGA.plugin.require('ecommerce')
                        ReactGA.plugin.execute('ecommerce', 'addItem', {
                            id: rsp.merchant_uid,
                            name: rsp.name,
                            sku: rsp.name,
                            price: rsp.paid_amount,
                            category: 'service',
                            quantity: 1,
                        })
                        ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                            id: rsp.merchant_uid,
                            revenue: rsp.paid_amount,
                        })
                        ReactGA.plugin.execute('ecommerce', 'send')
                        ReactGA.plugin.execute('ecommerce', 'clear')
                        /** /Ga */
                    } catch (e) {
                        console.log('GA Error :: ', e.message )
                    }

                    callback({ 'payment_idx': res, 'service_idx': params.serviceidx })

                }).catch((err) => {
                    console.log('Pay Error :: ', err.message )
                })
            } else {
                alert('결제가 취소되었거나 실패하였습니다.')
            }
        })
    }

    handleChange = (e) => {
        if (e.target.name === 'options') {
            this.setState({
                selectedService: e.target.value
            })
        }
        if (e.target.name === 'pay_method') {
            this.setState({
                pay_method: e.target.value
            })
        }
    }

    render () {
        const serviceType = {
            S: {
                name: '직인',
                price: 149000,
                fee: 10000,
                discount: 10000

            },
            R: {
                name: '검토',
                price: 189000,
                fee: 10000,
                discount: 10000
            }
        }

        let reqUrl = window.location.pathname
        const { children, opener, service } = this.props
        const { docData, serviceOptions } = this.state

        return (
            <Fragment>
                {children}
                <div id={opener} className="white_content payment_lawyer_contents">
                    {
                        <div className="payment_modal">
                            <div className="payment_header">
                                <div className="header_btn">
                                    <a className="xbtn header_xbtn" href="#close" onClick={(e) => {
                                        ReactGA.event({
                                            category: 'Payment',
                                            action: 'Reuqest Cancel',
                                            label: '변호사 첨삭/직인 결제요청 취소'
                                        })
                                        this.setState({ discountCode: '', discount: 0 })
                                    }}>
                                        <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"/>
                                    </a>
                                </div>
                                <span className="header_title">
                                {/* 변호사 {serviceType[this.props.service.type].name} 서비스 결제 */}
                                    변호사 {this.doc_type === '1' ? '직인' : '검토'} 서비스
                                </span>
                            </div>

                            <div className="info">
                                <span className="info_title">상품명</span>
                                <div className="info_content">
                                    {docData.title}<br/>
                                    변호사 {this.doc_type === '1' ? '직인' : '검토'} 서비스
                                </div>
                            </div>
                            <div className="option">
                                <span className="option_title">옵션선택</span>
                                <div className="option_select">
                                    {/* this.state.selectedService */}
                                    <select name="options" onChange={this.handleChange}>
                                        {
                                            serviceOptions.map((item, key) =>
                                                <option key={key} value={key}> {item.name} - {item.desc} + {Number(parseInt(item.display)).toLocaleString()} 원</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="code">
                                <span className="code_title">프로모션 코드 입력</span>
                                <span className="code_section"><input className="code_input" type="text"/></span>
                                <div className="btn btn-default">확인</div>
                            </div>

                            <div className="way">
                                <span className="way_title">결제수단 선택</span>
                                <div className="way_content">
                                    <label id="first">
                                        <input type="radio" name="pay_method" value="card" id="method_card" checked={(this.state.pay_method === 'card' ? 'checked' : '')}
                                               onChange={this.handleChange}/> 카드결제
                                    </label>
                                    <label>
                                        <input type="radio" name="pay_method" value="trans" id="method_trans" checked={(this.state.pay_method === 'trans' ? 'checked' : '')}
                                               onChange={this.handleChange}/> 계좌이체
                                    </label>
                                </div>
                            </div>

                            <div className="prices">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>변호사 {this.doc_type === '1' ? '직인' : '검토'} 서비스</td>
                                        <td colSpan='2'>|</td>
                                        <td>{Number(parseInt(serviceType[service.type].price)).toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td>시스템 이용료</td>
                                        <td colSpan='2'>|</td>
                                        <td>{Number(parseInt(serviceType[service.type].fee)).toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td>옵션 추가</td>
                                        <td colSpan='2'>|</td>
                                        <td>{Number(parseInt(this.state.serviceOptions.length > 0 && this.state.serviceOptions[this.state.selectedService].display)).toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td>할인금액</td>
                                        <td>|</td>
                                        <td className="text-red">-</td>
                                        <td className="text-red">{Number(parseInt(serviceType[this.props.service.type].discount)).toLocaleString()}원</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <hr/>

                            <div className="price_total">
                                <span className="total_title">최종 결제금액</span>
                                <div className="total_value">
                                    {Number(parseInt(this.state.serviceOptions.length > 0 && this.state.serviceOptions[this.state.selectedService].price)).toLocaleString()}원
                                </div>
                            </div>

                            <div className="pay_btn">
                                <div className="btn btn-default" onClick={() => this.onPayment([this.props.iddocument])}> 결제하기</div>
                            </div>

                        </div>
                    }
                </div>
            </Fragment>
        )
    }
}

export default Paylawyer
