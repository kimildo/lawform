import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import User from '../../utils/user';
import ReactGA from 'react-ga';
import { Helmet } from "react-helmet";
import Logo from "../common/logo";
import Signin from '../common/signin';
import Finduser from '../common/finduser';
import Findpw from '../common/findpw';
import Cookies from 'js-cookie';
import Package from '../common/package';


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            showSideMenu: false
        }
        this.userInfo = User.getInfo();
    }

    componentDidMount() {
    }

    logOut = () => {
        const q_logout =  window.confirm("로그아웃 하시겠습니까?");
        if( q_logout === true ) {
            Cookies.remove('token');
            Cookies.remove('token', { path: '/'});
            Cookies.remove('token', { path: '/detail' });
            Cookies.remove('token', { path: '/legalsolution' })
            window.location = "/";
        } else {
            return false;
        }
    };

    showSideMenu() {
        var status = this.state.showSideMenu;
        if( status === true ) {
            this.setState({
                showSideMenu:false
            })
        } else {
            this.setState({
                showSideMenu:true
            })
        }
    }

    render() {

        const refererPath = encodeURIComponent(window.location.pathname)

        return (
            <div className="header" style={this.props.styles}>
                <Logo></Logo>
                <ul className="menu mobile_hide" >
                    <li>문서작성하기
                        <ul>
                            <li><Link href="/category/1"><a>내용증명</a></Link></li>
                            <li><Link href="/category/3"><a>지급명령</a></Link></li>
                            <li><Link href="/category/4"><a>합의서</a></Link></li>
                            <li><Link href="/category/2"><a>위임장</a></Link></li>
                            <li><Link href="/category/99"><a>기업문서</a></Link></li>
                            <li><Link href="/category/99"><a>스타트업 필수문서</a></Link></li>
                        </ul>
                    </li>
                    <li><Link href="/startup"><a>스타트업프로그램</a></Link></li>
                    <li><Link href="/customer/qna"><a>1:1 이용문의</a></Link></li>
                    {/* <li><Link href="/magazine">매거진</Link></li> */}
                    <li><Package id="wrap_nav5" history={this.props.history}></Package></li>
                </ul>
                {!this.userInfo?
                <ul className="user-login mobile_hide">
                    <li><a href={'/auth/signin?referer=' + refererPath}>로그인</a></li>
                    <li><Link href="/auth/signup">회원가입</Link></li>
                </ul>
                :
                <ul className="user-login mobile_hide">
                    {/* <li onClick={this.logOut} >로그아웃</li> */}
                </ul>
                }
                <div className="hamberg mobile" >
                    <div onClick={()=>this.showSideMenu()}><img src="/images/common/hamberg.svg" /></div>
                    <div className={this.state.showSideMenu === true?`side-menu box-shadow`:`hide`}>
                        {!this.userInfo?
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
                            {this.userInfo?
                            <li><Link href="/mydocument"><img src="/header_img/mobile/side_menu/icon_3.svg" alt={'마이페이지'} />마이페이지</Link></li>
                                :null
                            }
                            <li><Link href="/"><img src='/header_img/mobile/side_menu/icon_1.svg' alt={'문서작성하기'}/>문서작성하기</Link></li>
                            <li><Link href="/startup"><img src="/header_img/mobile/side_menu/icon_2.svg" alt={'스타트업'}/>스타트업</Link></li>
                            <li><Link href="/customer/qna"><img src="/header_img/mobile/side_menu/icon_2.svg" alt={'1:1 이용문의'}/>1:1 이용문의</Link></li>
                            <li><Link href="/magazine"><img src="/header_img/mobile/side_menu/icon_2.svg" alt={'매거진'}/>매거진</Link></li>
                        </ul>
                        {!this.userInfo?
                        <div className="join">
                        아직 회원이 아니신가요?
                            <Link href="/auth/signup"><button>회원가입</button></Link>
                        </div>
                        :
                        <div className="join"></div>
                        }

                    </div>
                </div>
                <div className={this.state.showSideMenu === true?`side-menu-back`:`hide`} onClick={()=>this.showSideMenu()}></div>
            </div>
        );
    }
}

export default Header;
