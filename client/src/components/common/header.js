import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import Api from '../../utils/apiutil'
import Signin from './signin'
import Finduser from './finduser'
import Findpw from './findpw'
import Qna from './qna'
import User from '../../utils/user'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'

import helper_url from '../../helper/helper_url'

import { Helmet } from 'react-helmet'

class Header extends Component {

    isIE = () => {
        return /*@cc_on!@*/!!window.document.documentMode
    }

    componentDidMount () {

        // let loc = window.location.href

        // if (!!this.isIE() && loc.indexOf('autoform') === -1) {
        //     let check_cookie
        //     window.$('.promotionBanner .btnClose').bind('click', function () {
        //         Cookies.set('ieCheck', 'true', { expires: 1 })
        //         window.$('.promotionBanner').animate({ height: 0 }, 500)
        //     })

        //     check_cookie = Cookies.get('ieCheck')
        //     if (check_cookie === 'true') {
        //         window.$('.promotionBanner').hide()
        //     }
        // } else {
        //     window.$('.promotionBanner').hide()
        // }
    }

    constructor (props) {
        super(props)
        let userInfo = User.getInfo()
        let peer_review = ('peer_review' in props) ? props['peer_review'] : false
        let active_nav = ('active_nav' in props) ? props['active_nav'] : ''
        let hide_profile = ('hide_profile' in props) ? props['hide_profile'] : ''
        let service_type = ('service_type' in props) ? props['service_type'] : ''
        let defaultState = {
            login: 'N',
            idusers: '',
            username: '',
            peer_review: peer_review,
            active_nav: active_nav,
            account_type: '',
            hide_profile: hide_profile,
            service_type: service_type
        }

        if (!!userInfo) {
            defaultState.login = 'Y'
            defaultState.idusers = userInfo.idusers
            defaultState.username = userInfo.username
            defaultState.account_type = userInfo.account_type
        }

        this.state = defaultState

        ReactGA.initialize('UA-93064531-2', {
            titleCase: false,
            gaOptions: {
                userId: this.state.idusers
            },
            debug: (process.env.REACT_APP_GA_DEBUG === 'true')
        })
        ReactGA.ga('send', 'pageview', window.location.pathname + window.location.search)

        this.sideMenuRef = React.createRef()
        this.wrapRef = React.createRef()
    }

    logOut = () => {
        const LogOut = async () => {
            await Api.sendGet('/user/logout')
            this.setState({
                login: 'N'
            })
            await Cookies.remove('token')
            await Cookies.remove('token', { path: '/' })
            await Cookies.remove('token', { path: '/detail' })
            await Cookies.remove('token', { path: '/legalsolution' })
            window.location = '/'
        }
        const q_logout = window.confirm('로그아웃 하시겠습니까?')
        if (q_logout === true) {
            LogOut().then(r => {})
        } else {
            return false
        }
    }

    openSideMenu = () => {
        let body = document.body.style
        let sideMenu = this.sideMenuRef.current.style
        let testRef = this.wrapRef.current.style
        body.position = 'fixed'
        body.overflow = 'hidden'
        sideMenu.display = 'block'
        setTimeout(() => {
            testRef.left = '0'
        }, 50)

    }

    closeSideMenu = () => {
        let sideMenu = this.sideMenuRef.current.style
        let body = document.body.style
        let testRef = this.wrapRef.current.style
        testRef.left = '-295px'
        setTimeout(() => {
            body.position = 'initial'
            body.overflow = 'initial'
            sideMenu.display = 'none'
        }, 500)
    }

    render () {

        const refererPath = window.location.pathname
        const encRefererPath = encodeURIComponent(refererPath)

        let authButton = (refererPath === '/auth/signin')
            ? <button type="button" className="btn_signin" onClick={e => {window.location.reload()}}>로그인/가입</button>
            : <Link href={'/auth/signin?referer=' + encRefererPath}>
                <button type="button" className="btn_signin" onClick={(e) => ReactGA.pageview('/auth/signin?referer=' + encRefererPath, null, '로그인/가입')}>로그인/가입</button>
              </Link>

        return (
            <Fragment>
                {
                    Cookies.get('forceDeskTop') === 'true' ?
                        <Helmet meta={[{ 'name': 'viewport', 'content': 'width=1200, initial-scale=1, maximum-scale=1, user-scalable=yes, shrink-to-fit=yes' }]}/>
                        :
                        <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                }
                <div className="wrap_header">

                    {/* <div className="promotionBanner">
                        <div className="block">
                        <span className="infomation">
                            <img src="/common/i.png" alt="권장브라우저 안내"/> 권장 브라우저 안내
                        </span>
                            <span className="bannerLink">
                            <p>법률문서 자동작성은 IE 브라우저를 정식으로 지원하지 않습니다.</p>
                            <p style={{ color: '#b6b39c' }}> 크롬 혹은 Edge 브라우저를 이용해주세요.
                            <a href="https://www.google.com/intl/ko/chrome/" target="new" className="download_link">크롬 브라우저 다운로드</a>
                            <a href="https://www.microsoft.com/ko-kr/windows/microsoft-edge" target="new" className="download_link">IE Edge 브라우저 알아보기</a>
                            </p>
                        </span>
                            <a className="btnClose"><img src="/autoform_img/x_btn.png" width={30} height={30} alt="배너 닫기"/></a>
                        </div>
                    </div> */}

                    <div className="bg_header">
                        {(!this.state.peer_review) && <img className="mobile side_menu" src='/header_img/mobile/side_menu.svg' onClick={this.openSideMenu.bind(this)} alt=""/>}
                        <a href="/" id={'nav_home'}>
                            <div className="wrap_bi_header">
                                <img src="/header_img/mobile/logo.svg" className="bi_header" alt="로폼(Lawform)"/>
                            </div>
                        </a>
                        {(!this.state.peer_review) ? (
                            <Fragment>
                                <div className="wrap_nav" id="wrap_nav1">
                                    <span><a id={'#nav_category'}>문서작성하기</a></span>
                                    <span className="nav_img"/>
                                    <div className="nav_dropdown">
                                        <ul>
                                            {/* <li>전체</li> */}
                                            <li>
                                                <a href="/category/1">내용증명</a>
                                            </li>
                                            <li>
                                                <a href="/category/3">지급명령</a>
                                            </li>
                                            <li>
                                                <a href="/category/99">계약서</a>
                                            </li>
                                            <li>
                                                <a href="/category/99">스타트업</a>
                                            </li>
                                            <li>
                                                <a href="/category/4">합의서</a>
                                            </li>
                                            <li>
                                                <a href="/category/2">위임장</a>
                                            </li>


                                        </ul>
                                    </div>
                                </div>
                                <div className="wrap_nav" id="wrap_nav2">
                                    <Link href="/startup"><a id={'#nav_category'}>스타트업</a></Link>
                                </div>
                                <div className="wrap_nav" id="wrap_nav2">
                                    <Link href="/magazine"><a>교육실</a></Link>
                                </div>
                                <div className="wrap_nav" id="wrap_nav2">
                                    <Link href="/press"><a>로폼소식</a></Link>
                                </div>
                                {/* <div className="wrap_nav" id="wrap_nav3">
                                    <a id={'#nav_magazine'} href="/magazine"><span className="nav">로폼 매거진</span></a>
                                    <span className="nav_img"/>
                                    <div className="nav_dropdown">
                                        <ul>
                                            <li><Link href="/magazine"><a>법률실전</a></Link></li>
                                            <li><Link href="/press"><a>로폼소식</a></Link></li>
                                        </ul>
                                    </div>
                                </div> */}
                                <div className="wrap_nav" id="wrap_nav4">
                                    <a id={'#nav_qna'} href="/customer/qna"><span className="nav">1:1 이용문의</span></a>
                                </div>
                            </Fragment>
                        ) : (
                            <div className="wrap_nav-container mobile_hide">
                                <Link href={helper_url.service.lawyer.contract_request} onClick={() => window.location.refresh()}>
                                    <div className={`wrap_nav wrap_nav-lawyer mobile_hide ${(this.state.active_nav === 1) && 'wrap_nav-lawyer-active'}`}>
                                        <span className="nav">요청사건</span>
                                    </div>
                                </Link>
                                <Link href={helper_url.service.lawyer.contract_review} onClick={() => window.location.refresh()}>
                                    <div className={`wrap_nav wrap_nav-lawyer ${(this.state.active_nav === 3) && 'wrap_nav-lawyer-active'}`}>
                                        <span className="nav">내가 검토중인 문서</span>
                                    </div>
                                </Link>
                                <Link href={helper_url.service.member.document_list} onClick={() => window.location.refresh()}>
                                    <div className={`wrap_nav wrap_nav-lawyer`}>
                                        <span className="nav">법률문서 자동작성</span>
                                    </div>
                                </Link>

                                <Link href={helper_url.service.member.qna} onClick={() => window.location.refresh()}>
                                    <div className={`wrap_nav wrap_nav-lawyer mobile_hide`}>
                                        <span className="nav">1:1 이용문의</span>
                                    </div>
                                </Link>

                                {/*<Link href={helper_url.service.lawyer.contract_request_seal} onClick={() => window.location.refresh()}>
                                    <div className={this.state.active_nav === 1 ? 'wrap_nav wrap_nav-lawyer wrap_nav-lawyer-active' : 'wrap_nav wrap_nav-lawyer'}>
                                        <span className="nav">변호사 직인 요청</span>
                                    </div>
                                </Link>
                                <Link href={helper_url.service.lawyer.contract_request_review} onClick={() => window.location.refresh()}>
                                    <div className={this.state.active_nav === 2 ? 'wrap_nav wrap_nav-lawyer wrap_nav-lawyer-active' : 'wrap_nav wrap_nav-lawyer'}>
                                        <span className="nav">변호사 검토 요청</span>
                                    </div>
                                </Link>
                                */}
                            </div>
                        )}
                        <div className="wrap_nav_search">
                            {/* <img src="/header_img/nav_search.png" className="nav_search" alt="nav_search" /> */}
                        </div>
                        <div className="wrap_nav_login">
                            {/* @todo 변호사첨삭 - 필요한지 모르겠음  this.state.account_type === 'A' */}
                            {this.state.account_type === 'PPP' ? (
                                <div className="wrap_nav_change_service">
                                    <Link href={this.state.peer_review === false ? helper_url.service.lawyer.contract_request_seal : '/'} onClick={() => window.location.refresh()}>
                                        <div className="change_service_btn">
                                            <span className="transform-icon">
                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px"
                                                     height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
                                                    <g id="Bounding_Box">
                                                        <rect fill="none" width="24" height="24"/>
                                                    </g>
                                                    <g id="Master">
                                                        <g id="ui_x5F_spec_x5F_header_copy"/>
                                                        <g>
                                                            <path d="M22,8l-4-4v3H3v2h15v3L22,8z"/>
                                                            <path d="M2,16l4,4v-3h15v-2H6v-3L2,16z"/>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </span>
                                            {   // @todo 변호사첨삭 - 필요한지 모르겠음
                                                /*{this.state.service_type === '1' ? '로폼 서비스 전환' : '변호사 서비스 전환'}*/
                                            }
                                        </div>
                                    </Link>
                                </div>
                            ) : null}

                            {//this.state.peer_review == "" ? (
                                this.state.login === 'Y'
                                    ?
                                    (
                                        <div className="nav_userinfo">
                                            <div style={{ height: 56 }}>
                                                <div style={{ float: 'left', margin: '0px 10px 0 15px' }}><img className="nav_usericon" src="/header_img/usericon.svg"
                                                                                                               alt="user_image" width={36} height={36}/></div>
                                                <div className="nav_text" style={{ fontSize: 16, marginTop: 8 }}>
                                                    <span className="nav_username">{this.state.username}</span>
                                                    <span style={{ margin: `0 0 0 10px` }}>님</span>
                                                    <span className="nav_img"></span>
                                                </div>
                                            </div>
                                            <div className="nav_dropdown">
                                                {
                                                    (this.state.account_type === 'A') ?
                                                        <ul>
                                                            <li><Link href={helper_url.service.lawyer.contract_review}><a>나의 사건 관리</a></Link></li>
                                                            <li><Link href={helper_url.service.lawyer.document_list}><a>내 문서 보관함</a></Link></li>
                                                            <li><Link href={helper_url.service.lawyer.contract_review + '#3'}><a>사건 정산 내역</a></Link></li>
                                                            <li><Link href={helper_url.service.lawyer.profile}><a>내 정보 수정</a></Link></li>
                                                            <li onClick={this.logOut} style={{ cursor: 'pointer' }}>로그아웃</li>
                                                        </ul>
                                                        :
                                                        <ul>
                                                            <li><a href="/mydocument">마이페이지</a></li>
                                                            {/*{(window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') &&*/}
                                                            {/*<li>*/}
                                                            {/*    <Link href={helper_url.service.member.document_list}>*/}
                                                            {/*        마이페이지(첨삭-DEV)*/}
                                                            {/*    </Link>*/}
                                                            {/*</li>*/}
                                                            {/*}*/}
                                                            <li><a href="/myinfo">내 정보 수정</a></li>
                                                            <li onClick={this.logOut} style={{ cursor: 'pointer' }}>로그아웃</li>
                                                        </ul>
                                                }
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <Fragment>
                                            {authButton}
                                        </Fragment>
                                    )
                                //) : null
                            }
                        </div>
                    </div>
                    {/* <div className="kakao_plus">
                        <a href="http://pf.kakao.com/_sNJmxl/chat">
                            <img style={{height:'90px', width:'90px'}} src="/header_img/kakaoplus.png"></img>
                        </a>
                        </div> */}
                    <div id="qna" className="qna_content white_content">
                        <Qna userLogin={this.state.login}/>
                    </div>

                </div>
                <div style={{ height: 72 }}></div>

                <div className='side_menu' ref={this.sideMenuRef} style={{ display: 'none' }}>
                    <div className='backgound_layer' onClick={this.closeSideMenu.bind(this)}/>
                    <div className='wrap' ref={this.wrapRef}>
                        <img style={{ display: 'none' }} className='close_img' src='/autoform_img/x_btn.png' onClick={this.closeSideMenu.bind(this)}/>
                        {
                            this.state.login === 'N' ?
                                <div className='side_login'>
                                    <div className='side_login_header'>
                                        <Link href="/auth/signup">
                                            <button className="join">회원가입</button>
                                        </Link>
                                        <Link href={'/auth/signin?referer=' + encRefererPath}>
                                            <button onClick={(e) => {
                                                ReactGA.pageview('/auth/signin?referer=' + refererPath, null, '로그인/가입')
                                                this.closeSideMenu()
                                            }}>로그인
                                            </button>
                                        </Link>
                                        {/* <span>로그인을 해주세요</span>
                                        <a href={'/auth/signin?referer=' + encRefererPath} onClick={(e) => {
                                            ReactGA.pageview('/auth/signin?referer=' + encRefererPath, null, '로그인')
                                            this.closeSideMenu()
                                        }}>로그인</a> */}
                                    </div>
                                    <div className='side_login_contents'>
                                        <a href='/'><img src='/header_img/mobile/side_menu/icon_1.svg'/>문서 작성하기<img src='/header_img/mobile/side_menu/icon_6.svg' className='arrow_right'/></a>
                                        <a href='/startup'><img src='/header_img/mobile/side_menu/icon_2.svg'/>스타트업 프로그램<img src='/header_img/mobile/side_menu/icon_6.svg' className='arrow_right'/></a>
                                        <a href='/magazine'><img src='/images/icons/icon-magazine.svg'/>교육실<img src='/header_img/mobile/side_menu/icon_6.svg' className='arrow_right'/></a>
                                        <a href='/press'><img src='/images/icons/icon-microphone.svg'/>로폼소식<img src='/header_img/mobile/side_menu/icon_6.svg' className='arrow_right'/></a>
                                        <a href='/customer/qna'><img src='/header_img/mobile/side_menu/icon_2.svg'/>1:1 이용문의<img src='/header_img/mobile/side_menu/icon_6.svg' className='arrow_right'/></a>
                                        {/* <a href='/magazine'><img src="/header_img/mobile/side_menu/icon_2.svg"/>매거진<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                        className='arrow_right'/></a> */}
                                    </div>
                                    {/* <div className='side_login_bottom'>
                                        <span>아직 회원이 아니신가요?</span>
                                        <a href='/auth/signup'>회원가입</a>
                                    </div> */}
                                </div>
                                :
                                <div className='side_user_info'>
                                    <div className='side_user_info_header'>
                                        <span>{this.state.username} 님</span>
                                        <a onClick={this.logOut}>로그아웃</a>
                                    </div>
                                    <div className='side_user_info_contents'>
                                        <a href='/mydocument'><img src='/header_img/mobile/side_menu/icon_3.svg'/>마이페이지<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                            className='arrow_right'/></a>
                                        <a href='/'><img src='/header_img/mobile/side_menu/icon_1.svg'/>문서 작성하기<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                    className='arrow_right'/></a>
                                        <a href='/startup'><img src='/header_img/mobile/side_menu/icon_2.svg'/>스타트업<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                        className='arrow_right'/></a>
                                        <a href='/magazine'><img src='/images/icons/icon-magazine.svg'/>로폼 매거진<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                   className='arrow_right'/></a>
                                        <a href='/magazine'><img src="/header_img/mobile/side_menu/icon_2.svg"/>매거진<img src='/header_img/mobile/side_menu/icon_6.svg'
                                                                                                                        className='arrow_right'/></a>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Header
