import React, { Component } from 'react'
import Link from 'next/link'
import ReactGA from 'react-ga'

// import '../../scss/page/doc/sidebar.scss'
// import '../../scss/style.scss'

import API from '../../utils/apiutil'
import helper_date from '../../helper/helper_date'
import helper_url from '../../helper/helper_url'
import moment from 'moment'
import User from '../../utils/user'

class SidebarLawyerRequestComplete extends Component {
    constructor (props) {
        super(props)

        let that = this
        let state = {
            ui: {
                lawyer_card: 'lawyer-card',
                show_btn: true,
                showaccept: false,
                preview: false,
                disabled_retouch_btn: false
            },
            data: {
                writing_peer_review_idx: -1,
                document: {},
                review_content: '',
                review_score: 5,
                request_retouch_text: null,
                userInfo: User.getInfo()
            },
            style: {
                top: '0px',
            },
            msg: {
                accepted: '요청 수락이 완료 되었습니다.\n나의 사건 관리 페이지로 이동됩니다.',
                confirm_accept: '요청을 수락 하시겠습니까?',
                document_preoccupied: '이미 다른 분께서 먼저 신청하였습니다.',
                error_save: '저장 중에 문제가 발생하였습니다. 잠시 후 다시 시도해주세요.',
                check_cancel: '서비스 신청을 취소 하시겠습니까?',
                cancel_complete: '서비스 신청 취소 완료 되었습니다.',
                cancel_error: '취소 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.',
                check_request: '재요청 하시겠습니까?',
                check_review: '작성하신 평가 내용을 등록하시겠습니까?',
                request_complete: '재요청 완료 되었습니다.',
                request_error: '재요청 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.',
                review_placeholder: '서비스 이용 후기를 남겨주세요.\n 변호사 평가를 완료하시면 인쇄하기 및 다운로드가 가능합니다.',
                review_create_complete: '평가 등록이 완료되었습니다.',
                review_create_error: '평가 등록이 실패하였습니다. 잠시 후 다시 시도해주세요.',
                review_content_error: '이용 후기를 작성하여 주세요.',
                check_renew: '현재 진행중인 직인 서비스가 자동으로 취소 되며 새로운 변호사님으로 매칭을 새로 시작합니다.\n\n진행 하시겠습니까?',
            }
        }

        if ('showbtn' in props) state.ui.show_btn = props['showbtn']
        if ('showaccept' in props) state.ui.showaccept = props['showaccept']
        if ('preview' in props) state.ui.preview = props['preview']

        if ('writing_peer_review_idx' in props) state.data.writing_peer_review_idx = props['writing_peer_review_idx']

        this.state = state
        if (state.data.writing_peer_review_idx !== -1) {
            API.sendPost(helper_url.api.writing_peer.get, { 'peer_idx': state.data.writing_peer_review_idx }).then((result) => {
                if (result.status === 'ok') {
                    state.ui.status = 'complete'
                    state.data.document = result.data.data
                } else {
                    state.ui.status = 'error'
                    alert(state.msg.request_error)
                }
                that.setState(state)
            })
        }
    }

    /* *****************************************************************************
    *  handleClicks
    * *****************************************************************************/

    handleClickCancel = () => {

        if (!window.confirm(this.state.msg.check_cancel)) {
            return
        }

        // parent
        let that = this

        // create payload
        let payload = {
            writing_peer_review_idx: that.state.data.writing_peer_review_idx,
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.cancel, payload).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.cancel_complete)
                window.location = helper_url.service.member.mydocument_list
                return
            }
            alert(that.state.msg.cancel_error)
        })
    }

    handleClickRenew = () => {

        if (!window.confirm(this.state.msg.check_renew)) {
            return
        }

        // parent
        let that = this
        let today = new Date()

        // create payload
        let payload = {
            idx: that.state.data.writing_peer_review_idx,
            request_date_time: today,
            apply_end_date_time: helper_date.add_date(today, 'd', 14),
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.renew, payload).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.renew_complete)
                window.location = helper_url.service.member.document_list
                return
            }
            alert(that.state.msg.renew_error)
        })
    }

    handleLawyerCard = evt => {
        let state = this.state

        if (state.ui.lawyer_card === 'lawyer-card') {
            state.ui.lawyer_card = 'lawyer-card lawyer-card-show'
            state.style.top = evt.clientY - 20
        } else {
            state.ui.lawyer_card = 'lawyer-card'
        }

        this.setState(state)
    }

    handleReviewChange = evt => {
        let state = this.state
        state.data.review_content = evt.target.value
        this.setState(state)
    }

    handleScoreChange = evt => {
        let state = this.state
        state.data.review_score = evt.target.value

        this.setState(state)
    }

    handleWriteReview = () => {
        if (this.state.data.review_content.trim() === '') {
            alert(this.state.msg.review_content_error)
            return
        }

        if (!window.confirm(this.state.msg.check_review)) {
            return
        }

        let payload = {
            peer_idx: this.state.data.writing_peer_review_idx,
            content: this.state.data.review_content,
            score: parseInt(this.state.data.review_score) * 20
        }

        // set payload to server
        API.sendPost(helper_url.api.review.create_review, payload).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(this.state.msg.review_create_complete)
                window.location.reload(true)
                return
            }
            alert(this.state.msg.review_create_error)
        })
    }

    handleChangeRetouch = evt => {

        let state = this.state
        let maxLength = 300
        let curTextLength = evt.target.value.length
        state.data.request_retouch_text = evt.target.value

        if (curTextLength > maxLength) {
            state.data.request_retouch_text = evt.target.value.substr(0, maxLength)
        }

        this.setState(state)
    }

    handleClickRetouch = (e) => {

        if (!this.state.data.request_retouch_text || this.state.data.request_retouch_text.trim() === '') {
            alert('수정요청하실 내용을 입력해 주세요.')
            return
        }

        let deadline = helper_date.get_date_added(2, '12:00:00')
        let deadlineText = moment(deadline).format('Y.MM.DD H:mm')

        if (!window.confirm(`수정요청을 하시겠습니까? 마감기한은 ${deadlineText} 까지 입니다.`)) {
            return
        }

        let payload = {
            peer_idx: this.state.data.writing_peer_review_idx,
            request_retouch_text: this.state.data.request_retouch_text,
            retouch_deadline: deadline
        }

        API.sendPost(helper_url.api.writing_peer.retouch, payload).then((result) => {
            console.log('result', result)
            if ('status' in result && result.status === 'ok') {
                alert('수정요청이 완료되었습니다.')
                window.location.reload()
                return
            }

            alert('수정요청중에 오류가 있습니다.\n잠시후에 다시 시도해 주세요.')
        })
    }

    handleAccept = () => {

        let that = this
        let { data, msg } = this.state
        let document = data.document
        let alertMsg = '수락 가능한 요청이 아닙니다.'
        const msgPrefix = (document.service_type === 'R') ? '검토 ' : '직인 '

        if (document.processing_status !== 1 || !!document.lawyer_idx) {
            alert(alertMsg)
            return
        }

        if (false === helper_date.date_available_from_today(document.apply_end_date_time)) {
            alert(alertMsg)
            return
        }

        // check
        if (!window.confirm(msgPrefix + msg.confirm_accept)) {
            return
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.accept, { idx: document.writing_peer_review_idx }).then((result) => {
            let status = result.data.result
            if (status === '409') {
                alert(msg.document_preoccupied)
                window.location = helper_url.service.lawyer.contract_request
                return
            }

            if (status === 'ok') {
                alert(msg.accepted)
                window.location = helper_url.service.lawyer.contract_review
                return
            }

            alert(that.state.msg.error_save)
        })
    }

    nl2br = (text) => {
        try {
            return text.split('\n').map((item, key) => {
                return <span key={key}>{item}<br/></span>
            })
        } catch (e) {
            return text
        }
    }

    /* *****************************************************************************
     *  render
     * *****************************************************************************/

    render () {

        //console.log(this.state.data.document)

        const userInfo = this.state.data.userInfo
        const deadline = (userInfo.account_type === 'A') ? (
            (this.state.data.document.period === 2) ? '매칭일로 부터 2일 후 09:00까지 (영업일 기준)' : '매칭일로 부터 1일 후 09:00까지 (영업일 기준)'
        ) : (
            (this.state.data.document.period === 2) ? '매칭일로 부터 2일 후 12:00까지 (영업일 기준)' : '매칭일로 부터 1일 후 13:00까지 (영업일 기준)'
        )

        //console.log(this.state.data.document)

        let available_apply_end_time = helper_date.date_available_from_today(this.state.data.document.apply_end_date_time)
        let available_retouch_request, available_retouch_request_time
        if (!!this.state.data.document.review_complete_date
            && !this.state.data.document.retouch_request_timestamp
            && !!moment(this.state.data.document.review_complete_date).isValid())
        {
            available_retouch_request_time = moment(this.state.data.document.review_complete_date).add(1, 'days').format('Y-MM-DD 12:00')
            available_retouch_request = helper_date.date_available_from_today(available_retouch_request_time)
        }

        return (
            <div>
                <div className="sidebar">

                    {(this.state.data.document.lawyer != null) &&
                    <div className={this.state.ui.lawyer_card} style={{ top: this.state.style.top }}>
                        <div className="basic-info">
                            <div className="profile-image">
                                <div className="img-wrapper">
                                    <img alt={'lawyer-profile'}
                                        src={this.state.data.document.profile_img === '' || typeof this.state.data.document.profile_img == 'undefined' ? helper_url.service.assets.profile + 'noprofile.png' : helper_url.service.assets.profile + this.state.data.document.profile_img}/>
                                </div>
                            </div>
                            <div className="name">
                                <div className="person">{this.state.data.document.lawyer} 변호사</div>
                                <div className="office">{this.state.data.document.office_name}</div>
                            </div>
                        </div>
                        <ul>
                            {this.state.data.document.work_field.split('.').map((item, i) => (
                                <li key={i}><span>분야</span> {item}</li>
                            ))}
                        </ul>
                    </div>
                    }

                    <div className="sidebar-container">
                        <div className="bullet-title">
                            <span>&#9654;</span> 요청내용
                        </div>

                        {(userInfo.account_type !== 'A') ? (
                            <div className="dashbox">
                                <div className="title">꼭 읽어주세요!</div>
                                {this.state.data.document.lawyer === null ? (
                                    <ul>
                                        <li>오후 12시 이전 신청 건은 당일, 18시까지 이후 신청 건은 다음날 18시까지 매칭 됩니다.</li>
                                        <li>평균 매칭 소요시간은 업무시간 기준으로 6시간 이내입니다.</li>
                                        <li>매칭이 되지 않은 경우, 재신청 또는 취소하실 수 있습니다.</li>
                                        <li>매칭 진행 중에는 해당 문서를 수정하실 수 없습니다.</li>
                                    </ul>
                                ) : (
                                    <ul>
                                        <li>변호사의 수정본은 인쇄 또는 다운로드 하셔서 사용하실 수 있습니다.</li>
                                        <li>검토가 완료 된 후 변호사님에게 수정요청을 1회 하실 수 있습니다.</li>
                                        <li>수정 요청은 마감기한 다음날 09:00까지 가능합니다.</li>
                                        <li>수정요청 신청 후 서비스가 완료 될 때까지 해당문서의 작성 및 수정을 하실 수 없습니다.</li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="dashbox">
                                <div className="title">꼭 읽어주세요!</div>
                                <ul>
                                    <li>요청원본의 내용과 마감기한을 꼭 확인하시고 요청 수락을 눌러 주세요.</li>
                                    <li>한번 수락한 요청은 취소가 불가능합니다.</li>
                                    <li>요청 수락을 하시면 해당 문서 검토를 진행할 수 있습니다.<br/>
                                        (우측 상단 이름 > 나의 사건 관리)
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="graybox">

                            {(!this.state.ui.preview) ? (
                                <div className="infotext">
                                    <span>담당 변호사 : </span>
                                    {(this.state.data.document.lawyer !== null && this.state.data.document.processing_status > 1)
                                        ? <span>
                                                {this.state.data.document.lawyer} 변호사
                                                <span
                                                    className="lawyer-link"
                                                    onMouseOver={this.handleLawyerCard}
                                                    onMouseOut={this.handleLawyerCard}>
                                                    프로필 보기
                                                </span>
                                            </span>
                                        : '매칭 중 (담당할 변호사를 찾고 있는 중입니다)'}
                                </div>
                            ) : (
                                <div/>
                            )}

                            {(this.state.data.document.processing_status === 1) &&
                            <div className="infotext">
                                <span>마감 기한 : </span>
                                {deadline}
                            </div>
                            }

                            {(this.state.data.document.processing_status === 2) &&
                            <div className="infotext process">
                                <span>마감 기한 : </span>
                                <span className="text-red">
                                {(!!this.state.data.document.review_deadline) &&
                                    moment(this.state.data.document.review_deadline).format('Y.MM.DD 12:00')
                                }
                                </span>
                            </div>
                            }

                            {(this.state.data.document.processing_status === 3 && !!this.state.data.document.file_name) &&
                            <div className="infotext process">
                                <span>완료 일자 : </span>
                                <span className="text-red">
                                {
                                    moment(this.state.data.document.review_complete_date).format('Y.MM.DD HH:mm')
                                    // (this.state.data.document.retouch_deadline)
                                    //     ? (moment(this.state.data.document.retouch_deadline).format('Y.MM.DD H:mm')) : (
                                    //         (this.state.data.document.review_deadline) ? (moment(this.state.data.document.review_deadline).format('Y.MM.DD H:mm')) : null
                                    // )
                                }
                                </span>
                            </div>
                            }

                            {(!this.state.ui.preview && this.state.data.document.processing_status !== 3) &&
                            <div className="infotext">
                                <span>상태 : </span>
                                {(this.state.data.document.processing_status === 1) ? ' 요청' : ' 진행'}
                            </div>
                            }

                            {(!this.state.ui.preview && this.state.data.document.processing_status === 3) &&
                            <div className="infotext">
                                <span>상태 : </span>
                                {(!!this.state.data.document.file_name) ? ' 완료' : ' 진행 (관리자 검수중)'}
                            </div>
                            }

                            {this.state.data.document.request_type === 1 &&
                                <div>
                                    <div className="infotext">
                                        <span>요청 내용 : </span>
                                    </div>
                                    <div className="infocontent">
                                        {this.nl2br(this.state.data.document.question)}
                                    </div>
                                </div>
                            }

                            {this.state.data.document.request_type === 2 &&
                                <div>
                                    <div className="infotext">
                                        <span>1. 계약서의 특정부분 수정 요청 : </span>
                                    </div>
                                    <div className="infocontent">
                                        {this.nl2br(this.state.data.document.question)}
                                    </div>
                                    <div className="infotext">
                                        <span>2. 계약내용 전반적인 검토 요청 : </span>
                                    </div>
                                    <div className="infocontent">
                                        {this.nl2br(this.state.data.document.question_2)}
                                    </div>
                                    <div className="infotext">
                                        <span>3. 계약 경위 등 회원님의 상황 입력 : </span>
                                    </div>
                                    <div className="infocontent">
                                        {this.nl2br(this.state.data.document.question_3)}
                                    </div>
                                </div>
                            }

                        </div>

                        {(this.state.data.document.processing_status === 1 && !!this.state.ui.showaccept) &&
                        <div style={{textAlign:'center'}}>
                            <div className="btn btn-default" onClick={this.handleAccept}>요청수락</div>
                        </div>
                        }

                        {(this.state.data.document.processing_status === 3 && !!this.state.data.document.file_name && !!available_retouch_request) &&
                        <div>
                            <div className="bullet-title"><span>▶</span> 수정요청 ({available_retouch_request_time} 까지) </div>
                            <div className="graybox" style={{marginTop: 5}}>
                                <div className="infotext">요청내용</div>
                                <div className="question-answer">
                                    <textarea placeholder={this.state.msg.question_1_placeholder} onChange={this.handleChangeRetouch}/>
                                </div>
                                <div style={{textAlign:'center'}}>
                                    <div className="btn btn-default" onClick={this.handleClickRetouch}>수정요청</div>
                                </div>
                            </div>
                        </div>
                        }

                        {(!!this.state.data.document.retouch_request_timestamp) && <div>
                            <div className="bullet-title"><span>▶</span> 수정요청 </div>
                            <div className="graybox" style={{marginTop: 5}}>
                                <div className="infotext">
                                    <span>마감 기한 : </span>
                                    {moment(this.state.data.document.retouch_deadline).format('Y.MM.DD H:mm')}
                                </div>
                                <div className="infotext">
                                    <span>상태 : </span>
                                    {
                                        (this.state.data.document.processing_status === 1) ? ' 요청'
                                            : (this.state.data.document.processing_status === 2) ? ' 진행' : ' 완료'
                                    }
                                </div>
                                <div className="infotext">요청내용 :</div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.retouch_request_text)}
                                </div>
                            </div>
                        </div>
                        }



                        {(this.state.data.document.processing_status === 1 && this.state.ui.show_btn === true) &&
                            <div style={{textAlign: 'center'}}>
                                {
                                    (!available_apply_end_time)
                                            ? (<div className="btn btn-default" onClick={this.handleClickRenew}>새로신청</div>)
                                            : (<div className="btn btn-default" onClick={this.handleClickCancel}>요청취소</div>)
                                }
                            </div>
                        }

                        {this.state.data.document.processing_status === 3 && this.state.data.document.review_idx == null && false /*아미쿠스 측에서 히든 처리 요청*/ ?
                            <div>
                                <div className="bullet-title">
                                    <span>&#9654;</span> 변호사 평가
                                </div>

                                <div className="graybox no-margin">
                                    <div className="infotext">
                                        <span>별점 선택</span>
                                    </div>
                                    <div className="star-select">
                                        <select className="select-type" defaultValue={this.state.data.review_score} onChange={this.handleScoreChange}>
                                            <option value="5"> ★ ★ ★ ★ ★</option>
                                            <option value="4"> ★ ★ ★ ★ ☆</option>
                                            <option value="3"> ★ ★ ★ ☆ ☆</option>
                                            <option value="2"> ★ ★ ☆ ☆ ☆</option>
                                            <option value="1"> ★ ☆ ☆ ☆ ☆</option>
                                            <option value="0"> ☆ ☆ ☆ ☆ ☆</option>
                                        </select>
                                    </div>

                                    <br/><br/>

                                    <div className="infotext">
                                        <span>서비스 이용 후기</span>
                                    </div>
                                    <textarea maxLength={300} placeholder={this.state.msg.review_placeholder} onChange={this.handleReviewChange} value={this.state.data.review_content}/>
                                </div>
                                <br/><br/>
                                <center>
                                    <div className="btn btn-default" onClick={this.handleWriteReview}>평가 등록</div>
                                </center>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SidebarLawyerRequestComplete
