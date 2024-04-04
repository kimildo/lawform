import React, {Component, Fragment} from 'react';
import Carousel from 'nuka-carousel';
// import '../../scss/instructions/certifications.scss';
import NumberFormat from "react-number-format";
import Reviews from "./reviews";

class Certifications extends Component{
    constructor(props){
        super(props);
        this.state = {
            slideIndex: 0,
            requireActive: true,
            animationStartPosition: 0.3475238922675934,
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
            // this.props.fixedIconRef.current.style.display = "none"
            this.menuLeftRef.current.style.borderBottom = "none";
            this.menuRightRef.current.style.borderBottom = "solid 3px #15376c";
            this.detailRef.current.style.display = "none";
            this.reviewsRef.current.style.display = "block";
        }
    };

    render(){
        let data = this.props.data;
        return(
            <Fragment>
                <div className="certifications">
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
                                <div style={{marginTop: '10px'}}>왜 <span className="color_15376c">내용증명</span>이<br/>중요한가요?</div>
                            </div>
                            <div className="section_01_right">
                                <div className="right_header"><span className="color_15376c">{data.section[1].titleText[0]}</span><br/>{data.section[1].titleText[1]}</div>
                                <div className="right_content">{data.section[1].subText.map((item, key) => (<Fragment key={key}>{item}</Fragment>))}</div>
                            </div>
                        </div>
                        <div className="section_02">
                            <div className="section_02_left">
                                <img src='/instructions/certifications/02.svg'/>
                                <div style={{marginTop: '10px'}}><span className="color_15376c">언제</span><br/>사용하나요?</div>
                            </div>
                            <div className="section_02_right">
                                <div className="right_header">{data.section[2].titleText[0]}{data.section[2].titleText[1]}{data.section[2].titleText[2]}</div>
                                <div className="right_middle">
                                    <img src='/instructions/certifications/02/tip.svg' style={{margin: '0 20px 0 35px'}}/>
                                    <span style={{fontSize: '18px', letterSpacing: '0.36px', color: '#15376c'}}>상대방과 관련된 주소를 꼭 알고 있어야 합니다</span>
                                </div>
                                {
                                    data.section[2].requireContent &&
                                    <div className='require'>
                                        <div className='content'>
                                            <div className='box_01'/>
                                            <span className='text_01'>명예훼손 성립요건</span>
                                            <img className='toggle'
                                                 src={this.state.requireActive ? '/instructions/certifications/02/angle_01.svg' : '/instructions/certifications/02/angle_02.svg'}
                                                 onClick={() => {
                                                     this.setState({requireActive: !this.state.requireActive});
                                                 }}/>
                                        </div>
                                        {
                                            !this.state.requireActive &&
                                            <img src={'/instructions/certifications/02/require_7.jpg'}/>
                                        }
                                    </div>
                                }
                                <Fragment>
                                    <Carousel slideWidth="241px" initialSlideWidth="241px" width="705px" framePadding="0px 0px 38px"
                                              renderCenterLeftControls={({previousSlide}) => (this.state.slideIndex > 0) && <img className='carousel_button_l' src='/instructions/certifications/02/button_l.svg' onClick={previousSlide}/>}
                                              renderCenterRightControls={({nextSlide}) => (this.state.slideIndex + 3 < data.section[2].card.length) && <img className='carousel_button_r' src='/instructions/certifications/02/button_r.svg' onClick={nextSlide}/>}
                                              slideIndex={this.state.slideIndex}
                                              afterSlide={slideIndex => this.setState({slideIndex})}>
                                        {
                                            data.section[2].card.map((item, key) => (
                                                <div className='section_02_card' key={key}>
                                                    <img src={item.src}/>
                                                    <div className='section_02_card_text' style={{padding: '13px'}}>{item.text}</div>
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </Fragment>
                                {
                                    data.section[2].case &&
                                    <div className='case_01'>
                                        <div className='header'>
                                            <div className='box_01'/>
                                            {data.section[2].case[0]}
                                        </div>
                                        <div className='content'>
                                            {data.section[2].case[1]}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* <div className="section_03">
                            <div className="section_03_left">
                                <img src='/instructions/certifications/03.svg'/>
                                <div style={{marginTop: '10px'}}>가장<br/><span className="color_15376c">저렴하게</span><br/>작성하세요</div>
                            </div>
                            <div className="section_03_right">
                                <div className="right_header">기존 내용증명 대행비용의 <span className="color_15376c">1/10가격</span>으로 작성할 수 있습니다</div>
                                <div className="right_content">
                                    <div className="content">
                                        <span>변호사</span>
                                        <div className='dot'>
                                            <img src='/instructions/certifications/03/icon_1.svg'/>
                                        </div>
                                        <div className='animation_wrap'>
                                            {
                                                (this.props.scrollPosition > this.state.animationStartPosition) &&
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
                                                (this.props.scrollPosition > this.state.animationStartPosition) &&
                                                <div className='animation_end_02'/>
                                            }
                                        </div>
                                        <div>10~30만원</div>
                                    </div>
                                    <div className="content">
                                        <span>웹문서</span>
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
                                                (this.props.scrollPosition > this.state.animationStartPosition) &&
                                                <div className='animation_end_03'/>
                                            }
                                        </div>
                                        <div className='amount'><NumberFormat value={this.props.docData.dc_price} displayType={'text'} thousandSeparator={true}/> 원</div>
                                        <img src='/instructions/certifications/03/90.jpg' style={{position: 'absolute', right: '-10px', top: '55px'}}/>
                                    </div>
                                    <div className='animation_02_wrap'>
                                        {
                                            (this.props.scrollPosition > this.state.animationStartPosition) &&
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
                        <div className="section_04">
                            <div className="section_04_left">
                                <img src='/instructions/certifications/03.svg'/>
                                <div style={{marginTop: '10px'}}><span className="color_15376c">변호사가<br/>작성한 내용</span>으로<br/>완성하세요</div>
                            </div>
                            <div className="section_04_right">
                                <div className="right_header">변호사가 작성한 것처럼 <span className="color_15376c">전문적인 내용</span>으로 완성할 수 있습니다</div>
                                <div className="right_middle">
                                    <div style={{marginBottom: '47px'}}>
                                        <img src='/instructions/certifications/04/icon-1.svg'/><span>어려운 법률조항과 법률용어가 자동작성</span>
                                    </div>
                                    <div>
                                        <img src='/instructions/certifications/04/icon-2.svg'/><span>변호사의 작성가이드로 내용증명에 대한 자세한 안내</span>
                                    </div>
                                </div>
                                <div className="right_bottom">
                                    <img src='/instructions/certifications/04/tip.svg'/>
                                    <div className="text_01">
                                        완성된 내용증명 하단에<br />
                                        우측의 로폼 워터마크가 필요한 분은<br />
                                        자동작성 페이지 혹은 내문서보관함의 <br />
                                        편집요청을 통해 요청해 주시면<br />
                                        워터마크를 삽입해 드립니다.
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <img src='/instructions/certifications/04/law-form.png'/>
                                        <span className="text_02">[로폼 워터마크]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="section_05">
                            <div className="section_05_left">
                                <img src='/instructions/certifications/04.svg'/>
                                <div style={{marginTop: '10px'}}>자동작성으로<br/><span className="color_15376c">신속하고 편리하게<br/></span>완성하여<br/>발송하세요</div>
                            </div>
                            <div className="section_05_right">
                                <div className="right_header">내용증명을 <span className="color_15376c">자동으로 완성</span>하여, 활용방법까지 안내드립니다</div>
                                <div className="right_middle">
                                    <img className="img_01" src='/instructions/certifications/05/img-04.png' onClick={() => window.location.href = '/service'}/>
                                </div>
                                <div className="right_bottom">
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <img style={{marginRight: '15.5px'}} src='/instructions/certifications/05/icon-01.svg'/>
                                        <span className="text_02">내용증명 작성완료까지 5분! 시간이 곧 비용!!</span>
                                    </div>
                                </div>
                                <img style={{margin: '30px 0 15px'}} src='/instructions/certifications/05/img-03.jpg'/>
                                <img style={{marginBottom: '35px'}} src='/instructions/certifications/05/img-02.jpg'/>
                            </div>
                        </div>
                    </section>
                </div>
                <section ref={this.reviewsRef} style={{display: 'none'}}>
                    <Reviews document={this.state.document}/>
                </section>
            </Fragment>
        )
    }
}

export default Certifications