
import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import Payment from "../common/payment"
import User from '../../utils/user';
import API from '../../utils/apiutil';
import ReactGA from 'react-ga';
import Cookies from 'js-cookie';
import Package from '../common/package';

class Saramin extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        return (
            <Fragment>
            <div className="saramin">
                <div className="visual">
                    <div className="logo">
                        <img src="/images/event/saramin/top-collabo-logo.svg" alt="로폼 x 사람인" />
                    </div>
                    <div className="package">
                        <h3>
                            사람인의 신규회원이신가요?<br />
                            지금 변호사의 법률문서를 만나보세요!
                        </h3>
                        <div className="period">
                            <span className="label">이벤트 기간</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5" height="22" viewBox="0 0 1.5 22"><path d="M12316.667-1276.333v22" transform="translate(-12315.917 1276.333)" fill="none" stroke="#000" stroke-width="1.5"/></svg>
                            <span className="date">11월 5일(화) ~ 12월 6일(금)</span>
                        </div>
                        <Package history={this.props.history}><img src="/images/event/saramin/btn-inputcode.svg" /></Package>
                    </div>
                </div>
                <div className="contents" >
                    <section>
                        <h2><span><img src="/images/event/saramin/section-01.svg" /></span>로폼이 드리는 첫번째 혜택</h2>
                        <center>
                            <img src="/images/event/saramin/section-01-contents.svg" />
                        </center>
                        <div className="button" >
                            <Link href="/category/99"><img src="/images/event/saramin/section-01-button.svg" /></Link>
                        </div>
                    </section>
                    <section>
                        <h2><span><img src="/images/event/saramin/section-02.svg" /></span>로폼이 드리는 두번째 혜택</h2>
                        <center>
                            <img src="/images/event/saramin/section-02-contents.svg" />
                        </center>
                    </section>
                </div>
                <div className="footer">
                    <h2>꼭 읽어주세요.</h2>
                    <ul className="guides">
                        <li>본 이벤트는 사람인과 제휴된 이벤트로 사람인 신규 기업회원을 대상으로 합니다.</li>
                        <li>사람인에서 메일로 수령하신 제휴코드의 등록기간은 이벤트 종료일인 12월 6일 까지 입니다.</li>
                        <li>등록기간 만료 시 사용은 불가합니다.</li>
                        <li>쿠폰은 중복으로 등록할 수 없습니다.</li>
                        <li>문서 작성 가능 기간은 쿠폰등록일로 부터 2개월간(60일) 입니다.</li>
                        <li>문서 작성 가능 기간 내에 동일 문서는 무제한으로 작성할 수 있습니다.</li>
                        <li>기타 문의 : contact@amicuslex.net , 02-6925-0227</li>
                    </ul>
                </div>
            </div>
            </Fragment>
        );
    }
};

export default Saramin;