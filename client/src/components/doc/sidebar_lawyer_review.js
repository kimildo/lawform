import React, { Component } from 'react'
import Link from 'next/link'

// import '../../scss/page/doc/sidebar.scss'

import AlertPopPricing from './alert_pop_pricing'
import API from 'utils/apiutil'
import helper_url from 'helper/helper_url'

import Paylawyer from 'components/common/paylawyer'
import LegalNotice from 'components/common/legalnotice'
import ReactGA from 'react-ga'

class SidebarLawyerReview extends Component {

    constructor (props) {
        super(props)

        // https://ko.reactjs.org/docs/react-component.html#constructor
        // @todo 주의 state에 props를 복사하면 안 됩니다! 가장 흔히 범하는 실수 중 하나입니다.
        this.state = {
            'ui': {
                'show_price': false,
                'legal_checkbox': false
            },
            'data': {
                'writing_idx': this.props.writing_idx | 0,
                'document_idx': this.props.document_idx | 0,
                'category_idx': this.props.category_idx | 0,
                'payment_idx': 0,
                'service_idx': 0,
                'question_1': '',
                'question_2': '',
                'question_3': '',
                'question_1_len': 0,
                'question_2_len': 0,
                'question_3_len': 0,
                'request_type': '2'
            },
            'msg': {
                'question_1_error': '계약서의 특정부분 수정 요청을 입력해주세요',
                'question_2_error': '계약내용 전반적인 검토 요청을 입력해주세요',
                'question_3_error': '계약 경위 등 회원님의 상황을 입력해주세요',
                'question_1_placeholder': '[작성가이드]\n* 회원님께서 작성한 내용을 보시고, 특정한 부분에 대해 삭제/추가/수정하고 싶은 내용을 입력해주세요\n\n* 특히, 몇조 몇항 등 어느 조문에 관한 것인지 특정해주면 보다 정확한 자문을 받을 수 있답니다. \n\n예시) 계약서 3조 2항에서 계약 연장을 자동으로 하게 되어있는데, 자동으로 연장한 후 중간에 해지하고 싶으면 해지하는  규정을 넣고 싶습니다.',
                'question_2_placeholder': '[작성가이드]\n*계약에 관해 전반적으로 유리하거나 불리한 내용에 대해서 궁금한 사항을 남겨주세요 \n*특히, 3번에 계약에 관한 경위 등을 남겨주시면 변호사님의 자문에 도움이 됩니다.\n\n예시) 제가 부동산을 팔면서 대금을 2번 나눠서 받기로 했는데, 특별히 불리한 사항이 있을까요? ',
                'question_3_placeholder': '[작성가이드]\n* 본 계약을 체결하게 된 배경이나, 특별한 사정 등이 있으시다면 말씀해주세요.',
                'legal_checkbox_error': '정보제공 등의 사항에 동의해주세요.',
                'purchase_complete': '변호사 검토 신청이 완료되었습니다.\n검토가 완료 되면 문자로 안내드리겠습니다.',
                'purchase_error': '신청 중 문제가 생겼습니다. 잠시 후 다시 신청 해주세요.'
            }
        }

        //console.log('props', props)
    }

    /* *****************************************************************************
     *  handleChanges
     * *****************************************************************************/

    handleChangeQuestions = evt => {
        let state = this.state
        let maxLength = 300
        let curTextLength = evt.target.value.length

        state.data['question_' + evt.target.id] = evt.target.value
        state.data['question_' + evt.target.id + '_len'] = curTextLength

        if (curTextLength > maxLength) {
            state.data['question_' + evt.target.id] = evt.target.value.substr(0, maxLength)
        }

        this.setState(state)
    }

    handleChangeLegalAgree = evt => {
        let state = this.state
        state.ui.legal_checkbox = !state.ui.legal_checkbox
        this.setState(state)
    }

    /* *****************************************************************************
     *  handleClicks
     * *****************************************************************************/

    handleClickTogglePopupPricing = evt => {
        let state = this.state
        state.ui.show_price = (!state.ui.show_price)
        this.setState(state)
    }

    handleClickRequest = () => {
        // parent
        let that = this
        let payload = this.state.data

        // validate payload
        if (payload.question_1.trim() === '') {
            alert(that.state.msg.question_1_error)
            return
        }

        if (payload.question_2.trim() === '') {
            alert(that.state.msg.question_2_error)
            return
        }

        if (payload.question_3.trim() === '') {
            alert(that.state.msg.question_3_error)
            return
        }

        if (this.state.ui.legal_checkbox === false) {
            alert(that.state.msg.legal_checkbox_error)
            return
        }

        let reqUrl = window.location.pathname + '#paylawyer'
        ReactGA.pageview(reqUrl, null, '변호사 첨삭/직인 결제요청')
        ReactGA.event({
            category: 'Payment',
            action: 'Request',
            label: '변호사 첨삭/직인 결제요청'
        })
        window.location = reqUrl

    }

    handleClickPay = (payment_callback) => {

        // parent
        const { msg, data } = this.state

        // setup data
        let payload = data
        payload.payment_idx = payment_callback.payment_idx.data.data.paymentUid
        payload.service_idx = payment_callback.service_idx

        // set payload to server
        API.sendPost(helper_url.api.writing_peer.create, payload).then((result) => {
            if ('status' in result && result.status === 'ok') {
                let reqUrl = helper_url.service.doc.revision + this.props.writing_idx + '/' + result.data.data.idx
                alert(msg.purchase_complete)
                ReactGA.pageview(reqUrl + '/#paycomplete', null, '변호사 첨삭/직인 결제완료')
                window.location = reqUrl + '/#2'
                return
            }
            alert(msg.purchase_error)
        })
    }

    handleViewTerms = () => {
        window.location.href = '#terms'
    }

    /* *****************************************************************************
     *  render
     * *****************************************************************************/

    render () {

        let that = this
        return (
            <>
                <div className="sidebar">
                    {(!!this.state.ui.show_price) && <AlertPopPricing parent={that} type="2"/>}
                    <div className="sidebar-container">
                        <div className="panel-form">
                            <div className="form-head">
                                <div className="title">변호사 검토 서비스란</div>
                                <div className="option">
                                    <div className="option-item" onClick={this.handleClickTogglePopupPricing}>요금안내</div>
                                </div>
                            </div>
                            <div className="form-body">
                                <ul className="pie-join">
                                    <li>작성하신 계약서를 기초로 변호사의 자문을 받는 서비스입니다.</li>
                                    <li>아래 내용에 질문하면, 수정된 계약 내용을 받아보실 수 있습니다.</li>
                                    <li>로폼은 제휴한 변호사님 전체에게 본 자문 요청을 발송하며, 특정한 변호사님을 알선하지 않습니다.</li>
                                    <li>로폼은 변호사님의 자문 내용에 대하여 관여하지 않으며 법적책임 또한 지지 않습니다.</li>
                                </ul>
                                {/*<div className="pie-join">*/}
                                {/*    <div className="join-col">*/}
                                {/*        <div className="circle-of-life">*/}
                                {/*            <img src="/autoform_img/icon-complete-big.svg"/>*/}
                                {/*            <div className="title">문서 검토 후 수정</div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*    <div className="join-col">+</div>*/}
                                {/*    <div className="join-col">*/}
                                {/*        <div className="circle-of-life">*/}
                                {/*            <img src="/autoform_img/icon-edit-big.svg"/>*/}
                                {/*            <div className="title">변호사 명의 추가</div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <br/><br/>

                        <div className="panel-form">
                            <div className="form-head">
                                <div className="title">검토 요청 사항</div>
                            </div>
                            <div className="form-body">
                                <div className="question-title">1. 계약서의 특정부분 수정 요청</div>
                                <div className="question-answer">
                                    <textarea maxLength="300" id="1" placeholder={this.state.msg.question_1_placeholder} onChange={this.handleChangeQuestions}
                                              value={this.state.data.question_1}/>
                                </div>

                                <div className="question-title">2. 계약내용 전반적인 검토 요청</div>
                                <div className="question-answer">
                                    <textarea maxLength="300" id="2" placeholder={this.state.msg.question_2_placeholder} onChange={this.handleChangeQuestions}
                                              value={this.state.data.question_2}/>
                                </div>

                                <div className="question-title">3. 계약 경위 등 회원님의 상황 입력</div>
                                <div className="question-answer">
                                    <textarea maxLength="300" id="3" placeholder={this.state.msg.question_3_placeholder} onChange={this.handleChangeQuestions}
                                              value={this.state.data.question_3}/>
                                </div>
                            </div>
                            <div className="form-foot">
                                <div className="legal-wrapper">
                                    <div className="legal">
                                        <label htmlFor="legal_check">
                                            <input id="legal_check" type="checkbox" onClick={this.handleChangeLegalAgree} defaultChecked={this.state.ui.legal_checkbox}/>
                                            검토를 위해 변호사들에게 관련 내용이 제공되고, 로폼은  본 자문내용에 관해 책임이 없음을 확인합니다.
                                        </label>

                                        <div className="legal-link">
                                            <a href="#peer-terms">자세히보기</a>
                                        </div>

                                    </div>

                                    <div className="clearfix"/>
                                </div>
                            </div>
                        </div>

                        <br/><br/><br/>

                        <div className="row text-center">
                            <Paylawyer doc_type="2" service={{ type: 'R' }} iddocument={this.props.document_idx} opener="paylawyer" callback={this.handleClickPay}>
                                <div className="btn btn-default" onClick={this.handleClickRequest}>신청하기</div>
                            </Paylawyer>
                        </div>

                        <br/><br/>

                        <div className="caution-msg">
                            <div className="title">꼭 읽어주세요!</div>
                            <div className="content">
                                <ul>
                                    <li>오후 12시 이전 신청 건은 당일 18시까지, 오후 12시 후 신청 건은 다음날 18시까지 매칭 됩니다.</li>
                                    <li>평균 매칭 소요시간은 업무시간 기준으로 6시간 이내입니다.</li>
                                    <li>매칭이 되지 않은 경우, 재신청 또는 취소하실 수 있습니다.</li>
                                    <li>매칭 완료 시 검토 기간은 최대 2일을 넘지 않으며, 부득이한 사정으로 인해 검토 기간이 길어질 경우 기한 연장 또는 취소가 가능합니다.</li>
                                    <li>신청 후 서비스가 완료 될 때까지 해당문서의 작성 및 수정을 하실 수 없습니다.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <div id="peer-terms" className="white_content">
                    <div className='wrap_learmore'>
                        <div className="legalnotice_x_btn">
                            <a href="#close">
                                {/* <a href="javascript:history.back();"> */}
                                <img src="/autoform_img/x_btn_white.png" width="32" height="32" alt="x_btn"/>
                            </a>
                        </div>
                        <div className='wrap_legalnotice_header'>
                            <div className='legalnotice_header_name'>
                                개인정보 제공동의
                            </div>
                        </div>
                        <div className='wrap_learmore_content' style={{ textAlign: 'justify' }}>
                            본 회사(Amicus Lex) 로폼(LawForm)에서 이루어지는 내용증명, 법률문서, 계약서, 그 외 법률 자문 등(이하 ‘자문 서비스’) 진행을 위한 변호사 직인, 검토, 첨삭, 자문 서비스(이하 ‘본 변호사 자문 서비스’) 와 관련하여, 본 회사는 변호사 회원과 자문 의뢰인인 일반 회원 사이의 원할한
                            자문이 이루어지도록, 시스템과 플랫폼을 설치하여 이에 관한 IT 프로그램을 제공하고 있습니다. 따라서 본 회사(Amicus Lex), 로폼(LawForm)은 변호사 회원과 일반 회원 사이에 이루어지는 자문 서비스 내용에 대해 일체 관여나 특정인을 위한 중개를 하지 않습니다. 그러므로 아미쿠스렉스
                            (Amicus Lex)는 변호사 회원과 일반 회원 사이의 구체적인 상담이나 자문 내용 등 법률 서비스 이용 등에 대한 어떠한 보증이나 책임을 지지 않습니다.
                            <br/><br/>
                            또한 자문 서비스가 원활하게 진행되기 위해서는 일반 회원님이 작성한 최초 내용증명, 법률문서, 계약서 등의 요청 대상 내용과 요청하신 분의 특정을 위해 이에 관련된 일부 개인정보(요청 대상 내용과 개인정보를 합하여 ‘자문 서비스 관련 일반 회원 정보’)가 변호사 회원님에게 제공될 수 밖에 없습니다. 이런 점
                            고려해 일반 회원님이 좌측의 작성된 내용의 변호사 회원에게 제공 동의 클릭을 통해 자문 서비스 관련 일반 회원 정보를 변호사 회원에게 제공되는 것에 동의하신 것을 확인 합니다.
                        </div>
                    </div>
                </div>
            </>

        )
    }
}

export default SidebarLawyerReview
