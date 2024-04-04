import React, { Component } from 'react';
// import '../../scss/autoform/autoformguide.scss';




class AutoformGuide extends Component {

    render() {
        return (
            <div className="wrap_autoform_guide">
                <div className="autoform_guide">
                    <div className="autoform_guide_box">
                        <div className="autoform_guide_title">
                            <div className="autoform_guide_title_image">
                                <img src="/autoform_img/guide_img.png" width="24" height="24" alt="guide_img" />
                            </div>
                            <div className="autoform_guide_title_text">
                                <span >법률문서 자동작성 이용 가이드</span>
                            </div>
                        </div>
                        <div className="autoform_guide_content">
                            <li>화면 좌측 가이드에 따라 필요한 정보를 입력하면 오른쪽 미리보기 화면에서 작성 내용을 미리 볼 수 있습니다.</li>
                            <li>최종 문서의 출력 및 다운로드는 '저장하기' 이후 가능합니다.</li>
                            <li>저장된 문서는 '마이페이지 > 내 문서 보관함' 에서 확인 가능합니다. </li>
                            <li>작성하신 문서는 오타수정요청(내 문서 보관함 > 오타수정요청 버튼)을 하시면, 최종적으로 검수 및 수정하여 다시 발송해드립니다.</li>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default AutoformGuide;