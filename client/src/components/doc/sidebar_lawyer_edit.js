import React, { Component } from 'react'
import Link from 'next/link'
import ReactGA from 'react-ga'
import API from '../../utils/apiutil'
import helper_date from '../../helper/helper_date'
import helper_url from '../../helper/helper_url'
import moment from 'moment'
import ServiceSample from '../lawyer/service_sample'


class SidebarLawyerEdit extends Component {
    constructor (props) {
        super(props)
        let that = this
        let state = {
            ui: {
                lawyermode: '',
                sliding: {
                    mode: '',    // true or ""
                    cls: 'sidebar',
                    msg: '',
                },
                service_modal: {
                    show: false
                }
            },
            data: {
                writing_peer_review_idx: -1,
                document: {},
            },
            msg: {
                request_error: '재요청 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요',
            }
        }

        if ('writing_peer_review_idx' in props)
            state.data.writing_peer_review_idx = props['writing_peer_review_idx']

        if ('slide_mode' in props) {
            state.ui.sliding.mode = props['slide_mode']
            state.ui.sliding.cls = 'sidebar sidebar-show'
            state.ui.sliding.msg = '접\n기'
        }
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

    handleToggle = () => {
        let state = this.state
        if (state.ui.sliding.cls === 'sidebar sidebar-show') {
            state.ui.sliding.cls = 'sidebar sidebar-hide-action'
            state.ui.sliding.msg = '펼\n치\n기'
        } else {
            state.ui.sliding.cls = 'sidebar sidebar-show'
            state.ui.sliding.msg = '접\n기'
        }
        this.setState(state)
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

    toggleModal = () => {
        let state = this.state
        state.ui.service_modal.show = (!state.ui.service_modal.show)
        console.log(state.ui.service_modal.show)
        this.setState(state)
    }

    /* *****************************************************************************
     *  render
     * *****************************************************************************/

    render () {
        const dateFormat = 'Y.MM.DD HH:mm'
        return (
            <div>
                <div className={this.state.ui.sliding.cls}>
                    <div className="sidebar-toggle" onClick={this.handleToggle}>
                        <div className="toggle-btn">{this.state.ui.sliding.msg}</div>
                    </div>

                    <div className="sidebar-container sidebar-container-colored">
                        <div className="bullet-title">
                            <span>&#9654;</span> 안내드립니다
                        </div>
                        <div className="dashbox">
                            <ul>
                                {/*<li>제공되는 샘플을 먼저 확인하시고 진행해주세요 <span onClick={this.toggleModal} style={{cursor:'pointer'}}>[샘플 보기]</span></li>*/}
                                <li>
                                    <span style={{color:'#ff2e16'}}><strong>수정하신 문서는 자동저장이 되지 않습니다.</strong></span><br/>
                                    저장하기 버튼을 눌러 작업 중인 내용을 저장해주세요.
                                </li>
                                <li>검토가 최종 완료된 경우 상단의 최종 검토 완료 버튼을 꼭 눌러 주세요.</li>
                                <li>원본은 수정이 불가능하며, 수정본을 클릭하시면 문서 수정이 가능합니다.</li>
                                <li>기타 문의 사항은 로폼 고객센터를 통해 문의해주세요.</li>
                            </ul>
                        </div>
                        <br/><br/><br/>
                        <div className="bullet-title">
                            <span>&#9654;</span> 요청 내용
                        </div>
                        <div className="whitebox">
                            <div className="infotext process">
                                <span>마감 기한 :</span> <span className={'text-red'}>{moment(this.state.data.document.review_deadline).format(dateFormat)}</span>
                            </div>
                            {(this.state.data.document.processing_status === 3 && !this.state.data.document.retouch_deadline) &&
                            <div className="infotext process">
                                <span>완료 일자 :</span> {moment(this.state.data.document.review_complete_date).format(dateFormat)}
                            </div>
                            }

                            {(this.state.data.document.request_type === 1) &&
                            <div>
                                <div className="infotext">
                                    <span>요청 내용 : </span>
                                </div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.question)}
                                </div>
                            </div>
                            }

                            {(this.state.data.document.request_type === 2) &&
                            <div>
                                <div className="infotext">
                                    <span>1. 계약서의 특정부분 수정 요청</span>
                                </div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.question)}
                                </div>
                                <div className="infotext">
                                    <span>2. 계약 내용 전반적인 검토 요청</span>
                                </div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.question_2)}
                                </div>
                                <div className="infotext">
                                    <span>3. 계약 경위 등 회원님의 상황 입력</span>
                                </div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.question_3)}
                                </div>
                            </div>
                            }

                        </div>

                        {(!!this.state.data.document.retouch_deadline) && <>
                            <div className="bullet-title">
                                <span>&#9654;</span> 수정 요청 내용
                            </div>
                            <div className="whitebox">
                                <div className="infotext">
                                    <span>마감 기한 :</span> {moment(this.state.data.document.retouch_deadline).format(dateFormat)}
                                </div>
                                {(this.state.data.document.processing_status === 3) &&
                                <div className="infotext">
                                    <span>완료 일자 :</span> {moment(this.state.data.document.review_complete_date).format(dateFormat)}
                                </div>
                                }
                                <div className="infotext">
                                    <span>요청 내용 : </span>
                                </div>
                                <div className="infocontent">
                                    {this.nl2br(this.state.data.document.retouch_request_text)}
                                </div>
                            </div>
                        </>}



                    </div>
                </div>


                <ServiceSample show={this.state.ui.service_modal.show} toggleModal={this.toggleModal}/>

            </div>
        )
    }
}

export default SidebarLawyerEdit
