import React, {Component, Fragment} from 'react';
// import '../../scss/instructions/paymentorder.scss';
import NumberFormat from "react-number-format";
import Reviews from "./reviews";

class PaymentOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: '/instructions/paymentorder/02/chart_01.svg',
            animationStartPosition: 0.18137847642079807,
        };

        this.detailMenuRef = React.createRef();
        this.serviceMenuRef = React.createRef();
        this.reviewMenuRef = React.createRef();
        this.detailRef = React.createRef();
        this.serviceRef = React.createRef();
        this.reviewsRef = React.createRef();
    }

    clickMenu = (param) => {
        if (param === 'detail') {
            this.detailMenuRef.current.style.borderBottom = "solid 3px #15376c";
            this.serviceMenuRef.current.style.borderBottom = "none";
            this.reviewMenuRef.current.style.borderBottom = "none";
            this.detailRef.current.style.display = "block";
            this.serviceRef.current.style.display = "none";
            this.reviewsRef.current.style.display = "none";
            return;
        }

        if (param === 'service') {
            this.detailMenuRef.current.style.borderBottom = "none";
            this.serviceMenuRef.current.style.borderBottom = "solid 3px #15376c";
            this.reviewMenuRef.current.style.borderBottom = "none";
            this.detailRef.current.style.display = "none";
            this.serviceRef.current.style.display = "block";
            this.reviewsRef.current.style.display = "none";
            return;
        }

        if (param === 'reviews') {
            // this.props.fixedIconRef.current.style.display = "none"
            this.detailMenuRef.current.style.borderBottom = "none";
            this.serviceMenuRef.current.style.borderBottom = "none";
            this.reviewMenuRef.current.style.borderBottom = "solid 3px #15376c";
            this.detailRef.current.style.display = "none";
            this.serviceRef.current.style.display = "none";
            this.reviewsRef.current.style.display = "block";
            return;
        }
    };

    render() {
        let data = this.props.data;
        return (
            <Fragment>
                <div className="payment_order">
                    <div className='menu'>
                        <div className='menu_wrap'>
                            <div ref={this.detailMenuRef} className='detail_menu' onClick={this.clickMenu.bind(this, 'detail')}>
                                <span>문서 알아보기</span>
                            </div>
                            <span className='vl'/>
                            <div ref={this.serviceMenuRef} className='service_menu' onClick={this.clickMenu.bind(this, 'service')}>
                                <span>서비스 특징</span>
                            </div>
                            <span className='vl'/>
                            <div ref={this.reviewMenuRef} className='review_menu' onClick={this.clickMenu.bind(this, 'reviews')}>
                                <span>작성 후기</span>
                            </div>
                        </div>
                    </div>
                    <section className="wrap" ref={this.detailRef}>
                        <div className="detail_section">
                            <div className="section_01">
                                <div className="section_01_left">
                                    <img src='/instructions/certifications/01.svg'/>
                                    <div style={{marginTop: '10px'}}>왜 <span className="color_15376c">지급명령</span>이<br/>중요한가요?</div>
                                </div>
                                <div className="section_01_right">
                                    <div className="right_header">빌려준 돈, 매매대금, 보증금 등 각종 못받은 돈을<br/>법정변론을 거치지 않고 빠르게 지급받을 수 있는 방법입니다</div>
                                    <div className="right_content">
                                        <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송보다 저렴한 비용</span></div>
                                        <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>소송보다 빠른 확정</span></div>
                                        <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>소송보다 간편한 신청</span></div>
                                        <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>판결과 같은 효력으로<br/>강제집행 신청 가능</span></div>
                                    </div>
                                    <img src='/instructions/paymentorder/01/bot.jpg'/>
                                </div>
                            </div>
                            <div className="section_02">
                                <div className="section_02_left">
                                    <img src='/instructions/certifications/02.svg'/>
                                    <div style={{marginTop: '10px'}}>지급명령<br/>소송보다<br/><span className="color_15376c">얼마나<br/>저렴</span>할까요?</div>
                                </div>
                                <div className="section_02_right">
                                    <div className="right_header">최대 <span className="color_15376c">소송 인지대의 1/10 비용</span>으로 저렴하게 신청한 후,<br/>채무자에게 돌려받을 수 있습니다</div>
                                    <div className="right_middle">
                                        <img src='/instructions/paymentorder/02/img_01.svg'/>
                                        <div style={{position: 'relative', margin: '55px 0'}}>
                                            <div className='chart_01' onClick={() => {
                                                this.setState({chart: '/instructions/paymentorder/02/chart_01.svg'})
                                            }}/>
                                            <div className='chart_02' onClick={() => {
                                                this.setState({chart: '/instructions/paymentorder/02/chart_02.svg'})
                                            }}/>
                                            <div className='chart_03' onClick={() => {
                                                this.setState({chart: '/instructions/paymentorder/02/chart_03.svg'})
                                            }}/>
                                            <img src={this.state.chart}/>
                                        </div>
                                        <img src='/instructions/paymentorder/02/tip.svg'/>
                                    </div>
                                </div>
                            </div>
                            <div className="section_03">
                                <div className="section_03_left">
                                    <img src='/instructions/certifications/03.svg'/>
                                    <div style={{marginTop: '10px'}}>지급명령<br/>소송보다<br/><span className="color_15376c">얼마나 빠를까요</span>?</div>
                                </div>
                                <div className="section_03_right">
                                    <div className="right_header"><span className='color_15376c'>지급명령 확정까지 3주!</span><br/>소송보다 빠르게 법원의 지급명령 확정을 받을 수 있습니다</div>
                                    <img src="/instructions/paymentorder/03/chart.svg" style={{marginTop: '36px'}}/>
                                </div>
                            </div>
                            <div className="section_04">
                                <div className="section_04_left">
                                    <img src='/instructions/certifications/04.svg'/>
                                    <div style={{marginTop: '10px'}}>지급명령<br/><span className='color_15376c'>얼마나 간편</span>하게<br/>신청할 수 있을까요?</div>
                                </div>
                                <div className="section_04_right">
                                    <div className="right_header"><span className='color_15376c'>간편한 신청 절차!</span><br/>로폼의 지급명령신청서 하나면 별도의 절차없이 끝!</div>
                                    <img src="/instructions/paymentorder/04/chart.svg" style={{margin: '40px 0 0 43px'}}/>
                                    <img src="/instructions/paymentorder/04/tip.svg" style={{marginTop: '55px'}}/>
                                </div>
                            </div>
                            <div className="section_05">
                                <div className="section_05_left">
                                    <img src='/instructions/certifications/05.svg'/>
                                    <div style={{marginTop: '10px'}}><span className='color_15376c'>언제</span><br/>사용하나요?</div>
                                </div>
                                <div className="section_05_right">
                                    {data.section[5].titleText[0]}
                                    {data.section[5].titleText[1]}
                                    <img src="/instructions/paymentorder/04/img_01.jpg" style={{margin: '60px 0 0 0'}}/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="wrap" ref={this.serviceRef} style={{display: 'none'}}>
                        <div className="service_section">
                            <div className="section_01" style={{padding: '70px 0 0'}}>
                                <div className="section_01_left">
                                    <img src='/instructions/certifications/01.svg'/>
                                    <div style={{marginTop: '10px'}}>가장<br/><span className="color_15376c">저렴하게</span><br/>작성하세요</div>
                                </div>
                                <div className="section_01_right">
                                    <div className="right_header">기존 지급명령 대행비용의 <span className="color_15376c">1/10가격</span>으로 작성할 수 있습니다</div>
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
                            </div>
                            <div className="section_02" style={{padding: '70px 0 40px'}}>
                                <div className="section_02_left">
                                    <img src='/instructions/certifications/02.svg'/>
                                    <div style={{marginTop: '10px'}}><span className="color_15376c">변호사가<br/>작성한 내용</span>으로<br/>완성하세요</div>
                                </div>
                                <div className="section_02_right">
                                    <div className="right_header">변호사가 작성한 것처럼 <span className="color_15376c">전문적인 내용</span>으로 완성할 수 있습니다</div>
                                    <div className="right_middle">
                                        <div style={{marginBottom: '47px'}}>
                                            <img src='/instructions/certifications/04/icon-1.svg'/><span>지급명령 신청서의 청구취지와 청구원인을 자동으로 작성</span>
                                        </div>
                                        <div>
                                            <img src='/instructions/certifications/04/icon-2.svg'/><span>법원의 지급명령 확정을 위한 변호사의 문서 가이드</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="section_03" style={{padding: '70px 0 20px'}}>
                                <div className="section_03_left">
                                    <img src='/instructions/certifications/03.svg'/>
                                    <div style={{marginTop: '10px'}}><span className="color_15376c">빠르게 완성하여</span><br/>바로 출력 &<br/>신청하세요</div>
                                </div>
                                <div className="section_03_right">
                                    <div className="right_header">지급명령 신청서를 <span className="color_15376c">자동으로 완성</span>하여, 활용방법까지 안내드립니다</div>
                                    <div className="right_middle">
                                        <img className="img_01" src='/instructions/certifications/05/img-04.png' onClick={() => window.location.href = '/service'}/>
                                    </div>
                                    <div className="right_bottom">
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <img style={{marginRight: '15.5px'}} src='/instructions/certifications/05/icon-01.svg'/>
                                            <span className="text_02">지급명령 신청서 작성완료까지 <span style={{fontSize: '23px', letterSpacing: '0.69px'}}>5분!</span> 시간이 곧 비용!!</span>
                                        </div>
                                    </div>
                                    <img style={{margin: '30px 0 15px'}} src='/instructions/paymentorder/03/img_02.svg'/>
                                    <img style={{marginBottom: '35px'}} src='/instructions/certifications/05/img-02.jpg'/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section ref={this.reviewsRef} style={{display: 'none'}}>
                        <Reviews document={this.state.document}/>
                    </section>
                </div>
            </Fragment>
        )
    }
}

export default PaymentOrder