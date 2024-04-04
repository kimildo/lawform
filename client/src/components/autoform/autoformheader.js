import React, { Component } from 'react';
import Link from 'next/link';
// import '../../scss/autoform/autoformheader.scss';
import User from '../../utils/user';
import Cookies from 'js-cookie';

class AutoformHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: 'N',
            idusers: '',
            username: ''
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
        return (
            <div className="wrap_autofrom_header">
                <div className="logo_wrap">
                    <Link href="/" className="logo_link">
                        <img src="/autoform_img/header_logo.svg" />
                    </Link>
                    <div className="logo_title">
                        법률문서 자동작성
                    </div>
                </div>
                <div className="buttons">
                        <Link href="#"><a><img src="/autoform_img/btn_doc.svg" alt="문서 작성하기" /></a></Link>
                        <Link href="#"><a><img src="/autoform_img/btn_info.svg" alt="문서 상세설명" /></a></Link>
                        <Link href="#"><a><img src="/autoform_img/btn_price.svg" alt="요금 안내" /></a></Link>
                </div>
            </div>
        );
    }
}

export default AutoformHeader;