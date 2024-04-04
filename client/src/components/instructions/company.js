import React, {Component, Fragment} from 'react';
// import '../../scss/instructions/company.scss';
import NumberFormat from "react-number-format";
import Reviews from "./reviews";
import Modal from "../common/modal";

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            requireActive: true,
            animationStartPosition: [0.5147485493230174, 0.8838432122370937],
            showMemberIntro: false
        };

        this.menuLeftRef = React.createRef();
        this.menuRightRef = React.createRef();
        this.detailRef = React.createRef();
        this.reviewsRef = React.createRef();

    }

    clickMenu = (param) => {
        if (param === 'detail') {
            this.menuLeftRef.current.style.borderBottom = "solid 3px #15376c";
            this.menuRightRef.current.style.borderBottom = "none";
            this.reviewsRef.current.style.display = "none";
            this.detailRef.current.style.display = "block";
        } else {
            this.props.fixedIconRef.current.style.display = "none"
            this.menuLeftRef.current.style.borderBottom = "none";
            this.menuRightRef.current.style.borderBottom = "solid 3px #15376c";
            this.detailRef.current.style.display = "none";
            this.reviewsRef.current.style.display = "block";
        }
    };

    render() {
        let data = this.props.data;
        return (
            <Fragment>
                <div className="company">
                    <div className='menu'>
                        <div className='menu_wrap'>
                            <div ref={this.menuLeftRef} className='left_content' onClick={this.clickMenu.bind(this, 'detail')}>
                                <span>문서 알아보기</span>
                            </div>
                            <span className='vl'/>
                            <div ref={this.menuRightRef} className='right_content' onClick={this.clickMenu.bind(this, 'reviews')}>
                                <span>작성 후기</span>
                            </div>
                        </div>
                    </div>
                    <section className="wrap" ref={this.detailRef}>
                        <div className="section_01">
                            <div className="section_01_left">
                                <img src='/instructions/certifications/01.svg'/>
                                <div style={{marginTop: '10px'}}>{data.section[1].leftText}</div>
                            </div>
                            <div className="section_01_right">
                                <div className="right_top">
                                    <div className="header"><img src="/instructions/company/icon_1.svg"/>{data.section[1].rightTopText[0]}</div>
                                    <div className="content">{data.section[1].rightTopText[1]}</div>
                                </div>
                                {
                                    data.section[1].subText !== undefined &&
                                    <Fragment>
                                        <div className="right_content">{data.section[1].subText.map((item, key) => (<Fragment key={key}>{item}</Fragment>))}</div>
                                    </Fragment>
                                }
                                <div className="right_bottom" style={{background: data.section[1].botImg[0]}}>
                                    <div className="text_01">{data.section[1].botImg[1]}</div>
                                </div>
                            </div>
                        </div>
                        <div className="section_02">
                            <div className="section_02_left">
                                <img src='/instructions/certifications/02.svg'/>
                                <div style={{marginTop: '10px'}}>{data.section[2].leftText}</div>
                            </div>
                            <div className="section_02_right">
                                <div className="right_top">
                                    <div className="text_01">나는 <span className="color_15376c">어떤 이유</span>로 기업문서를 제대로 쓰거나 검토하지 않을까요?</div>
                                    <div className="text_02">사업자 중 대부분이 제대로 검토하지 않은 기업문서로 인해 <span className="color_15376c">법적분쟁을 경험하고 있습니다</span></div>
                                </div>
                                <div className="right_middle"><img src="/instructions/company/02/img_01.jpg"/></div>
                                <div className="right_bottom">
                                    <div className="text_01">어려운 기업문서 작성, 로폼이 도와드립니다</div>
                                    <div className="img_wrap"><img src="/instructions/company/02/img_02.jpg"/>
                                        <div className="clickable_box" onClick={() => this.setState({showMemberIntro: true})}/>
                                    </div>
                                    <Modal
                                        open={this.state.showMemberIntro}
                                        onClose={(e) => this.setState({showMemberIntro: false})}
                                        width={780}
                                        height={535}
                                        className="show-member-intro"
                                        scroll="body">
                                        <div className="default-dialog-title" style={{textAlign: 'left'}}>대표 변호사 소개
                                            <span className="close" onClick={(e) => this.setState({showMemberIntro: false})}><img src="/common/close-white.svg"/></span>
                                        </div>
                                        <div className="content" style={{padding: '25px 25px 22px 25px'}}><img src="/info_img/member-intro-pop.jpg"/></div>
                                        <div style={{width: '100%', height: 15, backgroundColor: '#15376C'}}/>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                        <div className="section_03">
                            <div className="section_03_left">
                                <img src='/instructions/certifications/03.svg'/>
                                <div style={{marginTop: '10px'}}>자동작성으로<br/><span className="color_15376c">신속하고 편리하게</span><br/>완성하세요</div>
                            </div>
                            <div className="section_03_right">
                                <div className="right_header">기업문서 자동작성의 <span className="color_15376c">편리함</span>을 경험해 보세요</div>
                                <div className="img_text"><img src="/instructions/company/03/icon_01.svg" style={{marginRight: '15px'}}/>기업문서 작성완료까지<span>5분~10분!</span>시간이 곧 비용!!</div>
                                <div className="right_content">
                                    <div className="ani_wrap">
                                        {
                                            (this.props.scrollPosition > this.state.animationStartPosition[0]) &&
                                            <img className="ani_img" src="/instructions/company/03/img_02.svg"/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="section_04">
                            <div className="section_04_left">
                                <img src='/instructions/certifications/04.svg'/>
                                <div style={{marginTop: '10px'}}><span className="color_15376c">변호사가<br/>작성한 내용</span>으로<br/>완성하세요</div>
                            </div>
                            <div className="section_04_right">
                                <div className="right_header">변호사가 작성한 것처럼 기업문서를 <span className="color_15376c">전문적</span>으로 완성할 수 있습니다</div>
                                <div className="right_content">
                                    <div style={{marginBottom: '39px'}}>
                                        <img src='/instructions/company/04/icon-1.svg'/><span>법조경력 20년 이상의 변호사가 만든 내용</span>
                                    </div>
                                    <div style={{marginBottom: '39px'}}>
                                        <img src='/instructions/company/04/icon-2.svg'/><span>어려운 법률조항과 법률용어가 자동작성</span>
                                    </div>
                                    <div>
                                        <img src='/instructions/company/04/icon-3.svg'/><span>변호사의 작성가이드로 기업문서 작성안내</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="section_05" style={{paddingBottom: '80px'}}>
                            <div className="section_05_left">
                                <img src='/instructions/certifications/05.svg'/>
                                <div style={{marginTop: '10px'}}>가장<br/><span className="color_15376c">저렴하게</span><br/>작성하세요</div>
                            </div>
                            <div className="section_05_right">
                                <div className="right_header">기존 기업문서 작성, 검토비용의 <span className="color_15376c">1/10가격</span>으로 완성할 수 있습니다</div>
                                <div className="right_content">
                                    <div className="content">
                                        <span>변호사</span>
                                        <div className='dot'>
                                            <img src='/instructions/certifications/03/icon_1.svg'/>
                                        </div>
                                        <div className='animation_wrap'>
                                            {
                                                (this.props.scrollPosition > this.state.animationStartPosition[1]) &&
                                                <div className='animation_end_01'/>
                                            }
                                        </div>
                                        <div>30~100만원</div>
                                    </div>
                                    <div className="content">
                                        <span>법무사</span>
                                        <div className='dot'>
                                            <img src='/instructions/certifications/03/icon_1.svg'/>
                                        </div>
                                        <div className='animation_wrap'>
                                            {
                                                (this.props.scrollPosition > this.state.animationStartPosition[1]) &&
                                                <div className='animation_end_02'/>
                                            }
                                        </div>
                                        <div>10~30만원</div>
                                    </div>
                                    <div className="content" style={{margin: '0 0 0 -50px'}}>
                                        <span style={{width: '105px'}}>양식제공업체</span>
                                        <div className='dot'><img src='/instructions/certifications/03/icon_2.svg'/></div>
                                        <div className='animation_wrap'/>
                                        <div style={{zIndex: '1'}}>전문성 없는 내용</div>
                                    </div>
                                    <div className="content">
                                        <img src='/instructions/certifications/03/star.svg' style={{position: 'absolute', left: '-30px'}}/>
                                        <span className='law_form'>로폼</span>
                                        <div className='dot'><img src='/instructions/certifications/03/icon_1.svg'/></div>
                                        <div className='animation_wrap'>
                                            {
                                                (this.props.scrollPosition > this.state.animationStartPosition[1]) &&
                                                <div className='animation_end_03'/>
                                            }
                                        </div>
                                        <div className='amount'><NumberFormat value={this.props.docData.dc_price} displayType={'text'} thousandSeparator={true}/> 원</div>
                                        <img src='/instructions/certifications/03/90.jpg' style={{position: 'absolute', right: '-10px', top: '55px'}}/>
                                    </div>
                                    <div className='animation_02_wrap'>
                                        {
                                            (this.props.scrollPosition > this.state.animationStartPosition[1]) &&
                                            <Fragment>
                                                <div className='ani_02_top_bottom'/>
                                                <div className='ani_02_content'>
                                                    <span className='ani_02_text_01'>최대</span>
                                                    <div className='ani_02_text_02'><img src='/instructions/certifications/03/minus.svg'/><span className='ani_02_text_03'>{data.reducedPrice[0]}</span></div>
                                                </div>
                                            </Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </section>
                </div>
                <section ref={this.reviewsRef} style={{display: 'none'}}>
                    <Reviews document={this.state.document}/>
                </section>
            </Fragment>
        )
    }
}

export default Company