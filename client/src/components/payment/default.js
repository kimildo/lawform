import React, { Component, Fragment } from 'react'
import NumberFormat from 'react-number-format'
import Router from 'next/router'
import API from '../../utils/apiutil'
// import '../../scss/payment.scss'
import User from '../../utils/user'
import ReactGA from 'react-ga'
import { Checkbox , FormLabel } from '@material-ui/core'
import Analystics from '../../utils/analytics'
import Plan from 'components/payment/plan'
import PaymentDocument from 'components/payment/document'
import Modal from 'components/common/modal'

class Payment extends Component {

    constructor (props) {
        super(props)
        this.state = {
            iddocument: null,
            docData: {},
            discount: 0,
            discountCode: '',
            plan:1,
            pay_Product:'doc',
            pay_method: 'card',
            discountPer: 50,
            fullPrice: 0,
            dcPrice: 0,
            categoryDocs: [],
            addedDocs: [],
            foldSelector: true,
            packageId: 0,
            userPackage: {},
            showIsStartup: false
        }
        let userInfo = User.getInfo();
        if (!!userInfo) {
            this.state.login = 'Y';
            this.state.idusers = userInfo.idusers;
            this.state.username = userInfo.username;
        } else {
            this.state.login = 'N';
        }
    }

    promotionComplete = ( res) => {
        // console.log('paymentComplete', res)
        if( res.status === 'ok' ) {
            if( res.data.chk.status === 'ok' ) {
                if( res.data.type === 'F' ) {
                            
                    this.setState({
                        discount: this.state.dcPrice,
                        freePromotion: true,
                        freePromotionCode: this.state.discountCode,
                        discountPer: 100
                    })
                } else if( res.data.type === 'D' ) {
                    this.setState({
                        discount: res.data.discount,
                        freePromotion: false,
                        freePromotionCode: this.state.discountCode
                    })
                }
            }
        }
    }


    componentDidMount () {
        User.getPackage().then(result => {
            if (!!result) {
                this.setState({
                    userPackage: result
                })
            }
        })
        console.log( 'props', this.props )
        this.setState({
            docData: this.props.docData,
            addedDocs: [Number(this.props.docData.iddocument)],
            iddocument: this.props.docData.iddocument,
            fullPrice: this.props.docData.price,
            dcPrice: this.props.docData.dc_price
        })
    }

    componentWillReceiveProps (nextProp) {
        // if (nextProp.docData.iddocuments !== this.props.docData.iddocuments) {
            this.setState({
                docData: nextProp.docData,
                addedDocs: [Number(nextProp.docData.iddocument)],
                iddocument: nextProp.docData.iddocument,
                fullPrice: nextProp.docData.price,
                dcPrice: nextProp.docData.dc_price
            })
        // }
    }

    render () {
        return (
            <Fragment>
            {
                this.props.open===true?    
            <div id="payment-default" className="payment-default">
                <div className="anchor">
                    <div className="close" onClick={this.props.onClose}>닫기</div>
                </div>
                <div className="payment-options">
                    <fieldset>
                        <h4>상품선택</h4>
                        <ul className="options">
                            <li>
                                <input type="radio" name="product" id="product" onChange={()=>this.setState({pay_Product:'doc'})}
                                checked={this.state.pay_Product==='doc'?'checked':''} />
                                <label for="product">단건구매</label>
                                <div className={this.state.pay_Product==='doc'?'active':''} >
                                    <del><NumberFormat value={this.state.fullPrice} displayType={'text'} thousandSeparator={true}></NumberFormat>원</del>
                                    <NumberFormat value={this.state.dcPrice} displayType={'text'} thousandSeparator={true}></NumberFormat>원
                                </div>
                            </li>
                            <li>
                                <input type="radio" name="product" id="pkg_startup" onChange={()=>this.setState({pay_Product:'plan'})}
                                checked={this.state.pay_Product==='plan'?'checked':''} />
                                <label for="pkg_startup">정기권 구매 </label><span onClick={()=>this.setState({showIsStartup:true})}>정기권이란?</span>
                                <div className={this.state.pay_Product==='plan'?'active':''} >
                                    <span>330,000</span>원
                                    {/* <span>198,000</span>원 */}
                                </div>
                            </li>
                        </ul>
                    </fieldset>
                    <fieldset>
                        <h4>결제수단</h4>
                        <ul className="method">
                            <li>
                                <input type="radio" name="method" id="method_card" value="card" onChange={()=>this.setState({pay_method:'card'})} 
                                checked={this.state.pay_method==='card'?'checked':''} />
                                <label for="method_card">신용카드</label>
                            </li>
                            <li>
                                <input type="radio" name="method" id="method_trans" value="trans"  onChange={()=>this.setState({pay_method:'trans'})}
                                checked={this.state.pay_method==='trans'?'checked':''} />
                                <label for="method_trans">계좌이체</label>
                            </li>
                        </ul>
                    </fieldset>
                    {this.state.pay_Product==='doc'?
                    <fieldset className="promotion">
                        <label>프로모션 코드</label><input type="text" value={this.state.promotionCode} onChange={e=>this.setState({promotionCode:e.target.value.toUpperCase()})} />
                        <button onClick={()=>this.setState({discountCode:this.state.promotionCode})}>적용</button>
                        <ul >
                            <li>이벤트, 제휴 등을 통해 할인코드를 가지고 계신 경우 입력해주세요.</li>
                            <li>결제금액이 할인가격보다 높은 경우에 사용할 수 있습니다.</li>
                        </ul>
                    </fieldset>
                    :null
                    }
                    <div className="price">
                        <div className="text">최종 결제금액</div>
                        <div className="num">
                            <NumberFormat value={this.state.pay_Product==='plan'?330000:this.state.dcPrice - this.state.discount} displayType={'text'} thousandSeparator={true}></NumberFormat>원
                        </div>
                    </div>
                    {
                        this.state.pay_Product==='plan'?
                        <Plan plan={this.state.plan} method={this.state.pay_method} btnLabel={'결제하기'} paymentComplete={this.paymentComplete}></Plan>
                        :
                        <PaymentDocument 
                            iddocument={this.state.iddocument} 
                            docData={this.state.docData} 
                            bindData={this.props.bindData} 
                            method={this.state.pay_method}
                            btnLabel={'결제하기'}
                            paymentComplete={this.paymentCompleteDocument}
                            promotionComplete={this.promotionComplete}
                            discountCode={this.state.discountCode}
                        ></PaymentDocument>
                        // <div className="doc">
                        //     <button onClick={()=>this.props.loginCheckBeforePayment()} >결제하기-단품</button>
                        // </div>
                    }
                </div>
            </div>:null
            }
            <Modal
                open={this.state.showIsStartup}
                onClose={(e) => this.setState({ showIsStartup: false })}
                width={584}
                height={660}
                marginTop={150}
                className="show-is-startup"
                scroll="body"
            >
                <div className="title" style={{ textAlign: 'left' }}>로폼 정기권 
                    <span className="close" onClick={(e) => this.setState({ showIsStartup: false })}><img src="/common/close-x-normal.svg"/></span>
                </div>
                <section>
                    <h5>스타트업 필수문서
                        <div className="sub-text">창업에서 투자, 매출까지 기업의 성장과정에서 필요한 기업문서를 패키지로 구성한 정기권</div>
                    </h5>
                    <div className="box">
                        <img src="/images/common/isstartup-image.jpg" />
                        <div className="balloon">
                            <img src="/images/common/isstartup-balloon.svg" />
                        </div>
                    </div>
                    <ul className="for">
                        <li><b>언제, 어떤 문서</b>를 쓸지 모르겠는 분 </li>
                        <li>무료 공개 <b>샘플에 대해 불안</b>했던 분</li>
                        <li>법무팀이 없어서 <b>법률문서 작성에 시간을 많이</b> 쓰시는 분</li>
                        <li><b>전문적인 법률문서를 저렴하게 이용</b>하고 싶었던 분</li>
                        <li>기업운영의 <b>속사정을 잘 반영</b>해주는 법률문서가 필요했던 분</li>
                        <li>문서의 <b>작성에서 보관까지 편리하게 관리</b>하고 싶은 분</li>
                    </ul>
                    <button onClick={()=>Router.push("/startup/document")}>자세히보기 <img src="/images/common/arrow-right-white.svg" /></button>
                </section>
            </Modal>
            </Fragment>
        )
    }
}

export default Payment