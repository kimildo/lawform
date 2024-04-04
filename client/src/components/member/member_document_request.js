import React, { Component } from 'react'
import Link from 'next/link'

import Header from '../../components/common/header'
import Footer from '../../components/common/footer'
import Common from '../../components/mypage/common'

// import '../../scss/component/layout.scss'
// import '../../scss/component/table.scss'
// import '../../scss/component/button.scss'
// import '../../scss/component/banner.scss'
// import '../../scss/component/input.scss'
// import '../../scss/component/align.scss'
// import '../../scss/component/text.scss'
// import '../../scss/component/navigation.scss'
// import '../../scss/component/tmp.scss'

// import '../../scss/page/member/document_request.scss'

import API from '../../utils/apiutil'
import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import helper_date from '../../helper/helper_date'
import helper_url from '../../helper/helper_url'
import helper_pagination from '../../helper/helper_pagination'
import helper_parse from '../../helper/helper_parse'
import moment from 'moment'

class MemberDocumentRequest extends Component {
    constructor (props) {
        super(props)
        let that = this
        let state = {
            'ui': {
                'per_page': 20, // for pagination
                'current_page': (typeof helper_parse.get_param('page') === 'undefined') ? 1 : helper_parse.get_param('page'), // for pagination
                'status': 'loading'
            },
            'data': {
                'document_list': [],
                'document_total': 0,
                'select_list': {}  /*
                                        체크 박스로 선택한 row를 위한 dictionary(편의상 list로 지칭)
                                        각 element도 dictionary로 key = writing_peer_reviews 테이블의 idwriting, value는 idwriting 객체의 속성 값을 저장하는 dictionary
                                        현재 선택된 문서에서 필요한 정보는
                                        다운받을 파일에 대한 정보인 file
                                        peer review  진행 중인 문서의 진행 상황 값이 processing_status
                                        이므로 형태는 다음과 같다.

                                        데이터 구조 예)

                                                    select_list = { "101" : {file : "101.pdf", processing_status: "1"},
                                                                    "192" : {file : "102.pdf", processing_status: "2"}}
                                        */
            },
            'msg': {
                'unable_to_load_document_list': '화면 로딩 중에 문제가 발생 했습니다! 잠시 후 다시 시도 해주세요!',
                'unable_to_delete': '변호사 서비스 신청 및 진행 중 문서는 삭제하실 수 없습니다. 다시 선택해주세요!',
                'no_download_document_selected_error': '다운로드할 문서를 선택해주세요.',
                'no_download_document_exists': '다운로드받을 수 있는 문서가 존재하지 않습니다.',
                'no_delete_document_selected_error': '삭제할 문서를 선택해주세요.',
                'document_delete_error': '삭제에 실패하였습니다.',
                'document_delete_confirm': '삭제하시겠습니까?',
                'constuction': '준비중 입니다.',
            }
        }

        this.state = state

        let payload = {
            'sort': 'desc',
            'limit': state.ui.per_page, // for pagination
            'offset': ((state.ui.current_page - 1) * state.ui.per_page) // for pagination
        }

        // 로그인한 유저가 변호사 서비스 신청한 기록을 받아옴
        API.sendPost(helper_url.api.writing_peer.documents_requested_service, payload).then((result) => {

            console.log('result.', result)

            if (result.status === 'ok') {
                state.ui.status = 'complete'
                state.data.document_list = result.data.data
                state.data.document_total = result.data.cnt
            } else {
                state.ui.status = 'error'
                alert(state.msg.unable_to_load_document_list)
            }
            that.setState(state)
        })
    }

    /* **************************************************************************** */
    /*  handle clicks                                                                */
    /* **************************************************************************** */

    // 각 row의 체크 박스 선택시 이벤트 처리
    handleSelect = evt => {
        let state = this.state
        let value = parseInt(evt.target.id) // document list의 index와 동일한 값이다
        let documentList = state.data.document_list
        let idx = documentList[value]['idx'] // 디비 writing_peer_reviews 테이블에서의 idx 값
        let selectList = state.data.select_list    // selectList는 idx를 key로 가지는 dictionary
                                                    //체크 해제 시 고유 값인 idx로 쉽게 조회 가능

        if (evt.target.checked === true) { // 체크 시 selectList에 추가
            selectList[idx] = {
                'file': documentList[value].file,
                'processing_status': documentList[value].processing_status,
            }
        } else { // 체크 해제 시 selectList에서 선택된 idx에 해당하는 값을 제거
            delete selectList[idx]
        }

        state.data.select_list = selectList
        this.setState(state)
    }

    // 전체 선택 체크 박스 클릭 처리
    handleSelectAll = evt => {
        let state = this.state
        let selectList = this.state.data.select_list
        let documentList = this.state.data.document_list

        if (documentList.length === Object.keys(selectList).length) {
            selectList = {}
        } else {
            documentList.map(x => {
                selectList[x['idx']] = {
                    'file': x.file,
                    'processing_status': x.processing_status,
                }
            })
        }

        state.data.select_list = selectList
        this.setState(state)
    }

    // PDF 파일 다운로드
    handleGetPdf = evt => {
        if (Object.keys(this.state.data.select_list).length <= 0) {
            alert(this.state.msg.no_download_document_selected_error)
            return false
        }

        let selects = this.state.data.select_list
        let zip = new JSZip()

        let savefile = 'lawform.zip'
        let files = []

        for (const [index, value] of Object.entries(selects)) {
            if (!!value && !!value.file && value.file !== 'saving' && value.file !== 'nofile') files.push(value.file)
        }

        let count = 0

        if (files.length > 0) {
            files.map((file) => {
                axios({
                    //url: "/print/"+file, // 추후 실제 파일 경로 추가해야함
                    url: '/documents/usage_1.pdf', // temp
                    method: 'GET',
                    responseType: 'blob',
                }).then((response, err) => {
                    if (err) {
                        throw err
                    } else {
                        zip.file(file, response.data, { binary: true })
                        count++
                        if (count === files.length) {
                            zip.generateAsync({ type: 'blob' }).then(function (content) {
                                saveAs(content, savefile)
                            })
                        }
                    }
                })
            })
        } else {
            alert(this.state.msg.no_download_document_exists)
        }
    }

    // MS word 파일로 다운로드
    // handleGetPdf 함수와 동일하게 구현하면 됨
    handleGetWord = evt => {
        if (Object.keys(this.state.data.select_list).length <= 0) {
            alert(this.state.msg.no_download_document_selected_error)
            return false
        }

        alert(this.state.msg.constuction)
    }

    // 선택한 문서 삭제 기능
    handleDelete = () => {
        if (Object.keys(this.state.data.select_list).length <= 0) {
            alert(this.state.msg.no_delete_document_selected_error)
            return false
        }

        for (let key in this.state.data.select_list) {
            if (this.state.data.select_list[key].processing_status !== 3) {
                alert(this.state.msg.unable_to_delete)
                return false
            }
        }

        if (window.confirm(this.state.msg.document_delete_confirm)) {
            let selects = this.state.data.select_list
            let docs = this.state.data.document_list
            let ids = ''

            for (let key in selects) {
                ids = ids + key + ','
            }

            ids = ids.substring(0, ids.length - 1)

            API.sendPost(helper_url.api.writing_peer.delete, { 'ids': ids }).then((res) => {
                if (res.status === 'ok') {
                    for (let key in selects) {
                        docs = docs.filter(function (elem) {
                            return parseInt(elem['idx']) !== parseInt(key)
                        })
                    }

                    this.componentDidMount()
                } else {
                    alert(this.state.msg.document_delete_error)
                    return false
                }
            })
        }
    }

    render () {
        let pagination_html = helper_pagination.html(
            helper_url.service.member.request_list,
            this.state.ui.current_page,
            this.state.ui.per_page,
            this.state.data.document_total
        )

        const dateFormat = 'Y년 MM월 DD일 HH시 mm분'
        const expiredBtn = '기간만료'
        return (
            <div>
                <div>

                    <div className="document_guide" style={{ marginBottom: 30 }}>
                        <ul>
                            <li>변호사 서비스 신청 문서 내역입니다.</li>
                            <li>요청 시 변호사는 최소 6시간내 매칭 됩니다. (15시 이전 요청은 당일 매칭)</li>
                            <li>변호사 서비스는 문서당 1회만 신청 가능합니다.</li>
                            <li>매칭이 되지 않은 경우 결제 금액은 취소 처리 됩니다.</li>
                            <li>검토 기간은 최대 3일을 넘지 않습니다.</li>
                        </ul>
                    </div>

                    <div className="table member-document-request-table">
                        <div className="table-options">
                            <div className="title">
                                전체 {this.state.data.document_total}건
                            </div>
                            <div className="option-wrapper">
                                <div className="option-item">
                                    <div className="btn btn-default" onClick={this.handleGetWord}>
                                        MS Word
                                        <img className="left-margin-10" src="/common/down-white.svg" alt={''}/>
                                    </div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={this.handleGetPdf}>
                                        PDF
                                        <img className="left-margin-10" src="/common/down-darkblue.svg" alt={''}/>
                                    </div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={this.handleDelete}><img src="/common/trash.svg" alt={''}/></div>
                                </div>
                            </div>
                            <div className="clearfix"/>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <div className="blue-checkbox">
                                        <label>
                                            <input type="checkbox" checked={(Object.keys(this.state.data.select_list).length === this.state.data.document_list.length)}
                                                   onClick={this.handleSelectAll}/>
                                            <span className="checkmark"/>
                                        </label>
                                    </div>
                                </th>
                                <th style={{width: 540}}>문서명</th>
                                <th>마감 기한 (영업일 기준)</th>
                                <th>변호사</th>
                                <th>진행상황</th>
                            </tr>
                            </thead>
                            <tbody className="member-document-request-list">
                            {this.state.data.document_list.map((item, i) => {
                                let state = this.state
                                let today = new Date()
                                return (
                                    <tr key={i}>
                                        <td className="text-center">
                                            <div className="blue-checkbox">
                                                <label id={i}>
                                                    {<input id={i} type="checkbox" value={i} checked={(typeof state.data.select_list[item['idx']] != 'undefined')}
                                                            onClick={this.handleSelect}/>}
                                                    <span id={i} className="checkmark"/>
                                                </label>
                                            </div>
                                        </td>

                                        {/*<td className="text-center">*/}
                                        {/*    <div className="document-name">{item.category_name}</div>*/}
                                        {/*</td>*/}

                                        <td className="left">
                                            <div className="big-title">{item.title}</div>
                                            <div className="blue-small-title">
                                                요청일시 : {helper_date.get_full_date_with_text(item.request_date_time)}
                                            </div>
                                        </td>

                                        <td className="text-center text-gray">
                                            <div className="big-title">

                                                {(item.processing_status === 3 && item.file !== null) && '완료'}
                                                {(item.processing_status === 3 && item.file === null) && '검토중'}
                                                {item.processing_status === 2 && (
                                                    (!!item.retouch_deadline) ? (
                                                        (!helper_date.date_available_from_today(item.retouch_deadline)) ? expiredBtn : '재검토중'
                                                    ) : (
                                                        (!helper_date.date_available_from_today(item.review_deadline)) ? '검토기간만료' : '검토중'
                                                    )
                                                )}
                                                {item.processing_status === 1 && (
                                                    (!helper_date.date_available_from_today(item.apply_end_date_time)) ? '매칭기간만료' : '매칭중'
                                                )}
                                            </div>
                                            <div className="blue-small-title">

                                                마감일시 : {item.processing_status === 3 ? (
                                                    moment(item.review_complete_date).format(dateFormat)
                                                ) : (
                                                    (!!item.retouch_deadline) ? (
                                                        moment(item.retouch_deadline).format(dateFormat)
                                                    ) : (
                                                        (!!item.review_deadline)
                                                            ? moment(item.review_deadline).format(dateFormat)
                                                            : moment(item.apply_end_date_time).format(dateFormat)
                                                    )
                                                )}

                                            </div>
                                        </td>

                                        <td className="text-center text-gray" style={{padding:'15px 0'}}>
                                            <div className="big-title">{(!!item.lawyer) ? item.lawyer : '-'}</div>
                                        </td>

                                        <td className="text-center text-gray">
                                            {
                                                (item.processing_status === 1) ?
                                                    <div className="process">
                                                        <span className="text-blue">요청 ▸</span>
                                                        진행중 ▸ 완료
                                                    </div> :
                                                    (item.processing_status === 2 || (item.processing_status === 3 && item.file === null)) ?
                                                        <div className="process">
                                                            <span className="text-black">요청 ▸</span>
                                                            <span className="text-blue">진행중 ▸</span>
                                                            완료
                                                        </div> :
                                                        <div className="process">
                                                            <span className="text-black">요청 ▸</span>
                                                            <span className="text-black">진행중 ▸</span>
                                                            <span className="text-red">완료</span>
                                                        </div>
                                            }
                                            <div className="row">
                                                <Link href={helper_url.service.doc.revision + item.writing_idx + '/' + item.idx + '/#2'} target="_blank">
                                                    <div className="btn btn-dark btn120">
                                                        문서 확인
                                                    </div>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {this.state.data.document_list.length <= 0 ? (
                                <tr>
                                    <td className="empty-row" colSpan="6">
                                        <div className="empty-msg">
                                            <div className="small-msg">
                                                변호사 서비스를 신청한 문서가 없습니다.
                                            </div>
                                            <div className="large-msg">
                                                변호사 서비스 신청은 내 문서 관리 &gt; 전체 문서 혹은 작성/수정하기 &gt; 변호사 직인/검토 서비스 버튼을 통해서 하실 수 있습니다.
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="6">{pagination_html}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default MemberDocumentRequest
