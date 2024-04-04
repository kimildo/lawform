import React, { Component, Fragment } from 'react';
import Link from 'next/link';
// import '../../scss/autoform/autoformheader.scss';
import User from '../../utils/user';
import Cookies from 'js-cookie';
import ReactGA from 'react-ga';
import API from '../../utils/apiutil';
import Category from '../../pages/category';

class AutoformHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: 'N',
            idusers: '',
            username: '',
            category: 1
        }

        let userInfo = User.getInfo();
        if (!!userInfo) {
            this.state.login = 'Y';
            this.state.idusers = userInfo.idusers;
            this.state.username = userInfo.username;
        } else {
            this.state.login = 'N';
        }
    }

    componentWillMount() {
        API.sendGet('/documents/preview/' + this.props.iddocument).then((res)=>{
            console.log( res.data )
            if( res.data.status === 'ok' ) {
                this.setState({
                    docTitle : res.data.data[0].title,
                    docContext : res.data.data[0].context,
                    category: res.data.data[0].idcategory_1
                })
            } else {
                alert('해당문서가 없습니다.')
                window.location.href = '/'
            }
        });
    }

    logOut = () => {
        const q_logout =  window.confirm("로그아웃 하시겠습니까?");
        if( q_logout === true ) {
            this.setState({
                login : 'N'
            })
            Cookies.remove('token');
            window.location = "/";
        } else {
            return false;
        }
    }

    render() {
        let back = "/category/"+this.state.category;
        var agent = navigator.userAgent.toLowerCase(); 
        return (
            <div className="wrap_autofrom_header">
                <div className="autofrom_header">
                    <div className="autofrom_header_img">
                    {
                        ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1))?
                        <Fragment>
                            <a href={back}>
                            <img src="/category_img/back.png" className="autoform_mypage_btn" alt="autoform_mypage_btn" />
                            </a>
                            <a href="/">
                            <img src="/autoform_img/main_btn.png" width="119" height="72" className="autoform_main_btn" alt="autoform_main_btn" />
                            </a>
                        </Fragment>
                        :
                        <Fragment>
                        <Link href={back}>
                        <img src="/category_img/back.png" className="autoform_mypage_btn" alt="autoform_mypage_btn" />
                        </Link>
                        <Link href="/">
                        <img src="/autoform_img/main_btn.png" width="119" height="72" className="autoform_main_btn" alt="autoform_main_btn" />
                        </Link>
                    </Fragment>

                    }
                    </div>
                    <div className="autofrom_header_user">
                        {this.state.login === 'Y'
                            ?
                            (
                                <div className="nav_userinfo">

                                    <div style={{height:56}}>
                                        <div style={{float:'left', margin:'0px 7px 0 15px',}}><img className="nav_usericon" src="/header_img/usericon.svg" alt="user_image" width={36} height={36} ></img></div>
                                        <div className="nav_text" style={{ fontSize:16, marginTop:8}}>
                                            <span className="nav_username">{this.state.username}</span>
                                            <span style={{ margin: `0 0 0 10px` }}>님</span>
                                            <span className="nav_img"></span>
                                        </div>
                                    </div>
                                    <div className="nav_dropdown">
                                        <ul>
                                            <li><a href="/mydocument" >마이페이지</a></li>
                                            <li onClick={this.logOut}  style={{cursor:'pointer'}}>로그아웃</li>
                                        </ul>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <a href="#signin">
                                    <img src="/header_img/nav_login.png" className="nav_login" alt="nav_login" />
                                </a>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AutoformHeader;