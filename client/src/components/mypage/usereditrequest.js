import React, { Component, Fragment } from 'react'
// import '../../scss/mypage/userquestion.scss';
// import '../../scss/mypage/questionmodal.scss';
// import '../../scss/common/paging.scss';
import Link from 'next/link'
import User from 'utils/user'
import Api from 'utils/apiutil'
import moment from 'moment'
import Cookies from 'js-cookie'
import { isMobile, isIE } from 'react-device-detect'

class Usereditrequest extends Component {
    constructor (props) {
        super(props)
        this.state = {
            addBtn: false,
            userData: {},
            questionData: [],
            modalIdx: null,
            openIdx: null,
            modalQuestion: null,
            modalKeyIdx: null,
            currentPage: 1,
            pages: 1,
            total: 0,
            per: (!!isMobile) ? 3 : 10
        }

        this.onHandleChange = this.onHandleChange.bind(this)

    }

    componentDidMount () {
        this.pageHandler({ page: 1 })
        this.setState({
            userStatus: 'Y'
        })
    }

    onHandleChange (e) {
        this.setState({
            modalQuestion: e.target.value
        })
    }

    openAnswer (e, idx, index, status) {

        const { openIdx } = this.state

        if (status !== 'Y') {
            if (!!isMobile) alert('답변 처리 중 입니다.')
            return
        }

        if (openIdx === idx) {
            this.closeAnswer()
            return
        }

        this.setState({
            openIdx: idx
        })
    }

    closeAnswer () {
        this.setState({
            openIdx: null
        })
    }

    pageHandler (e) {

        const { per } = this.state
        let offset = 0
        if (e.page > 0) {
            offset = (per * e.page) - per
        }

        const params = {
            limit: per,
            offset: offset
        }

        Api.sendPost('/user/listWriteReview', params).then(res => {
            if (res.data.status === 'ok' && !!res.data.data) {
                let totalCount = res.data.total
                let pages = Math.ceil(totalCount / per)
                this.setState({ questionData: res.data.data, pages: pages, currentPage: e.page, total: totalCount })
            }
        })
    }

    // @todo 파일 다운로더를 만들어야 함
    handleShowFile = (file_url) => {
        if (!file_url) return
        let win = window.open(file_url, '_blank')
        win.focus()
    }

    render () {

        const { pages, total, currentPage, per, questionData } = this.state
        const paging_wrap = { margin: '40px' }

        let paging = []
        for (let i = 1; i < pages + 1; i++) {
            if (currentPage === i) paging.push(<span key={i} className="paging_num"><strong>{i}</strong></span>)
            else paging.push(<span key={i} className="paging_num" style={{ cursor: 'pointer' }} ref={i} onClick={(e) => { this.pageHandler({ page: i }) }}>{i}</span>)
        }

        return (
            <div className="wrap_userfavorite">
                <div className="wrap_writingdoc"></div>
                <div className="mobile total">
                    전체 {(!!this.state.total) ? this.state.total : 0} 건
                </div>
                <table className="table" style={{ width: '93%', margin: '40px auto' }}>
                    <thead>
                    <tr className="point_row point_header">
                        <th className="question_table_cell question_header_1 middle">
                            <span>번호</span>
                        </th>
                        <th className="question_table_cell question_header_2 middle" width='300'>
                            <span>내용</span>
                        </th>
                        <th className="question_table_cell question_header_3 middle">
                            <span>등록일</span>
                        </th>
                        <th className="question_table_cell question_header_4 middle">
                            <span>답변 상태</span>
                        </th>
                        <th className="question_table_cell question_header_4 middle">
                            <span>완료문서<br/>다운로드</span>
                        </th>
                        <th className="question_table_cell question_header_5 middle">
                            <span></span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        questionData.map((item, index) => {

                            let rowNum = (total - (per * (currentPage - 1))) - index
                            return (
                                <Fragment key={index}>
                                    <tr key={index} className="question_row" style={{cursor:'pointer'}} onClick={(e) => this.openAnswer(e, item.idx, index, item.status)}>
                                        <td className="question_table_cell question_content_1 middle idx">
                                            {rowNum}
                                        </td>
                                        <td className="question_table_cell question_content_2 middle">
                                            <span>{item.content}</span>
                                        </td>
                                        <td className="question_table_cell question_content_3 middle">
                                            {
                                                (isMobile && Cookies.get('forceDeskTop') !== 'true') ?
                                                    <span>등록일 : {moment(item.registerdate).format('YYYY년 MM월 DD일')}</span>
                                                    :
                                                    <span>{moment(item.registerdate).format('YYYY.MM.DD')}</span>
                                            }

                                        </td>
                                        <td className="question_table_cell question_content_4 middle">
                                            {(item.status === 'Y') ? <strong style={{ color: '#5373a7' }}>답변완료</strong> : <span>처리 중</span>}
                                        </td>
                                        <td className="question_table_cell question_content_4 middle">
                                            {(item.status === 'Y' && !!item.reply_filename) ? <strong style={{ color: '#5373a7', cursor: 'pointer' }} onClick={() => this.handleShowFile(item.reply_filename)} >다운로드</strong> : <span>-</span>}
                                        </td>
                                        <td className="question_table_cell question_content_5 middle">
                                            <img src="/mypage_img/mobile/icon_2.svg" alt="plus_btn"
                                                 //onClick={(e) => this.openAnswer(e, item.idx, index, item.status)}
                                                 className={(this.state.openIdx === item.idx) ? 'question_hide' : 'question_block'}
                                                 style={{ cursor: 'pointer' }}
                                            />
                                            <img src="/mypage_img/mobile/icon_1.svg"
                                                 alt="minus_btn"
                                                 //onClick={(e) => this.closeAnswer(e)}
                                                 className={(this.state.openIdx === item.idx) ? 'question_block ' : 'question_hide'}
                                                 style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    </tr>

                                    <tr className={(this.state.openIdx === item.idx) ? 'question_contents' : 'question_hide'}>
                                        <td colSpan="6" className="question_table_cell wrap_question_detail middle">
                                            <div className="question_detail">
                                                <div className="q">Q.</div>
                                                <span className='mobile q_mark'>Q.</span>
                                                <div className="q_detail">
                                                    {item.content}
                                                </div>
                                            </div>
                                            {(item.status === 'Y') ?
                                                <div className="question_detail">
                                                    <div className="a">A.</div>
                                                    <span className='mobile a_mark'>A.</span>
                                                    <div className="a_detail" style={{ marginLeft: 15 }}>
                                                        {!!item.reply && item.reply.split('\n').map(function (item, key) {
                                                            return (
                                                                <><span key={key}>{item}</span><br/></>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                : ''
                                            }

                                            {(!!isMobile && item.status === 'Y' && !!item.reply_filename) &&
                                            <div style={{marginTop: 20}}>
                                                <strong style={{ color: '#5373a7', cursor: 'pointer' }} onClick={() => this.handleShowFile(item.reply_filename)} >다운로드</strong>
                                            </div>
                                            }

                                            <div className="question_btn">
                                                {/*<img src="/mypage_img/q_insert_btn.png" className="q_insert_btn" alt="문의수정" style={{ cursor: 'pointer' }}*/}
                                                {/*     onClick={(e) => this.modifyQuestion(item.idx, item.question, index)}/>*/}
                                                {/*<img src="/mypage_img/q_delete_btn.png" className="q_delete_btn" alt="문의삭제" style={{ cursor: 'pointer' }}*/}
                                                {/*    // onClick={(e) => this.deleteQuestion(item.idx) }*/}
                                                {/*     onClick={() => {*/}
                                                {/*         if (window.confirm('삭제하시겠습니까?')) {this.deleteQuestion(item.idx)}*/}

                                                {/*     }}*/}
                                                {/*/>*/}
                                            </div>
                                        </td>

                                    </tr>
                                </Fragment>
                            )


                        })

                    }

                    </tbody>
                </table>

                <div style={paging_wrap}>
                    <div className="paging_wrap">
                        {/* <div className="inline_box">
                            <img src="paging_img/paging_left.png" className="paging_btn" alt="leftpaging_left" />
                        </div> */}
                        <div className="inline_box">
                            {paging}
                        </div>
                        {/* <div className="inline_box">
                            <img src="paging_img/paging_right.png" className="paging_btn" alt="paging_right" />
                        </div> */}
                    </div>
                </div>

            </div>
        )
    }
}

export default Usereditrequest
