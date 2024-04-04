import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import Router from 'next/router'
import User from '../../../utils/user';

class Services extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            userSubscription:null
        };
        this.userInfo = User.getInfo();
    }
    componentDidMount() {
        User.getSubscription().then(result=>{
            if( !!result ) {
                this.setState({
                    userSubscription:result
                })
            }
        });

    }
    
    render() {
        return (
            <Fragment>
                <ul className="service-list">
                    <li>
                        <div className="wrapper" >
                            <div className="image"><img src="/images/startup/v2/icon-01.svg" alt={'스타트업 필수문서'}/></div>
                            <div className="sub-title">아차!하다 망한다고?!</div>
                            <div className="title">스타트업 필수문서</div>
                        </div>
                        <div className="description">기업 운영 관련 직무 분야에서의 교육 & 실습.솔루션(법률문서)을 제공하는 패키지</div>
                        <button className="view-service" onClick={()=>Router.push('/startup/document')}>자세히 보기 <img src="/images/common/arrow-right-grey.svg" alt={'자세히보기'}/></button>
                    </li>
                    <li>
                        <div className="wrapper" >
                            <div className="image"><img src="/images/startup/v2/icon-02.svg" alt={'스타트업 실사'}/></div>
                            <div className="sub-title">내 기업은 몇점?</div>
                            <div className="title">스타트업 실사</div>
                        </div>
                        <div className="description">4대 분야에서 기업의 리스크를 진단, 최적의 맞춤형 교육과 솔루션을 제공하는 프로그램</div>
                        <button className="view-service" onClick={()=>Router.push('/startup/solution')}>자세히 보기 <img src="/images/common/arrow-right-grey.svg" alt={'자세히보기'} /></button>
                    </li>
                    <li>
                        <div className="wrapper" >
                            <div className="image"><img src="/images/startup/v2/icon-education.svg" alt={'교육실'}/></div>
                            <div className="sub-title">&nbsp;</div>
                            <div className="title">교육실</div>
                        </div>
                        <div className="description">스타트업의 임 · 직원을 위한 온라인 직무교육 콘텐츠를 제공하는 교육 자료실</div>
                        <button className="view-service" onClick={()=>Router.push('/startup/education')}>바로가기 <img src="/images/common/arrow-right-grey.svg" alt={'자세히보기'}/></button>
                    </li>
                </ul>
                <div className="affiliate">
                    <div className="text">이미 많은 제휴사와 고객사가 로폼의 스타트업 프로그램을 이용중입니다.</div>
                    <ul className="companys">
                        <li><img src="/images/startup/v2/seoul.svg" alt={'서울특별시'}/></li>
                        <li><img src="/images/startup/v2/koscom.svg" alt={'코스콤'}/></li>
                        <li><img src="/images/startup/v2/busanit.svg" alt={'부산정보산업진흥원'}/></li>
                        <li><img src="/images/startup/v2/ibk.svg" alt={'IBK기업은행'}/></li>

                        <li><img src="/images/startup/v2/kibo.svg" alt={'기술보증기금'}/></li>
                        <li><img src="/images/startup/v2/keb.svg" alt={'KEB하나은행'}/></li>
                        <li><img src="/images/startup/v2/saramin.svg" alt={'사람인'}/></li>
                        <li><img src="/images/startup/v2/kaa.png" alt={'한국액셀러레이터협회'}/></li>

                        <li><img src="/images/startup/v2/cnttech.jpg" alt={'CNTTECH'}/></li>
                        <li><img src="/images/startup/v2/kacc.jpg" alt={'K액셀러레이터'}/></li>
                        <li><img src="/images/startup/v2/venturus.jpg" alt={'VENTURUS'}/></li>
                        <li><img src="/images/startup/v2/gca.svg" alt={'경기콘텐츠진흥원'}/></li>

                    </ul>
                </div>
            </Fragment>
        );
    }
}

export default Services;
