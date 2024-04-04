import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { isMobile } from 'react-device-detect'

import Api from '../../utils/apiutil'

import helper_url from '../../helper/helper_url'
import helper_date from '../../helper/helper_date'
import helper_pagination from '../../helper/helper_pagination'
import helper_parse from '../../helper/helper_parse'

class Sale extends Component {

    constructor (props) {
        super(props)
        let today = new Date()

        this.state = {
            ui: {
                per_page: 10,
                current_page: (typeof helper_parse.get_param('page') === 'undefined') ? 1 : helper_parse.get_param('page'),
                status: 'loading'   // loading, complete, error
            },
            'data': {
                'list': [],
                'total': 0,

                // pagination을 위하여 검색 조건이 url의 parameter로 전달되는데
                // 변수 하나로 관리하는 경우, ui에서 값을 변경하고 검색을 하지 않은 채로 다른 페이지를 선택하는 경우
                // 변경된 변수 값이 그대로 parameter로 전달되어 결국 검색 조건이 달라지게 된다.
                // 두 개의 변수를 활용하여 이를 방지한다.

                // filter Component들의 value를 저장. 사용자에 의해 값이 변경되는 dynamic 변수
                // 검색 조건 값으로 활용되므로 검색 버튼 클릭 시 url의 parameter로 전달된다.
                'start_date': (typeof helper_parse.get_param('sdate') === 'undefined') ? null : new Date(helper_parse.get_param('sdate')),
                'end_date': (typeof helper_parse.get_param('edate') === 'undefined') ? null : new Date(helper_parse.get_param('edate')),
                'type': (typeof helper_parse.get_param('type') === 'undefined') ? null : helper_parse.get_param('type'),

                // 해당 페이지의 filter 조건을 저장. ui가 변경되어도 값이 변경되지 않는 static 변수입니다.
                // pagination을 통해 다른 페이지로 이동할 때, url의 parameter로 전달된다.
                'filter': {
                    'start_date': (typeof helper_parse.get_param('sdate') === 'undefined') ? null : new Date(helper_parse.get_param('sdate')),
                    'end_date': (typeof helper_parse.get_param('edate') === 'undefined') ? null : new Date(helper_parse.get_param('edate')),
                    // 1:review_complete_date, 2:payment_expect_date 중 어떤 걸 선택할 지  결정
                    'type': (typeof helper_parse.get_param('type') === 'undefined') ? null : helper_parse.get_param('type'),
                }
            },
            'popup_details': {
                'style': {
                    'display': 'none'
                },
                'data': {
                    'service': 0,
                    'option': 0,
                    'platform': 0,
                    'total': 0,
                }
            },
            'msg': {
                'no_type_error': '검색 조건을 지정해주세요.',
                'no_start_date_error': '시작일을 지정해주세요.',
                'no_end_date_error': '종료일을 지정해주세요.',
                'filter_condition_error': '검색 조건을 확인해주세요.'
            },
        }
    }

    /* **************************************************************************** */
    /*  handle clicks                                                                */
    /* **************************************************************************** */

    // 시작 일시 선택
    handleStartDate = (date) => {
        let state = this.state
        state.data.start_date = date

        let start = moment(date)
        if (!!this.state.data.end_date) {
            if (start.diff(moment(this.state.data.end_date), 'days') > 0)
                state.data.end_date = new Date(start.add(7, 'days').format('Y-MM-DD'))
        }

        this.setState(state)
    }

    // 종료 일시 선택
    handleEndDate = (date) => {
        let state = this.state
        let end = moment(date)

        if (!!this.state.data.start_date) {
            if (end.diff(moment(this.state.data.start_date), 'days') < 0)
                state.data.start_date = new Date(end.subtract(7, 'days').format('Y-MM-DD'))
        }

        state.data.end_date = date
        this.setState(state)
    }

    // 어떤 일자를 기준으로 필터링 할 지 선택
    handleFilterType = evt => {
        let state = this.state
        state.data.type = evt.target.value

        this.setState(state)
    }

    // 특정 기간이 정해져있는 필터
    handleMonthFilter = (count = 1) => {

        let state = this.state
        let dateFormat = 'Y-MM-DD'

        state.data.start_date = new Date(moment().subtract(count, 'month').format(dateFormat))
        state.data.end_date = new Date(moment().format(dateFormat))

        this.setState(state)
    }

    // 검색 수행
    handleSearch = () => {

        let that = this
        let state = that.state
        let sdate, edate

        if (!state.data.type) {
            alert(state.msg.no_type_error)
            return
        }

        if (!state.data.start_date && !!state.data.end_date) {
            alert(state.msg.no_start_date_error)
            return
        }

        if (!!state.data.start_date && !state.data.end_date) {
            alert(state.msg.no_end_date_error)
            return
        }

        sdate = moment(state.data.start_date).format('Y-MM-DD')
        edate = moment(state.data.end_date).format('Y-MM-DD')

        let url = helper_url.service.lawyer.contract_review

        //검색 결과 적용하여 해당 창으로 이동
        window.location = url + '?page=1'
            + '&' + encodeURIComponent('sdate') + '=' + encodeURIComponent(sdate)
            + '&' + encodeURIComponent('edate') + '=' + encodeURIComponent(edate)
            + '&' + encodeURIComponent('type') + '=' + encodeURIComponent(state.data.type)
            + '#3'

    }

    /* **************************************************************************** */
    /*  popup clicks                                                                */
    /* **************************************************************************** */

    // 상세보기 클릭 시 팝업 생성
    clickDetails = (evt, item) => {
        let state = this.state
        state.popup_details.style = { 'display': 'inline-block' }
        state.popup_details.data.option = item.display
        state.popup_details.data.service = (!!item.display) ? (item.price - item.display) : item.price
        state.popup_details.data.platform = 0
        state.popup_details.data.total = state.popup_details.data.service + state.popup_details.data.option
        this.setState(state)
    }

    // 팝업 종료
    clickCloseDetails = evt => {
        let state = this.state
        state.popup_details.style = { 'display': 'none' }
        this.setState(state)
    }

    resetFilter = () => {
        window.location = helper_url.service.lawyer.contract_review + '#3'
    }

    componentDidMount () {

        let that = this
        let state = this.state
        let payload = {
            'sort': 'desc',
            'limit': state.ui.per_page,
            'offset': ((state.ui.current_page - 1) * state.ui.per_page),
            'lawyer_sale': true,
        }

        // 3가지 검색 조건 중 누락된 값이 없을 경우 해당 조건으로 필터링하도록 parameter 구성
        if (state.data.start_date && state.data.end_date && state.data.type) {
            payload['search'] = true
            payload['sdate'] = moment(state.data.start_date).format('Y-MM-DD')
            payload['edate'] = moment(state.data.end_date).format('Y-MM-DD')
            payload['type'] = state.data.type === '1' ? 'review_complete_date' : 'payment_expect_date'
        }

        Api.sendPost(helper_url.api.writing_peer.get_list, payload).then((result) => {
            if (result.status === 'ok') {
                state.ui.status = 'complete'
                state.data.list = result.data.data
                state.data.total = result.data.cnt
            } else state.ui.status = 'error'
            that.setState(state)
        })
    }

    render () {
        let extra_params = {}

        // filter 조건이 parameter로 넘어왔다면 dictionary에 추가하여 pagination 생성에 이용

        if (!!this.state.data.filter.start_date) {
            extra_params['sdate'] = moment(this.state.data.filter.start_date).format('Y-MM-DD')
        }
        if (!!this.state.data.filter.end_date) {
            extra_params['edate'] = moment(this.state.data.filter.end_date).format('Y-MM-DD')
        }

        if (!!this.state.data.filter.type) {
            extra_params['type'] = this.state.data.filter.type
        }

        let pagination_html = helper_pagination.html(
            helper_url.service.lawyer.contract_review,
            this.state.ui.current_page,
            this.state.ui.per_page,
            this.state.data.total,
            extra_params, '3'
        )

        //console.log(this.state.data.list)
        //console.log(isMobile)

        const dateFormat = 'Y년 MM월 DD일'

        return (
            <div>
                <div className="layer-sale-popup" style={this.state.popup_details.style}>
                    <div className="sale-popup-box">
                        <div className="popup-header">
                            <div className="popup-title">수익금 내역</div>
                        </div>
                        <div className="popup-body">
                            <div className="row">
                                <div className="row-title">검토 및 직인 서비스 제공료</div>
                                <div className="row-price">{Number(parseInt(this.state.popup_details.data.service)).toLocaleString()} 원</div>

                            </div>
                            <div className="row">
                                <div className="row-title">옵션 추가</div>
                                <div className="row-price">{Number(parseInt(this.state.popup_details.data.option)).toLocaleString()} 원</div>
                            </div>
                            <div className="row">
                                <div className="row-title text-red">플랫폼 이용료</div>
                                <div className="row-price">{Number(parseInt(this.state.popup_details.data.platform)).toLocaleString()} 원</div>
                            </div>
                            <div className="row">
                                <div className="dotted-line"></div>
                            </div>
                            <div className="row">
                                <div className="row-title text-bold">최종 입금 금액</div>
                                <div className="row-final-price">{Number(parseInt(this.state.popup_details.data.total)).toLocaleString()} 원</div>
                            </div>

                            <div className="row text-center">
                                <div className="btn btn-default" onClick={this.clickCloseDetails}>확인</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<Common></Common>*/}
                <div>

                    <div className="list-options">
                        <div className="title">전체 {this.state.data.total}건</div>
                        <div className="clearfix"></div>
                    </div>

                    <div className="table">
                        <div className="table-options">
                            <div className="option-wrapper" style={{margin: 10}}>
                                <div className="option-item">
                                    <select className="select-type" onChange={this.handleFilterType}>
                                        <option value="" selected={!this.state.data.type}>검색조건</option>
                                        <option value="1" selected={this.state.data.type === '1'}>검토완료일</option>
                                        <option value="2" selected={this.state.data.type === '2'}>입금예정일</option>
                                    </select>
                                </div>

                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={(evt) => this.handleMonthFilter()}>1개월</div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={(evt) => this.handleMonthFilter(3)}>3개월</div>
                                </div>
                                {/*<div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={(evt)=>this.handleMonthFilter('m', 6)}>6개월</div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={(evt)=>this.handleMonthFilter('y', 1)}>1년</div>
                                </div>*/}
                                <div className="option-item">
                                    <div className="datepicker-wrapper">
                                        <DatePicker placeholderText="YYYY-MM-DD" dateFormat="yyyy-MM-dd" onChange={date => this.handleStartDate(date)}
                                                    selected={this.state.data.start_date}/>
                                    </div>
                                </div>
                                <div className="option-item option-dash">—</div>
                                <div className="option-item">
                                    <div className="datepicker-wrapper">
                                        <DatePicker placeholderText="YYYY-MM-DD" dateFormat="yyyy-MM-dd" onChange={date => this.handleEndDate(date)}
                                                    selected={this.state.data.end_date}/>
                                    </div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default" onClick={this.handleSearch}>조회</div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default" onClick={this.resetFilter}>초기화</div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>

                        {!isMobile &&
                        <table className={'mobile_hide'}>
                            <thead>
                            <tr>
                                <th>서비스명</th>
                                <th>수익금</th>
                                <th>검토완료일</th>
                                <th>입금예정일</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                            <tbody className="lawyer-sale">
                            {!!this.state.data.list && this.state.data.list.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            <div className="big-title">
                                                {item.title}
                                            </div>
                                            <div className="small-title">
                                                변호사 {item.service_name}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="price">
                                                {Number(parseInt(item.price)).toLocaleString()} 원 <span>(플랫폼이용료 제외)</span>
                                            </div>
                                            <div className="btn btn-default btn-outline-default btn108" onClick={(evt) => this.clickDetails(evt, item)}>상세보기</div>
                                        </td>
                                        <td className="text-center text-gray text-14">
                                            {moment(item.review_complete_date).format(dateFormat)}
                                        </td>
                                        <td className="text-center text-gray text-14">
                                            {(!!item.payment_expect_date && item.payment_expect_date !== '0000-00-00') ? moment(item.payment_expect_date).format(dateFormat) : '-'}
                                        </td>
                                        {item.payment_status === 1 ?
                                            <td className="text-center text-17">
                                                <div className="status text-blue">입금대기</div>
                                            </td>
                                            :
                                            <td className="text-center text-17">
                                                <div className="status text-red">입금완료</div>
                                                <div className="btn btn-default">세금계산서 발행</div>
                                            </td>
                                        }
                                    </tr>
                                )
                            })}

                            {!this.state.data.list.length &&
                                <tr>
                                    <td colSpan={5} align={'center'}>검토완료된 문서가 없습니다.</td>
                                </tr>
                            }

                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="5">
                                    {pagination_html}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                        }
                    </div>
                </div>

                {!!isMobile &&
                <div className="list calc">
                    <ul>
                    {!!this.state.data.list && this.state.data.list.map((item, i) => {
                        return (
                            <li>
                                <div className="item">
                                    <div className="title">
                                        {item.title}
                                    </div>

                                    <div className="pricing">
                                        수익금: {Number(parseInt(item.price)).toLocaleString()} 원 <span>(플랫폼이용료 제외)</span>
                                    </div>

                                    <div className="complete-date">
                                        검토완료일:  {moment(item.review_complete_date).format(dateFormat)}
                                    </div>

                                    <div className="expect-date">
                                        입금예정일: {(!!item.payment_expect_date && item.payment_expect_date !== '0000-00-00') ? moment(item.payment_expect_date).format(dateFormat) : '-'}
                                    </div>

                                    <div className="status process">
                                        <span className="text-black">상태</span>: {
                                            (item.payment_status === 1) ? <span className="text-red">입금대기</span>
                                                : <><span className="text-blue">입금완료</span> <span className="btn btn-default">[세금계산서 발행]</span></>
                                        }
                                    </div>

                                    <div className="detail">
                                        <div className="btn btn-default btn-outline-default btn108" onClick={(evt) => this.clickDetails(evt, item)}>상세보기</div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}

                    {!this.state.data.list.length &&
                        <li>
                            <div className="empty-msg">
                                <div className="msg">정산 내역이 없습니다.</div>
                            </div>
                        </li>
                    }

                    </ul>

                    {pagination_html}

                </div>}




            </div>
        )
    }
}

export default Sale
