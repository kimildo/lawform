import React, { Component } from 'react'
import Link from 'next/link'

import API from 'utils/apiutil'
import helper_url from 'helper/helper_url'
import helper_document from 'helper/helper_document'
import moment from 'moment'
import helper_date from 'helper/helper_date'
import { isIE } from 'react-device-detect'

class PageView extends Component {

    constructor (props) {
        super(props)
        const { innerWidth: width, innerHeight: height } = window
        let that = this // create pointer
        let state = {
            ui: {
                isBlocking: false,
                showtabs: false,
                tabactive: 0,
                tabhide: 0,
                type: 0,
                showpricing: false,
                showdirection: false,
                showstamp: false,
                stamptype: 0,
                addpadding: false,
                showaccept: false,
                showprocess: false,
                mode: null,
                viewerheight: 'height - 123',
                delegate: null,
                preview: false,
                showballoon: false
            },
            data: {
                idx: -1,
                writing_peer_review_idx: -1,
                document: null,
                processing_status: 0,
                apply_end_date_time: null,
                review_deadline: null,
                status: 1,
                html: {
                    original: '',
                    lawyer: ''
                }
            },
            msg: {
                loading_error: '문서를 읽어오지 못헀습니다',
                accepted: '요청 수락이 완료 되었습니다.\n나의 사건 관리 페이지로 이동됩니다.',
                document_complete_check: '최종 검토 완료 하시겠습니까?',
                document_complete: '검토를 완료하여, 회원에게 전달하였습니다.',
                save_warn: '문서를 저장하시겠습니까?',
                save_complete: '저장 완료 되었습니다',
                error_save: '저장 중에 문제가 발생하였습니다.',
                document_preoccupied: '이미 다른 분께서 먼저 신청하였습니다.',
                confirm_accept: '요청을 수락하시겠습니까?',
                check_cancel: '현재 진행중인 서비스가 자동으로 취소되며 환불 처리 됩니다.\n서비스 신청을 취소 하시겠습니까?',
                cancel_complete: '정상적으로 접수되었습니다.\n' +
                    '환불 처리의 경우 최대 7일까지 소요 되며, 평균 2~3일 내로 \n' +
                    '결제취소 / 입금 처리 됩니다.\n' +
                    '문의 사항 있으신 경우 고객센터로 연락 부탁드립니다.',
                cancel_error: '취소 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.',
                check_renew: '현재 진행중인 직인 서비스가 자동으로 취소 되며 새로운 변호사님으로 매칭을 새로 시작합니다.\n\n진행 하시겠습니까?',
                renew_complete: '정상적으로 접수되었습니다.',
                renew_error: '문제가 생겼습니다. 잠시 후 다시 시도 해주세요',
                renewed: '이미 연장되었습니다',
            }
        }

        // get ui config params
        for (let key in props) if (key in state.ui) state.ui[key] = props[key]

        // get data config params
        for (let key in props) if (key in state.data) state.data[key] = props[key]

        // save state
        this.state = state
        let today = new Date()

        // get html for vewier
        if (this.state.data.idx !== -1) {

            API.sendPost(helper_url.api.writing.get_document_elemement_list, { 'idx': this.state.data.idx }).then((result) => {
                if ('status' in result && result.status === 'ok' && result.data.length) {

                    let document = result.data[0]
                    // @todo parser ie 수정해야함
                    let page_html = helper_document.get_html(document.template_data, JSON.parse(document.binddata))

                    state.data.document = document
                    state.data.html.original = page_html
                    state.data.html.lawyer = page_html
                    that.setState(state)

                    if (state.data.writing_peer_review_idx !== -1) {
                        API.sendPost(helper_url.api.writing_peer.lawyer_content, { idx: this.state.data.writing_peer_review_idx }).then((result) => {

                            if ('status' in result && result.status === 'ok') {
                                if (result.data.data !== '') {
                                    if (!result.data.data.status) {
                                        return
                                    }

                                    state.data.processing_status = result.data.data['processing_status']
                                    if (state.ui.mode === 'revision' && !state.ui.tabactive) {
                                        state.ui.tabactive = ((result.data.data['processing_status'] === 1 && !!helper_date.date_available_from_today(result.data.data.apply_end_date_time))) ? 1 : 2
                                    }

                                    if (!!result.data.data['lawyer_edit_content'] && result.data.data['lawyer_edit_content'] !== '') {
                                        state.data.html.lawyer = result.data.data['lawyer_edit_content']
                                        state.ui.showballoon = false
                                    } else {
                                        state.ui.showballoon = true
                                    }

                                    if (state.data.processing_status === 3 && result.data.data.service_type === 'S') {
                                        state.data.html.lawyer += `<div class="layer-seal-wrapper"><div class="layer-seal"><span>변호사${result.data.data.lawyer_name}</span></div></div>`
                                    }

                                    if (!!result.data.data['original_bind_data'] && result.data.data['original_bind_data'] !== '') {
                                        state.data.html.original = helper_document.get_html(document.template_data, JSON.parse(result.data.data['original_bind_data']))
                                    }

                                    state.data.apply_end_date_time = result.data.data.apply_end_date_time
                                    state.data.review_deadline = result.data.data.review_deadline
                                    state.data.retouch_deadline = result.data.data.retouch_deadline
                                    state.data.review_complete_date = result.data.data.review_complete_date
                                    state.data.lawyer_idx = result.data.data.lawyer_idx
                                    state.data.lawyer_name = result.data.data.lawyer_name
                                    state.data.service_type = result.data.data.service_type
                                    state.data.file_name = result.data.data.file_name
                                    state.data.status = result.data.data.status

                                    if (state.ui.mode === 'edit' && state.data.processing_status === 2) {
                                        this.addListener()
                                    }

                                    that.setState(state)
                                }
                            }
                        })
                    }
                    return
                }

                alert(that.state.msg.loading_error)
                window.history.back()
            })
        }

        if (this.state.ui.delegate != null) {
            this.state.ui.delegate.addCallback('save', this.handleSave)
            this.state.ui.delegate.addCallback('complete', this.handleComplete)
            this.state.ui.delegate.addCallback('accept', this.handleAccept)
            this.state.ui.delegate.addCallback('writedoc', this.handleWriteDoc)
            this.state.ui.delegate.addCallback('tempSave', this.handleTempSave)
        }

    }

    handleLaywerChange = (new_content) => {
        let state = this.state
        state.data.html.lawyer = new_content
        this.setState(state)
    }

    handleWriteDoc = () => {
        window.location = helper_url.service.autoform + this.state.data.idx
    }

    handleSave = () => {
        // parent
        let that = this
        // set payload to server
        API.sendPost(helper_url.api.writing_peer.save, { idx: this.state.data.writing_peer_review_idx, 'content': this.state.data.html.lawyer }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.save_complete)
                window.location = helper_url.service.lawyer.contract_review
                return
            }
            alert(that.state.msg.error_save)
        })
    }

    /**
     * 검토완료
     * @param evt
     */
    handleComplete = () => {

        if (this.state.data.processing_status !== 2) {
            return
        }

        if (!window.confirm(this.state.msg.document_complete_check)) {
            return
        }

        // parent
        let that = this
        // set payload to server
        API.sendPost(helper_url.api.writing_peer.complete, { idx: this.state.data.writing_peer_review_idx, content: this.state.data.html.lawyer }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                //API.sendPost(helper_url.api.user.update_new_completed, { 'new_completed': 2, 'idusers': this.state.data.document.idusers })
                alert(that.state.msg.document_complete)
                window.location = helper_url.service.lawyer.contract_review + '#2'
                return
            }

            alert(that.state.msg.error_save)
        })
    }

    /**
     * 임시저장
     */
    handleTempSave = () => {

        let that = this

        if (this.state.data.processing_status !== 2) {
            return
        }

        if (!window.confirm(this.state.msg.save_warn)) {
            return
        }

        let payload = {
            idx: this.state.data.writing_peer_review_idx,
            content: this.state.data.html.lawyer
        }

        API.sendPost(helper_url.api.writing_peer.tempsave, payload).then((result) => {
            alert(that.state.msg.save_complete)
        }).catch((err) => {
            console.log(err.message)
            alert(that.state.msg.error_save)
        })

    }

    handleTabs = (num) => {
        let state = this.state
        state.ui.tabactive = num
        this.setState(state)
        window.location.hash = '#' + num
    }

    handleAccept = () => {

        let { data, msg } = this.state
        let alertMsg = '수락 가능한 요청이 아닙니다.'
        let today = new Date()
        const msgPrefix = (data.service_type === 'R') ? '검토 ' : '직인 '

        if (data.processing_status !== 1 || !!data.lawyer_idx) {
            alert(alertMsg)
            return
        }

        if (false === helper_date.date_available_from_today(data.apply_end_date_time)) {
            alert(alertMsg)
            return
        }

        if (!window.confirm(msgPrefix + msg.confirm_accept)) {
            return
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.accept, { idx: data.writing_peer_review_idx }).then((result) => {
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

    handleExtendPeriod = () => {

        // parent
        let that = this

        // create payload
        let payload = {
            idx: that.state.data.writing_peer_review_idx
        }

        let confirm_msg = that.state.msg.check_renew
        if (!window.confirm(confirm_msg)) {
            return
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.renew, payload).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.renew_complete)
                window.location = helper_url.service.doc.revision + that.state.data.idx + '/' + result.data.data + '/#2'
                return
            }

            alert(that.state.msg.renew_error)
        })

    }

    handlePayCancel = () => {

        // parent
        let that = this
        let confirm_msg = that.state.msg.check_cancel
        if (!window.confirm(confirm_msg)) {
            return
        }

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.cancel, {
            writing_peer_review_idx: that.state.data.writing_peer_review_idx,
        }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.cancel_complete)
                window.location = helper_url.service.member.mydocument_list
                return
            }
            alert(that.state.msg.cancel_error)
        })
    }

    hideBalloon = () => {
        let state = this.state
        state.ui.showballoon = false
        this.setState(state)
    }

    beforeunload = e => { // the method that will be used for both add and remove event
        e.preventDefault()
        e.returnValue = true
    }

    addListener = () => {
        //window.addEventListener('beforeunload', this.beforeunload.bind(this))
    }

    componentDidMount () {

    }

    componentWillUnmount () {
        //window.removeEventListener('beforeunload', this.beforeunload.bind(this))
    }

    render () {

        let { isBlocking, ui, data } = this.state

        const rematch = <div>
            <div>
                <span>
                    진행중인 요청이 취소 되었습니다.<br/>
                    서비스 이용에 불편을 드려 죄송합니다.<br/>
                    다른 변호사님과의 매칭을 원하실 경우 새로신청 버튼을 눌러주세요.
                </span>
            </div>
            <div className="processing-status-buttons">
                <button className={'btn btn-white-blue'} onClick={this.handleExtendPeriod}>새로신청</button>
                <button className={'btn btn-white-blue'} onClick={this.handlePayCancel}>요청취소</button>
            </div>
        </div>

        const expired = <div>
            <div>
                <span>
                    서비스검토가 기간내에 완료되지 않았습니다.<br/>
                    서비스 이용에 불편을 드려 죄송합니다.<br/>
                    다른 변호사님과의 매칭을 원하실 경우 새로신청 버튼을 눌러주세요.
                </span>
            </div>
            <div className="processing-status-buttons">
                <button className={'btn btn-white-blue'} onClick={this.handleExtendPeriod}>새로신청</button>
                <button className={'btn btn-white-blue'} onClick={this.handlePayCancel}>요청취소</button>
            </div>
        </div>

        //console.log(this.state.ui)

        return (
            <div className={`page-view ${(ui.addpadding === true) && 'right-margin-30 page-select'}`}>

                {(ui.showstamp === true) &&
                <div className={`original-stamp ${(ui.stamptype === 2) && 'edit-stamp'}`}>
                    {(ui.stamptype === 1) ? '원본' : (data.processing_status === 3) ? '검토완료' : '수정본'}
                    {(ui.stamptype === 2 && !!ui.showballoon && data.processing_status === 2) &&
                    // <img src="/lawyer_img/lawyer-edit-comment.png" alt={'balloon'} onClick={this.hideBalloon} className="comment-balloon -\32 126"/>
                    <div className={'comment-balloon'} onClick={this.hideBalloon}>
                        <span>검토하고자 하는 부분을</span>
                        <span>클릭하여 검토를 시작해주세요</span>
                    </div>
                    }
                </div>
                }

                <div className={`page ${(ui.preview === true) && 'lawyer-preview'}`}>
                    {
                        ui.mode === 'edit' ?
                            (
                                <div
                                    onBlur={(e) => {this.handleLaywerChange(e.currentTarget.innerHTML)}}
                                    contentEditable={(data.processing_status === 2)}
                                    suppressContentEditableWarning={true}
                                    className={`autoform_output_a4 ${(ui.stamptype === 2) ? 'lawyer-edit-contents' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: data.html.lawyer }}
                                    onChange={this.handleLaywerChange}>
                                </div>
                            ) :
                            (
                                // 현재 요청, 진행 중인 상태라면 진행 상황 책갈피만 보이고 뒤에 문서는 보이지 않도록 하기 위한 조건
                                <div className={`autoform_output_a4`}
                                     dangerouslySetInnerHTML={
                                         {
                                             __html: ui.tabactive === 1 ? data.html.original :
                                                 (ui.showprocess === true && (data.processing_status !== 3)
                                                     ? null : (!!ui.tabactive && !data.file_name) ? null : data.html.lawyer)
                                         }
                                     }>
                                </div>
                            )
                    }

                </div>

                {ui.showtabs === true &&
                <div className="tabs">

                    {ui.tabhide !== 1 &&
                    <div className={`tab ${ui.tabactive === 1 ? 'tab-active' : ''}`} onClick={(e) => { this.handleTabs(1) }}>
                        요청<br/>원본
                        <div className="pivot"></div>
                    </div>
                    }

                    {ui.tabhide !== 2 &&
                    <div className={`tab ${ui.tabactive === 2 ? 'tab-active' : ''}`} onClick={(e) => { this.handleTabs(2) }}>
                        변호사<br/>검토본<br/>
                        <div className="pivot"></div>
                    </div>
                    }
                </div>
                }

                {ui.showaccept === true ? (
                    <div className="accept-box">
                        <div className="accept-msg">
                            검토를 진행하시려면<br/>아래 요청 수락 버튼을 눌러 주세요.
                        </div>
                        <div className="row text-center">
                            <div className="btn btn-white" onClick={this.handleAccept}>요청 수락</div>
                        </div>
                    </div>
                ) : null}

                {(ui.showprocess === true && data.processing_status !== 3 && ui.tabactive !== 1) ? (
                    <div className="processing-status-msg">
                        {
                            (!!data.apply_end_date_time) && (
                                (false === helper_date.date_available_from_today(data.apply_end_date_time) && !data.lawyer_idx) ? (
                                    rematch
                                ) : (

                                    (data.processing_status === 1) ? (
                                        <span>
                                        담당 변호사를 찾고 있는 중입니다.
                                        <br/>
                                        담당 변호사 매칭 후 검토가 완료 되면 문서를 확인하실 수 있습니다.
                                        </span>
                                    ) : (data.processing_status === 2) ? (

                                        (false === helper_date.date_available_from_today(data.review_deadline) && !data.retouch_deadline) ? expired
                                            : (
                                                (!!data.retouch_deadline)
                                                    ? (
                                                        (false === helper_date.date_available_from_today(data.retouch_deadline)) ? expired : (
                                                            <span>
                                                            담당변호사가 수정사항 검토를 진행 중입니다.
                                                            <br/>
                                                            담당 변호사의 검토가 완료 되면 문서를 확인 하실 수 있습니다.
                                                          </span>
                                                        )
                                                    )
                                                    : (
                                                        <span>
                                                        담당변호사가 검토를 진행 중입니다.
                                                        <br/>
                                                        담당 변호사의 검토가 완료 되면 문서를 확인 하실 수 있습니다.
                                                        </span>
                                                    )
                                            )
                                    ) : null
                                )
                            )
                        }
                    </div>
                ) : null}

                {(ui.showprocess === true && ui.tabactive !== 1 && data.processing_status === 3 && data.file_name === null) &&
                <div className="processing-status-msg">
                     <span>
                        담당변호사가 검토를 진행 중입니다.
                        <br/>
                        담당 변호사의 검토가 완료 되면 문서를 확인 하실 수 있습니다.
                    </span>
                </div>
                }

                {(ui.showdirection === true) && <div className="progressbar">좌측 질문지에 답변을 입력하시면<br/>자동으로 문서가 완성됩니다.</div>}
                {(ui.showpricing === true) &&
                <div className="footnote">
                    <div className="name">내용증명 (매매대금 청구)</div>
                    <div className="price">40,000 원</div>
                    <div className="btn btn-white text-bold">결제하기</div>
                </div>
                }

                {/* {(ui.mode === 'edit' && data.processing_status === 2) &&
                <Prompt when={isBlocking}
                        message={location => `변경사항이 저장되지 않을 수 있습니다. 페이지를 벗어 나시겠습니까?`}
                />
                } */}

            </div>
        )
    }
}

export default PageView
