import React, { Component } from 'react';
import ReactDOM from "react-dom";
// import '../../scss/correction/correction.scss';
// import '../../scss/style.scss';

class Requestside extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div>
                <div className="request-side">
                    <div className="side-title">변호사 직인 서비스란?</div>
                    <div className="side-content">
                        문서 검토 후 수정
                        변호사 명의 추가
                    </div>
                    <div className="side-title">서비스 신청</div>
                    <div className="side-content">
                        변호사가 해당 내용을 읽고 문서 검토 시 참고 합니다.
                    </div>
                    <div className="side-title">로폼에 등록된 변호사</div>
                    <div className="side-content">
                        <textarea placeholder="300 자 이내로 작성해주세요. 예시 ) 예시문구 삽입삽입삽입"></textarea>
                    </div>
                </div>
            </div>
        );
    }
}

export default Requestside;
