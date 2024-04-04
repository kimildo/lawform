import React, { Component } from 'react';
import ReactDOM from "react-dom";
// import '../../scss/common/finduser.scss';
import Api from '../../utils/apiutil';
import Cookies from 'js-cookie';
import moment from 'moment';
import ReactGA from 'react-ga';

class Finduser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            tab: '1',
            phoneCheck: "N", // 전화번호 인증 스위치
            sendCode: 'N',
            countdown: 120*10000,
            timer: '2:00',
            sendSmsBtn : '전송',
            view:"",
            findedUserId : "",
            findedUserName : "",
            findedUsers : [],
            findedCount : 0,
            nameLabel : "이름"
         }
    }


    componentDidMount() {
        this.startCountDown()
        this.setState({
            view: this.form
        })
    }

    startCountDown() {
        clearInterval( setTimer )
        let setTime = 120*10000;
        var setTimer = setInterval(()=>{ 
            setTime = this.state.countdown - 10000
            if( setTime <= 0 ) {
                setTime  = 0
                this.setState({
                    sendCode: 'N',
                    timer: '0:00'
                })
            }
            var m = parseInt(( ( setTime *0.0001) %3600)/60);
            var s = ( setTime*0.0001 )%60;
            s = ("0" + s).slice(-2)
            // console.log( "countdown: " , this.state.countdown , m, s , setTimer)
            this.setState({
                countdown : setTime,
                timer : m+':'+s
            })
        }, 1000);
    }

    phoneAuthCode = () => {
        var receiver =ReactDOM.findDOMNode(this.refs.phonenumber).value;
        if( receiver === "" ) {
            alert('전화번호를 입력해주세요.')
            return false;
        }
        const params = {
            "receiver": receiver
        };
        let phone_true =ReactDOM.findDOMNode(this.refs.phone_true);
        let phone_false =ReactDOM.findDOMNode(this.refs.phone_false);
        let phone_send =ReactDOM.findDOMNode(this.refs.phone_send);
        Api.sendPost('/user/sendphone', params)
        .then(res => {
          if( res.status === 'ok' ) {
            this.setState({
                sendCode: 'Y',
                countdown: 120*10000,
                sendSmsBtn: '재전송'
            },()=>{
                phone_true.style.display = "none";
                phone_false.style.display = "none";
                phone_send.style.display = "inline";
                alert("인증번호가 전송되었습니다.")
            })
          } else {
            this.setState({
                sendCode: 'N'
            })
          }
        })
    }

    checkAuthCode = () => {
        var rcode = ReactDOM.findDOMNode(this.refs.rcode).value;
        var receiver =ReactDOM.findDOMNode(this.refs.phonenumber).value;
        let phone_true =ReactDOM.findDOMNode(this.refs.phone_true);
        let phone_false =ReactDOM.findDOMNode(this.refs.phone_false);
        let phone_send =ReactDOM.findDOMNode(this.refs.phone_send);

        const params = {
            "rcode": rcode,
            "receiver": receiver
        };
        Api.sendPost('/user/authphone', params)
        .then(res => {
          let status = res.data.status;
          if( status === "ok" && this.state.sendCode === 'Y' ) {
            phone_true.style.display = "inline";
            phone_false.style.display = "none";
            phone_send.style.display = "none";
            this.setState({
                phoneCheck : "Y"
            })
//            this.props.phoneCheck("Y");
          } else {
            phone_false.style.display = "inline";
            phone_true.style.display = "none";
            phone_send.style.display = "none";
            // this.props.phoneCheck("N");
          }
        })

    }

    findUser= () => {
        if( this.state.phoneCheck !== 'Y' ) {
            alert( "전화인증을 완료해주십시오." )
            return false
        }
        let findreault =ReactDOM.findDOMNode(this.refs.findreault)
        let findform =ReactDOM.findDOMNode(this.refs.findform)

        let phonenumber =ReactDOM.findDOMNode(this.refs.phonenumber).value.trim();
        let findname =ReactDOM.findDOMNode(this.refs.findname).value.trim();

        if( findname === '' ) {
            alert( "이름을 입력해주세요." )
            return false
        }
        let usertype = 'P';
        if( this.state.tab == '2'  ) {
            usertype = 'C'
        }

        var params = {
            name : findname,
            phonenumber : phonenumber,
            usertype : usertype
        }
        Api.sendPost( '/user/finduser', params ).then((res)=>{
            if( res.status === 'ok' ) {
                
                this.setState({
                    findedUsers : res.data.data,
                    findedCount : res.data.data.length,
                    findedUserName : findname
                });
                findform.style.display = 'none'
                findreault.style.display = 'block'

            } else {
                alert('일치하는 정보가 없습니다.')
                findform.style.display = 'block'
                findreault.style.display = 'none'

            }
        })

    }


    section_personal = () => {
        if( this.state.tab !== '1' ){
            this.setState({
                tab: '1',
                nameLabel: '이름'
            });
            ReactDOM.findDOMNode(this.refs.findname).value = "";
            ReactDOM.findDOMNode(this.refs.phonenumber).value = "";
            ReactDOM.findDOMNode(this.refs.rcode).value = "";    
        }
    }

    section_company = () => {
        if( this.state.tab !== '2' ){
            this.setState({
                tab: '2',
                nameLabel: '담당자명'
            });
            ReactDOM.findDOMNode(this.refs.findname).value = "";
            ReactDOM.findDOMNode(this.refs.phonenumber).value = "";
            ReactDOM.findDOMNode(this.refs.rcode).value = "";
        }
    }

    reset_find = () => {
        ReactDOM.findDOMNode(this.refs.phonenumber).value = "";
        ReactDOM.findDOMNode(this.refs.findname).value = "";
        ReactDOM.findDOMNode(this.refs.rcode).value = "";
    }

    close_find = () => {
        ReactDOM.findDOMNode(this.refs.findreault).style.display = 'none'
        ReactDOM.findDOMNode(this.refs.findform).style.display = 'block'
        ReactDOM.findDOMNode(this.refs.phonenumber).value = "";
        ReactDOM.findDOMNode(this.refs.findname).value = "";
        ReactDOM.findDOMNode(this.refs.rcode).value = "";
        ReactGA.pageview(window.location.pathname+'#findpw',null,'비밀번호 찾기')
    }

    render() {

        var tab_check  = this.state.tab;

        if (tab_check === '1'){
            var personal = {
                display: 'block'
            }
            var company = {
                display: 'none'
            }
            var lawyer = {
                display: 'none'
            }
            var personal_tab = {
                borderColor: '#15376c',
                color: '#15376c'
            }
            var company_tab = {
                borderColor: 'gray',
                color: 'gray'
            }
        }
        else if (tab_check === '2'){
            personal = {
                display: 'none'
            }
            company = {
                display: 'block'
            }
            lawyer = {
                display: 'none'
            }
            personal_tab = {
                borderColor: 'gray',
                color: 'gray'
            }
            company_tab = {
                borderColor: '#15376c',
                color: '#15376c'
            }
        }


        var bottom = {
            borderBottom: 'solid black 3px '
        }

        return (
            <div className="wrap_finduser"  style={{adding:' 9px 47px', position:'relative'}}>
                <a className="close" href="#close" onClick={this.close_find} style={{ right:20 }}>
                    <img src="/autoform_img/x_btn.png" width="48" height="48" alt="x_btn"></img>
                </a>
                <div  className="wrap_finduser_findid">
                    아이디 찾기
                </div>
                <div className="findPassword"><a href="#findpw" style={{color:'#000'}} onClick={this.close_find}>비밀번호 찾기</a></div>
            <div className="findform" ref="findform">
                <div>
                    <table className="wrap_signup_section">
                        <tbody>
                            <tr style={bottom}>
                                <td style={personal_tab} className="signup_section" id="signup_personal_section" onClick={this.section_personal}>개인회원</td>
                                <td style={company_tab} className="signup_section" id="signup_company_section" onClick={this.section_company} >기업회원</td>
                                <td className="signup_section_lawyer"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='find_user_personal'>
                    <div className="wrap_finduser_title" style={{marginTop: 20}}>
                        <span>{this.state.nameLabel}*</span>
                    </div>
                    <div className="wrap_signup_personal_pw_section">
                        <input placeholder="홍길동" className="signup_personal_pw" type="text" name="name" ref="findname"></input>
                    </div>
                    <div className="wrap_finduser_title">
                        <span>휴대폰 번호*</span>
                    </div>
                    <div className="wrap_signup_personal_inputphone">
                        <div className="wrap_signup_personal_phone_section">
                            <input placeholder="'_' 없이 입력" className="signup_personal_phone" type="text" name="phonenumber" ref="phonenumber"></input>
                        </div>
                        <div className="blank"></div>
                        <div className="wrap_signup_personal_phone_btn" onClick={this.phoneAuthCode}>
                            <span>인증번호 {this.state.sendSmsBtn}</span>
                        </div>
                    </div>
                    <div className="wrap_finduser_title">
                        <span>인증번호*</span>
                        <span ref="phone_send" className="personal_pw_false"> ({this.state.timer})이내에 입력해주십시오. </span><span ref="phone_true" className="personal_pw_false">인증되었습니다.</span><span ref="phone_false" className="personal_pw_false">인증번호가 올바르지 않습니다.</span>
                    </div>
                    <div className="wrap_signup_personal_inputphone">
                        <div className="wrap_signup_personal_phone_section">
                            <input placeholder="인증번호 입력" className="signup_personal_phone" type="text" ref="rcode"></input>
                        </div>
                        <div className="blank"></div>
                        <div className="wrap_signup_personal_phone_btn" onClick={this.checkAuthCode}>
                            <span>확인</span>
                        </div>
                    </div>
                    <button type="button" className="wrap_finduser_btn" onClick={this.findUser}>아이디 찾기</button>
                    <div className="finduser_foot">
                        위 방법으로 계정을 찾을 수 없다면 1:1문의를 이용해주세요.
                    </div>
                </div>
            </div>
            <div className="findreault" ref="findreault">
                <div>
                    <div className="searched">
                    {this.state.findedUserName}님의 아이디가 {this.state.findedCount}건 검색되었습니다.
                    </div>
                    <ul className="findedList">
                        <li><div>이메일</div><div>가입일</div></li>
                    {
                        this.state.findedUsers.map((item, index) =>
                            <li key={index}><div>{item.email}</div><div>{ moment(item.registerdate).format('YYYY.MM.DD')}</div></li>
                        )
                    }
                    </ul>
                    <a href="#signin" style={{color:'#FFF'}}><button type="button" className="wrap_finduser_btn" >로그인</button></a>
                </div>
            </div>
            </div>
        );
    }
}
export default Finduser;
