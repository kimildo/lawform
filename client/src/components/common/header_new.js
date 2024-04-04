import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import Api from '../../utils/apiutil'
import User from '../../utils/user'
import { Helmet } from 'react-helmet'
import Logo from '../common/logo'
import Cookies from 'js-cookie'
import Package from '../common/package'
import AttoneySVC from '../event/attoneysvc'
// import '../../scss/common/header_new.scss'
import helper_url from '../../helper/helper_url'
import ReactGA from 'react-ga'

class Header extends Component {
    constructor (props) {
        super(props)

        this.userInfo = User.getInfo()
        if (!!this.userInfo) {
            this.state = {
                login: 'Y',
                idusers: this.userInfo.idusers,
                username: this.userInfo.username,
                showSideMenu: false
            }
        } else {
            this.state = {
                login: 'N',
                idusers: '',
                username: '',
                showSideMenu: false
            }
        }

        ReactGA.initialize('UA-93064531-2', {
            titleCase: false,
            gaOptions: {
                userId: this.state.idusers
            },
            debug: (process.env.REACT_APP_GA_DEBUG === 'true')
        })
        ReactGA.ga('send', 'pageview', window.location.pathname + window.location.search)

    }

    componentDidMount () {

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
            LogOut()
        } else {
            return false
        }
    }

    showSideMenu () {
        let { showSideMenu } = this.state
        this.setState({
            showSideMenu: (!showSideMenu)
        })
        // if (showSideMenu === true) {
        //     this.setState({
        //         showSideMenu: false
        //     })
        // } else {
        //     this.setState({
        //         showSideMenu: true
        //     })
        // }
    }

    closeAttoneySVC = () => {
        this.setState({
            openAttoneySVC: false
        })
    }

    completeAttoneySVC = () => {
        this.setState({
            openAttoneySVC: false
        })
    }

    goLawyerLink = (hash) => {
        let url
        switch (hash) {
            case 1:
                url = helper_url.service.lawyer.contract_review
                break
            case 3:
                url = helper_url.service.lawyer.contract_review + '#3'
                break
            default:
                url = helper_url.service.lawyer.profile

        }

        window.location.href = url
    }

    render () {

        const themeClass = (!!this.props.theme) ? this.props.theme : null
        const iconHamberg = <img src={themeClass === 'dark' ? '/images/common/hamberg-dark.svg' : '/images/common/hamberg.svg'} alt={'hamberg'}/>
        const attoneybtn = <img src={themeClass === 'dark' ? '/images/event/attoneyservice/headerbtn-dark.svg' : '/images/event/attoneyservice/headerbtn.svg'} alt={'headerbtn'}/>
        const refererPath = encodeURIComponent(window.location.pathname)

        return (
            <div className={'common header ' + themeClass} style={this.props.styles}>
                <AttoneySVC open={this.state.openAttoneySVC} close={this.closeAttoneySVC} onComplete={this.completeAttoneySVC}/>
                <nav className={'nav-item logo'}><Logo theme={this.props.theme}/></nav>
                <nav className={'nav-item menu'}>
                    {(!this.props.peer_review) ? (<>
                            <ul className="menu mobile_hide">
                                <li className="dropdown">문서작성하기
                                    <div className="arrow"></div>
                                    <ul>
                                        <li><Link href="/category/[id]" as="/category/1"><a>내용증명</a></Link></li>
                                        <li><Link href="/category/[id]" as="/category/3"><a>지급명령</a></Link></li>
                                        <li><Link href="/category/[id]" as="/category/99"><a>계약서</a></Link></li>
                                        <li><Link href="/startup/document"><a>스타트업</a></Link></li>
                                        <li><Link href="/category/[id]" as="/category/4"><a>합의서</a></Link></li>
                                        <li><Link href="/category/[id]" as="/category/2"><a>위임장</a></Link></li>
                                    </ul>
                                </li>
                                <li >
                                    <Link href="/startup"><a>스타트업</a></Link>
                                </li>
                                <li><a href="/magazine" >교육실</a></li>
                                <li><Link href="/press"><a>로폼소식</a></Link></li>
                                {/* <li className="dropdown">
                                    로폼 매거진
                                    <div className="arrow"></div>
                                    <ul>
                                        <li><Link href="/magazine"><a>법률실전</a></Link></li>
                                        <li><Link href="/press"><a>로폼소식</a></Link></li>
                                    </ul>
                                </li> */}
                                <li className={this.props.active === 'qna' ? 'active' : null}>
                                    <Link href="/customer/qna"><a>1:1 이용문의</a></Link></li>
                                <li onClick={() => this.setState({ openAttoneySVC: true })}>{attoneybtn}</li>
                                {/* <li><Package id="wrap_nav5" history={this.props.history}></Package></li> */}
                            </ul>

                        </>
                    ) : (<>
                            <ul className="menu mobile_hide">
                                <li style={{ width: 0, margin: 0, padding: 0 }}/>
                                <li className={this.props.active === 'lawyer_contract_request' ? 'active' : null}><Link
                                    href={helper_url.service.lawyer.contract_request}>요청사건</Link></li>
                                <li className={'lawyer-document'}>법률문서 자동작성
                                    <div className="arrow"/>
                                    <ul>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/1"><a>내용증명</a></Link></li>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/3"><a>지급명령</a></Link></li>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/4"><a>합의서</a></Link></li>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/2"><a>위임장</a></Link></li>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/99"><a>계약서</a></Link></li>
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/99"><a>스타트업 필수문서</a></Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={this.props.active === 'lawyer_qna' ? 'active' : null}><Link
                                    href={helper_url.service.member.qna}>1:1 이용문의</Link></li>
                            </ul>

                        </>
                    )}
                </nav>

                <nav className={'nav-item signup-area'}>
                    {(!this.props.peer_review) ? (
                        <>
                            {!this.userInfo ?
                                <ul className="user-login mobile_hide">
                                    {/*<li><a href="#signin" onClick={(e) => ReactGA.pageview(window.location.pathname + '#signin', null, '로그인/가입')}>로그인/가입</a></li>*/}
                                    {/*<li><Link href="/signup">회원가입</Link></li>*/}
                                    <li><Link href={'/auth/signin?referer=' + refererPath}><a onClick={(e) => ReactGA.pageview('/auth/signin?referer=' + refererPath, null, '로그인/가입')}>로그인/가입</a></Link></li>
                                </ul>
                                :
                                <div className="user-loged mobile_hide">
                                    <div className="user-name">{this.userInfo.username}</div>
                                    님
                                    <div className="arrow"></div>
                                    <ul>
                                        <li><Link href="/mydocument" as="/mydocument"><a>마이페이지</a></Link></li>
                                        <li><Link href="/myinfo" as="/myinfo"><a href="/myinfo">내 정보 수정</a></Link></li>
                                        <li><a style={{ cursor: 'pointer' }} onClick={this.logOut}>로그아웃</a></li>
                                    </ul>
                                </div>
                            }
                            <div className="hamberg mobile">
                                <div onClick={() => this.showSideMenu()}>{iconHamberg}</div>
                                <div className={this.state.showSideMenu === true ? `side-menu box-shadow` : `hide`}>
                                    {!this.userInfo ?
                                        <div className="login">
                                            <Link href="/auth/signup">
                                                <button  className="join">회원가입</button>
                                            </Link>
                                            <Link href={'/auth/signin?referer=' + refererPath}>
                                                <button onClick={(e) => ReactGA.pageview('/auth/signin?referer=' + refererPath, null, '로그인/가입')}>로그인</button>
                                            </Link>
                                        </div>
                                        :
                                        <div className="logout">
                                            <span>{this.userInfo.username} 님</span>
                                            <button onClick={this.logOut}>로그아웃</button>
                                        </div>
                                    }
                                    <ul>
                                        {this.userInfo ?
                                            <li><Link href="/mydocument" as="/mydocument"><a><img
                                                src="/images/icons/icon-mypage.svg"/>마이페이지</a></Link></li>
                                            : null
                                        }
                                        <li>
                                            <Link href="/"><a><img
                                                src='/images/icons/icon-documents.svg'/>문서작성하기</a></Link>
                                            <ul>
                                                <li><Link href="/category/1"><a>내용증명</a></Link></li>
                                                <li><Link href="/category/3"><a>지급명령</a></Link></li>
                                                <li><Link href="/category/99"><a>계약서</a></Link></li>
                                                <li><Link href="/category/4"><a>합의서</a></Link></li>
                                                <li><Link href="/category/2"><a>위임장</a></Link></li>
                                            </ul>
                                        </li>
                                        <li><Link href="/startup"><a><img src="/images/icons/icon-startup.svg"/>스타트업 프로그램</a></Link></li>
                                        <li><a href="/magazine"><img src="/images/icons/icon-magazine.svg"/>교육실</a></li>
                                        <li><Link href="/press"><a><img src="/images/icons/icon-microphone.svg"/>로폼소식</a></Link></li>
                                        <li><Link href="/customer/qna"><a><img src="/images/icons/icon-qna.svg"/>1:1 이용문의</a></Link></li>
                                        <li><Link href="/event/attoney"><a><img src="/images/icons/icon-attoney.svg"/>변호사 서비스 안내</a></Link></li>
                                    </ul>
                                    {/* {!this.userInfo ?
                                        <div className="join">
                                            아직 회원이 아니신가요?
                                            <Link href="/auth/signup">
                                                <button>회원가입</button>
                                            </Link>
                                        </div>
                                        :
                                        <div className="join"></div>
                                    } */}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {(!this.userInfo) ?
                                <ul className="user-login mobile_hide">
                                    <li><Link href={'/auth/signin?referer=' + refererPath} onClick={(e) => ReactGA.pageview('/auth/signin?referer=' + refererPath, null, '로그인/가입')}>로그인/가입</Link></li>
                                </ul>
                                :
                                <div className="user-loged mobile_hide">
                                    <div className="user-name">{this.userInfo.username}</div>
                                    님
                                    <div className="arrow"></div>

                                    {this.userInfo.account_type === 'A' &&
                                    <ul>
                                        <li onClick={() => this.goLawyerLink(1)}><a style={{ cursor: 'pointer' }}>나의 사건 관리</a></li>
                                        <li><Link href={helper_url.service.member.document_list} as={helper_url.service.member.document_list}>내 문서 보관함</Link></li>
                                        <li onClick={() => this.goLawyerLink(3)}><a style={{ cursor: 'pointer' }}>사건 정산 내역</a></li>
                                        <li><Link href={helper_url.service.lawyer.profile} as={helper_url.service.lawyer.profile}>내 정보 수정</Link></li>
                                        <li onClick={this.logOut} style={{ cursor: 'pointer' }}>로그아웃</li>
                                    </ul>
                                    }

                                </div>
                            }

                            <div className="hamberg mobile">
                                <div onClick={() => this.showSideMenu()}>{iconHamberg}</div>
                                <div className={this.state.showSideMenu === true ? `side-menu box-shadow` : `hide`}>
                                    {!this.userInfo ?
                                        <div className="login">
                                            로그인을 해주세요.
                                            <a href={'/auth/signin?referer=' + refererPath}><button>로그인</button></a>
                                        </div>
                                        :
                                        <div className="logout">
                                            <span>{this.userInfo.username} 님</span>
                                            <button onClick={this.logOut}>로그아웃</button>
                                        </div>
                                    }
                                    <ul>
                                        <li><Link href={helper_url.service.lawyer.contract_request} as={helper_url.service.lawyer.contract_request}><a>요청사건</a></Link></li>
                                        <li onClick={() => this.goLawyerLink(1)}><a style={{ cursor: 'pointer' }}>나의 사건 관리</a></li>
                                        {/*<li><Link href={helper_url.service.member.document_list}>내 문서 보관함</Link></li>*/}
                                        <li onClick={() => this.goLawyerLink(3)}><a style={{ cursor: 'pointer' }}>사건 정산 내역</a></li>
                                        <li><Link href={helper_url.service.lawyer.profile} as={helper_url.service.lawyer.profile}><a>내 정보 수정</a></Link></li>
                                        <li onClick={this.logOut} style={{ cursor: 'pointer' }}>로그아웃</li>
                                    </ul>
                                    {!this.userInfo ?
                                        <div className="join">
                                            아직 회원이 아니신가요?
                                            <Link href="/auth/signup">
                                                <a>
                                                    <button>회원가입</button>
                                                </a>
                                            </Link>
                                        </div>
                                        :
                                        <div className="join"></div>
                                    }
                                </div>
                            </div>
                        </>
                    )}

                </nav>
                <div className={this.state.showSideMenu === true ? `side-menu-back` : `hide`} onClick={() => this.showSideMenu()}></div>


            </div>
        )
    }
}

export default Header
