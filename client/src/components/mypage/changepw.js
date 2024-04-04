import React, { Component } from 'react';
// import '../../scss/common/changepw.scss';
import Api from '../../utils/apiutil';

class Changepw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwFormatCheck:false
        }
    }

    checkPassword = ( e ) => {
        if( e.target.value.length < 8 ){
            console.log( 8 )
            this.setState({
                pwFormatCheck:false
            })
            return false;
        }
        var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/;
        if( !check.test( e.target.value ) ){
            console.log( "!test" );
            this.setState({
                pwFormatCheck:false
            })
        } else {
            this.setState({
                pwFormatCheck:true
            })

        }
    }

    handlePwSubmit = (event) => {
        event.preventDefault();

        /** ie-error */
        const data = new FormData(event.target);
        var current_password = data.get('current_password');
        var password = data.get('password');
        var password_re = data.get('password_re');


        if(  !this.state.pwFormatCheck ) {
            alert("새 비밀번호의 형식을 확인해주십시오.");
            return false;
        }

        if( password === null || password === '' || password !== password_re ) {
            alert("새 비밀번호를 확인해주십시오.");
            return false;
        }

        const params = {
            "current_password": current_password,
            "password": password,
            "password_re": password_re
        }

        Api.sendPost('/user/changepassword', params )
        .then(res => {
            let status = res.data.status;
            if( status === "ok") {
                console.log( status );
                alert("비밀번호가 변경되었습니다.");
                window.location.href = "javascript:history.go(-1);";
            } else {
                alert('기존 비밀번호가 일치하지 않습니다.')
            }
        })

    }

    render() {
        return (
            <div className="wrap_password">
                <div className="header">
                    <span>비밀번호 변경</span>
                    <div className="btn_close">
                        <a href="javascript:history.back();"><img src="/mypage_img/btn_close.png" width="16" height="16" alt="x_btn"></img></a>
                    </div>
                </div>
                <form onSubmit={this.handlePwSubmit} >
                    <div className="inputs">
                        <div className="input_id">
                            <label>현재 비밀번호 입력</label>
                            <input type="password" name="current_password" placeholder="현재 비밀번호를 다시 입력해 주세요" ref="current_password"></input>
                        </div>
                        <div className="input_pw" style={{marginBottom:0, height:105}}>
                            <label >새 비밀번호 입력</label>
                            <input type="password" name="password" placeholder="변경하실 비밀번호를 입력해주세요" ref="password" onChange={ (e)=>this.checkPassword(e) }></input>
                            <span className="alert" style={ {display:(this.state.pwFormatCheck)?'none':'inline'} }>영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</span>
                        </div>
                        <div className="input_re">
                            <label >새 비밀번호 입력</label>
                            <input type="password" name="password_re" placeholder="변경하실 비밀번호를 다시 입력해주세요" ref="password_re"></input>
                        </div>
                        <div style={{marginTop:115}} className='cp_buttons'>
                            <a href="javascript:history.back();"><img src="/mypage_img/btn_cancel.png" alt="취소" ></img></a>
                            <input className="submit" type="image" src="/mypage_img/btn_change_pw.png" width="182" height="48" alt="변경하기" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
export default Changepw;
