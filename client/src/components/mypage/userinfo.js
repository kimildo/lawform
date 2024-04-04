import React, { Component, Fragment } from 'react';
// import '../../scss/mypage/userinfo.scss';
import Changepw from './changepw';
import User from '../../utils/user';
import Api from '../../utils/apiutil';

class Userinfo extends Component {
    constructor() {
        super();
        this.state = {
            shown: false,
            userStatus : "N",
            userData : "",
            company_style : {display: 'none'},
            company_section : ''
        };
    }

    componentDidMount() {
        let userInfo = User.getInfo();
        if( !!userInfo ) { // Logged In
            Api.sendPost('/user/info').then(res => {
                let status = res.data.status;
                let userInfo = res.data.userData;
                if( status === "ok") {
                    userInfo.email1 = userInfo.email.split('@')[0];
                    userInfo.email2 = userInfo.email.split('@')[1];
                    // userInfo.idusers = userInfo.idusers;
                    this.setState({
                        userData: userInfo,
                        nameString : "담당자명*",
                        company_style : {display : 'block'}
                    })
                } else {
                    return false
                }
            })

            this.setState ({
                userStatus : "Y"
            })
        } else {
            alert("로그인 후 이용하세요.");
            window.location = "/";
        }
    }

    handleChange = (e) => {

        if( e.target.name === 'name' ) {
            if (e.target.value.length !== 0) {
                this.setState({
                    shown: false
                });
            }
            else if (e.target.value.length === 0) {
                this.setState({
                    shown: true
                });
            }
        }

        let data = this.state.userData;
        data[e.target.name] =  e.target.value

        this.setState({
            userData : data
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        var object = {};
        data.forEach(function(value, key){
            object[key] = value;
        });
        var params = object;
        Api.sendPost( '/user/update', params ).then((result)=>{
            if( result.status === 'ok' ){
                alert('회원정보가 변경되었습니다.')
            }
        })
    }

    render() {
        var hidden = {
            display: this.state.shown ? true : "none"
        }

        var border = {
            border: this.state.shown ? true : "solid 1px #878d91"
        }
        if( this.state.userStatus !== "Y" ) {
            return false;
        }

        return (
            <div className="wrap_userinfo">
                <form method="POST" onSubmit={this.handleSubmit} >
                <input type="hidden" name="type"  value={this.state.userData.type} ></input>
                {this.state.userData.type === 'C'?
                <Fragment>
                <div className="update_text">계정정보 수정</div>
                <div className="info_text">계정 정보</div>
                <div className="section">
                    <div className="table_section">
                        <div className="table_row section_02">
                            <div className="cell left">
                                <div className="user_input">아이디*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">{this.state.userData.login_id}</div>
                            </div>
                        </div>
                        <div className="table_row section_04">
                            <div className="cell left">
                                <div className="user_input">이메일*</div>
                            </div>
    
                            <div className="cell right">
                                <div className="input_area">
                                    {this.state.userData.email1}@{this.state.userData.email2}
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_03">
                            <div className="cell left">
                                <div className="user_input">담당자 명*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input style={border} className="box_textfield_name" name="name" onChange={this.handleChange.bind(this)} id="box_textfield" value={this.state.userData.name} required="required"></input>
                                    <br></br>
                                    <span style={hidden} className="warning" id="warning">(필수 입력 항목입니다. 회원님의 성함을 입력하세요.)</span>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_05">
                            <div className="cell left">
                                <div className="user_input">휴대전화번호*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input className="box_textfield" name="phonenumber" value={this.state.userData.phonenumber}  onChange={this.handleChange.bind(this)}  required="required" ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_07">
                            <div className="cell left">
                                <div className="user_input">비밀번호</div>
                            </div>
                            <div className="cell right">
                                <br></br>
                                <a href="#changepw" ><img src="mypage_img/password_btn.png" className="password_btn" width="150" height="40" alt="password_btn" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="info_text" style={this.state.company_style}>회사 정보</div>
                <div className="section" style={this.state.company_style}>
                    <div className="table_section">
                        <div className="table_row section_08">
                            <div className="cell left">
                                <div className="company_input">회사명*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input className="box_textfield" name="company_name" value={this.state.userData.company_name}  onChange={this.handleChange.bind(this)} required='required' ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_09">
                            <div className="cell left">
                                <div className="company_input" >대표자명*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input className="box_textfield" name="company_owner" value={this.state.userData.company_owner}  onChange={this.handleChange.bind(this)}  required="required" ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_12">
                            <div className="cell left">
                                <div className="company_input">사업자 등록번호</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input className="box_textfield" name="company_number" value={this.state.userData.company_number}  onChange={this.handleChange.bind(this)} ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Fragment>
                :
                <Fragment>
                <div className="update_text">내 정보 수정</div>
                {/* <div className="info_text">내 정보</div> */}
                <div className="section">
                    <div className="table_section">
                        <div className="table_row section_04">
                            <div className="cell left">
                                <div className="user_input">이메일*</div>
                            </div>

                            <div className="cell right">
                                <div className="input_area">
                                    {this.state.userData.email}
                                    {/* <input className="box_textfield" value={this.state.userData.email1} name="email1" onChange={this.handleChange.bind(this)}></input>
                                    <span className="padding">@</span>
                                    <input className="box_textfield" value={this.state.userData.email2} name="email2" onChange={this.handleChange.bind(this)}></input> */}
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_03">
                            <div className="cell left">
                                <div className="user_input">사용자명*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input style={border} className="box_textfield_name" name="name" onChange={this.handleChange.bind(this)} id="box_textfield" value={this.state.userData.name} ></input>
                                    <br></br>
                                    <span style={hidden} className="warning" id="warning">(필수 입력 항목입니다. 회원님의 성함을 입력하세요.)</span>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_05">
                            <div className="cell left">
                                <div className="user_input">휴대전화번호*</div>
                            </div>
                            <div className="cell right">
                                <div className="input_area">
                                    <input className="box_textfield" name="phonenumber" value={this.state.userData.phonenumber} onChange={this.handleChange.bind(this)}></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row section_07">
                            <div className="cell left">
                                <div className="user_input">비밀번호</div>
                            </div>
                            <div className="cell right">
                                <br></br>
                                <a href="#changepw" ><img src="mypage_img/password_btn.png" className="password_btn" width="150" height="40" alt="password_btn" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                </Fragment>
                }
                {/* {updateForm} */}
                <button className="submit_btn" type="submit" style={{cursor:'pointer'}}>내 정보 변경하기</button>
                </form>
                <div id="changepw" className="white_content">
                    <Changepw idusers={this.state.userData.idusers}></Changepw>
                </div>
            </div>

        );
    }
}

export default Userinfo;
