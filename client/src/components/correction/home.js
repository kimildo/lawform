import React, { Component } from 'react';
import ReactDOM from "react-dom";
// import '../../scss/correction/correction.scss';
// import '../../scss/style.scss';
// import '../../scss/slick.min.scss';
import Slider from "react-slick";

class CorrectionHome extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {

        var slick_settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1
        };

        return (
            <div>
                <div className="container-fix">
                    <div className="page-title">변호사 첨삭 서비스</div>

                    <div className="correction-banner">
                        서비스 소개
                    </div>

                    <div className="correction-banner">
                        이용안내
                    </div>

                    <div className="correction-attorney-slides">
                        <div className="correction-attorney-option">
                            <a href="">전체보기</a>
                        </div>
                        <Slider {...slick_settings}>
                            <div>
                                <div className="attorney-slide">
                                    <div className="attorney-slide-tmp">
                                    등록된 변호사 요약 프로필
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="attorney-slide">
                                    <div className="attorney-slide-tmp">
                                    등록된 변호사 요약 프로필
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="attorney-slide">
                                    <div className="attorney-slide-tmp">
                                    등록된 변호사 요약 프로필
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="attorney-slide">
                                    <div className="attorney-slide-tmp">
                                    등록된 변호사 요약 프로필
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="attorney-slide">
                                    <div className="attorney-slide-tmp">
                                    등록된 변호사 요약 프로필
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>

                    <div className="attorney-tbl">
                        <div className="attorney-tbl-option">
                            <div className="attorney-tbl-option-btn">
                                전체
                            </div>
                            <div className="attorney-tbl-option-btn">
                                내 신청 내역
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>문서명</th>
                                    <th>신청자</th>
                                    <th>신청일</th>
                                    <th>진행상태</th>
                                    <th>신청종류</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>월세계약서</td>
                                    <td>강필구</td>
                                    <td>2019년 08월 01일</td>
                                    <td>뛰는듕</td>
                                    <td>첨삭</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="section-row text-right">
                        <div className="btn-tmp">내 법률문서 첨삭 요청</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CorrectionHome;
