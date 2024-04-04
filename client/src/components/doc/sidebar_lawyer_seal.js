import React, { Component } from 'react'
import Link from 'next/link'

// import '../../scss/page/doc/sidebar.scss'

import AlertPopPricing from './alert_pop_pricing'
import API from 'utils/apiutil'
import helper_url from 'helper/helper_url'

import Paylawyer from 'components/common/paylawyer'
import LegalNotice from 'components/common/legalnotice'
import ReactGA from 'react-ga'

class SidebarLawyerSeal extends Component {

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
                'question_1_len': 0,
                'question_2': '',
                'question_3': '',
                'request_type': '1'
            },
            'msg': {
                'question_1_error': '변호사가 참고 할 내용 입력해주세요',
                'question_1_placeholder': '300자 이내로 작성해주세요.\n\n예시) 내용 추가를 요청하는 경우\n수신인한테 대여금 변제요청을 했는데, 오히려 협박문자로 발신인의 신변을 위협하고 있습니다. 이런 내용을 넣고 싶습니다.',
                'legal_checkbox_error': '작성한 내용 제공 동의에 동의해주세요',
                'purchase_complete': '변호사 직인 신청이 완료되었습니다.\n검토가 완료 되면 문자로 안내드리겠습니다.',
                'purchase_error': '신청 중 문제가 생겼습니다. 잠시 후 다시 신청 해주세요.'
            }
        }
    }

    // componentWillReceiveProps (nextProps) {
    //     console.log( "props receive",nextProps )
    //     let state = this.state
    //     if ('writing_idx' in nextProps) state.data.writing_idx = props['writing_idx']
    //     if ('document_idx' in nextProps) state.data.document_idx = props['document_idx']
    //     if ('category_idx' in nextProps) state.data.category_idx = props['category_idx']
    //     this.setState(state)
    // }

    /* *****************************************************************************
     *  handleChanges
     * *****************************************************************************/

    handleChangeQuestions = evt => {
        let state = this.state
        let maxLength = 300
        let curTextLength = evt.target.value.length

        state.data[`question_${evt.target.id}`] = evt.target.value
        state.data[`question_${evt.target.id}_len`] = curTextLength

        if (curTextLength > maxLength) {
            state.data[`question_${evt.target.id}`] = evt.target.value.substr(0, maxLength)
        }

        this.setState(state)
    }

    handleChangeLegalAgree = () => {
        let state = this.state
        state.ui.legal_checkbox = !state.ui.legal_checkbox
        this.setState(state)
    }

    /* *****************************************************************************
     *  handleClicks
     * *****************************************************************************/

    handleClickTogglePopupPricing = () => {
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

    /* *****************************************************************************
     *  render
     * *****************************************************************************/

    render () {
        let that = this
        return (
            <>
                <div className="sidebar">
                    {(!!this.state.ui.show_price) && <AlertPopPricing parent={that} type="1"/>}
                    <div className="sidebar-container">
                        <div className="panel-form">
                            <div className="form-head">
                                <div className="title">변호사 직인 서비스란?</div>
                                <div className="option">
                                    <div className="option-item" onClick={this.handleClickTogglePopupPricing}>요금안내</div>
                                </div>
                            </div>
                            <div className="form-body">
                                <ul className="pie-join">
                                    <li>내용증명의 발신인이 변호사 명의로 진행되는 서비스입니다.</li>
                                    <li>회원은 변호사에게 내용증명의 발신을 위임한 발신위임인이 됩니다.</li>
                                    <li>내용 변경이나 검토하고 싶은 사항은 아래 서비스 신청란에 적어주세요.</li>
                                    <li>서비스를 요청하면 변호사님께서 문서를 검토하여 특별히 법적으로 문제가 없는 경우 변호사님이 발신인으로서 직인을 추가해드립니다.</li>
                                    <li>본 서비스는 발송을 대행하지 않습니다.</li>
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
                                <div className="title">서비스 신청</div>
                            </div>
                            <div className="form-body">
                                <div className="question-title">- 변호사가 해당 내용을 읽고 문서 검토 시 참고 합니다.</div>
                                <div className="question-answer">
                                    <textarea maxLength="300" id="1" placeholder={this.state.msg.question_1_placeholder} onChange={this.handleChangeQuestions} value={this.state.data.question_1}/>
                                </div>
                            </div>
                            <div className="form-foot">
                                <div className="legal-wrapper">
                                    <div className="legal">
                                        <label htmlFor="legal_check">
                                            <input id="legal_check" type="checkbox" onClick={this.handleChangeLegalAgree} defaultChecked={this.state.ui.legal_checkbox}/>
                                            검토를 위해 변호사들에게 작성한 내용이 제공 되는 것에 등의합니다.
                                        </label>
                                    </div>
                                    <div className="legal-link">
                                        <a href="#peer-terms">자세히보기</a>
                                    </div>
                                    <div className="clearfix"/>
                                </div>
                            </div>
                        </div>

                        <br/><br/>
                        <div className="row text-center">
                            <Paylawyer doc_type="1" service={{ type: 'S' }} iddocument={this.props.document_idx} opener="paylawyer" callback={this.handleClickPay}>
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

export default SidebarLawyerSeal
