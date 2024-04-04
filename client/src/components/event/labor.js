import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import Payment from "../common/payment"
import User from '../../utils/user';
import API from '../../utils/apiutil';
import ReactGA from 'react-ga';

class Labor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docData: {},
            category: 0
        }
    }

    componentDidMount() {
        alert( "종료된 이벤트입니다." );
        window.location  = "/";
        // API.sendGet('/documents/document/50')
        //     .then(res => {
        //         this.setState({
        //             docData: res.data[0],
        //             category: res.data[0].idcategory_1
        //         });
        //     })
    }

    loginCheckBeforePayment = () => {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert("로그인 후 구매하여 주세요.");
            window.location.href = "#signin";
        } 
        else {
            let param = {
                host: window.location.hostname
            };
            API.sendPost('/user/state', param).then((res) => {
                    if (this.state.docData.dc_price === 0) { // 무료 문서
                        let param = {
                            isFree : true,
                            iddocuments: 50,
                            name: this.state.docData.title
                        };
                        API.sendPost('/payments', param).then((res) => {
                            if( res.status === 'ok' ) {
                                // if( !!res.data.result.insertId ){
                                //     // window.location.href = '/autoform/'+res.data.result.insertId;
                                //      window.location.href = '/mydocument';
                                // }
                                ReactGA.event({
                                    category: 'event',
                                    action: 'labor get free document'
                                  });
                                let r = window.confirm('내 문서함 보관함에 추가 되었습니다. \r\n내 문서 보관함으로 이동하시겠습니까?'); // 사실은 payments 이후에 호출 되어야 하나 중복 클릭 방지 하기 위해 여기 위치
                                if ( r === true) {
                                    window.location.href = '/mydocument';
                                }
                            }
                        });
                    }
            });
        }
    }

    render() {
        return (
            <div className="labor">
                <div className="top">
                    <div className="buttons">
                    <a href="/signup" target="new">
                        <img src="/images/event/button-signup.svg" alt="로폼 회원 가입하기" />
                    </a>
                    </div>
                </div>
                <div className="contents">
                    <div className="about-autoform"><img src="/images/event/about-autoform.svg" alt="로폼의 법률문서 자동작성이란?"/></div>
                    <section className="event1">
                        <a onClick={()=> this.loginCheckBeforePayment()} style={{cursor:'pointer'}}>
                            <img src="/images/event/write.svg" alt="근로계약서 무료 작성하기" />
                        </a>
                    </section>
                    <section className="event2">
                        <Link href="/preview/34">
                            <img src="/images/event/buy.svg" alt="할인 구매하기" />
                        </Link>
                    </section>
                </div>
            </div>
        );
    }
};

export default Labor;