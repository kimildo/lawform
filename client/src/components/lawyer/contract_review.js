import React, { Component } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { isMobile } from 'react-device-detect'
import Api from '../../utils/apiutil'
import helper_url from '../../helper/helper_url'
import helper_date from '../../helper/helper_date'
import helper_pagination from '../../helper/helper_pagination'
import helper_parse from '../../helper/helper_parse'
import Sale from '../lawyer/sale'
import User from '../../utils/user'
class ContractReview extends Component {

    constructor (props) {
        super(props)
        this.state = {
            ui: {
                per_page: 100,
                current_page: (typeof helper_parse.get_param('page') === 'undefined') ? 1 : helper_parse.get_param('page'),
                status: 'loading',   // loading, complete, error
                hash: 1
            },
            data: {
                list: [],
                total: 0,
                curList: [],
                reviewLists: [],
                completeLists: [],
                filter: (typeof helper_parse.get_param('filter') === 'undefined') ? null : helper_parse.get_param('filter'),
            },
            msg: {
                no_reviewing_document: '검토 중인 문서가 없습니다.',
                no_complete_document: '완료된 문서가 없습니다.',
                check_cancel: '마감기한을 엄수하지 않아 사건이 자동으로 취소 됩니다.\n3회 이상 기한 미 준수 시 매칭에 제한이 되오니 참고 부탁드립니다.',
                cancel_complete: '정상적으로 접수되었습니다.\n' +
                    '환불 처리의 경우 최대 7일까지 소요 되며, 평균 2~3일 내로 \n' +
                    '결제취소 / 입금 처리 됩니다.\n' +
                    '문의 사항 있으신 경우 고객센터로 연락 부탁드립니다.',
            },
        }

    }

    // 진행 상황에 다른 필터링.
    // "전체", "진행", "완료"
    handleFilter = evt => {
        window.location = helper_url.service.lawyer.contract_review + '?page=1&' + encodeURIComponent('filter') + '=' + encodeURIComponent(evt.target.value)
    }

    componentDidMount () {

        let that = this
        let reviewLists = []
        let completeLists = []

        let payload = {
            sort: 'desc',
            limit: this.state.ui.per_page,
            offset: ((this.state.ui.current_page - 1) * this.state.ui.per_page),
            contract_review: true
        }

        if (!!this.state.data.filter) {
            payload['filter'] = this.state.data.filter
        }

        let hash = Number(window.location.hash.replace('#', ''))

        Api.sendPost(helper_url.api.writing_peer.lawyer_processing_documents, payload).then((res) => {

            let status = res.data.result
            let state = that.state
            let today = new Date()

            //console.log('data', res.data.data)

            if (status === 'ok') {
                state.data.list = res.data.data
                state.data.total = res.data.cnt

                res.data.data.map((row) => {
                    if (row.status === 1 && row.processing_status === 2 && !row.retouch_deadline && !row.review_complete_date /*&& helper_date.diff_two_dates(today, row.review_deadline) >= 0*/) {
                        reviewLists.push(row)
                    } else {
                        completeLists.push(row)
                    }
                })

                state.data.reviewLists = reviewLists
                state.data.completeLists = completeLists
            }
            
            that.setState(state)
            this.setTabs(hash)
        })
    }

    setTabs = (tab, history = false) => {

        if (!User.getInfo()) {
            window.location.href = '#signin'
            return
        }

        let state = this.state
        let url = helper_url.service.lawyer.contract_review
        if (!tab) tab = 1
        state.ui.tab = tab

        switch (tab) {
            case 1:
                state.data.curList = state.data.reviewLists
                state.data.total = state.data.reviewLists.length
                break
            case 2:
                state.data.curList = state.data.completeLists
                state.data.total = state.data.completeLists.length
                break
            default:
                state.data.curList = []
                state.data.total = 0
        }

        state.ui.hash = tab
        this.setState(state)

        window.location.hash = '#' + tab
        if (!!history) {
            window.location = url + '#' + tab
        }

    }

    handleMoveEdit = (writing_idx, idx) => {

        if (!!isMobile) {
            alert('모바일에서 이용하실 수 없습니다. PC에서 이용해주세요.')
            return
        }

        window.location = helper_url.service.doc.lawyer_edit + writing_idx + '/' + idx

    }

    handlePayCancel = (idx) => {

        // parent
        let that = this
        let confirm_msg = that.state.msg.check_cancel
        if (!window.confirm(confirm_msg) || !idx) {
            return
        }

        Api.sendPost(helper_url.api.writing_peer.cancel, {
            writing_peer_review_idx: idx,
        }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                alert(that.state.msg.cancel_complete)
                this.componentDidMount()
                return
            }

            alert(that.state.msg.cancel_error)
        })
    }

    render () {

        let extra_params = {}
        let today = moment().format('YYYY-MM-DD HH:mm:ss')
        const dateFormat = 'Y년 MM월 DD일 HH시 mm분'

        if (!!this.state.data.filter) {
            extra_params['filter'] = this.state.data.filter
        }

        let pagination_html = helper_pagination.html(
            helper_url.service.lawyer.contract_review,
            this.state.ui.current_page,
            this.state.ui.per_page,
            this.state.data.total,
            extra_params,
            this.state.ui.hash
        )

        const expiredBtn = <div className="btn btn-red btn-block" disabled={true}>
            마감기한 초과
        </div>

        return (
            <div className="main">
                <div className="visual">
                    <h2>나의 사건 관리</h2>
                    <h3 className="mobile_hide">진행 중인 사건의 상태 및 정산 내역을 확인하실 수 있습니다.</h3>
                </div>
                <div className="container-blog lawyer-contract-review contents">

                    <ul className="tabs">
                        <li className={this.state.ui.tab === 1 ? 'active' : null} onClick={() => this.setTabs(1, true)}><a>검토중인 사건</a></li>
                        <li className={this.state.ui.tab === 2 ? 'active' : null} onClick={() => this.setTabs(2, true)}><a>완료 사건</a></li>
                        <li className={this.state.ui.tab === 3 ? 'active' : null} onClick={() => this.setTabs(3, true)}><a>정산 내역</a></li>
                    </ul>

                    <div className="lawyer-contract-wrap">

                        <div className="table-banner">
                            {(this.state.ui.tab === 1) &&
                            <ul>
                                <li>마감기한은 꼭 엄수해주세요.</li>
                                <li>검토가 완료된 경우 상단의 최종 검토 완료 버튼을 꼭 눌러주세요.</li>
                                <li>검토 완료 된 문서는 의뢰인이 1회 수정요청을 할 수 있습니다.</li>
                                <li>요청원본은 수정이 불가능하며 변호사 검토 화면에서 문서를 수정할 수 있습니다.</li>
                                <li>기타 문의 사항은 로폼 고객센터를 통해 문의해주세요.</li>
                            </ul>
                            }
                            {(this.state.ui.tab === 2) &&
                            <ul>
                                <li>검토 완료 문서 내역입니다. (기한 미준수 포함)</li>
                                <li>기한 미준수 건수가 3회 이상인 경우 매칭에 제한이 있을 수 있습니다.</li>
                                <li>검토 완료된 문서는 회원이 1회 수정요청을 할 수 있습니다.</li>
                                <li>재검토하기 버튼을 눌러 문서를 재수정 할 수 있습니다.</li>
                                <li>기타 문의 사항은 상단의 서비스 소개를 참고하시거나 로폼 고객센터를 통해 문의해주세요.</li>
                            </ul>
                            }
                            {(this.state.ui.tab === 3) &&
                            <ul>
                                <li>매월 초일부터 말일까지 변호사 회원님이 완료한 서비스에 관하여 일반 회원이 서비스 이용 대가로 지불한 금액에 대해 로폼 내부의 정산 기준과 절차에 따라
                                    그 익월 30(공휴일 등 비영업일일 경우 그 다음 영업일)에 변호사 회원님이 등록해주신 계좌로 지급됩니다.</li>
                                <li>지급 계좌 등록 절차를 진행해주세요. <Link href={helper_url.service.lawyer.profile}>[계좌등록하기]</Link></li>
                                <li>세금계산과 관련 문의는 고객센터로 문의 바랍니다.</li>
                            </ul>
                            }
                        </div>

                        {(this.state.ui.tab !== 3) && <>

                            <div className="list-options">
                                <div className="title">전체 {this.state.data.total}건</div>
                                <div className="clearfix"></div>
                            </div>

                            <div className="list">
                                <ul>
                                    {!!this.state.data.curList && this.state.data.curList.map((item, i) => {
                                        return (
                                            <li key={i}>
                                                <div className={`item process ${(item.processing_status === 3 || !item.status) && 'item-complete'}`}>
                                                    <div className="title">
                                                        {item.title}
                                                        {(item.processing_status === 3 && item.status === 1) && <div className="complete blue">&#10003; COMPLETED</div>}
                                                        {(item.status === 0) && <div className="complete">REJECTED</div>}
                                                    </div>
                                                    {/*<div className="sub-title">*/}
                                                    {/*    {item.category_name}*/}
                                                    {/*</div>*/}
                                                    <div className="request-date process">
                                                        {/*요청일시 : {helper_date.get_full_date_hm_with_text(item.request_date_time)}*/}
                                                        {(item.processing_status === 2) && (
                                                            (!!item.retouch_deadline) ? (<>
                                                                완료 일시: <span className={'text-red text-inline'}>{moment(item.review_complete_date).format('Y년 MM월 DD일 HH시 mm분')}</span>
                                                            </>) : (<>
                                                                <span className={'text-black text-inline'}>회신 마감기한:</span> <span className={'text-inline'}>{moment(item.review_deadline).format(dateFormat)}</span>
                                                            </>)
                                                        )}
                                                        {(item.processing_status === 3) && <span className={'text-black text-inline'}>완료 일시: <span className={'text-red text-inline'}>{moment(item.review_complete_date).format(dateFormat)}</span></span>}
                                                        {(item.processing_status === 2 && !!item.retouch_deadline) && <>
                                                            <span className={'text-black text-inline'}>재검토 마감기한:</span> <span className={'text-inline'}>{moment(item.retouch_deadline).format(dateFormat)}</span>
                                                        </>}
                                                    </div>

                                                    <div className="option">
                                                        {item.processing_status === 3 ? (
                                                            (item.status === 1) &&
                                                                      <div className="btn btn-default btn-block" onClick={() => this.handleMoveEdit(item.writing_idx, item.idx)}>
                                                                            내용보기
                                                                      </div>
                                                            ) : (
                                                                (!!item.retouch_deadline) ?
                                                                    ((moment(item.retouch_deadline) - moment(today)) < 0) ? expiredBtn : (
                                                                        <div className="btn btn-default btn-block" onClick={() => this.handleMoveEdit(item.writing_idx, item.idx)}>
                                                                            재검토하기
                                                                        </div>
                                                                    )
                                                                    :
                                                                    ((moment(item.review_deadline) - moment(today)) < 0) ? expiredBtn : (
                                                                        <div className="btn btn-default btn-block" onClick={() => this.handleMoveEdit(item.writing_idx, item.idx)}>
                                                                            검토하기
                                                                        </div>
                                                                    )
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </li>
                                        )
                                    })}
                                    {!this.state.data.curList.length &&
                                        <div className="empty-msg">
                                            <div className="msg">
                                                {(this.state.ui.tab === 1) ? this.state.msg.no_reviewing_document : this.state.msg.no_complete_document}
                                            </div>
                                        </div>
                                    }
                                </ul>
                            </div>
                            {pagination_html}
                        </>}

                        {(this.state.ui.tab === 3) && <Sale/>}

                    </div>




                </div>
            </div>
        )
    }
}

export default ContractReview
