import React, { Component } from 'react';
import ReactDOM from "react-dom";
// import '../../scss/mypage/questionmodal.scss';
import Api from '../../utils/apiutil';

class Questionmodal extends Component {

    constructor(props) {
        super(props);
        this.state = {
          question: ""
        };
    
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
    }

    

    onHandleChange(e) {
    this.setState({
        question: e.target.value
    });
    }

    onHandleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        var params = {
            question : data.get('question')
        }
        
        Api.sendPost('/user/writeqna', params).then((result) => {
            
            if( result.status === 'ok' ) {
                this.setState({
                    question: ""
                }, () => {
                    alert('회원님 감사합니다.\n문의가 등록 되었습니다.\n답변은 문의 등록 후 24시간 이내 회신을 원칙으로 하고 있습니다.\n답변 등록시 문자로 안내 드립니다.');
                    window.location.href = "javascript:history.go(-1);";
                });
            }
        });
    }


    render() {
        return (
            <div className="wrap_qna">
                <div className="header">
                    <span>1:1 이용문의</span>
                    <div className="btn_close">
                        <a href="javascript:history.back();"><img src="/mypage_img/btn_close.png" width="16" height="16" alt="x_btn"></img></a>
                    </div>
                </div>
                <form onSubmit={this.onHandleSubmit} >
                <div className="inputs">
                    <div className="input_id">
                        <textarea name="question" 
                        placeholder="사용하시면서 불편하신 점이 있다면 편하게 말씀해 주세요. 
회원님이 문의하신 내역은 마이페이지에서 확인하실 수 있습니다."
                        ref="question"
                        onChange={this.onHandleChange}
                        value={this.state.question}/>
                    </div>
                    <div style={{marginTop:15}}>
                        <button type="submit" className="btn_submit" >1:1 문의 전송하기</button>
                    </div>
                </div>
                </form>
            </div>
        );
    }
}
export default Questionmodal;
