import React, { Component, Fragment } from 'react'
import Link from 'next/link'
// import 'scss/mypage/userdocument.scss'
import API from 'utils/apiutil'
import CommonUtil from 'utils/commonutil'
import { green } from '@material-ui/core/colors'
import axios from 'axios'
import ReactGA from 'react-ga'
import moment from 'moment'
import JSZip from 'jszip'
import { isIE, isMobile } from 'react-device-detect'
import { saveAs } from 'file-saver'
import Modal from '../common/modal'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Review from './review'
import Cookies from 'js-cookie'
import Survey from './survey'
import Inquiry from '../common/inquiry'
import helper_url from 'helper/helper_url'
import User from 'utils/user'
import Paging from '../common/paging'

const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

class CompleteDoc extends Component {

    static defaultProps = {
        name: ''
    }

    userInfo = User.getInfo()

    constructor (props) {
        super(props)
        this.state = {
            hidden: '2',
            name: '',
            init: '',
            writingList: null,
            names: {},
            currentPage: 1,
            page: 1,
            pages: 1,
            fileUrl: '',
            fileKey: 0,
            extIdwriting: '',
            extType: '',
            reviewEmail: '',
            reviewContent: '',
            reviewIdwriting: '',
            dialogOpen: false,
            selectDocs: [],
            showReviewWrite: false,
            surveyRequired: false,
            SurveyDocument: null,
            openSurvey: false,
            listType: this.props.listType || 'all',
            categroy: this.props.category || 1
        }
        this.inquiryClose = this.inquiryClose.bind(this)
    }

    closeReview = () => {
        this.setState({
            reviewOpen: false
        })
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
                } else {
                    this.setState({
                        surveyRequired: false,
                        SurveyDocument: null
                    })
                }
            }
        })
    }

    componentWillUpdate (nextProp) {
        if (nextProp.listType !== this.state.listType) {
            this.setState({ listType: nextProp.listType })
        }
    }

    componentDidMount () {
        this.pageHandler({ page: 1 })
        API.sendPost('/user/info').then((res) => {
            const userData = res.data.userData
            this.setState({ reviewEmail: userData.email })
        })
        this.checkFirstSurvey()
    }

    onClickButton1 (key) {

        this.setState({
            hidden: '1',
            listkey: key
        })

    }

    onClickButton2 (key, idwriting) {
        this.setState({
            hidden: '2',
            init: this.state.name
        })

        const titleData = {
            'idwriting': idwriting,
            'title': this.state.writingList[key].name
        }

        API.sendPost('/writing/updatetitle', titleData).then((res) => {

        })
    }

    onClickButton3 () {
        this.setState({ hidden: '3' })
    }

    deleteDoc (idwriting) {

        if (window.confirm('삭제 하시겠습니까?')) {
            const deleteData = {
                'idwriting': idwriting,
            }
            API.sendPost('/writing/deletedata', deleteData).then((res) => {
                this.componentDidMount()
            })
        } else {

        }
    }

    handleChange1 = (e, key) => {
        e.preventDefault()
        this.setState({
            name: e.target.value
        })
        var newW = this.state.writingList
        newW[key].name = e.target.value
        this.setState({
            writingList: newW
        })
    }

    componentWillReceiveProps (nextProp) {

        let params = {
            page: nextProp.page,
            listType: nextProp.listType || 'all',
            category: nextProp.category || null
        }

        this.pageHandler(params)

    }

    setPage = (page) => {
        this.setState({ page: page })
        this.pageHandler({ page })
    }

    pageHandler (e) {

        let params = {
            page: e.page,
            per: 10,
            order: 'w.registerdate',
            sort: 'desc',
            listType: e.listType,
            category: e.category
        }

        let stateParam = { writingList: null, pages: 1, currentPage: 1, selectDocs: [], totalDocs: 0 }

        if (e.listType === 'lawyer') {
            this.setState(stateParam)
            return
        }

        API.sendGet('/writing/list', params).then((res) => {
            let pages = Math.ceil(res.data.total / params.per)
            if (res.data.status === 'ok') {
                stateParam = { writingList: res.data.data, pages: pages, currentPage: e.page, selectDocs: [], totalDocs: res.data.total }
            }
            this.setState(stateParam)
        })
    }

    checkAll = (e) => {
        let selectDocs = this.state.selectDocs
        let writingList = this.state.writingList
        if (selectDocs.length === writingList.length) {
            selectDocs = []
        } else {
            selectDocs = []
            writingList.map((key) => {
                selectDocs.push(key)
            })
        }
        this.setState({
            selectDocs: selectDocs
        })
    }

    handleChange = (e) => {
        let selectDocs = this.state.selectDocs
        if (e.target.checked === true) {
            selectDocs[String(e.target.value)] = {
                idwriting: this.state.writingList[e.target.value].idwriting,
                file: this.state.writingList[e.target.value].file
            }
        } else {
            delete selectDocs[e.target.value]
        }
        this.setState({
            selectDocs: selectDocs
        })
    }

    getZip () {

        if (this.state.selectDocs.length <= 0) {
            alert('다운로드할 문서를 선택해주세요.')
            return false
        }

        let docs = this.state.selectDocs
        let zip = new JSZip()

        let savefile = 'lawform.zip'
        let files = []

        for (const [index, value] of docs.entries()) {
            if (!!value && !!value.file && value.file !== 'saving' && value.file !== 'nofile') files.push(value.file)
        }

        let count = 0

        files.map((file) => {
            // var file = url.file.substr(url.file.lastIndexOf("/")+1);
            axios({
                url: '/print/' + file,
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
    };

    delDocs () {
        // console.log('목록', this.state.selectDocs , this.state.selectDocs.length, this.state.listType );
        if (this.state.selectDocs.length <= 0) {
            alert('삭제할 문서를 선택해주세요.')
            return false
        }

        if (window.confirm('삭제 하시겠습니까?')) {
            let listType = this.state.listType
            let docs = this.state.selectDocs
            let count = 0
            let t = this
            docs.forEach(function (doc) {
                API.sendPost('/writing/deletedata', { 'idwriting': doc.idwriting })
                count++
                if (count === Object.keys(docs).length) {
                    t.pageHandler({ page: t.state.currentPage, listType: listType })
                }
            })
        }

    }

    savePDF (e, idwriting, bindData) {

        if (bindData === 1) {
            alert('문서를 작성 후 이용하여 주시기 바랍니다.')
            return
        }

        let file = '', title = ''
        API.sendGet('/writing/download', {
            idwriting: idwriting
        }).then((res) => {
            file = res.data.data.savedFile
            title = res.data.data.title
            if (file === 'saving') {
                alert('문서 저장 중입니다. 잠시 후에 다시 시도해주십시오.')
                return false
            } else {
                axios({
                    url: '/print/' + file,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', title + '.pdf')
                    document.body.appendChild(link)
                    link.click()
                })
            }
        })

    }

    usageDoc (category) {
        let file, title
        switch (category) {
            case 1:
                title = '내용증명 활용방안'
                file = 'usage_1.pdf'
                break
            case 3:
                title = '지급명령 활용방안'
                file = 'usage_3.pdf'
                break
            default:
        }

        let url = '/documents/' + file
        if (!!isIE) {
            window.open(url, title)
            return
        }

        axios({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', title + '.pdf')
            document.body.appendChild(link)
            link.click()
        })

    }

    downPdf = (rowData) => {

        if (rowData.file === null) return alert('문서를 작성 후 이용하여 주시기 바랍니다.')

        let url = '/print/' + rowData.file
        let title = rowData.title

        if (!!isIE) {
            window.open(url, title)
            return
        }

        axios({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', title + '.pdf')
            document.body.appendChild(link)
            link.click()
        })
    }

    printPDF (e, idwriting, bindData) {

        if (bindData === 1) {
            alert('문서를 작성 후 이용하여 주시기 바랍니다.')
            return false
        } else {
            let params = {
                idwriting: idwriting
            }
            let file = '', title = ''
            API.sendGet('/writing/download', params).then((res) => {
                file = res.data.data.savedFile
                if (file === 'saving') {
                    alert('문서 저장 중입니다. 잠시 후에 다시 시도해주십시오.')
                    return false
                } else {
                    title = res.data.data.title
                    let url = '/print/' + file
                    setTimeout(() => {
                        let printWindow = window.open(url, title, 'height=680,width=800')
                        // printWindow.focus();
                        // printWindow.print();
                    }, 100)
                }

            })
        }
    }

    daysLeft (dateTime) {
        let targetDateTime = new Date(dateTime)
        let targetTimeStamp = Date.parse(targetDateTime.getFullYear() + '/' + (targetDateTime.getMonth() + 1) + '/' + (targetDateTime.getDate()) + ' 23:59:59')
        let leftTimeStamp = Date.parse(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + (new Date().getDate()) + ' 23:59:59')
        let diff = targetTimeStamp - leftTimeStamp
        return diff / 86400000
    }

    expireCheck (dateTime) {
        let targetDateTime = new Date(dateTime)
        return Date.parse(targetDateTime.getFullYear() + '/' + (targetDateTime.getMonth() + 1) + '/' + (targetDateTime.getDate()) + ' 23:59:59') >= Date.parse(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + (new Date().getDate()) + ' 23:59:59')
    }

    extensionOfTerm (idwriting, type) {
        window.location.href = '#extensionOfTerm'
        this.setState({
            extIdwriting: idwriting,
            extType: type
        })
    }

    processExtension () {
        let params = {
            idwriting: this.state.extIdwriting,
            type: this.state.extType
        }

        if (!params.idwriting || !params.type) {
            alert('선택된 문서가 없습니다.')
            window.location = '#close'
            return false
        }

        API.sendPost('/writing/extension', params).then((res) => {
            //console.log('연장결과', res)
            if (res.status === 'ok') {
                alert('기한이 연장되었습니다.')
                window.location.replace('#close')
                this.pageHandler({ page: this.state.currentPage })
                return true
            } else {
                alert('기한 연장에 실패하였습니다.')
                return false
            }
        })
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

    reviewRequest (rowData) {

        const { idwriting, expired } = rowData

        if (!!expired) {
            alert('문서 보관기간이 만료되어 편집요청을 할 수 없습니다..')
            return
        }

        if (this.state.SurveyDocument === idwriting && this.state.surveyRequired === true) {
            this.setState({
                openSurvey: true
            })
        } else {
            ReactGA.ga('send', 'pageview', window.location.pathname + '#reviewRequest')
            this.setState({
                reviewIdwriting: idwriting,
                showReviewWrite: true
            })
        }

    }

    processReviewRequest () {
        if (this.state.reviewEmail === '' || this.state.reviewIdwriting === '') {
            alert('잘못된 요청입니다.')
            return false
        }
        let params = {
            email: this.state.reviewEmail,
            idwriting: this.state.reviewIdwriting,
            content: this.state.reviewContent
        }

        API.sendPost('/writing/review', params).then((result) => {
            if (result.status === 'ok') {
                alert('편집 요청이 완료되었습니다.')
                this.pageHandler({ page: this.state.currentPage })
                this.setState({
                    showReviewWrite: false
                })
                return true
            } else {
                alert('요청을 처리할 수 없습니다. 잠시 후에 이용해주세요.')
                return false
            }
        })

    }

    isIE = () => {
        return isIE
    }

    linkautoform (idwriting) {
        if (!!isIE) {
            //alert('법률문서 자동작성은 IE 브라우저를 정식으로 지원하지 않습니다. 크롬 혹은 Edge를 이용해주세요.')
            //this.setState({dialogOpen: true})
            if (!window.confirm('로폼의 문서 작성 및 수정은 크롬 혹은 Edge 브라우저에 최적화 되어 있습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.\n\n계속 진행하시겠습니까?')) {
                return
            }
        }

        window.location = '/autoform/' + idwriting
    }

    linkPeerRequest (url, peer = false) {

        if (!url) {
            alert('문서를 작성하신 후 이용해 주시기 바랍니다.')
            return
        }

        if (!!isIE ) {
            if (host === 'https://lawform.io') {
                alert('해당 기능은 IE 브라우저는 지원하지 않습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.')
                return
            } else {
                if (!window.confirm('로폼의 문서 작성 및 수정은 크롬 혹은 Edge 브라우저에 최적화 되어 있습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.\n\n계속 진행하시겠습니까?')) {
                    return
                }
            }
        }

        if (!!peer) {
            window.location = url
        } else {
            if (!!window.confirm('현재까지 작성한 내용으로 변호사님에게 요청 됩니다.\n계속 진행하시겠습니까?')) {
                window.location = url
            }
        }

    }

    inquiryClose = () => {
        this.setState({
            openInquiry: false
        })
    }

    renderRow (rowData, key) {

        let agent = navigator.userAgent.toLowerCase()
        const userInfo = this.userInfo
        let showPeerButton = true
        let category_title = rowData.category_name
        let insert_mydocument_title = ['insert_mydocument_title']
        let user_document_name = ['user_document_name']
        let list = ['list' + key]
        let user_document_detail = ['user_document_detail']

        let init_title
        if (this.state.hidden === '1') {
            if (list[0] === 'list' + this.state.listkey) {
                insert_mydocument_title.push('insert_active')
                user_document_name.push('insert_hide')
                list.push('insert_hide')
                // user_document_detail.push('insert_hide');
            }
        }

        if (this.state.hidden === '2') {
            init_title = [this.state.name]
        } else if (this.state.hidden === '3') {
            init_title = [this.state.init]
        }

        //console.log('rowData', rowData)
        //console.log('userInfo', userInfo)

        // 변호사 검토/직인 버튼
        let peerLinkButton = null
        let peerLinkUrl = null
        let peerLinkText = null
        let peerLinkStyle = { marginTop: 5, backgroundColor: '#9aa0aa', borderColor: '#9aa0aa', color: '#FFF' }

        // !rowData.emptybindata &&
        if ((rowData.category === 1 || ((rowData.category === 99 || rowData.category === 4) && showPeerButton === true)) && userInfo.account_type !== 'A' && !rowData.expired) {

            peerLinkUrl = ((rowData.category === 1) ? helper_url.service.doc.review_seal : helper_url.service.doc.review_request) + rowData.idwriting
            peerLinkText = (rowData.category === 1) ? '변호사 직인요청' : '변호사 검토요청'

            if (!!rowData.emptybindata) {
                peerLinkUrl = null
            }

            if (!!rowData.writing_peer_idx && !!rowData.writing_peer_status) {
                peerLinkUrl = helper_url.service.doc.revision + rowData.idwriting + '/' + rowData.writing_peer_idx + '/#2'
                peerLinkText = '변호사 문서확인'
                peerLinkStyle = { marginTop: 5, backgroundColor: '#435062', borderColor: '#435062', color: '#FFF' }
            }

            peerLinkButton = <button className="comment_write" style={peerLinkStyle} onClick={() => this.linkPeerRequest(peerLinkUrl, (!!rowData.writing_peer_idx))}>{peerLinkText}</button>

        }

        return (
            <tbody key={key}>
            {rowData.view === 'Y' &&
            <tr className="point_row">
                <td className="writing_table_cell  middle">
                    {
                        (!!isIE) ?
                            <input type="checkbox" checked={(!!this.state.selectDocs[key])} onChange={(e) => this.handleChange(e)} value={key}/>
                            :
                            <Checkbox
                                checked={(!!this.state.selectDocs[key])}
                                onChange={(e) => this.handleChange(e)}
                                value={key}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                    }

                </td>
                {/*
                <td className="writing_table_cell complete_content_2 middle">
                    <div className={user_document_detail.join(' ')}>{rowData.title}</div>
                </td>
                */}
                <td className="writing_table_cell middle" style={{ padding: '10px 0', textAlign: 'left' }}>
                    <img className='mobile x_icon' onClick={() => this.deleteDoc(rowData.idwriting)} src='/category_img/mobile/icon_2.svg' alt={'close'}/>
                    <div className="warp_ic_badge">
                        <div className={user_document_name.join(' ')}
                             onClick={(e) => (!!isMobile && Cookies.get('forceDeskTop') !== 'true') ? this.linkautoform(rowData.idwriting) : {}}>
                            {rowData.name}
                        </div>
                        <div className={list.join(' ') + ' insert_title_btn'} onClick={() => this.onClickButton1(key)}>
                            <img src="/mypage_img/insert_title_btn.png" className="insert_title_btn" alt="insert_title_btn"/>
                        </div>
                    </div>
                    <div className={insert_mydocument_title.join(' ')}>
                        <input type="text" className="insert_title_field" value={this.state.writingList[key].name} onChange={(e) => this.handleChange1(e, key)}/>
                        <img src="/mypage_img/true.png" className="true_btn" alt="true_btn" onClick={() => this.onClickButton2(key, rowData.idwriting)}/>
                        <img src="/mypage_img/false.png" className="false_btn" alt="false_btn" onClick={this.onClickButton3.bind(this)}/>
                    </div>
                    <div className="docs_info_date"><label>작성기간 : </label>
                        {moment(rowData.editabledate).format('YYYY 년 MM월 DD일')}
                    </div>
                    <div className="docs_info_date"><label>보관기간 : </label>
                        {moment(rowData.expiredate).format('YYYY 년 MM월 DD일')}
                    </div>
                </td>

                <td className="writing_table_cell  middle">
                    <button className="comment_write" onClick={() => this.linkautoform(rowData.idwriting)}>{(!!rowData.emptybindata) ? '문서작성' : '문서수정'}</button>
                    {peerLinkButton}
                </td>

                <td className="writing_table_cell middle">
                    {
                        (rowData.category === 1 || rowData.category === 3) && userInfo.account_type !== 'A' &&
                        <button className="usage" onClick={(e) => this.usageDoc(rowData.category)}>{category_title} 활용방법</button>
                    }
                    {(rowData.review !== 'Y') ?
                        <button className="buttonReviewRequestImage" style={{ cursor: 'pointer' }}
                                //onClick={(e) => this.linkautoform(rowData.idwriting)}
                                onClick={(e) => this.reviewRequest(rowData)}>편집요청</button>
                        :
                        <button className="buttonReviewRequestImage" onClick={() => window.location = '/writingreview'}>편집요청완료</button>
                    }
                </td>
                <div className='mobile button_wrap'>
                    {/*<button className="" onClick={(e) => this.downPdf(rowData)}>다운로드</button>*/}
                    <button className="comment_write" onClick={(e) => this.linkautoform(rowData.idwriting)}>{(!!rowData.emptybindata) ? '문서작성' : '문서수정'}</button>
                    {
                        (rowData.category === 1 || rowData.category === 3) &&
                        <button className="usage" onClick={(e) => this.usageDoc(rowData.category)}>활용방법</button>
                    }
                    {
                        (rowData.review !== 'Y') ?
                            <button className="" onClick={(e) => this.linkautoform(rowData.idwriting)} style={{ cursor: 'pointer' }}
                                    onClick={(e) => this.reviewRequest(rowData)}>편집요청</button>
                            :
                            <button className="" onClick={() => window.location = '/writingreview'}>편집요청완료</button>
                    }
                </div>
            </tr>
            }
            </tbody>

        )

    }

    render () {

        let agent = navigator.userAgent.toLowerCase()
        const userInfo = this.userInfo

        const paging_wrap = {
            margin: '40px',
        }
        // let paging = []
        // let pages = this.state.pages
        // for (var i = 1; i < pages + 1; i++) {
        //     const page = i
        //     if (this.state.currentPage === i) paging.push(<span className="paging_num" key={i}><strong>{i}</strong></span>)
        //     else paging.push(<span className="paging_num" style={{ cursor: 'pointer' }} ref={i} key={i} onClick={(e) => { this.pageHandler({ page }) }}>{i}</span>)
        // }

        if (!!this.state.writingList) {

            return (
                <div className="wrap_writing_detail">
                    <div className="total">
                        전체 {(!!this.state.totalDocs) ? this.state.totalDocs : 0} 건
                    </div>
                    {
                        (!!isIE) ?
                            <div className="buttons">
                                {(!!this.props.openReview) &&
                                <button onClick={(e) => this.props.openReview()} color="primary" className="review-write">
                                    후기작성
                                </button>
                                }
                                <button onClick={(e) => this.delDocs(e)} color="primary">
                                    <img src="/common/trash.svg" alt="삭제"/>
                                </button>

                            </div>
                            :
                            <div className="buttons" style={{ position: 'relative' }}>

                                <div className={'review-promotion-baloon'}>
                                    <span>후기작성하면</span>
                                    <span>100% 커피쿠폰을!</span>
                                </div>

                                {/*{(!!this.props.openReview) && <img src='/mypage_img/tooltip.svg' style={{ position: 'absolute', top: '-62px' }} alt="tooltip"/>}*/}
                                {(!!this.props.openReview) &&
                                <Button onClick={(e) => {(!!this.props.openReview) ? this.props.openReview() : window.location.href = '/mydocument'}} color="primary"
                                        className="review-write">
                                    후기작성
                                </Button>
                                }
                                <Button onClick={(e) => this.delDocs(e)} color="primary">
                                    <img src="/common/trash.svg" alt="삭제"/>
                                </Button>
                            </div>

                    }
                    <table>
                        <thead>
                        <tr className="point_row point_header">
                            <th className="writing_table_cell complete_header_1 middle">
                                {
                                    (!!isIE) ?
                                        <input type="checkbox" checked={(Object.keys(this.state.selectDocs).length === this.state.writingList.length)}
                                               onClick={(e) => this.checkAll()}/>
                                        :
                                        <Checkbox
                                            checked={(Object.keys(this.state.selectDocs).length === this.state.writingList.length)}
                                            color="primary"
                                            inputProps={{
                                                'aria-label': 'secondary checkbox',
                                            }}
                                            onClick={(e) => this.checkAll()}
                                        />
                                }
                            </th>
                            {/* <th className="writing_table_cell complete_header_2 middle">
                                    <span>문서명</span>
                                </th> */}
                            <th className="writing_table_cell complete_header_3 middle">
                                <span>문서명</span>
                            </th>
                            <th className="writing_table_cell complete_header_4 middle">
                                <span>문서작성</span>
                            </th>
                            <th className="writing_table_cell complete_header_5 middle">
                                <span>부가서비스</span>
                            </th>
                        </tr>
                        </thead>
                        {this.state.writingList.map((rowData, key) => this.renderRow(rowData, key))}
                    </table>
                    <div style={paging_wrap}>
                        {/* {paging} */}
                        <Paging total={this.state.totalDocs} page={this.state.page} per={10} setPage={this.setPage}/>
                    </div>
                    <div id="extensionOfTerm" className="white_content">
                        <div className="wrap_extensionOfTerm">
                            <div className="header">
                                <span>기한 연장</span>
                                <div className="btn_close">
                                    <a href="#close"><img src="/mypage_img/btn_close.png" width="16" height="16" alt="x_btn"/></a>
                                </div>
                            </div>
                            <div className="comment">
                                <div className="box">
                                    로폼 서비스를 더 오래 이용하고 싶다면 이용 기한을 연장해 주세요.
                                </div>
                            </div>
                            <div className="product">
                                <div className="name">기한 연장</div>
                                <div className="description">저장 기한 연장 7일</div>
                            </div>
                            <div className="buttons">
                                <a href="#close">
                                    <button className="cancel">취소</button>
                                </a>
                                <button className="submit" onClick={(e) => this.processExtension()}>연장하기</button>
                            </div>
                        </div>
                    </div>
                    {/**첨삭 수정 */}
                    <div id="reviewRequest" className="white_content">
                        <div className="wrap_reviewRequest">
                            <div className="header">
                                <span>편집 요청</span>
                                <div className="btn_close">
                                    <a href="#close"><img src="/mypage_img/btn_close.png" width="16" height="16" alt="x_btn"/></a>
                                </div>
                            </div>
                            <div className="comment">
                                <div className="box">
                                    <ul>
                                        <li>작성하신 문서의 오타를 무료로 검수해 드립니다.</li>
                                        <li>작업일은 신청일로 부터 2 영업일 이내 입니다.</li>
                                        <li>검수 완료 문서는 PDF 파일로 하단에 기입하신 이메일로 보내 드립니다.</li>
                                        <li>오타수정 서비스는 1회만 제공됩니다.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="emailTitle">이메일 입력</div>
                            <input type="email" className="email" value={this.state.reviewEmail} onChange={(e) => this.reviewEmail(e)}/>
                            <div className="buttons">
                                <a href="#close">
                                    <button className="cancel">취소</button>
                                </a>
                                <button className="submit" onClick={(e) => this.processReviewRequest()}>편집 요청</button>
                            </div>
                        </div>
                    </div>
                    <Modal
                        open={this.state.showReviewWrite}
                        onClose={(e) => this.setState({ showReviewWrite: false })}
                        width={700}
                        height={630}
                        className="show-review-write"
                        scroll="body"
                    >
                        <div className="default-dialog-title" style={{ textAlign: 'left' }}>편집 요청
                            <span className="close" onClick={(e) => this.setState({ showReviewWrite: false })}><img src="/common/close-white.svg"/></span>
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
                                <button className="cancel" onClick={(e) => this.setState({ showReviewWrite: false })}>취소</button>
                                <button className="submit" onClick={(e) => this.processReviewRequest()}>편집 요청</button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        width={550}
                        height={150}
                    >
                        <div className="dialog_content">
                            <div id="alert-dialog-description" style={{ textAlign: 'left' }}>
                                법률문서 자동작성은 IE 브라우저를 정식으로 지원하지 않습니다. <br/>
                                크롬을 이용해주세요.
                            </div>
                        </div>
                        <div className='dialog_buttons'>
                            <a href="https://www.google.com/intl/ko/chrome/" target="new" style={{ textDecoration: 'none' }}>
                                <button color="primary" autoFocus>
                                    <img src="common/chrome-logo.svg" style={{ width: 25, marginRight: 10 }}/> 크롬 다운로드
                                </button>
                            </a>
                            <button onClick={(e) => this.setState({ dialogOpen: false })} color="primary">
                                확인
                            </button>
                        </div>
                    </Modal>
                    <Survey open={this.state.openSurvey} close={this.surveyClose} onComplete={this.surveyComplete}/>
                </div>
            )
        } else {
            return (
                <div className="no-contents">
                    {(!!this.props.listType && (this.props.listType === 'package' || this.props.listType === 'subscription')) ?
                        <div className="package-list">
                            {(!this.props.subscriptionEnddate) ? /** 정기권 만료일로 체크 */
                                <Fragment>
                                    <div>구매한 정기권 문서가 없습니다.</div>
                                    <Link href="/plans"><a>자세히보기</a></Link>
                                </Fragment>
                                :
                                <Fragment>
                                    <div>
                                        작성된 문서가 없습니다.<br/>
                                        문서 추가하기에서 문서 추가후 작성해주세요.
                                    </div>
                                </Fragment>
                            }
                        </div>
                        : null
                    }
                    <Inquiry modalOpen={this.state.openInquiry} close={this.inquiryClose} onComplete={this.inquiryClose} event={8}/>
                </div>
                // <div>보관된 문서가 없습니다.</div>
            )
        }
    }
}

export default CompleteDoc
