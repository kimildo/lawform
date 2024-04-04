import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import Payment from "../common/payment"
import User from '../../utils/user';
import API from '../../utils/apiutil';
import ReactGA from 'react-ga';
import Cookies from 'js-cookie';

class Happylaw extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docData: {},
            category: 0
        }
    }

    componentDidMount() {

    }
    
    render() {
        const Stars =  
        <ul class="stars">
            <li><img src='../common/star_full.png' alt='Full Star' /></li>
            <li><img src='../common/star_full.png' alt='Full Star' /></li>
            <li><img src='../common/star_full.png' alt='Full Star' /></li>
            <li><img src='../common/star_full.png' alt='Full Star' /></li>
            <li><img src='../common/star_full.png' alt='Full Star' /></li>
        </ul>
        const categorys = {
            1: {
                title:'내용증명',
                price:10000,
                description:'빌려준 돈, 보증금 반환, 계약해지, 월세청구, 매매대금 등'
            },
            3: {
                title:'지급명령',
                price:10000,
                description:''
            },
            4: {
                title:'합의서',
                price:10000,
                description:''
            },
            99: {
                title:'계약서',
                price:10000,
                description:''
            }
        }
        return (
            <div className="happylaw">
                <div className="top">
                    <div className="center">
                        <div className="inline face">
                            <img src="/images/event/happylaw/top-img-1.png" alt="" />
                        </div>
                        <div className="inline text">
                            <img src="/images/event/happylaw/top-text-2.svg" alt="" />
                            <div className="mobile_hide description">이벤트 기간 : 2019. 9. 23 - 9. 29</div>
                            <div className="mobile description">오직 7일만! 선착순 1,000분께!<br />로폼의 모든 서비스를 만원에 제공합니다!!</div>
                        </div>
                    </div>
                </div>
                <div className="top-banner">
                    <div className="center">
                        <div className="inline text">
                            <p><span className="title emphasis">로폼</span>은<br /></p>
                            <p>
                                다양한 <span className="emphasis">법률분쟁 해결</span>을 위해 필요한<br /> 내용증명, 지급명령 등의 법률문서와<br />
                                <span className="emphasis">기업의 성장과 운영에 꼭 필요한</span><br />주주간계약서, NDA 등 다양한 계약서를<br />
                                <span className="emphasis white"> ‘변호사가 만든 자동작성 시스템’ </span>으로 완성할 수 있는 법률서비스입니다 
                            </p>
                            {/* <img src="/images/event/happylaw/banner-text.svg" alt="" /> */}
                        </div>
                        <div className="inline user-img">
                            <img src="/images/event/happylaw/user-img.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div className="contents" >
                    <div className="center">
                        <h2>이용자 <span>30,000명 돌파</span> 기념 이벤트!</h2>
                        <label>혜택 안내</label>
                        <ul id="benefits">
                            <li>
                                <div className="image"><img src="/images/event/happylaw/icon-1-1.svg" alt="" /></div>
                                <div className="text">로폼의 모든 서비스<br />만원에 이용! <br />(선착순 1,000명)</div>
                            </li>
                            <li>
                                <div className="image"><img src="/images/event/happylaw/icon-1-2.svg" alt="" /></div>
                                <div className="text">서비스 이용 후<br/>후기를 남겨주신 분께<br/>1만원 추가 혜택 (10명)</div>
                            </li>
                        </ul>
                        <label>참여 방법</label>
                        <ul id="sequence">
                            <li>
                                <div className="image">
                                    <img src="/images/event/happylaw/icon-2-1.svg" alt="" />
                                    <div className="num">01</div>
                                </div>
                                <div className="text">나에게 맞는 문서 확인 후<br />지금 확인하기 버튼 클릭!</div>
                            </li>
                            <li>
                                <div className="image">
                                    <img src="/images/event/happylaw/icon-2-2.svg" alt="" />
                                    <div className="num">02</div>
                                </div>
                                <div className="text">나에게 필요한 서비스<br />1만원에 이용</div>
                            </li>
                            <li>
                                <div className="image">
                                    <img src="/images/event/happylaw/icon-2-3.svg" alt="" />
                                    <div className="num">03</div>
                                </div>
                                <div className="text">마이페이지에서<br />변호사의 법률문서<br />자동으로 완성하기</div>
                            </li>
                            <li>
                                <div className="image">
                                    <img src="/images/event/happylaw/icon-2-4.svg" alt="" />
                                    <div className="num">04</div>
                                </div>
                                <div className="text">이용후기 작성 후 <br />추첨을 통해<br />만원 혜택 증정</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="categorys">
                    <div className="center">
                        <h2 className="mobile_hide">내용증명 & 지급명령</h2>
                        <h2 className="mobile">내용증명 모바일 서비스!</h2>
                        <div className="image mobile_hide"><img src="/images/event/happylaw/banner-cate-1n3.jpg" alt="" /></div>
                        <div className="image mobile"><img src="/images/event/happylaw/banner-cate-1.jpg" alt="" /></div>
                        <ul>
                            <li className="best">
                                <div><span className="small">빌려준 돈, 매매대금, 용역대금, 임금 등</span><br/>받아야하는 돈을 못 받았을 때!</div>
                                <Link href="/category/1#0_1">
                                    <a>
                                    <button className="mobile_hide">내용증명<br />확인하기</button>
                                    <button className="mobile">지금<br />확인하기</button>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <div>계약을 빨리 이행하라고 독촉하거나,<br/>손해배상, 해지 등을 하고 싶을 때!</div>
                                <Link href="/category/1#0_13">
                                    <a>
                                    <button className="mobile_hide">내용증명<br />확인하기</button>
                                    <button className="mobile">지금<br />확인하기</button>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <div><span className="small">보증금반환, 월세청구, 임대차 계약해지 등</span><br/>부동산 관련 골치아픈 일이 발생했을 때!</div>
                                <Link href="/category/1#0_3">
                                    <button className="mobile_hide">내용증명<br />확인하기</button>
                                    <button className="mobile">지금<br />확인하기</button>
                                </Link>
                            </li>
                            <li>
                                <div><span className="small">명예훼손, 물건 파손, 상해 등 </span><br/>소중한 신체, 재산 등이 침해되었을 때! </div>
                                <Link href="/category/1#0_14">
                                    <button className="mobile_hide">내용증명<br />확인하기</button>
                                    <button className="mobile">지금<br />확인하기</button>
                                </Link>
                            </li>
                        </ul>

                        <ul className="mobile_hide">
                            <li>
                                <div><span className="small">빌려준 돈, 매매대금, 용역대금, 임금 등</span><br/>받아야하는 돈을 못 받았을 때!</div>
                                <Link href="/category/3#0_1"><button>지급명령<br />확인하기</button></Link>
                            </li>
                            <li>
                                <div><span className="small">매매대금 반환, 용역대금 반환</span><br/>이미 지급한 돈을 반환 받고 싶을 때!</div>
                                <Link href="/category/3#0_7"><button>지급명령<br />확인하기</button></Link>
                            </li>
                        </ul>
                        <h2 className="mobile_hide" >계약서 & 합의서</h2>
                        <h2 className="mobile" > 지급명령, 계약서, 합의서 등</h2>
                        <ul className="mobile">
                            <li>
                                <div><span className="small"> 각종 계약서, 지급명령 신청서, 합의서 등은<br />PC버전에서 서비스 이용 가능합니다.</span></div>
                                <button onClick={(e)=>{ Cookies.set('forceDeskTop', 'true');window.location.reload(true);} }>PC버전<br />보기</button>
                            </li>
                        </ul>
                        <ul className="mobile_hide">
                            <li>
                                <div><span className="small">근로계약서, 용역계약서, 동업계약서 등</span><br/>예비 창업자를 위한 문서</div>
                                <Link href="/category/99#0_1"><button>계약서<br />확인하기</button></Link>
                            </li>
                            <li>
                                <div><span className="small">업무협약서, NDA, 입사자서약서 , 스톡옵션계약서 등</span><br/>초기 성장을 위한 문서</div>
                                <Link href="/category/99#0_3"><button>계약서<br />확인하기</button></Link>
                            </li>
                            <li>
                                <div><span className="small">정관, 주주간계약서, 임원계약서 등</span><br/>법인설립을 위한 문서</div>
                                <Link href="/category/99#0_2"><button>계약서<br />확인하기</button></Link>
                            </li>
                            <li>
                                <div><span className="small">폭행, 명예훼손, 금전분쟁 등</span><br/>다양한 법률분쟁을 합의하고 싶을 때!</div>
                                <Link href="/category/4"><button>합의서<br />확인하기</button></Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="reviews">
                    <div className="center">
                    <h2>로폼 이용자 후기</h2>
                        <ul>
                            <li>
                                {Stars}
                                <div className="review">내용증명 발송 후 집주인과 원만히 해결되었습니다.</div>
                                <div className="doc">내용증명(보증금 반환 청구용)</div>
                            </li>
                            <li>
                                {Stars}
                                <div className="review">사업을 하면서 많은 법률문서가 필요합니다.<br /> 간단한 내용이라도 검토 후에 진행이 필요한데<br /> 로폼에서 그 문제를 해결해 주었습니다.</div>
                                <div className="doc">업무협약서</div>
                            </li>
                            <li>
                                {Stars}
                                <div className="review">지급명령신청서 작성에 어려움이 있어서<br /> 로폼을 활용하게 되었습니다.<br /> 기존 변호사나 법무사에서 의뢰하면<br /> 상당한 비용을 요구했는데<br /> 로폼은 저렴한 가격에 간단하게 작성할 수 있어 좋았습니다.</div>
                                <div className="doc">지급명령신청서(매매대금 청구)</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};

export default Happylaw;