import React, { Component } from 'react'
import Link from 'next/link'
import { isIE, isMobile, isEdge } from 'react-device-detect'

// import '../../scss/component/layout.scss'
// import '../../scss/component/table.scss'
// import '../../scss/component/button.scss'
// import '../../scss/component/input.scss'
// import '../../scss/component/align.scss'
// import '../../scss/component/text.scss'
// import '../../scss/component/list.scss'

// import '../../scss/page/doc/toolbar.scss'

import API from '../../utils/apiutil'
import helper_url from '../../helper/helper_url'
import Button from '@material-ui/core/Button'
import Axios from 'axios'
import User from '../../utils/user'

import jQuery from 'jquery'

window.$ = window.jQuery = jQuery
const HOST = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

class Toolbar extends Component {

    constructor (props) {
        super(props)
        let that = this
        let state = {
            surveyRequired: false,
            SurveyDocument: null,
            ui: {
                showeditdoc: '',
                showservice: '',
                title: '',
                shownew: false,
                showsave: false,
                showprint: false,
                showdownload: false,
                showcomplete: false,
                showdescription: false,
                showaccept: false,
                delegate: null,
                type: 1,
                reviewed: false,
                mode: '',
                isMobile: isMobile,
            },
            data: {
                peer_idx: props.writing_peer_review_idx,
                writing_idx: props.writing_idx,
                document_idx: props.document_idx,
                category_idx: props.category_idx,
                processing_status: 0,
                new_completed: '',
            },
            msg: {
                save_complete: '저장 되었습니다!',
                accepted: '요청 수락 완료 하셨습니다',
                error_save: '저장 중에 문제가 발생 했습니다. 계속 발생하면 로폼 고객센터로 전화해주세요',
                new_not_available: '새로 작성 기능은 문서 작성 서비스에서 이용할 수 있습니다.',
                save_not_available: '저장하기 기능은 문서 작성 서비스에서 이용할 수 있습니다.',
            }
        }

        // get ui config params
        for (let key in props) if (key in state.ui) state.ui[key] = props[key]

        // get data config params
        for (let key in props) if (key in state.data) state.data[key] = props[key]

        // save state
        this.state = state

        if (typeof state.data.peer_idx !== 'undefined') {

            API.sendPost(helper_url.api.writing_peer.get, { peer_idx: state.data.peer_idx }).then((result) => {
                if (!result.data.data.status) {
                    alert('잘못된 접근입니다.')
                    window.location.href = '/mydocument'
                    return
                }

                if (result.status === 'ok') {
                    state.ui.type = result.data.data.request_type
                    state.ui.reviewed = (result.data.data.review_idx !== null)
                    state.data.processing_status = result.data.data.processing_status
                    state.data.new_completed = (result.data.data.processing_status === 3) ? result.data.data.user_check_new_document : 'N'
                    state.data.data = result.data.data
                    state.data.apply_end_date_time = result.data.data.apply_end_date_time
                    state.data.status = result.data.data.status
                } else {
                    state.ui.status = 'error'
                    alert(state.msg.request_error)
                }
                that.setState(state)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    /* *****************************************************************************
     *  handleClicks
     * *****************************************************************************/

    handleNew = evt => {
        if (this.state.ui.mode === 'revision') {
            alert(this.state.msg.new_not_available)
            return
        }

        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('save')
    }

    handleSave = evt => {
        if (this.state.ui.mode === 'revision' || typeof this.state.data.peer_idx === 'undefined') {
            alert(this.state.msg.save_not_available)
            return
        }

        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('save')
    }

    handleComplete = evt => {
        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('complete')
    }

    handleAccept = evt => {
        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('accept')
    }

    handleMoveWriteDoc = () => {

        if (typeof this.state.data.peer_idx !== 'undefined') {
            let a4_html = window.$('.page > .autoform_output_a4').html()
            let html = {
                html: a4_html,
                idwriting: this.state.data.data.writing_idx,
                iddocuments: this.state.data.data.document_idx,
                idcategory_1: this.state.data.data.category_idx,
                bindData: this.state.data.data.binddata,
                filePrefix: 'peer'
            }

            API.sendPost('/print/createpdf', html).then(res => {
                return res.data.data
            }).then((pdf) => {
                API.sendPost('/writing/writingdata/', {
                    bindData: this.state.data.data.binddata,
                    document: this.state.data.data.document_idx,
                    file: pdf
                }).then((res) => {
                    if (res.status !== 'ok') throw new Error('error')
                    window.alert('변호사 문서 저장이 완료되었습니다.')
                }).catch((err) => {
                    window.alert('저장에 실패 하였습니다.')
                })
            })

            return
        }

        alert(this.state.msg.save_not_available)

        // if (!!window.confirm('해당기능은 문서작성 서비스에서 이용할 수 있습니다.\n이동 하시겠습니까?')) {
        //     window.location = helper_url.service.autoform + this.props.writing_idx
        //
        // }
    }

    handleTempSaveLawyerContents = () => {
        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('tempSave')
    }

    // handleService = evt => {
    //     var state = this.state
    //     API.sendPost(helper_url.api.user.update_new_completed, { 'new_completed: 1 }).then((result) => {
    //         if (result.status === 'ok') {
    //             state.data.new_completed = 1
    //             this.setState(state)
    //         }
    //     })
    // }

    handleService = () => {
        const state = this.state
        if (state.data.processing_status === 3 && !!state.data.data.file_name) {
            API.sendPost(helper_url.api.writing_peer.user_check_complete, { peer_idx: this.state.data.peer_idx }).then((result) => {
                if (result.status === 'ok') {
                    state.data.new_completed = 'Y'
                    this.setState(state)
                }
            })
        }
    }

    handleWriteDoc = evt => {
        if (this.state.ui.delegate !== null)
            this.state.ui.delegate.callback('writedoc')
    }

    checkFirstSurvey = () => {
        API.sendPost('/event/checkSurvey').then((res) => {
            //console.log('checkFirstSurvey', res)
            if (res.status === 'ok') {
                if (res.data.data.result === 'N') {
                    this.setState({
                        surveyRequired: true,
                        SurveyDocument: res.data.data.idwriting
                    })
                }
            }
        })
    }

    handleViewPDF = (action = 'D') => {

        let writing_idx = this.props.writing_idx
        let file = ''
        let title = ''

        API.sendGet(helper_url.api.writing.download, {
            idwriting: writing_idx,
            peer: true
        }).then((res) => {

            file = res.data.data.savedFile || null
            title = (res.data.data.title || null) + ' - 변호사'

            if (file === null || file === 'nofile') {
                alert('문서가 아직 업로드 되지 않았습니다.')
                return
            }

            if (file === 'saving') {
                alert('문서 저장 중입니다. 잠시 후에 다시 시도해주십시오.')
                return
            }

            if(!/\.(pdf|docx|doc)$/i.test(file)) {
                alert('허용되지 않은 다운로드 파일 형식입니다. 관리자에게 문의하여 주십시오.')
                return
            }

            let printUrl = (file.indexOf('https://lawform.s3.ap-northeast-2.amazonaws.com') > -1) ? file : '/print/' + file

            // 로컬 테스트용
            if (HOST === 'http://localhost' || HOST === 'http://127.0.0.1') {
                //printUrl = printUrl.replace('https://', 'http://')
                printUrl = '/print/20200831121335.docx'
                //printUrl = '/print/1599621326.pdf'
            }

            let lastDot = printUrl.lastIndexOf('.')
            let fileExt = printUrl.substring(lastDot + 1, file.length)
            console.log('fileExt', fileExt)

            // vnd.openxmlformats-officedocument.wordprocessingml.document
            // msword
            const blobType = (fileExt === 'pdf') ? 'application/pdf' : 'vnd.openxmlformats-officedocument.wordprocessingml.document'

            Axios({
                url: printUrl,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {

                let blob = new Blob([response.data], { type: blobType })
                let blobURL = URL.createObjectURL(blob)
                let fileName = title + '.' + fileExt

                if (action === 'D') {

                    if (!!isIE) {
                        window.navigator.msSaveOrOpenBlob(blob, fileName)
                        return
                    }

                    let downloadLink = document.createElement('a')
                    downloadLink.setAttribute('download', fileName)
                    downloadLink.setAttribute('href', blobURL)
                    downloadLink.click()
                    return
                }

                if (action === 'P' && fileExt !== 'pdf') {
                    alert('MS-WORD 파일은 브라우저 프린트를 지원하지 않습니다.\n다운로드 하시고 프린트 부탁드립니다. ')
                    return
                }

                let frame = window.document.querySelector('#pdf-frame')
                frame.setAttribute('src', blobURL)

                setTimeout(() => {
                    if (!!isEdge || !!isIE) {
                        frame.contentWindow.document.execCommand('print', true, null)
                    } else {
                        frame.contentWindow.print()
                    }
                }, 500)

            }).catch((err) => {
                console.log('response', err)
                alert('파일이 존재하지 않습니다.')
            })
        })
    }

    componentDidMount () {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('비정상적인 접근입니다.')
            window.location.href = '/'
        }


        this.checkFirstSurvey()
    }

    render () {

        //console.log(this.state.data)
        return (
            <div className="doc-toolbar wrap_autoform_save">
                <iframe id="pdf-frame" style={{ display: 'none' }}></iframe>
                <div className="toolbar-menu">
                    {(!this.state.ui.isMobile && this.state.ui.title !== '' && this.state.ui.mode !== 'revision') && <div className="menu-item title">{this.state.ui.title}</div>}
                    {(this.state.ui.isMobile && this.state.ui.mode !== 'revision') && <div className="menu-item title" onClick={() => {window.history.back()}}>뒤로가기</div>}

                    {(!!this.state.ui.showeditdoc) &&
                    <div className="menu-item menu-item-with-btn" onClick={this.handleWriteDoc}>
                        <div className="btn btn-white-blue">문서 작성</div>
                    </div>
                    }

                    {(!!this.state.ui.showservice) &&
                    <div className="menu-item menu-item-with-btn" onClick={this.handleService}>
                        <div className="btn btn-default">
                            {(this.state.ui.type === 1) ? '변호사 직인 요청' : '변호사 검토 요청'}
                        </div>
                        {this.state.data.processing_status === 3 && !!this.state.data.data.file_name && this.state.data.new_completed === 'N' ? <div className="new-alert-msg">N</div> : null}
                    </div>
                    }

                    {(!!this.state.ui.showcomplete) &&
                    <div className="menu-item menu-item-with-btn">
                        <div className="btn btn-white-blue" style={{ marginRight: 5 }} disabled={(this.state.data.processing_status !== 2)} onClick={this.handleComplete}>최종 검토완료</div>
                        <div className="btn btn-dark" disabled={(this.state.data.processing_status !== 2)} onClick={this.handleTempSaveLawyerContents}>저장하기</div>
                    </div>
                    }

                    {/* @todo 버튼 감추기 요청
                    {(this.state.ui.showaccept !== '') &&
                        <div className="menu-item menu-item-with-btn">
                            <div className="btn btn-white-blue" onClick={this.handleAccept}>요청 수락</div>
                        </div>
                    }*/}
                </div>

                <div className="buttons mobile_hide" style={{ marginLeft: 55 }}>
                    {(!!this.state.ui.shownew) &&
                    <Button onClick={this.handleSave} disabled={true}>
                        새로작성 <img src="/autoform_img/icon-new.svg" alt="새로작성 아이콘"/>
                    </Button>
                    }

                    {(!!this.state.ui.showsave) && <>
                        <Button onClick={this.handleSave} disabled={true}>
                            편집하기 <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘"/>
                        </Button>
                        <Button onClick={this.handleMoveWriteDoc} disabled={(this.state.data.processing_status !== 3)}>
                            저장하기 <img src="/autoform_img/icon-save.svg" alt="저장하기 아이콘"/>
                        </Button>
                    </>}

                    {(!!this.state.ui.showprint && !this.state.ui.isMobile) &&
                    <Button onClick={() => this.handleViewPDF('P')} disabled={(this.state.data.processing_status !== 3)}>
                        인쇄하기 <img src="/autoform_img/icon-print.svg" alt="인쇄하기 아이콘"/>
                    </Button>
                    }

                    {(!!this.state.ui.showdownload && !this.state.ui.isMobile) &&
                    <Button onClick={() => this.handleViewPDF()} disabled={(this.state.data.processing_status !== 3)}>
                        다운로드 <img src="/autoform_img/icon-download.svg" alt="다운로드 아이콘"/>
                    </Button>
                    }
                </div>

                <div className="toolbar-option">
                    {(!!this.state.ui.showdescription) &&
                    <div className="option">
                        <div className="btn btn-default">
                            문서 상세설명
                            <div className="ballon">
                                <div className="pivot"/>
                                <div className="pivot-inner"/>
                                문서에 대한 자세한 내용을<br/>확인해보세요
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        )

        {/*<div>
                <div className="doc-toolbar">
                    <div className="toolbar-menu">
                        {this.state.ui.title !== "" && this.state.ui.mode !== "revision" ? (
                            <div className="menu-item title">{this.state.ui.title}</div>
                        ) : null}

                        {this.state.ui.showeditdoc !== "" ? (
                            <div className="menu-item menu-item-with-btn" onClick={this.handleWriteDoc}>
                                <div className="btn btn-white-blue">문서 작성</div>
                            </div>
                            ) : null}

                        {this.state.ui.showservice !== "" ? (
                            <div className="menu-item menu-item-with-btn" onClick={this.handleService}>
                                <div className="btn btn-default">
                                    {this.state.ui.type == '1' ? '변호사 직인 서비스' : '변호사 검토 서비스'}
                                </div>
                                {this.state.data.new_completed == 2 ? <div className="new-alert-msg">N</div> : null}
                            </div>
                        ): null}

                        {this.state.ui.shownew !== "" ? (
                            <div className="menu-item" onClick={this.handleNew}>
                                새로작성<img src="/autoform_img/icon-new.svg" alt={''}/>
                            </div>
                            ) : null}

                        {this.state.ui.showsave !== "" ? (
                            <div className="menu-item" onClick={this.handleSave}>
                                저장하기<img src="/autoform_img/icon-save.svg" alt={''}/>
                            </div>
                            ) : null}

                        {this.state.ui.showprint !== "" ? (
                            <div className="menu-item" disabled={!this.state.ui.reviewed && this.state.ui.mode === "revision"}>
                                인쇄하기<img src="/autoform_img/icon-print.svg"/>
                            </div>
                            ) : null}

                        {this.state.ui.showdownload !== "" ? (
                            <div className="menu-item" disabled={!this.state.ui.reviewed && this.state.ui.mode === "revision"}>
                                다운로드<img src="/autoform_img/icon-download.svg"/>
                            </div>
                            ) : null}

                        {this.state.ui.showcomplete !== "" ? (
                            <div className="menu-item" onClick={this.handleComplete}>
                                최종검토완료
                            </div>
                            ) : null}

                        {this.state.ui.showaccept !== "" ? (
                            <div className="menu-item menu-item-with-btn">
                                <div className="btn btn-white-blue" onClick={this.handleAccept}>요청 수락</div>
                            </div>
                            ) : null}
                    </div>

                    <div className="toolbar-option">
                        {this.state.ui.showdescription !== "" ? (
                            <div className="option">
                                <div className="btn btn-default">
                                    문서 상세설명
                                    <div className="ballon">
                                        <div className="pivot"/>
                                        <div className="pivot-inner"/>
                                        문서에 대한 자세한 내용을<br/>확인해보세요
                                    </div>
                                </div>
                            </div>
                            ) : null}
                    </div>
                </div>
            </div>*/
        }
    }
}

export default Toolbar
