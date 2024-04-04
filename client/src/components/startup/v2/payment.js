import React, { Component, Fragment } from 'react'
import User from '../../../utils/user'
import Plan from 'components/payment/plan'
import moment from 'moment';
import Api from 'utils/apiutil'
import Router from 'next/router';

class Payment extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            plan:13,
            paymentMethod:"card",
            paymentProductShow:false,
            userProgram:null,
            userPrograms:[]
        };
        this.userInfo = User.getInfo();
        this.paymentComplete = this.paymentComplete.bind(this)

    }
    componentDidMount() {
        if( !!this.userInfo )
            this.getProgram( this.userInfo.idusers )
    }
    

    getProgram( idusers ) {
        var params = {
            idusers:idusers
        }
        Api.sendPost('/user/program', params ).then(res => {
            if( res.data.data ) {
                if( res.data.data.group_idx === null ){
                } else {
                    this.setState({ userProgram:res.data.data[0], userPrograms:res.data.data } )
                }
            }
        })
    }

    paymentComplete() {

    }

    handleChange(e) {
        var value = e.target.value
        this.setState({
            paymentMethod:value
        })
    }
    render() {
        return (
            <div className="payment">
                <div className="consumers">
                    {!!this.props.userSubscription?
                    <Fragment>
                    <label>필수문서를 법무팀처럼 활용하세요</label>
                    <ol className="order-list">
                        <li>
                            <label>카테고리 활용</label>
                            <ul className="check-list">
                                <li>어떻게 업무를 해결할지 알수 있어요</li>
                                <li>필요한 내용을 쉽고 빠르게 확인할 수 있어요</li>
                            </ul>
                        </li>
                        <li>
                            <label>자동작성 & 교육실 활용</label>
                            <ul className="check-list">
                                <li>교육과정과 함께 어려운 법률문서를 완성해요</li>
                            </ul>
                        </li>
                    </ol>
                    </Fragment>:
                    <Fragment>
                    <label>이런 분들에게 필요해요!</label>
                    <ul className="check-list">
                        <li><b>스타트업의 속사정</b>을 반영한 <b>전문법률교육</b>이 필요하신 분</li>
                        <li>교육 내용을 실무에 적용하여 <b>쉽고, 빠르게</b> 업무를 처리하고 싶은 분 </li>
                        <li>현재 기업의 리스크를 분석하고 <b>개선 솔루션을 제공</b>하는 <b>교육과정</b>이 필요하신 분</li>
                        <li className="bang">현재 계약서, 내용증명, 지급명령 등 10만 이상 사례 적용 가능
                            <small>*스타트업 필수문서는 <red>매주 업데이트</red> 됩니다</small>
                        </li>
                    </ul>
                    </Fragment>
                    }
                </div>
                <div className={this.state.paymentProductShow===true?"product active":"product"}>
                    <div class="anchor mobile"><div class="close" onClick={()=>this.setState({paymentProductShow:false})}>닫기</div></div>
                    {/* <div className="banner-sale mobile_hide"><img src="/images/startup/v2/banner-limit300.svg"/></div> */}
                    <div className="title mobile_hide">스타트업 필수문서</div>
                    { !!this.props.userSubscription?
                    <ul className="info subscription">
                        { !!this.state.userProgram?
                        <li>
                            <label>이용상태 : 이용중</label>
                            <div>* 본 이용권은 {this.state.userProgram.group_name}에서 지원하고 있습니다.</div>
                        </li>
                        :
                        <li>
                            <label>상품명</label>
                            <div>스타트업 필수문서</div>
                        </li>
                        }
                        <li>
                            <label>이용기간</label>
                            <div>{moment( this.props.userSubscription.regdatetime).format('Y.MM.DD')} ~ {moment( this.props.userSubscription.enddate).format('Y.MM.DD')}</div>
                        </li>
                    </ul>
                    :
                    <ul className="info">
                        <li>
                            <label>이용기간</label>
                            <div><del>3개월</del>6개월</div>
                        </li>
                        <li>
                            <label>이용료</label>
                            <div>330,000원</div>
                        </li>
                        <li>
                            <label>결제수단</label>
                            <div>
                                <label><input type="radio" name="method" id="method_card"  value="card"  checked={this.state.paymentMethod === 'card'?true:false}  onChange={(e)=>this.handleChange(e)} />신용카드</label>
                                <label><input type="radio" name="method" id="method_trans" value="trans" checked={this.state.paymentMethod === 'trans'?true:false} onChange={(e)=>this.handleChange(e)}/>계좌이체</label>
                            </div>
                        </li>
                    </ul>
                    }
                    { !!this.props.userSubscription?
                        <Fragment>
                        {!!this.state.userProgram?
                            <div className="plan"><button className="subscription" onClick={()=>Router.push("/startup/qna")}>이용문의</button></div>
                            :
                            <div className="plan"><button className="subscription" onClick={()=>Router.push("/customer/qna")}>이용문의</button></div>
                        }
                        </Fragment>
                        :
                        <Plan plan={this.state.plan} method={this.state.paymentMethod} btnLabel={'결제하기'} paymentComplete={this.paymentComplete}></Plan>
                    }
                </div>
                <button className="subscription-program mobile" onClick={()=>this.setState({paymentProductShow:true})}>{!!this.props.userSubscription?"이용중":"프로그램 이용 신청"}</button>
            </div>
        );
    }
}

export default Payment;
