import React, { Component, Fragment } from 'react';

import Reviews from './reviews';
import ReactFullpage from '@fullpage/react-fullpage';
import Footer from '../common/footer';
import User from '../../utils/user'
import Api from '../../utils/apiutil';
import Router from 'next/router';
var agent
if( process.browser )  agent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideo:false,
            video:{},
            youTubeSrc: "",
            youTubeBtn: { display: "block" },
            isMobile : agent,
            isModalShow1 : false,
            isModalShow2 : false,
            isModalShow3 : false,
            pressItems: [],
            question : "",
            openQuestion : false
        }
        this.userInfo =  User.getInfo()
    }

    componentDidMount() {
        Api.sendPost('/board/press', {type:'main'}).then((res) => {
            if (res.status === 'ok') {
                this.setState({
                    pressItems: res.data.press
                })
            }
        })
    }

    setQuestion(e) {
        if( !this.userInfo ) {
            alert('로그인 후에 이용해주십시오.')
            window.location = "#signin"    
            return false
        } else {
            this.setState({ question:e.target.value })
        }

    }

    sendQuestion(e) {
        if( !this.userInfo ) {
            alert('로그인 후에 이용해주십시오.')
            window.location = "#signin"    
            return false
        }

        if( this.state.question === '' ||this.state.question === null ) {
            alert('문의 내용을 입력해주세요.')
            return false
        }
        var params = {
            question : this.state.question
        }
        Api.sendPost('/user/writeqna', params).then((result) => {
            
            if( result.status === 'ok' ) {
                this.setState({
                    question: "",
                    openQuestion: false
                }, () => {
                    alert('회원님 감사합니다.\n문의가 등록 되었습니다.\n답변은 문의 등록 후 24시간 이내 회신을 원칙으로 하고 있습니다.\n답변 등록시 문자로 안내 드립니다.')
                })
            }
        });
    }

    render() {
        const anchors = ['main','reivew','videos','footer']
        var isMobile
        if( process.browser ) isMobile =  window.innerWidth < 1024

        return (
            <div className="main">
                {!!this.state.openQuestion?
                <div className="qna-popup">
                    <div className="photo">
                        <img src='/images/home/qna-photo.png' />
                    </div>
                    <h1>무엇을 도와드릴까요?</h1>
                    {/* <h2 className="mobile_hide">현재 처해 있는 상황이나 내용을 자세히 작성해주세요.</h2> */}
                    <textarea 
                        placeholder={`회원님의 고민을 편하게 말씀해주세요. 
이후 로폼에서는 회원님에게 적합한 문서와 해결 방법을 안내드립니다.
                        
고객센터 : 02-6925-0227(오전 10시~오후7시, 점심시간 : 12시30분~오후2시)`} 
                        value={this.state.question} 
                        onChange={e=> this.setQuestion(e)}>
                    </textarea>
                    <div className="buttons">
                        <button className="cancel" onClick={()=>this.setState({ openQuestion:false, question:'' })}>취소</button>
                        <button className="submit" onClick={() => this.sendQuestion()}>접수</button>
                    </div>
                </div>
                :null
                }
                <div className="floating-btns mobile_hide">
                    <h3>어떤 문서가 필요하세요?</h3>
                    <div onClick={()=>this.setState({ openQuestion: true})} ><img src="/images/home/floating-searchdoc.svg"/></div>
                    <div onClick={()=>{window.location.href="/#main"}}><img src="/images/home/floating-counsel.svg"/></div>
                </div>
                <div onClick={()=>this.setState({ openQuestion: true})} className="mobile btn-question"><img src="/images/home/btn-question-mobile.svg"  /></div>
                <ReactFullpage
                licenseKey = {'245B4949-E5FD4642-A4799F34-9ED95BA6'}
                scrollingSpeed = {700}
                lockAnchors={false}
                anchors={anchors}
                verticalCentered={false}
                controlArrows={false}
                slidesNavigation={true}
                navigation
                render={({ state, fullpageApi }) => {
                    return (
                    <ReactFullpage.Wrapper >
                        <div className="section main">
                            <div className="wrap">
                                <h1 className="text-shadow">어떤 도움이<br />필요하신가요?</h1>
                                <h2>로폼은 법률문서자동작성을 통해 법률문제를 해결합니다.</h2>
                                <ul className="categorys">
                                    <li onClick={()=>Router.push('/category/1')}><span>내용증명</span></li>
                                    <li onClick={()=>Router.push('/category/3')}><span>지급명령</span></li>
                                    <li onClick={()=>Router.push('/category/99')}><span>계약서</span></li>
                                    <li onClick={()=>Router.push('/category/4')}><span>합의서</span></li>
                                    <li onClick={()=>Router.push('/startup/document')}><span>스타트업</span></li>
                                    {/* <li onClick={()=>window.location='/startup'} className="mobile" ><span>스타트업<br />프로그램</span></li> */}
                                </ul>
                                {/* <div className="qna-copy">어떤 문서를 써야 하는지 모르겠어요</div> */}
                                <div className="btn-counsel mobile_hide">
                                    <h4>어떤 문서를 써야 하는지 모르겠어요</h4>
                                    <button onClick={()=>this.setState({ openQuestion: true})} className="btn-question">
                                        상담이 필요해요
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10.03" height="18.061" viewBox="0 0 10.03 18.061">
                                            <path id="path_1832" data-name="path 1832" d="M7226-1057l7.616,7.616-7.616,7.616" transform="translate(-7224.586 1058.414)" fill="none" stroke="#15376C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        <div className="section reviews">
                            <div className="wrap">
                                <h1>가장 쉽고, 빠르게<br />전문적으로 완성합니다</h1>
                                <h2>
                                    {/* 고객들의 생생한 실제 후기를 읽어보세요! */}
                                </h2>
                                <Reviews></Reviews>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        <div className="section videos">
                            <div className="wrap">
                                <h2 className="text-shadow">로폼이 뭔지 아직도 모르시는 분들을 위해?</h2>
                                <h1>아직도 어떻게 해야할지<br />막막하세요?</h1>
                                <div className='vertical-line'></div>
                                <h3>로폼이란?</h3>
                                <div className="mobile line" />
                                <p>간단한 입력으로 <br className="mobile_hide" />
                                변호사의 문서를 <br className="mobile_hide" />
                                완성할수 있는 
                                시스템입니다
                                </p>
                                <div className="video-frame">
                                    {
                                        !!this.state.videoload?
                                        <iframe 
                                        className="youtube" 
                                        width="515" 
                                        height="342" 
                                        src="https://www.youtube-nocookie.com/embed/AGCYzKnAFGc?controls=1&autoplay=1&mute=1" 
                                        frameborder="2" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" 
                                        allowfullscreen="allowfullscreen"
                                        ></iframe>
                                        :
                                        <img src="/images/home/video-cover.jpg" className="youtube" onClick={()=> this.setState({videoload:true})} />
                                    }
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        {/* <div className="section contents">
                            <div className="wrap">
                                <h2>법률은 누구나 당연하게 누릴 권리입니다</h2>
                                <h1>알고보면 법(法)은<br />어렵지 않습니다</h1>
                                <div className='vertical-line'></div>
                                <button>
                                    법률 컨텐츠 더보기
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.03" height="18.061" viewBox="0 0 10.03 18.061">
                                        <path id="패스_1832" data-name="패스 1832" d="M7226-1057l7.616,7.616-7.616,7.616" transform="translate(-7224.586 1058.414)" fill="none" stroke="#575247" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>
                                </button>
                                <ul className="magazine-thumbs">
                                    <li>
                                        <img src="/images/home/magazine-thumb-01.jpg" />
                                        <div>변호사의 내용증명, <br />지급명령, 계약서를 <br />1만원에 완성! <br />로폼의 특급 EVENT!</div>
                                    </li>
                                    <li>
                                        <img src="/images/home/magazine-thumb-02.jpg" />
                                        <div>[법률문서 자동작성] <br />로폼의 스타트업 <br />법률강의 현장</div>
                                    </li>
                                    <li>
                                        <img src="/images/home/magazine-thumb-03.jpg" />
                                        <div>[이벤트]로폼의 대국민 법률서비스! <br />오직 7일간 만원의 <br />행복으로 만나보세요</div>
                                    </li>
                                    <li>
                                        <img src="/images/home/magazine-thumb-04.jpg" />
                                        <div>특허전쟁 2019 로폼 참여 현장 후기</div>
                                    </li>
                                </ul>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div> */}
                        <div className={`section footer ${isMobile?'':'short'}`} >
                            <div className="wrap">
                                <Footer/>
                            </div>
                        </div>
                    </ReactFullpage.Wrapper>
                    );
                }}
                />
            </div>

        );
    }
}

export default Main;
