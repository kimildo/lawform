import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import ReactFullpage from '@fullpage/react-fullpage';
import User from '../../utils/user';
import Survey from '../category/survey';
import Footer from '../common/footer';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            essentialBox:'table',
            screenWidth: null
        };
        this.userInfo = User.getInfo();

    }
    componentDidMount() {
        this.setState({
            screenWidth: this.container.offsetWidth,
        });
    }
    
    render() {
        const { screenWidth } = this.state;
        const anchors = ['main','inspection','essential','contract','company', 'footer'];
        const isMobile = window.innerWidth < 1024;

        const List = 
                <Fragment>
                    <h4 className="list-title text-shadow">이런 분들에게 필요해요!</h4>
                    <ul className="list">
                        <li>정부지원 사업을 수행중인 창업자 분</li>
                        <li>법인설립을 앞둔 분</li>
                        <li>직원수가 많은 분</li>
                        <li>업무협력을 진행중인 분</li>
                        <li>필요할 때마다 문서 찾기 귀찮은 분</li>
                        <li>변호사의 법률문서가 필요한 분</li>
                    </ul>
                </Fragment>
        const Table_array = [
                        {
                            title:'지분관리',
                            docs:[
                                { title:'동업계약서', iddocument:32 },
                                { title:'주주간계약서', iddocument:39 },
                                { title:'스톡옵션계약서', iddocument:35 },
                            ]
                        },
                        {
                            title:'임직원 관리',
                            docs: [
                                { title:'임원계약서', iddocument:38 },
                                { title:'근로계약서', iddocument:30 },
                                { title:'입사자서약서', iddocument:34 },
                            ]
                        },
                        {
                            title:'법인설립',
                            docs: [
                                { title:'정관', iddocument:20 },
                                { title:'주주간계약서', iddocument:39 },
                                { title:'임원계약서', iddocument:38 },
                            ]
                        },
                        {
                            title:'공동사업',
                            docs: [
                                { title:'비밀유지계약서', iddocument:33 },
                                { title:'업무협약서', iddocument:36 },
                                { title:'공동사업약정서', iddocument:54 },
                            ]
                        },
                        {
                            title:'용역계약',
                            docs: [
                            { title:'용역계약서', iddocument:37 },
                            ]
                        }
                ]


        const Table = 
                <Fragment>
                    <h4 className="table-title text-shadow">로폼의 스타트업 필수법률문서</h4>
                    <ul className="table">
                        { Table_array.map((item,key) =>
                            <li key={key}>
                                <div>{item.title}</div>
                                <div>
                                    { item.docs.map( (docs, dockey) =>
                                        <p key={dockey}><Link href={`/preview/`+docs.iddocument+`?referer=/startup#essential/1`}><a>{docs.title}</a></Link></p>
                                    )}
                                </div>
                            </li>
                        )}
                    </ul>
                </Fragment>
        return (
            <div className="main" ref={el => (this.container = el)}>
                <Survey banner={false} ref={ e => { this.child = e; }} title="스타트업 실사 무료진단 신청 문의 " description={<Fragment>무료 체험 신청을 원하시면 아래 내용을 작성해주세요.<br /> 1일 이내에 담당자가 다시 연락 드리겠습니다.</Fragment>} ></Survey>
                <Survey banner={false} ref={ e => { this.child2 = e; }} title="스타트업 실사 솔루션 이용 문의 " description={<Fragment>아래에 신청 문의를 남겨주시면<br />  1일 이내에 담당자가 다시 연락 드리겠습니다.</Fragment>} event={2} ></Survey>
                <Survey banner={false} ref={ e => { this.child3 = e; }} title="강의, 컨설팅 문의 " description={<Fragment>아래에 신청 문의를 남겨주시면<br />  1일 이내에 담당자가 다시 연락 드리겠습니다.</Fragment>} event={5} ></Survey>

                <ReactFullpage
                //fullpage options
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
                    <ReactFullpage.Wrapper>
                        <div className="section main">
                            <div className="wrap">
                                <h1 className="text-shadow">
                                <span>20년 전문 변호사의</span><br />
                                체계적인 <br />
                                프로그램을 만나보세요
                                </h1>
                                <ul>
                                    <li onClick={()=>fullpageApi.moveTo(2)}>스타트업 실사</li>
                                    <li onClick={()=>fullpageApi.moveTo(3)}>스타트업<br /> 필수문서</li>
                                    <li onClick={()=>fullpageApi.moveTo(4)}>투자계약<br /> 실무</li>
                                    <li onClick={()=>this.child2.handleModal( true )}>스타트업 실사<br /> 솔루션</li>
                                </ul>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        <div className="section inspection">
                            <div className="wrap">
                                <h2 className="text-shadow">스타트업 실사란?</h2>
                                <div className="description">투자 전에<br /> 투자 대상 <strong>기업의 법률상의 위험을 체크하는 방법</strong>을<br />
                                    제공하는 프로그램
                                </div>
                                <Link href="/presentation/1" as="/presentation/1" ><button className="text-yellow">스타트업 실사 강의안(무료)</button></Link>
                                <button className="text-yellow" onClick={() => { this.child.handleModal( true ); }} >무료 진단 신청</button>
                                <div className="box">
                                    <h4 className="list-title text-shadow">이런 분들에게 필요해요!</h4>
                                    <ul className="list">
                                        <li>투자나 지원 대상 스타트업이<br /> 잘 성장할지 체크하고 싶은 분</li>
                                        <li>투자대상 기업의 법률적<br /> 평가를 위해 고액의 전문가<br /> 비용을 지불하기 어려운 분</li>
                                        <li>지원 대상 스타트업의<br /> 법률 이슈를 케어하고 싶은 분</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        <div className="section essential">
                            <div className="wrap">
                                <h2 className="text-shadow">스타트업<br />필수법률문서란?</h2>
                                <div className={isMobile?'slide':null} >
                                    <div className="description">
                                        스타트업이 창업, 운영, 투자를 통해<br />
                                        스케일업하는 과정에서 자주 겪는 법률 이슈를 관리하고,<br />
                                        지속적으로 성장하기 위해 작성해야 문서로 구성된 패키지 
                                    </div>
                                    <Link href="/presentation/2" as="/presentation/2"><button className="text-yellow" style={{marginRight:10}}>무료 가이드북</button></Link>
                                    <button className="text-yellow" onClick={() => { this.child.handleModal( true ); }} >무료 체험 신청</button>
                                    {
                                        isMobile?
                                        <div className="box-selector">
                                            <div onClick={()=>fullpageApi.moveTo(3,1)}>필수법률문서에는 무엇이 있나요?</div>
                                            <div onClick={()=>fullpageApi.moveTo(3,2)}>패키지는 이런 분들이 사용하세요</div>
                                        </div>
                                        :
                                        <div className="box-selector">
                                            <div className={ this.state.essentialBox==='table'?'active':null } onClick={()=> this.setState({essentialBox:'table'})}>필수법률문서에는 무엇이 있나요?</div>
                                            <div className={ this.state.essentialBox==='list'?'active':null } onClick={()=> this.setState({essentialBox:'list'})}>패키지는 이런 분들이 사용하세요</div>
                                        </div>
                                    }
                                    <div className="box mobile_hide">
                                        {
                                            this.state.essentialBox === 'list'?
                                            List
                                            :
                                            Table
                                        }
                                    </div>
                                </div>
                                <div  className={isMobile?'slide mobile':'mobile'} >
                                    <div className="box box-table">
                                        { Table }
                                    </div>
                                </div>
                                <div  className={isMobile?'slide mobile':'mobile'} >
                                    <div className="box">
                                        { List }
                                    </div>
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        
                        <div className="section contract">
                            <div className="wrap">
                                <h2 className="text-shadow">로폼의<br />투자계약실무</h2>
                                <div className="description">
                                    성공적인 투자를 위한<br />투자계약 <strong>방법과</strong><br /><strong>투자계약서</strong>를 <strong>함께</strong> 제공하는 프로그램
                                </div>
                                <Link href="/preview/53?referer=/startup#contract" ><button className="text-yellow">투자계약실무 바로가기</button></Link>
                                <button className="text-yellow" onClick={() => { this.child3.handleModal( true ); }} >강의, 컨설팅 문의</button>

                                <div className="box">
                                    <h4 className="list-title text-shadow">이런 분들에게 필요해요!</h4>
                                    <ul className="list">
                                        <li>투자 계약서를 제공받고 싶은 분</li>
                                        <li>투자계약시 유의할 사항을 알고 싶은 분</li>
                                        <li>투자 계약 강의를 들을 시간이 없는 분</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
                        <div className="section company">
                            <div className="wrap">
                                <h1 className="text-shadow">
                                왜<br />
                                로폼인가요?
                                </h1>
                                <div>
                                    로폼은 법조경력 20년이상의 변호사와 <br />
                                    스타트업을 실제 운영하는 변호사 등으로 <br />
                                    구성된 전문가팀이, 스타트업으로서의 <br />
                                    공감대를 갖고 프로그램을 운영합니다
                                </div>
                                <div className="box">
                                    <h4 className="">제휴사 및 고객사</h4>
                                    <div>
                                        <img src="/images/startup/biz-customers.png" />
                                    </div>
                                </div>
                            </div>
                            <div className="down" onClick={()=>fullpageApi.moveSectionDown()} ><img src="/images/startup/arrow-box-down.svg" /></div>
                        </div>
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
