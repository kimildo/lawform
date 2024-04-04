import React, { Component, Fragment } from 'react'
// import '../../scss/autoform/autoformsave.scss'
import API from '../../utils/apiutil'
import axios from 'axios'
import User from '../../utils/user'
import { withAutoformContext } from '../../contexts/autoform'
import jQuery from 'jquery'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Survey from '../mypage/survey'
// import '../../scss/page/doc/toolbar.scss'
import helper_url from '../../helper/helper_url'
import Modal from '../common/modal'
import ReactGA from 'react-ga'
import { isIE, isEdge, isMobile } from 'react-device-detect'

window.$ = window.jQuery = jQuery

class AutoformTitle extends Component {

    userInfo = User.getInfo()
    
    constructor (props) {
        super(props)
        this.state = {
            alertEdit: false,
            alertSave: false,
            alertNew: false,
            surveyRequired: false,
            SurveyDocument: null,
            openSurvey: false,
            iddocuments: null,
            isNotEditable: false,
            new_completed: 'N',
            showReviewWrite: false,
            reviewContent: '',
            reviewEmail: ''
        }

        this.props.setBindData()
    }

    updateServer (document) {
        if (!((window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && document === 'dropfile')) {
            API.sendGet('/writing/loadinfo/' + document)
                .then(res => {
                    const documentData = res.data
                    if (documentData[0] == null) {
                        alert('비정상적인 접근입니다.')
                        window.location.href = '/'
                    }
                    if (documentData[0].sysdate > documentData[0].expiredate) {
                        alert('만료기간이 지났습니다.')
                        window.location.href = '/mydocument'
                    }
                    this.setState({
                        docuData: documentData,
                        new_complete: documentData[0].user_check_new_document,
                        isNotEditable: (!!documentData[0].writing_peer_idx && documentData[0].writing_peer_processing_status !== 3)
                    })
                    //console.log('documentData', documentData)
                    //console.log(this.state.new_complete)
                })
        }
    }

    surveyComplete = () => {
        this.setState({
            surveyRequired: false,
            SurveyDocument: null,
            openSurvey: false
        })
    }

    surveyClose = () => {
        this.setState({
            openSurvey: false
        })
    }

    checkFirstSurvey () {
        API.sendPost('/event/checkSurvey').then((res) => {
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

    componentDidMount () {

        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        } else {
            this.setState({reviewEmail:userInfo.email})
        }

        this.updateServer(this.props.document)
        this.checkFirstSurvey()
    }

    saveData = () => {

        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        }

        //console.log(this.state.docuData)
        //console.log(this.state.isNotEditable)
        if (!!this.state.isNotEditable) {
            alert('변호사 첨삭중인 문서는 수정할 수 없습니다.')
            return
        }

        if (this.props.btnEditable === 'true') {
            alert('문서편집을 종료한 후 저장해주세요.')
            return
        }

        this.saveDataProccess().then((res) => {
            if (true === res) {
                if (true === (window.confirm('저장이 완료 되었습니다. 내 문서 보관함으로 이동 하시겠습니까?'))) {
                    window.location.href = '/mydocument'
                }
                return
            }

            window.alert('저장에 실패 하였습니다.')
        })
    }

    saveDataProccess = () => {

        let that = this
        return new Promise(function (resolve, reject) {
            let checklist = []
            if (!!that.props.necessaryData) {
                let check_target = []
                for (let i = 0; i < that.props.necessaryData.length; i++) {
                    if (!that.props.bindData[that.props.necessaryData[i]]) {
                        checklist.push(that.props.necessaryData[i])
                    } else {
                        check_target = document.getElementsByName(that.props.necessaryData[i])
                        if (check_target[0].type === 'text') {
                            check_target[0].parentElement.parentElement.style.border = 'solid #878d91 1px'
                            check_target[0].style.border = 'solid #878d91 0px'
                        }
                    }
                }

                let target = document.getElementsByName(checklist[0])
                if (target && target.length > 0) {
                    if (target[0].type === 'text') {
                        target[0].parentElement.parentElement.style.border = 'solid red 1px'
                    } else {
                        target[0].style.border = 'solid red 1px'
                    }
                    target[0].focus()
                    alert('필수항목을 입력해주세요!')
                    return reject()
                }
            }

            if (!checklist[0]) {
                let document = that.props.document
                let params = {
                    bindData: that.props.bindData,
                    document: document
                }
                let a4_html = window.$('#output_a4').html()
                let html = {
                    html: a4_html,
                    idwriting: document,
                    iddocuments: that.state.docuData[0].iddocuments,
                    idcategory_1: that.state.docuData[0].idcategory_1,
                    bindData: that.props.bindData
                }

                API.sendPost('/print/createpdf', html).then(res => {
                    return res.data.data
                }).then((pdf) => {
                    params.file = pdf
                    API.sendPost('/writing/writingdata/', params).then((res) => {
                        if (res.status !== 'ok') throw new Error('error')
                        return resolve(true)
                    }).catch((err) => {
                        return reject(err)
                    })
                })
            }
        })
    }

    getPdf = (action = 'D') => {
        const isIE = this.isIE()
        const isEdge = this.isEdge()
        let that = this
        
        if (this.state.SurveyDocument === Number(this.props.document) && this.state.surveyRequired === true) {
            this.setState({ openSurvey: true })
            return
        }
        return new Promise(function (resolve, reject) {
            let checklist = []
            if (!!that.props.necessaryData) {
                let check_target = []
                for (let i = 0; i < that.props.necessaryData.length; i++) {
                    if (!that.props.bindData[that.props.necessaryData[i]]) {
                        checklist.push(that.props.necessaryData[i])
                    } else {
                        check_target = document.getElementsByName(that.props.necessaryData[i])
                        if (check_target[0].type === 'text') {
                            check_target[0].parentElement.parentElement.style.border = 'solid #878d91 1px'
                            check_target[0].style.border = 'solid #878d91 0px'
                        }
                    }
                }

                let target = document.getElementsByName(checklist[0])
                if (target && target.length > 0) {
                    if (target[0].type === 'text') {
                        target[0].parentElement.parentElement.style.border = 'solid red 1px'
                    } else {
                        target[0].style.border = 'solid red 1px'
                    }
                    target[0].focus()
                    alert('필수항목을 입력해주세요!')
                    return reject()
                }
            }
            if (!checklist[0]) {
                let html = window.$('#output_a4').html()
                let title = window.$('#output_a4 > .autoform_output_title').text()
                if (!!that.props.templateData.title) title = that.props.templateData.title
                API.postBlob('/print/getPdf', { html: html, idcategory_1: that.state.docuData[0].idcategory_1, title: title })
                    .then(res => {
                        if (action === 'D') {
                            if (!isIE) {
                                const url = window.URL.createObjectURL(new Blob([res.data]))
                                const link = document.createElement('a')
                                link.href = url
                                link.setAttribute('download', title + '.pdf')
                                document.body.appendChild(link)
                                link.click()
                            } else {
                                window.navigator.msSaveOrOpenBlob(res.data, title + '.pdf')
                            }
                        } else {
                            if (!isEdge) {
                                setTimeout(() => {
                                    var file = new Blob([res.data], { type: 'application/pdf' })
                                    var fileURL = URL.createObjectURL(file)
                                    var windowOpen = window.open(fileURL, title, 'height=680,width=800')
                                    windowOpen.print()
                                    return false
                                }, 100)
                            } else {
                                window.navigator.msSaveOrOpenBlob(res.data, title + '.pdf')
                            }
                        }
                    })
            }
        })
    }

    viewPDF (action = 'D') {

        const isIE = this.isIE()
        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        }

        if (this.state.SurveyDocument === Number(this.props.document) && this.state.surveyRequired === true) {
            this.setState({ openSurvey: true })
            return
        }

        let params = {
            idwriting: this.props.document
        }

        let file = '', title = ''
        API.sendGet('/writing/download', params).then((res) => {
            file = res.data.data.savedFile
            title = res.data.data.title
            if (file === null || file === 'nofile') {
                alert('문서 저장 후에 이용해주세요.')
                return
            }

            if (file === 'saving') {
                alert('문서 저장 중입니다. 잠시 후에 다시 시도해주십시오.')
                return
            }

            const printUrl = '/print/' + file
            axios({
                url: printUrl,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                if (action === 'D' && !isIE) {
                    const link = window.document.createElement('a')
                    link.href = window.URL.createObjectURL(new Blob([response.data]))
                    link.setAttribute('download', title + '.pdf')
                    window.document.body.appendChild(link)
                    link.click()
                } else {
                    setTimeout(() => {
                        let printWindow = window.open(printUrl, title, 'height=680,width=800')
                    }, 100)
                }
            }).catch((err) => {
                console.log('response', err)
                alert('파일이 존재하지 않습니다. 저장하기 먼저해주세요.')
            })

        })
    }

    editClear () {

        if (!!this.state.isNotEditable) {
            alert('변호사 첨삭중인 문서는 수정할 수 없습니다.')
            return
        }

        if (window.confirm('수정된 내용을 취소하시겠습니까?.') === true) {
            // this.props.getDocData( this.props.document );
            window.location.reload()
        }
    }

    editHandler () {

        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        }

        if (!!this.state.isNotEditable) {
            alert('변호사 첨삭중인 문서는 수정할 수 없습니다.')
            return
        }

        let checklist = []
        if (!!this.props.necessaryData) {
            let check_target = []
            for (let i = 0; i < this.props.necessaryData.length; i++) {
                if (!this.props.bindData[this.props.necessaryData[i]]) {
                    checklist.push(this.props.necessaryData[i])
                } else {
                    check_target = document.getElementsByName(this.props.necessaryData[i])
                    if (check_target[0].type === 'text') {
                        check_target[0].parentElement.parentElement.style.border = 'solid #878d91 1px'
                        check_target[0].style.border = 'solid #878d91 0px'
                    }
                }
            }
            let target = document.getElementsByName(checklist[0])
            if (target && target.length > 0) {
                if (target[0].type === 'text') {
                    target[0].parentElement.parentElement.style.border = 'solid red 1px'
                } else {
                    target[0].style.border = 'solid red 1px'
                }
                target[0].focus()
                alert('필수항목을 입력해주세요!')
                return false
            }
        }

        if (this.props.inputStatus === 'enable') {
            this.setState({
                alertEdit: true
            })
        } else {
            if (this.props.btnEditable === 'true') {
                if (window.confirm('변경된 내용으로 저장하시겠습니까?') === true) this.props.setEditable()
                // this.setState({
                //     alertSave:true
                // })
            } else {
                this.props.setEditable()

            }
        }
    }

    setClearDoc = () => {

        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        }

        if (!!this.state.isNotEditable) {
            alert('변호사 첨삭중인 문서는 수정할 수 없습니다.')
            return
        }

        if (window.confirm('문서를 새로 작성하시겠습니까?\n새로작성 하시는 경우 기존 문서는 저장되지 않습니다') === true) {
            let params = {
                bindData: null,
                document: this.props.document,
                file: 'nofile'
            }
            API.sendPost('/writing/writingdata/', params).then((res) => {
                if (res.status === 'ok') {
                    API.sendPost('/writing/useredit/', { idwriting: this.props.document, content: null }).then((r) => {
                        if (r.status === 'ok') {
                            window.location.reload()
                        }
                    })
                }
            })
        }
    }

    handleService = (url, idx = 0, check_update= true) => {

        const userInfo = this.userInfo
        if (!userInfo) {
            alert('로그인 후 이용해 주세요.')
            window.location.href = '/'
            return
        }

        if (!url) {
            alert('문서를 작성하신 후 이용해 주시기 바랍니다.')
            return
        }

        if (!!idx) {
            if (!!check_update) {
                API.sendPost(helper_url.api.writing_peer.user_check_complete, { 'peer_idx': idx }).then((result) => {
                    if (result.status === 'ok') {
                        this.setState({
                            new_completed: 'Y'
                        })
                        window.location.href = url
                    }
                })
            } else {
                window.location.href = url
            }

        } else {
            if (!!window.confirm('현재까지 작성한 내용으로 변호사님에게 요청 됩니다.\n계속 진행하시겠습니까?')) {
                this.saveDataProccess().then((res) => {
                    if (true === res) {
                        window.location.href = url
                    } else {
                        window.alert('저장에 실패 하였습니다.')
                    }
                })
            }
        }

    }

    reviewRequest ( status ) {
        if( status === true ) {
            ReactGA.ga('send', 'pageview', window.location.pathname + '#reviewRequest')
            this.setState({
                showReviewWrite: true
            })
        } else {
            this.setState({
                showReviewWrite: false,
                reviewContent:"",
            })
        }

    }

    reviewEmail (e) {
        this.setState({
            reviewEmail: e.target.value
        })
    }

    reviewContent (e) {
        this.setState({
            reviewContent: e.target.value
        })
    }

    processReviewRequest () {
        if (this.state.reviewEmail === '') {
            alert('잘못된 요청입니다.')
            return false
        }
        let params = {
            email: this.state.reviewEmail,
            idwriting: this.props.document,
            content: this.state.reviewContent
        }

        API.sendPost('/writing/review', params).then((result) => {
            if (result.status === 'ok') {
                alert('편집요청이 완료되었습니다.')
                this.reviewRequest ( false )
                return true
            } else {
                alert('요청을 처리할 수 없습니다. 잠시 후에 이용해주세요.')
                return false
            }
        })

    }

    isIE () {
        return isIE
    }

    isEdge () {
        return isEdge
    }

    render () {

        const { docuData } = this.state
        const userInfo = this.userInfo
        const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'
        //let showPeerButton = (host !== 'https://lawform.io')
        let showPeerButton = true

        if (!!docuData) {

            // 변호사 검토 버튼
            let peerLinkButton = null
            let peerLinkUrl = null
            let peerLinkText = '변호사 직인 서비스'
            let peerBarText = ''
            let rowData = docuData[0]

            // console.log('rowData', rowData)
            // console.log('new_completed', this.state.new_completed)
            // !rowData.emptybindata &&
            if ((rowData.idcategory_1 === 1 || ((rowData.idcategory_1 === 99 || rowData.idcategory_1 === 4) && showPeerButton === true)) && userInfo.account_type !== 'A') {

                peerLinkUrl = ((rowData.idcategory_1 === 1) ? helper_url.service.doc.review_seal : helper_url.service.doc.review_request) + rowData.idwriting
                peerLinkText = (rowData.idcategory_1 === 1) ? '변호사 직인요청' : '변호사 검토요청'

                if (!!rowData.emptybindata) {
                    peerLinkUrl = null
                }

                if (!!rowData.writing_peer_idx) {
                    peerLinkUrl = helper_url.service.doc.revision + rowData.idwriting + '/' + rowData.writing_peer_idx + '/'
                    peerLinkText = (rowData.idcategory_1 === 1) ? '변호사 직인 서비스' : '변호사 검토 서비스'
                    peerBarText = (rowData.writing_peer_processing_status !== 3)
                        ? <div style={{ paddingTop: 5 }}>변호사 검토 및 직인 완료되기 전까지 문서 작성 및 수정이 제한 됩니다.</div>
                        : (this.state.new_completed === 'N') ? (
                            <div>
                                <div style={{ display: 'inline-block' }}>요청하신 문서 검토 및 직인이 완료 되었습니다. 완료된 문서를 확인해보세요.</div>
                                <div style={{ display: 'inline-block', marginLeft: 10, marginBottom: 5 }} className="btn btn-white-blue"
                                     onClick={() => this.handleService(peerLinkUrl, rowData.writing_peer_idx)}>
                                    확인하기
                                </div>
                            </div>
                        ) : ''
                }

                peerLinkButton = <div style={{ marginLeft: 10 }} className="btn btn-white-blue" onClick={() => this.handleService(peerLinkUrl, rowData.writing_peer_idx, (rowData.writing_peer_processing_status === 3))}>
                    {peerLinkText}
                </div>
            }

            //console.log('rowData', rowData)

            return (
                <div className="wrap_autoform_save">
                    <Survey open={this.state.openSurvey} close={this.surveyClose} onComplete={this.surveyComplete}/>

                    {(!!rowData.writing_peer_idx && rowData.user_check_new_document === 'N' && !isMobile) &&
                    <div className={'peer-new-bar'}>
                        {(this.state.new_completed === 'N' && rowData.writing_peer_processing_status === 3) && <div className={'new-alert-icon'}>N</div>}
                        {!!peerBarText &&
                        <div className={'new-alert-bar'}>
                            <div className={'new-alert-bar-contents'}>{peerBarText}</div>
                        </div>
                        }
                    </div>
                    }

                    <Dialog
                        open={this.state.alertEdit}
                        onClose={(e) => this.setState({ alertEdit: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_edit"
                        scroll="body"
                    >
                        <DialogTitle id="confirmation-dialog-title">문서 편집</DialogTitle>
                        <label><img src="/autoform_img/v-check.svg" alt={'꼭 읽어 주세요'}/>꼭 읽어 주세요!</label>
                        <ul>
                            <li>문서 편집은 오른쪽에 자동으로 완성된 내용을<br/> 수정 및 편집할 수 있는 기능입니다.</li>
                            <li>문서 편집 기능을 이용한 이후에는,<br/> 좌측 질문지에 더 이상 입력할 수 없습니다.</li>
                            <li>문서 편집 기능은 좌측의 입력을 완료한 이후<br/> 이용할 것을 권장 드립니다.</li>
                        </ul>
                        <DialogActions className="buttons">
                            <Button
                                onClick={(e) => this.setState({ alertEdit: false })}
                                color="primary"
                                className="cancel">
                                취소
                            </Button>
                            <Button
                                onClick={(e) => {
                                    this.props.setEditable()
                                    this.setState({ alertEdit: false })
                                }}
                                color="primary"
                                className="ok">
                                편집하기
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.alertSave}
                        onClose={(e) => this.setState({ alertSave: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_save"
                        scroll="body"
                    >
                        <div>변경된 내용으로 저장하시겠습니까?</div>
                        <DialogActions className="buttons">
                            <Button
                                onClick={(e) => this.setState({ alertSave: false })}
                                color="primary"
                                className="cancel">
                                아니오
                            </Button>
                            <Button
                                onClick={(e) => {
                                    this.props.setEditable()
                                    this.setState({ alertSave: false })
                                }}
                                color="primary"
                                className="ok">
                                네
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.alertNew}
                        onClose={(e) => this.setState({ alertNew: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_new"
                        scroll="body"
                    >
                        <div>문서를 새로 작성하시겠습니까?<br/>새로작성 하시는 경우 기존 문서는 저장되지 않습니다</div>
                        <DialogActions className="buttons">
                            <Button
                                onClick={(e) => this.setState({ alertNew: false })}
                                color="primary"
                                className="cancel">
                                아니오
                            </Button>
                            <Button
                                onClick={(e) => {
                                    this.setClearDoc()
                                    this.setState({ alertNew: false })
                                }}
                                color="primary"
                                className="ok">
                                네
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Modal
                        open={this.state.showReviewWrite}
                        onClose={(e) => this.setState({ showReviewWrite: false })}
                        width={700}
                        height={630}
                        marginTop={120}
                        className="show-review-write"
                        scroll="body"
                    >
                        <div className="default-dialog-title" style={{ textAlign: 'left' }}>편집 요청
                            <span className="close" onClick={(e) => this.reviewRequest(false)}><img src="/common/close-white.svg"/></span>
                        </div>
                        <div className="box">
                            <ul>
                                <li>작성하신 문서의 오타 및 서식을 편집해드리는 서비스입니다.</li>
                                <li>인쇄하기나 다운로드를 통한 결과물의 오타나 서식이 맞지 않는 경우 등의 편집 요청 내용을 간략히 적어주세요.</li>
                                <li>편집 요청 서비스에는 별도의 법적 검토나 자문이 포함되어 있지 않습니다.</li>
                                <li>편집이 완료된 문서는 마이페이지 > 편집요청내역에서 다운로드 하실 수 있습니다.</li>
                                <li>편집 서비스는 1회만 제공되며, 신청일로부터 최대 2 영업일 내(평균 1일 내)에 완료됩니다.</li>
                            </ul>
                        </div>
                        <div className="content">
                            <h4>편집 요청 내용 입력</h4>
                            <textarea value={this.state.reviewContent} onChange={(e) => this.reviewContent(e)}/>
                            {/*<h4>이메일 입력</h4>*/}
                            {/*<input type="email" className="email" value={this.state.reviewEmail} onChange={(e) => this.reviewEmail(e)}/>*/}
                            <div className="buttons">
                                <button className="cancel" onClick={(e) => this.reviewRequest(false)}>취소</button>
                                <button className="submit" onClick={(e) => this.processReviewRequest()}>편집 요청</button>
                            </div>
                        </div>
                    </Modal>
                    <div className="buttons mobile_hide" style={{ margin: '8px 60px 0px 20px' }}>
                        <div className="btn btn-default">문서 작성</div>
                        {peerLinkButton}
                    </div>

                    <div className="buttons mobile_hide">

                        <Button onClick={(e) => this.setClearDoc()} className={(this.props.btnEditable === 'true')?'disabled hide':''}
                                disabled={(!!this.state.isNotEditable) ? 'disabled' : ''}>
                            새로작성
                            <img src="/autoform_img/icon-new.svg" alt="새로작성 아이콘"/>
                        </Button>
                        {/* { (window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io')?
                        <Button onClick={(e) => this.editHandler()} className={(this.props.btnEditable === 'true') && 'disabled hide'}
                                disabled={(!!this.state.isNotEditable) ? 'disabled' : ''}>
                            편집하기
                            <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘"/>
                        </Button>:null
                        } */}
                        <Button onClick={(e) => this.reviewRequest(true)} className={(this.props.btnEditable === 'true' || !!rowData.WR_CNT) && 'disabled hide'}
                                disabled={(!!this.state.isNotEditable) ? 'disabled' : ''}>
                            편집요청
                            <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘"/>
                        </Button>
                        <Button onClick={(e) => this.editHandler()} className={(this.props.btnEditable !== 'true') && 'disabled hide'}>
                            편집완료
                            <img src="/autoform_img/icon-doc-save-s.svg" alt="문서수정완료 아이콘"/>
                        </Button>
                        <Button onClick={(e) => this.editClear()} className={(this.props.btnEditable !== 'true') && 'disabled hide'}>
                            편집취소
                            <img src="/autoform_img/icon-back-s.svg" alt="문서수정완료 아이콘"/>
                        </Button>

                        {/* <Button onClick={(e) => (this.props.btnEditable === 'false') && this.saveData()} className={(this.props.btnEditable === 'true') && 'disabled hide'}
                                disabled={(!!this.state.isNotEditable) ? 'disabled' : ''}>
                            저장하기
                            <img src="/autoform_img/icon-save.svg" alt="저장하기 아이콘"/>
                        </Button>
                        <Button onClick={(e) => (this.props.btnEditable === 'false') && this.viewPDF('P')}
                                className={(this.props.btnEditable === 'true' || !!this.isIE()) && 'disabled hide'}>
                            인쇄하기
                            <img src="/autoform_img/icon-print.svg" alt="인쇄하기 아이콘"/>
                        </Button>
                        <Button onClick={(e) => (this.props.btnEditable === 'false') && this.viewPDF('D')} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            다운로드
                            <img src="/autoform_img/icon-download.svg" alt="다운로드 아이콘"/>
                        </Button> */}

                        <Button onClick={(e) => (this.props.btnEditable === 'false') && this.getPdf('P')}
                            className={(this.props.btnEditable === 'true' || !!this.isIE() || !!this.isEdge() ) && 'disabled hide'}>
                            인쇄하기
                            <img src="/autoform_img/icon-print.svg" alt="인쇄하기 아이콘"/>
                        </Button>
                        <Button onClick={() => (this.props.btnEditable === 'false') && this.getPdf()} className={(this.props.btnEditable === 'true'  ) && 'disabled hide'}>
                            다운로드
                            <img src="/autoform_img/icon-download.svg" alt="다운로드 아이콘"/>
                        </Button>

                        {/* <Button >
                            문서상세설명
                            <img src="/autoform_img/icon-download.svg" alt="문서상세설명 아이콘" />
                        </Button> */}
                    </div>
                    <div className="buttons mobile">
                        <Button onClick={(e) => this.setClearDoc()} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            <img src="/autoform_img/af_m_new.svg" alt="새로작성 아이콘"/>
                        </Button>
                        {/* <Button onClick={(e) => this.reviewRequest(true)} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            <img src="/autoform_img/af_m_edit.svg" alt="문서수정 아이콘"/>
                        </Button> */}
                        <Button onClick={(e) => (this.props.btnEditable === 'false') && this.getPdf()} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            <img src="/autoform_img/af_m_down.svg" alt="다운로드 아이콘"/>
                        </Button>
                        {/* <Button onClick={(e) => (this.props.btnEditable === 'false') && this.saveData()} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            <img src="/autoform_img/af_m_save.svg" alt="저장하기 아이콘"/>
                        </Button> */}
                        {/* <Button onClick={(e) => (this.props.btnEditable === 'false') && this.viewPDF('D')} className={(this.props.btnEditable === 'true') && 'disabled hide'}>
                            <img src="/autoform_img/af_m_down.svg" alt="다운로드 아이콘"/>
                        </Button> */}
                        {/* <Button  onClick={(e)=> alert("문서 다운로드는 PC에서 이용해주세요.")} className={(this.props.btnEditable  === 'true' )&&'disabled hide'}>
                            <img src="/autoform_img/af_m_down.svg" alt="다운로드 아이콘" />
                        </Button> */}
                        {/* <Button >
                            문서상세설명
                            <img src="/autoform_img/icon-download.svg" alt="문서상세설명 아이콘" />
                        </Button> */}
                    </div>
                    {/* {
                        (this.props.btnEditable  === 'true' )&&
                        <div className={"autoform_cancel_btn "} onClick={(e) => this.editClear()}>
                            <img src="/common/return.svg" alt='취소' />
                        </div>
                    }

                    <div className={"autoform_editable_btn "+( (this.props.btnEditable  === 'true' )?"editabled":"")} onClick={(e) => this.editHandler()}>
                        <img src={(this.props.btnEditable  === 'true' )?"/autoform_img/icon-doc-save.svg":"/autoform_img/icon-doc-edit.svg"} alt={(this.props.btnEditable  === 'true' )?'편집완료':'문서편집'} />
                    </div> */}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default withAutoformContext(AutoformTitle)