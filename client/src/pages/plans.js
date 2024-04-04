import React, { Component, Fragment }  from 'react'
import { Helmet } from "react-helmet"
import Api from '../utils/apiutil'
import dynamic from 'next/dynamic'
import Router from 'next/router'

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})
const Plan = dynamic(() => import('../components/payment/plan'),{ssr:false})

const defaultState = {
    paymentMethod:'card',
    remain:300
}

class Plans extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState
    }

    componentWillMount () {
        this.getRemain()
    }

    getRemain = () =>{
        const params = {
            name: "plans_remain"
        }
        Api.sendPost('/config/values',params).then((res) => { 
            var data = res.data.data
            this.setState({
                remain:data.value
            })

        })
    }

    render() {
        return (
            <div className="plans">
                <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                <Header theme={'dark'} styles={{position:'absolute'}}></Header>
                <div className="main">
                    <div className="product">
                        <h1>
                            <div>창업하시나요? 기업을 운영중이세요?</div>
                            <div><span>법인설립에서 매출, 투자</span>까지 필요한 법률문서를</div>
                            <div><b>“스타트업 필수문서”</b>로 해결하세요! </div>
                        </h1>
                        <div className="tickets">
                            <div>스타트업<br />필수문서</div>
                            <div>
                                <div>법인설립에서 투자까지<br />필요한 기업문서 <span className="red">전부</span></div>
                                <div>정관, 용역계약서, 근로계약서 등</div>
                                <button onClick={()=> Router.push('/startup/document')}>문서구성 자세히보기</button>
                            </div>
                            {/* <div>
                                <div>300개 한정판매</div>
                                <div className="red">마감임박</div>
                                <div className="red">{this.state.remain}개 남음</div>
                            </div> */}
                            <div>
                                <div>6개월 (180일)동안 <br /><span>무제한</span></div>
                                {/* <div>330,000원</div>
                                <div>99,000원</div> */}
                                <div>바로 확인 가능한 <span>법률가이드</span>까지</div>
                            </div>
                        </div>
                        <div className="guide">
                        스타트업필수문서는 창업에서 투자, 매출까지 기업의 성장과정에서 필요한 기업문서를 패키지로 구성한 로폼의 정기권입니다. 
                        </div>
                        <div className="hr-dot">
                            <img src="/images/plans/line-dotted.svg" />
                        </div>
                        <h3>
                            전문 변호사의 <br />
                            <span>“스타트업 필수문서”</span>는 <br />
                            이런 분들에게 필요해요!
                        </h3>
                        <ul className="for">
                            <li><b>언제, 어떤 문서</b>를 쓸지 모르겠는 분 </li>
                            <li>무료 공개 <b>샘플에 대해 불안</b>했던 분</li>
                            <li>법무팀이 없어서 <b>법률문서 작성에 시간을 많이</b> 쓰시는 분</li>
                            <li><b>전문적인 법률문서를 저렴하게 이용</b>하고 싶었던 분</li>
                            <li>기업운영의 <b>속사정을 잘 반영</b>해주는 법률문서가 필요했던 분</li>
                            <li>문서의 <b>작성에서 보관까지 편리하게 관리</b>하고 싶은 분</li>
                        </ul>
                    </div>
                    <div className="form-bar">
                        <label>결제방법 선택</label>
                        <ul className="select-method">
                            <li onClick={()=>this.setState({paymentMethod:'card'})} ><img src={this.state.paymentMethod==='card'?'/images/plans/select-on.svg':'/images/plans/select-off.svg'} />신용카드</li>
                            <li onClick={()=>this.setState({paymentMethod:'trans'})}><img src={this.state.paymentMethod==='trans'?'/images/plans/select-on.svg':'/images/plans/select-off.svg'} />계좌이체</li>
                        </ul>
                    </div>
                    <div className="form-bar">
                        <label>결제금액 확인</label>
                        <div className="price">
                            <div></div>
                            <div>330,000원 (부가세 포함)</div>
                        </div>
                    </div>
                    <Plan plan={13} method={this.state.paymentMethod} btnLabel={'결제하기'} paymentComplete={this.paymentComplete} >
                    </Plan>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

export default Plans;