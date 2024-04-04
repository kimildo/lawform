
import React, {Component} from 'react';
import User from '../../utils/user';
import API from '../../utils/apiutil';
import ReactGA from 'react-ga';

class Thankyou extends Component {

    constructor(props) {
        super(props)
        this.state = {
            story1:"",
            story2:""
        }
    }

    handleChange = (e) => {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert("로그인 후 이용해주세요.")
            window.location.href = "#signin"
        } else {
            let name = e.target.name
            let value = e.target.value
    
            if( name === 'story1') {
                this.setState({ story1:value })
            }
            if( name === 'story2') {
                this.setState({ story2:value })
            }
        }
    }

    handlesubmit = () => {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert("로그인 후 이용해주세요.")
            window.location.href = "#signin"
        } else {
            if( this.state.story1.length > 30 && this.state.story2.length > 30 ) {
                var params = {
                    event: 6,
                    idusers:userInfo.idusers,
                    data:{
                        story1:this.state.story1,
                        story2:this.state.story2
                    },
                    type: 'onetime'
                }
                API.sendPost('/event/setdata', params ).then(result => {

                    if( result.status === 'ok' ) {
                        alert('이벤트 참여가 완료 되었습니다.\n당첨자 발표 및 경품 발송은 2월 5일에 진행됩니다.');
                        window.location.href = "/"
                    } else {
                        if( result.reason === "EXIST" ) {
                            alert("이미 참여하셨습니다.")
                        } else {
                            alert("등록에 실패했습니다. 잠시 후 이용해주십시오")
                        }

                    }
                });
            } else {
                alert("30자 이상 작성해주세요.");
            }

        }

    }
    render() {
        return (
            <div className="thankyou">
                <div className="intro">
                    <img src="/images/event/thankyou/title-img.svg" />
                    <img className="sub-title" src="/images/event/thankyou/intro-sub-title.svg" />
                    <ul className="box">
                        <li>
                            <label>이벤트 기간</label>
                            <div>2019. 12. 24. ~ 2020. 01. 31.</div>
                        </li>
                        <li>
                            <label>이벤트 대상</label>
                            <div>로폼의 내용증명, 지급명령 문서 구매 회원</div>
                        </li>
                        <li>
                            <label>당첨자 발표</label>
                            <div>2020.02.05 홈페이지 게재 및 당첨자 개별 연락</div>
                        </li>
                        <li>
                            <label>참여방법</label>
                            <div>하단 작성란에 사연을 작성</div>
                        </li>
                    </ul>
                    <ul className="gifts">
                        <li>
                            <div className="gift"><img src="/images/event/thankyou/giftcard-50000.png" /></div>
                            <div className="circle"><img src="/images/event/thankyou/gift-01.svg" /></div>
                        </li>
                        <li>
                            <div className="gift"><img src="/images/event/thankyou/giftcard-10000.png" /></div>
                            <div className="circle"><img src="/images/event/thankyou/gift-02.svg" /></div>
                        </li>
                        <li>
                            <div className="gift coffee"><img src="/images/event/thankyou/coffeecan.png" /></div>
                            <div className="circle"><img src="/images/event/thankyou/gift-03.svg" /></div>
                        </li>
                    </ul>
                </div>
                <div className="storys">
                    <img src="/images/event/thankyou/title-img-02.svg" />
                    <img className="storys-img" src="/images/event/thankyou/storys-img.svg" />
                </div>
                <div className="event-forms">
                    <img src="/images/event/thankyou/title-img-03.svg" />
                    <div className="tip"><span>*  당첨 TIP!</span> 구체적으로 자세히 작성해 주실수록 당첨 확률이 높아집니다.</div>
                    <form >
                        <label>1. 내용증명 혹은 지급명령 작성 전 어떤 상황이셨나요?</label>
                        <textarea id="story1" name="story1" onChange={e=>this.handleChange(e)}></textarea>
                        <label>2. 내용증명 혹은 지급명령 발송 후 현재 어떻게 해결 되셨나요?
                                <span>*완벽히 해결된 상황이 아니어도 괜찮습니다. 현재 상황 그대로를 작성해주세요.</span></label>
                        <textarea id="story2" name="story2" onChange={e=>this.handleChange(e)}></textarea>
                        <button type="button" onClick={()=>this.handlesubmit()}>이벤트 참여</button>
                    </form>
                </div>
                <div className="readme">
                    <div className="box">
                        <div className="title">꼭 읽어주세요</div>
                        <ul>
                            <li>본 이벤트는 내용증명 혹은 지급명령신청서 구매 회원을 대상으로 합니다.</li>
                            <li>이벤트는 중복 참여가 되지 않습니다.</li>
                            <li>참여 회원님의 가입 정보로 안내 문자나 메일이 발송됩니다.<br className="mobile" /> 참여 전 회원 정보를 확인해주세요.</li>
                            <li>경품은 모바일 쿠폰으로 발송됩니다.</li>
                            <li>회원님의 과실로 모바일 기프티콘을 재 발송 할 수 없습니다.</li>
                            <li>작성해주신 내용은 익명으로 홈페이지나 기타 홍보 자료에 활용될 수 있습니다. </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};

export default Thankyou;