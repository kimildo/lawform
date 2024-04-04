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
import Modal from '../common/modal';

class Header extends Component {
    constructor (props) {
        super(props)

        this.userInfo = User.getInfo()
        if (!!this.userInfo) {
            this.state = {
                login: 'Y',
                idusers: this.userInfo.idusers,
                username: this.userInfo.username,
                company_name: this.userInfo.company_name,
                showSideMenu: false,
                userProgram: null,
                boardpermission: false,
                programRequest:{}
            }
        } else {
            this.state = {
                login: 'N',
                idusers: '',
                username: '',
                company_name: '',
                showSideMenu: false,
                userProgram: null,
                boardpermission: false,
                programRequest:{}
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
        this.getProgram( this.state.idusers)
    }

    getProgram( idusers ) {
        var params = {
            idusers:idusers
        }
        Api.sendPost('/user/program', params ).then(res => {
            if( res.data.data ) {
                this.setState({ userProgram:res.data.data[0] })
                if( !!res.data.data[0] && !!res.data.data[0].group_idx ) {
                    Api.sendPost('/user/boardpermission', params ).then(r => {
                        if( r.data.permission === true ) {
                            this.setState({boardpermission:true})
                        }
                    })
                }
            } 
        })
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

    requestOpen = (refererPath) => {
        if( !this.userInfo ) {
            alert('기업회원만 이용가능합니다.\n로그인 후 이용해 주세요.')
            window.location.href = '/auth/signin?referer=' + refererPath
        } else {
            if( this.userInfo.account_type ==='C' ) {
                this.setState({requestOpen:true})
            } else {
                alert('기업회원만 이용가능합니다.')
            }
        }
    }

    setRequest = async (e) => {
        let request = this.state.programRequest
        // console.log(  'this.setRequest' , e.target, request)
        const name = e.target.name
        let value = e.target.value
        if( value === '' ) value = null
        request[name] = value
        await this.setState({
            programRequest:request
        })
    }

    submitRequest = async (e) => {
        let request = this.state.programRequest
        if( !request.keyword || !request.owner_name || !request.owner_phonenumber, !request.owner_email ) {
            alert("모든 항목을 입력해주세요.")
            e.preventDefault()
        }
        Api.sendPost('/user/programrequest', request ).then(res => {
            console.log( 'submitrequest',res )
            if( res.status === 'ok' ) {
                this.setState({
                    requestOpen:false,
                    programRequest:{}
                })
                alert("프로그램 권한이 신청되었습니다. 승인 후 안내 문자를 보내드립니다. 감사합니다.")
            }
        })
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
                                <li className={this.props.active === 'startup' ? 'active' : null}>
                                    <Link href="/startup"><a>스타트업</a></Link>
                                </li>
                                <li className={this.props.active === '' ? 'active' : null}>
                                    <Link href="/startup/document"><a>스타트업 필수문서</a></Link>
                                </li>
                                <li className={this.props.active === '' ? 'active' : null}>
                                    <Link href="/startup/solution"><a>스타트업 실사</a></Link>
                                </li>
                                <li className={this.props.active === '' ? 'active' : null}>
                                    <a href="/startup/education">교육실</a>
                                </li>
                                {/* <li className={this.props.active === '' ? 'active' : null}>
                                    <Link href="/"><a>투자 실사</a></Link>
                                </li> */}
                                <li className={this.props.active === '' ? 'active' : null}>
                                    { ( this.state.boardpermission === true )?
                                    <Link href="/startup/qna"><a>제휴사 전용 서비스</a></Link>   
                                    :
                                    <Link href="/customer/qna"><a>이용문의</a></Link>
                                    }
                                </li>
                                { ( !this.state.boardpermission )?
                                <li>
                                    <div className="program-request-btn" onClick={e=>this.requestOpen(refererPath)}>프로그램 권한 신청</div>
                                </li>:null
                                }
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
                                        <li><Link href="/lawyer/category/[id]" as="/lawyer/category/99"><a>기업문서</a></Link></li>
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
                                            {/* <ul>
                                                <li><Link href="/category/[id]" as="/category/1"><a>내용증명</a></Link></li>
                                                <li><Link href="/category/[id]" as="/category/3"><a>지급명령</a></Link></li>
                                                <li><Link href="/category/[id]" as="/category/99"><a>계약서</a></Link></li>
                                                <li><Link href="/category/[id]" as="/category/99"><a>스타트업</a></Link></li>
                                                <li><Link href="/category/[id]" as="/category/4"><a>합의서</a></Link></li>
                                                <li><Link href="/category/[id]" as="/category/2"><a>위임장</a></Link></li>
                                            </ul> */}
                                        </li>
                                        <li><Link href="/startup"><a><img src="/images/icons/icon-startup.svg"/>스타트업 프로그램</a></Link>
                                            <ul>
                                                <li><Link href="/startup/document" ><a>스타트업 필수문서</a></Link></li>
                                                <li><Link href="/startup/solution" ><a>스타트업 실사</a></Link></li>
                                                <li><a href="/startup/education" >교육실</a></li>
                                                <li><Link href="/startup/qna"><a>제휴사 서비스</a></Link></li>
                                                <li><a onClick={e=>this.requestOpen(refererPath)}>프로그램 권한 신청</a></li>
                                            </ul>
                                        </li>
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
                <Modal
                    open={this.state.requestOpen}
                    onClose={e=>this.setState({programRequest:{}})}
                    width={524}
                    height={620}
                    className='program-request'
                >
                    <div className="close-x" onClick={e=>this.setState({requestOpen:false})} ><img src="/common/close-x-normal.svg" /></div>
                    <div className="">
                        <h3>프로그램 권한 신청</h3>
                        <ul>
                            <li>원활한 권한 지급을 위해 지원기관에 사전 등록된 정보와 동일하게 입력해주세요.</li>
                            <li>등록 키워드는 문자/이메일을 통해 전달드린 키워드와 동일하게 입력해주세요.</li>
                            <li>권한 신청 관련한 문의 사항은 1:1 이용문의를 이용해주세요.</li>
                        </ul>
                        <hr />
                        <section>
                            <div className="comapny-name">회사명: {this.state.company_name}</div>
                            <div className="keyword"><input type="text" value={!!this.state.programRequest.keyword?this.state.programRequest.keyword:null} name="keyword" onChange={e=>this.setRequest(e)} placeholder="등록 키워드를 입력해주세요." /></div>
                            <div className="comapny-owner"><input type="text" value={!!this.state.programRequest.owner_name?this.state.programRequest.owner_name:null} name="owner_name" onChange={e=>this.setRequest(e)} placeholder="대표자명을 입력해주세요." />
                            <span>*공동대표일경우, 가나다 순서로 우선하는 대표자명 1인을 입력 </span>
                            </div>
                            <div className="comapny-owner-phonenumber"><input type="tel" value={!!this.state.programRequest.owner_phonenumber?this.state.programRequest.owner_phonenumber:null} name="owner_phonenumber" onChange={e=>this.setRequest(e)} placeholder="대표자 핸드폰 번호를 입력해주세요. ( ‘-’ 제외 입력)." /></div>
                            <div className="comapny-owner-email"><input type="email" value={!!this.state.programRequest.owner_email?this.state.programRequest.owner_email:null} name="owner_email" onChange={e=>this.setRequest(e)} placeholder="대표자 이메일을 입력해주세요." /></div>
                        </section>
                        <button onClick={e=>this.submitRequest(e)}>권한 신청</button>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default Header
