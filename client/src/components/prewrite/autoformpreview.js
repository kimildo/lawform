import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
// import '../../scss/autoform/autoformmain.scss';
import { withAutoformContext } from '../../contexts/autoform';
import User from '../../utils/user';
import API from '../../utils/apiutil';
import NumberFormat from 'react-number-format';
import PaymentDefault from '../payment/default'

class AutoformPreview extends Component {

    static propTypes = {
        onOverflowChange: PropTypes.func,
        children: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        style: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            printFile : "",
            tester: "",
            firstPayment:false,
            firstPrice:0,
            paymentEvent:null,
            payOpen:false
        }
        
    }

    getPayCount() {
        var params = {

        }
        API.sendPost('/payments/count', params).then((res) => {
            if( res.data.data.count < 1 ) {
                this.setState({
                    firstPayment:true,
                    firstPrice:14900,
                    paymentEvent:"firstPayment"
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    componentDidMount(){
        //console.log("mobile :: ", this.props.isMobile );
        this.getPayCount();
    }

    render() {
        let style_a4 = {height : window.innerHeight - 133};
        if(this.state.tester === 'Y'){
            style_a4 = {
                height : window.innerHeight - 133,
                msUuserSelect: 'auto',
                mozUserSelect: 'auto',
                webkitUserSelect: 'auto',
                khtmlUserSelect: 'auto',
                userSelect: 'auto',
            }
        }
        let userInfo = User.getInfo();
        return (
            <div className="autoform_output_field" id="output" ref={this.setDOMElement} >
                {/* <div className="autoform_output_a4" id="output_a4" style = {style_a4}onContextMenu={(e) => {e.preventDefault(); return false;}} > */}
                <div className="autoform_output_a4" id="output_a4" onContextMenu={(e) => {e.preventDefault(); return false;}} >
                    {this.props.children}
                    
                    {
                        ( Number( this.props.docData.iddocument ) !== 50 || !userInfo ) &&
                        <div className='bottom_layer {/*mobile_hide*/}'>{this.props.showPaymentPop}
                        {
                            ( this.props.idcategory_1 !== 2 )?
                                <Fragment>
                                {
                                    // ( this.props.sectionSelect < 3 )?
                                        <Fragment>
                                            {
                                                // 근로계약서 이벤트
                                                ( Number( this.props.docData.iddocument ) === 50 ) ?
                                                <div className="event-50">
                                                    <div className="pop" style={{display:this.state.showEvent50Pop}}>
                                                        <div className="close" onClick={()=> this.setState({showEvent50Pop:'none'}) }>
                                                            <img src="/images/event/small-x-10.svg" alt="이벤트 팝업 닫기" />
                                                        </div>
                                                        <Link href="/event/labor" >
                                                            <img src="/images/event/50-event-button.svg" alt="근로계약서 무료 자동작성 이벤트 보기"  />
                                                        </Link>
                                                    </div>
                                                    <div className="text">근로계약서 <span className="line-through">19,800원</span> <strong>선착순 0원</strong></div>
                                                    <button className="default block" onClick={()=>this.props.loginCheckBeforePayment()}>작성하기</button>
                                                </div>
                                                :
                                                <Fragment>
                                                {
                                                    ( this.props.sectionSelect > 0 )?

                                                    <div className="info loading">
                                                    문서가 자동으로 완성중입니다.<br />
                                                    결제하시면 문서 전체를 확인하실 수 있습니다.
                                                        <img src="/autoform_img/loading.svg" className="loading-img" />
                                                    </div>
                                                    :
                                                    <div className="info input">
                                                    {(this.props.isMobile === false)?"좌측 ":""}질문지에 답변을 입력하시면<br />
                                                    자동으로 문서가 완성됩니다.
                                                    </div>
                                                }
                                                </Fragment>
                                            }
                                        </Fragment>
                                }
                                </Fragment>
                                :
                                <Fragment>
                                {
                                    <div className="info payment">
                                        
                                        <div className="text">
                                            {
                                                ( this.props.sectionSelect >= 1 )?
                                                '문서 전체를 확인하시려면 아래 버튼을 눌러주세요.'
                                                :    
                                                '위임장은 무료로 작성하실 수 있습니다.'
                                            }
                                            <a className="payment_open"  onClick={(this.props.loginCheckBeforePayment)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="36" viewBox="0 0 120 36">
                                                    <g id="그룹_283" data-name="그룹 283" transform="translate(-806 -646)">
                                                        <rect id="사각형_133" data-name="사각형 133" width="120" height="36" rx="3" transform="translate(806 646)" fill="#fff"/>
                                                        <text id="결제하기" transform="translate(866 670)" fill="#435062" font-size="15" font-family="NotoSansCJKkr-Bold, Noto Sans CJK KR" font-weight="700" letter-spacing="0.02em"><tspan x="-28.05" y="0">
                                                            {
                                                                ( this.props.sectionSelect >= 1 )?
                                                                '확인하기'
                                                                :
                                                                '작성하기'
                                                            }
                                                        </tspan></text>
                                                    </g>
                                                </svg>
                                            </a>
                                        </div>                    
                                    </div>    
                                }
                                </Fragment>
                        }
                        </div>

                    }

                    {/*하단 결제하기*/}
                    <PaymentDefault 
                        docData={this.props.docData}
                        iddocument={this.props.iddocument}
                        bindData={this.props.bindData}
                        loginCheckBeforePayment={this.props.loginCheckBeforePayment}
                        return_url={'/instructions/' + this.props.iddocument}
                        docProps={this.props}
                        open={this.state.payOpen}
                        onClose={()=>this.setState({payOpen:false})}
                    />
                    <div
                        className="layer-payment"
                        id="layer-payment-animation" 
                        // style={( this.props.sectionSelect > 0 && this.props.idcategory_1 !== 2 && this.props.userInfo !== null )?{display:'block'}:{display:'none'}} 
                    >
                        {/* <Link href="/event/happylaw" className="event-banner"><img src ="/images/event/happylaw/happylaw-pop.png" /> </Link> */}
                        <div className="infos" >
                            <div className="doc-title">{this.props.docData.h1}</div>
                            <div className="doc-price">
                                <span>
                                    {
                                        ( Number( this.props.docData.iddocument ) === 50 )?
                                        "19,800"
                                        :
                                        <NumberFormat value={this.props.docData.price} displayType={'text'} thousandSeparator={true}></NumberFormat>
                                    }

                                원</span>
                                <span><NumberFormat value={this.props.docData.dc_price} displayType={'text'} thousandSeparator={true}></NumberFormat>원</span>
                            </div>
                        </div>
                        {
                            ( Number( this.props.docData.iddocument ) === 50 )?
                            <div className="labor-event-pop" style={{display:this.state.showEvent50Pop}}>
                                <div className="close" onClick={()=> this.setState({showEvent50Pop:'none'}) }>
                                    <img src="/common/small-x-10-red.svg" alt="이벤트 팝업 닫기" />
                                </div>
                                <Link href="/event/labor"><img src="/images/event/50-event-button.svg" /></Link>
                            </div>
                            :
                            <div className="doc-sale-icon">
                                <img src="/common/50off.svg" />
                            </div>

                        }
                        <button 
                            onClick={ ()=> [1, 3, 99].indexOf( Number( this.props.idcategory_1) ) >= 0?this.setState({payOpen:true}):this.props.loginCheckBeforePayment() }
                        >
                            {
                                ( this.props.docData.dc_price === 0 )?"작성하기":"결제하기"
                            }
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAutoformContext(AutoformPreview);