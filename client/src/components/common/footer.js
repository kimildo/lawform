import React, { Component } from 'react';
import Link from 'next/link';
// import '../../scss/autoform/autoformmain.scss';
import User from '../../utils/user';

class Footer extends Component {
    constructor(props) {
        super(props);
        let userInfo = User.getInfo();
        if (!!userInfo) {
            this.state = {
                login: 'Y',
                footerShow : false
            }
        } else {
            this.state = {
                login: 'N',
                footerShow : false
            }
        }


    }

    render() {
        const categoryText = {
            fontSize: 16,
            fontWeight: 500,
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#ffffff',
            margin: '3px 0px 11px 16px'
        };

        const listText = {
            fontSize: 13,
            fontWeight: 100,
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#ffffff',
            margin: '3px 0px 3px 16px'
        };

        const infoText = {
            fontSize: 16,
            fontWeight: 500,
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#ffffff',
            margin: '29px 0px 11px 16px'
        };

        // const select = {
        //     background: 'url(footer_img/arrow.png) no-repeat 96% 50%'
        // };

        const copyright = {
            fontSize: 16,
            fontWeight: 500,
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#ffffff',
            margin: '25px 0px 0px 16px'
        };

        const bgStyle = this.props.styles

        return (
            <div className="wrap_footer" style={bgStyle}>
                <div className="footer_container">
                    <div className="bg_footer">
                        {/* <div className="wrap_bi_footer">
                            <img width="148" height="98" src="/footer_img/bi.png" className="bi_footer" alt="bi_footer" />
                        </div> */}
                        <div className="category_footer">
                            <div className="category_top">
                                <div className="field_footer">
                                    <p style={categoryText}>회사 소개</p>
                                    <a href="/company" ><p style={listText}>아미쿠스렉스 소개</p></a>
                                    <a href="/press" ><p style={listText}>보도자료</p></a>
                                    {/* <p style={listText}>PARTNERS</p>
                                    <p style={listText}>공지사항</p> */}
                                </div>
                                <div className="field_footer">
                                    <p style={categoryText}>서비스 소개</p>
                                    <a href='/service'><p style={listText}>법률문서 자동작성</p></a>
                                    {/* <p style={listText}>변호사 첨삭</p> */}
                                </div>
                                <div className="field_footer">
                                    <p style={categoryText}>고객센터</p>
                                    <a href="/customer/faq" ><p style={listText}>자주하는 질문</p></a>
                                    <a href="/customer/qna" ><p style={listText}>1:1 이용문의</p></a>
                                    <a href="/press/notice" ><p style={listText}>공지사항</p></a>
                                </div>
                                <div className="field_footer">
                                    <p style={categoryText}>약관 및 정책</p>
                                    <Link href="/legalnotice" as='/legalnotice#terms'><a><p style={listText}>서비스 이용약관</p></a></Link>
                                    <Link href='/legalnotice' as='/legalnotice#privacy'><a><p style={listText}>개인정보 처리방침</p></a></Link>
                                    <Link href='/legalnotice' as='/legalnotice#disclaimer' ><a><p style={listText}>면책 공고</p></a></Link>
                                </div>
                                {/* <div className='field_footer_right'>
                                    <div>고객센터</div>
                                    <div style={{fontSize: '20px', fontWeight: '500'}}>02-6925-0227</div>
                                    <div style={{fontSize: '12px'}}>(오전10시~오후7시, 점심시간 : 12시30분~오후2시)</div>
                                    <div className="set-mobile" onClick={(e)=>{ Cookies.remove('forceDeskTop');window.location.reload(true);} } >모바일보기</div>
                                </div> */}
                                <div className="line"></div>
                            </div>
                            <div className="category_bottom">
                                <p style={infoText}>아미쿠스렉스<span style={{fontWeight:200, fontSize:14}}> (주)</span></p>
                                <span style={listText}>대표이사: 정진숙 </span>
                                <span style={listText} className="vertical">|</span>
                                <span style={listText}> 사업자등록번호: 259-81-00111</span>                                
                                <span style={listText} className="vertical">|</span>
                                <span style={listText}>통신판매신고: 2019-서울강남-00716</span>
                                <span style={listText} className="vertical">|</span>
                                <span style={listText}>개인정보관리책임자: 조선호</span>
                                <br></br>
                                <span style={listText}>이메일: contact@amicuslex.net</span>
                                <span style={listText} className="vertical">|</span>
                                <span style={listText}>주소: 서울시 영등포구 의사당대로 83 HP빌딩 6층 (여의도동 23-6)</span>
                                <br></br>
                                <span style={listText}>고객센터: 02-6925-0227 (오전10시~오후7시, 점심시간 : 12시30분~오후2시)</span>
                                <p style={copyright}>COPYRIGHT @ 2019 Amicus Lex. ALL RIGHT RESERVED</p>
                            </div>
                            <div className="contents_footer">
                                {/* <select style={select} className="select_footer">
                                        <option >Family Site0</option>
                                        <option >Family Site1</option>
                                        <option >Family Site2</option>
                                        <option >Family Site3</option>
                                    </select> */}
                                {/* <div className="sns">
                                    <a href="https://www.facebook.com/amicuslex.net" target="new" ><img width="48" height="48" src="/images/common/icon-footer-facebook.svg" className="sns_img" alt="facebook" /></a>
                                    <a href="https://blog.naver.com/amicuslex/" target="new" ><img width="48" height="48" src="/images/common/icon-footer-blog.svg" className="sns_img" alt="blog" /></a>
                                    <a href="https://youtube.com/amicuslex/" target="new" ><img width="48" height="48" src="/images/common/icon-footer-youtube.svg" className="sns_img" alt="blog" /></a>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mobile footer'>
                    {/* <div className="sns">
                        <a href="https://www.facebook.com/amicuslex.net" target="new" ><img width="48" height="48" src="/images/common/icon-footer-facebook.svg" className="sns_img" alt="facebook" /></a>
                        <a href="https://blog.naver.com/amicuslex/" target="new" ><img width="48" height="48" src="/images/common/icon-footer-blog.svg" className="sns_img" alt="blog" /></a>
                        <a href="https://youtube.com/amicuslex/" target="new" ><img width="48" height="48" src="/images/common/icon-footer-youtube.svg" className="sns_img" alt="blog" /></a>
                    </div> */}
                    <div>고객센터 02-6925-0227 <span style={{fontSize:9}}>(오전10시~오후7시, 점심시간 : 12시30분~오후2시)</span>
                    <br /><a href="/customer/qna">1:1 이용문의</a> / <a href='/legalnotice#terms' target="new">이용약관</a> ㅣ
                        <a href='/legalnotice#privacy' target="new" >개인정보 처리방침</a> ㅣ
                        <a href='/legalnotice#disclaimer' target="new" >면책 공고</a>
                    </div>
                    <hr />
                    <div className='companyinfo' >
                        <h3>아미쿠스렉스<span style={{fontWeight:200, fontSize:14}}> (주)</span></h3>
                        <span >대표이사: 정진숙 </span>
                        <span className="vertical">|</span>
                        <span > 사업자등록번호: 259-81-00111</span>                                
                        <br></br>
                        <span >통신판매신고: 2019-서울강남-00716</span>
                        <span  className="vertical">|</span>
                        <span >개인정보관리책임자: 조선호</span>
                        <br></br>
                        <span >이메일: contact@amicuslex.net</span>
                        <br></br>
                        <span >주소: 서울시 영등포구 의사당대로 83 HP빌딩 6층 (여의도동 23-6)</span>
                    </div>
                    <div style={{fontSize : '12px', marginTop:20, fontWeight:500}}>COPYRIGHT @ 2019 Amicus Lex. ALL RIGHT RESERVED</div>
                </div>
                {/* {
                    Cookies.get('forceDeskTop') !== 'true'?
                    <div onClick={(e)=>{ Cookies.set('forceDeskTop', 'true');window.location.reload(true);} } >PC버전보기</div>
                    :
                    <div onClick={(e)=>{ Cookies.remove('forceDeskTop');window.location.reload(true);} } >모바일보기</div>
                } */}
                {/* <LegalNotice type='terms'/>
                <LegalNotice type='privacy'/>
                <LegalNotice type='disclaimer'/> */}
            </div>
        );
    }
}

export default Footer;
