import React, { Component } from 'react'
import Link from 'next/link'
import API from '../../utils/apiutil'
import User from '../../utils/user'
import helper_url from '../../helper/helper_url'
import helper_date from '../../helper/helper_date'
import helper_pagination from '../../helper/helper_pagination'
import helper_parse from '../../helper/helper_parse'
import moment from 'moment'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import ServiceSample from './service_sample'

class ContractRequest extends Component {

    constructor (props) {
        super(props)
        this.state = {
            ui: {
                per_page: 10,
                current_page: (typeof helper_parse.get_param('page') === 'undefined') ? 1 : helper_parse.get_param('page'),
                status: 'loading',   // loading, complete, error
                tab: 2,
                service_modal: {
                    show: false
                }
            },
            data: {
                request_type: ('requestType' in props) ? props['requestType'] : 'review',
                request_total: 0,
                list: []
            },
            msg: {
                document_accept_confirm: '요청을 수락하시겠습니까?',
                document_accept_error: '요청이 수락되지 않았습니다.',
                document_accept_complete: '요청 수락이 완료 되었습니다.\n나의 사건 관리 페이지로 이동됩니다.',
                document_preoccupied: '이미 수락된 문서입니다.',
                no_requested_document: '요청된 문서가 없습니다.',
            }
        }

        // if ('requestType' in props) state.data.request_type = props['requestType']
        // this.state = state

    }

    componentDidMount () {

        let hash = Number(window.location.hash.replace('#', ''))
        if (!!hash) this.setTabs(hash, false)

        let payload = {
            'limit': this.state.ui.per_page,
            'offset': ((this.state.ui.current_page - 1) * this.state.ui.per_page)
        }

        API.sendPost(helper_url.api.writing_peer.documents_waiting_lawyer, payload).then((res) => {
            let status = res.data.result
            if (status === 'ok') {
                var data = {
                    request_type: 'review',
                    list: res.data.data,
                    request_total: res.data.cnt
                }
                this.setState({ data: data })
            }
        })
    }

    // 선택한 문서 요청 수락
    handleAccept = (item) => {

        const { msg } = this.state
        const { idx, type } = item
        const msgPrefix = (type === 'R') ? '검토 ' : '직인 '

        if (!!window.confirm(msgPrefix + msg.document_accept_confirm)) {
            API.sendPost(helper_url.api.writing_peer.accept, { 'idx': idx }).then((res) => {
                let status = res.data.result

                if (status === '409') {
                    alert(msg.document_preoccupied)
                    this.componentDidMount()
                    return
                }

                if (status === 'ok') {
                    alert(msgPrefix + msg.document_accept_complete)
                    this.componentDidMount()
                    window.location = helper_url.service.lawyer.contract_review
                    return
                }

                alert(msgPrefix + msg.document_accept_error)
            })
        }
    }

    setTabs = (tab, history = true) => {

        let state = this.state
        state.ui.tab = tab
        this.setState(state)

        window.location.href = '#' + tab
    }

    toggleModal = () => {
        let state = this.state
        state.ui.service_modal.show = (!state.ui.service_modal.show)
        console.log(state.ui.service_modal.show)
        this.setState(state)
    }

    render () {

        // let pagination_html = helper_pagination.html(
        //     helper_url.service.lawyer.contract_request + this.state.data.request_type + '/',
        //     this.state.ui.current_page,
        //     this.state.ui.per_page,
        //     this.state.data.request_total)
        // console.log('list', this.state.data.list)

        return (
            <div className="main">
                <div className="visual">
                    <h2>당신의 사건을 만나보세요</h2>
                    <h3 className="mobile_hide">로폼의 시스템에서 쉽고, 빠르게 사건을 처리할 수 있습니다.</h3>
                </div>
                <div className="container-blog lawyer-contract-review contents">

                    <ul className="tabs">
                        <li className={`${this.state.ui.tab === 1 ? 'active' : null}`} onClick={() => this.setTabs(1)}><a>서비스 가이드</a></li>
                        <li className={this.state.ui.tab === 2 ? 'active' : null} onClick={() => this.setTabs(2)}><a>요청 사건</a></li>

                    </ul>

                    <div className="lawyer-contract-wrap">

                        {(this.state.ui.tab === 2) &&
                        <div className="table-banner">
                            <ul>
                                <li>회원이 변호사의 검토 및 발신인 명의를 요청한 문서의 내용은 미리보기 버튼을 클릭하여 확인할 수 있습니다.</li>
                                <li>회원의 요청을 수락할 수 있는 기한과 변호사의 회신의 기한을 확인하여 수락해주세요.</li>
                                <li>요청 수락 이후에는 요청을 취소할 수 없습니다.</li>
                            </ul>
                        </div>
                        }

                        {
                            (this.state.ui.tab === 1)
                                ? (
                                    <>
                                        <div className="service-guide-wrap">
                                            <div className="list-options">
                                                <div className="title">
                                                    <h2>내용증명 검토 및 직인 서비스</h2>
                                                </div>
                                            </div>

                                            <div className="service-guide">
                                                <div>
                                                    <div className={'title'}>직인 기본</div>
                                                    <div className={'contents'}>
                                                        <div>
                                                            <span>수임료</span>
                                                            <span className="price">149,000원</span>
                                                        </div>
                                                        <div>
                                                            <span>회신기한</span>
                                                            <span className="text-red">사건 수락 후 +2일 9:00까지</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={'title hurry'}>직인 긴급</div>
                                                    <div className={'contents'}>
                                                        <div>
                                                            <span>수임료</span>
                                                            <span className="price">249,000원</span>
                                                        </div>
                                                        <div>
                                                            <span>회신기한</span>
                                                            <span className="text-red">사건 수락 후 익일 9:00까지</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="service-guide-wrap">
                                            <div className="list-options">
                                                <div className="title">
                                                    <h2>계약서 검토 서비스</h2>
                                                </div>
                                            </div>

                                            <div className="service-guide">
                                                <div>
                                                    <div className={'title'}>검토 기본</div>
                                                    <div className={'contents'}>
                                                        <div>
                                                            <span>수임료</span>
                                                            <span className="price">189,000원</span>
                                                        </div>
                                                        <div>
                                                            <span>회신기한</span>
                                                            <span className="text-red">사건 수락 후 +2일 9:00까지</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={'title hurry'}>검토 긴급</div>
                                                    <div className={'contents'}>
                                                        <div>
                                                            <span>수임료</span>
                                                            <span className="price">289,000원</span>
                                                        </div>
                                                        <div>
                                                            <span>회신기한</span>
                                                            <span className="text-red">사건 수락 후 익일 9:00까지</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="table-banner">
                                            <ul>
                                                <li>내용증명 직인 서비스는 회원의 위임에 따라 변호사가 내용증명의 발신인이 되는 서비스입니다. <span onClick={this.toggleModal} style={{ cursor: 'pointer' }}>[샘플 보기]</span></li>
                                                <li>변호사는 회원이 요청한 내용증명을 검토한 후 발신인을 변호사로 하여 회원에게 회신하는 절차로 완료되며, 변호사가 발송을 대행하지는 않습니다.</li>
                                                <li>회신 기한 미준수 건수가 3회 이상인 경우 매칭에 제한이 있을 수 있습니다.</li>
                                                <li>문서 최종 검토 완료 시, 직인은 변호사님의 성함으로 로폼이 제작한 이미지로 삽입됩니다.</li>
                                            </ul>
                                        </div>

                                        <ServiceSample show={this.state.ui.service_modal.show} toggleModal={this.toggleModal}/>


                                    </>
                                )
                                : (<div>
                                    <div className="list-options">
                                        <div className="title">전체 {this.state.data.request_total}건</div>
                                    </div>

                                    <div className="list">
                                        <ul>
                                            {!!this.state.data.list.length && this.state.data.list.map((item, i) => {
                                                return (
                                                    <li key={i}>
                                                        <div className="item">
                                                            <div className="title">
                                                                {item.title}
                                                            </div>

                                                            <div className="request-date">
                                                                요청일시 : {moment(item.request_date_time).format('Y년 MM월 DD일')}
                                                                <span>요청 수락 가능 기한: {moment(item.apply_end_date_time).format('Y년 MM월 DD일 HH시 mm분')}</span>
                                                                <span>회신 마감 기한: 매칭일로 부터 {item.period}일 후 09:00까지 (영업일 기준)</span>
                                                            </div>

                                                            <div className="pricing">
                                                                <div className="expiredate">
                                                                    {/*정보 추가되면 수정*/}
                                                                    {/*마감기한 : <span>{helper_date.diff_two_dates(new Date(), item.apply_end_date_time)}일 이내</span> (요청 수락 시점 기준)*/}
                                                                </div>
                                                                <div className="actual-price">
                                                                    {Number(parseInt(item.paid_amount)).toLocaleString()} 원
                                                                </div>
                                                            </div>

                                                            <div className="preview">
                                                                <Link href={helper_url.service.doc.preview + item.writing_idx + '/' + item.idx + '/'}>
                                                                    <div className="btn btn-light">
                                                                        미리보기
                                                                    </div>
                                                                </Link>
                                                                <div className="btn btn-dark" onClick={(e) => this.handleAccept(item)}>
                                                                    요청수락
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                            {!this.state.data.list.length &&
                                            <div className="empty-msg">
                                                <div className="msg">
                                                    {this.state.msg.no_requested_document}
                                                </div>
                                            </div>
                                            }
                                        </ul>
                                    </div>
                                    {/* {pagination_html} */}
                                </div>)
                        }


                    </div>

                </div>
            </div>
        )
    }
}

export default ContractRequest
