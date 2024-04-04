import React, { Component, Fragment } from 'react'
// import 'react-app-polyfill/ie11'
import { createBrowserHistory } from "history";

import Link from 'next/link'
import DaumPostcode from 'react-daum-postcode'
// import '../../scss/autoform/autoformmain.scss';
import AutoformPreview from './autoformpreview'
import AutoformSave from './autoformsave'
import htmlparser from 'htmlparser2'
import CommonUtil from '../../utils/commonutil'
import CustomTag from '../../utils/customtag'
import Counter from '../../utils/counter'
import Files from 'react-files'
import InputSection from './input/inputsection'

import SelectPartnerShip from './select/partnership'
import SelectLoans from './select/loans'
import ArticleOfAssociation from './select/articleofassociation'
import LaborContract from './select/laborcontract'

import { withAutoformContext } from '../../contexts/autoform'
import API from '../../utils/apiutil'
// import { number } from 'prop-types';
import jQuery from 'jquery'

import User from '../../utils/user'
import ReactGA from 'react-ga'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Cookies from 'js-cookie'

import Signin from '../common/signin'
import Finduser from '../common/finduser'
import Findpw from '../common/findpw'
import Qna from '../common/qna'

import NumberFormat from 'react-number-format'

import Payment from './payment'
import PaymentDefault from '../payment/default'

window.$ = window.jQuery = jQuery

class Prewritemain extends Component {

    constructor (props) {
        super(props)

        this.state = {
            fixedOutput: 'none',
            docData: {
                docTitle: '',
                iddocument: this.props.iddocument,
                dc_price: 0,
                idcategory_1: 1,
            },
            showPaymentPop: true,
            sectionSelect: 0,
            templateData: {},
            mobilePreview: false,
            promotion: {
                PATENT83CH: {
                    discount: '5000',
                    display: '5,000'
                },
            },
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            mobileAlert53: true,
            guideOpen: false,
            payOpen: false
        }

        // for file Read
        this.fileReader = new FileReader()
        this.fileReader.onload = (event) => {
            const autoform = JSON.parse(event.target.result)
            const data = { autoform: autoform }
            data.autoform.outputSections.map((output, output_key) => this.preParsing(output, output_key))
            this.props.setTemplateData(data.autoform)
        }

        // for output
        this.renderHtml = ''
        this.preview = React.createRef()
        this.outputDomID = 0
        this.highlightedOutputDomIDs = []

        this.counter = new Counter()
        this.customTag = new CustomTag(this.props.bindData)

        this.nextSave = new Date()
        this.nextSave.setMonth(this.nextSave.getMonth() + 10)
        this.inlineKeys = []

        const IMP = window.IMP
        IMP.init('imp91690618')
        this.handleClick = this.handleClick.bind(this)
        this.backUrl = '/category/' + this.state.docData.idcategory_1

        // IE에서 startsWith 지원이 안됨 재정의해서 씀
        if (!String.prototype.startsWith) {
            console.log('ie')
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0
                return this.indexOf(searchString, position) === position
            }
        }
        this.history = createBrowserHistory();
    }

    loginCheckBeforePayment = () => {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('회원 전용 서비스 입니다. 로그인 또는 회원 가입을 해주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            // this.setState({
            //     dialogOpen: true
            // })
        } else {
            let param = {
                host: window.location.hostname
            }

            if (this.state.docData.dc_price === 0) { // 무료 문서
                let param = {
                    isFree: true,
                    iddocuments: this.props.iddocument,
                    name: this.props.templateData.title,
                    bindData: this.props.bindData
                }
                API.sendPost('/payments', param).then((res) => {
                    if (res.status === 'ok') {
                        // if( !!res.data.result.insertId ){
                        //     window.location.href = '/autoform/'+res.data.result.insertId;
                        // }
                    }
                })
                let r = window.confirm('내 문서함 보관함에 추가 되었습니다. \r\n내 문서 보관함으로 이동하시겠습니까?') // 사실은 payments 이후에 호출 되어야 하나 중복 클릭 방지 하기 위해 여기 위치
                if (r === true) {
                    window.location.href = '/mydocument'
                }
            } else {
                window.location.href = '#payment'
                ReactGA.pageview(window.location.pathname + '#payment', null, '문서 결제')
            }

        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false })
    }

    goSignIn = () => {
        this.setState({
            dialogOpen: false
        })
        window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
    }

    goSignUp = () => {
        this.setState({
            dialogOpen: false
        })
        window.location.href = '/auth/signup'
        Cookies.set('signInReferrer', '/preview/' + this.props.iddocument, { expires: 1 })
    }

    preParsing (output, output_key) {
        let newHtml = ''
        let bindData = this.props.bindData
        let isThereBinding = false
        let isThereNotEmptyBinding = false
        let thisClass = this
        if (output.counterreset === true) {
            this.counter.resetUnderProvision()
        }

        this.counter.snapshot()

        if (output.caseCount > 0) {
            let isVisible = false
            let allAnd = true
            let allOr = false
            for (var i = 0; i < output.caseCount; i++) {
                if (!!output.caseFields[i].value) {
                    if (bindData[output.caseFields[i].name] === output.caseFields[i].value) {
                        allOr = true
                    } else {
                        allAnd = false
                    }
                } else if (!output.caseFields[i].value) {
                    if (!!bindData[output.caseFields[i].name]) {
                        allOr = true
                        allAnd = false
                    }
                }
            }

            let casetype = output.casetype ? output.casetype : 'OR'
            if (casetype === 'OR') isVisible = allOr
            else if (casetype === 'AND') isVisible = allAnd
            if (!isVisible) return
        }

        let isLast_P_TagOrdering = false
        let lastTag = ''
        let titleVisible = false
        if (!!output.section_title) {
            if (!!output.bindFields) {
                for (let i = 0; i < output.bindFields.length; i++) {
                    if (!!bindData[output.bindFields[i].bindData]) {
                        if (!!this.props.bindData && !!output.bindFields[i].bindData) {
                            titleVisible = true
                        }
                    }
                    // this.props.bindData.output.bindFields[i].bindData;                
                }
            } else if (!output.bindFields) {
                titleVisible = true
            }

            if (titleVisible) {
                // newHtml += `&lt;p style='text-align: center; font-size:16px; padding-top: 30px;'&gt;&lt;strong &gt${this.counter.increase('title')} ${output.section_title}&lt;/strong&gt;&lt;/p&gt;`;
                newHtml += `&lt;br/ &gt;&lt;p style='text-align: center; font-size:16px;'&gt;&lt;strong &gt${this.counter.increase('title')} ${output.section_title}&lt;/strong&gt;&lt;/p&gt;`

            }
        }

        if (!!output.provision_title) {
            // if (this.counter.provision !== 0) this.renderHtml += `&lt;br/&gt;`;
            if (output.Addendum) {
                this.counter.reset()
                newHtml += `&lt;br/ &gt;&lt;p style='padding: 0 0 5px 0;'&gt;&lt;strong&gt부 칙&lt;/strong&gt;&lt;/p&gt;`
            }
            newHtml += `&lt;br/ &gt;&lt;p style='padding: 0 0 5px 0;'&gt;&lt;strong&gt${this.counter.increase('provision')}(${output.provision_title})&lt;/strong&gt;&lt;/p&gt;`
        }

        let parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                if (thisClass.customTag.isCustomTag(name, attribs)) {
                    let { result, binding, notEmptyBinding, isHighlighted } = thisClass.customTag.invoke(name, attribs)
                    if (!isNaN(result)) result = CommonUtil.pureNumberToCommaNumber(result)
                    newHtml += result
                    if (binding) isThereBinding = true
                    if (notEmptyBinding) isThereNotEmptyBinding = true
                    if (isHighlighted) {
                        thisClass.highlightedOutputDomIDs.push(thisClass.outputDomID - 1)
                    }
                } else {
                    lastTag = name
                    if (thisClass.inlineKeys.indexOf(output_key - 1) === 1 && attribs.style !== 'display: inline;') {
                        newHtml += `&lt;/span&gt;&lt;/p&gt;`
                    }
                    if (name.toUpperCase() === 'P' && attribs.style === 'display: inline;') {
                        /** inline  */
                        if (thisClass.inlineKeys.indexOf(output_key) === -1) {
                            thisClass.inlineKeys.push(output_key)
                        }
                        thisClass.inlineKeys.sort()
                        /** /inline  */

                        if (thisClass.inlineKeys.indexOf(output_key - 1) === -1) {
                            newHtml += `&lt;${name} id=output_${thisClass.outputDomID++}`
                            let keys = Object.keys(attribs)
                            for (let i = 0; i < keys.length; i++) {
                                newHtml += ` ${keys[i]}='${attribs[keys[i]].replace('display: inline;', '')}'`
                            }
                            newHtml += `&gt;`
                        }
                    } else {
                        newHtml += `&lt;${name} id=output_${thisClass.outputDomID++}`
                        let keys = Object.keys(attribs)
                        for (let i = 0; i < keys.length; i++) {
                            newHtml += ` ${keys[i]}='${attribs[keys[i]]}'`
                        }
                        newHtml += `&gt;`
                    }
                }
            },
            ontext: function (text) {
                var orderText = ''
                if (lastTag === 'p' || lastTag === 'P') {
                    var { type, str } = thisClass.counter.isOrdering(text)
                    isLast_P_TagOrdering = (type !== undefined)
                    if (isLast_P_TagOrdering) {
                        orderText += `&lt;span listtype=${type} style='text-indent:-18px; padding-left:18px; display:inline-block;'&gt;${thisClass.counter.increase(type)} ` // for outdent
                        text = str
                    } else {
                        if (text.trim().startsWith('-')) {
                            isLast_P_TagOrdering = true
                            str = text.substr(1, text.length - 1)
                            str.trim()

                            orderText += `&lt;span listtype='dash' style='text-indent:-9px; padding-left:9px; display:inline-block;'&gt;- ` // for outdent
                            text = str
                        }
                    }
                }
                let { overrideText, binding, notEmptyBinding, isHighlighted, fieldtype, lastnumbering } = CommonUtil.overrideBindingText(bindData, text, false, thisClass.props.lastChangedBindData, '', thisClass.counter.countindex('circle'), '')
                //    let { overrideText, binding, notEmptyBinding, isHighlighted } = CommonUtil.overrideBindingText(bindData, text, false, thisClass.props.lastChangedBindData);

                if (isHighlighted) {
                    thisClass.highlightedOutputDomIDs.push(thisClass.outputDomID - 1)
                }
                if (binding) isThereBinding = true
                if (notEmptyBinding) isThereNotEmptyBinding = true
                if (fieldtype === 'etc' && orderText === '') {
                    thisClass.counter.lastindex('circle', Number(lastnumbering))
                }

                if (overrideText === 'undefined')
                    overrideText = ''
                newHtml += orderText + overrideText
                // }

            },
            onclosetag: function (tagname) {
                if (thisClass.inlineKeys.indexOf(output_key) === -1) {
                    if (tagname === 'p' || tagname === 'P') {
                        if (isLast_P_TagOrdering) {
                            newHtml += `&lt;/span&gt;`
                        }
                    }
                    newHtml += `&lt;/${tagname}&gt;`
                } else {

                }
                // newHtml += `&lt;/${tagname}&gt;`;

            },
            onend () {
            }
        }, { decodeEntities: true })
        parser.write(output.law_text)

        parser.end()
        if (!(isThereBinding && !isThereNotEmptyBinding)) {
            this.renderHtml += newHtml
        } else {
            this.counter.rollback()
        }
        // console.log( 'renderhtml' , CommonUtil.htmlDecode(this.renderHtml ) )
    }

    updateScrollInfo () {
        let threshold = 592
        if (window.pageYOffset < threshold) {
            if (this.state.fixedOutput !== 'none') this.setState({ fixedOutput: 'none' })
        } else if (this.state.fixedOutput !== 'top') {
            if (this.state.fixedOutput !== 'top') this.setState({ fixedOutput: 'top' })
        }
    }

    listenToScroll = () => {
        this.updateScrollInfo()
    }

    componentDidMount () {
        const isMobile = this.state.isMobile
        let iddocument = this.props.iddocument
        if (this.props.params) {

        } else {
            API.sendPost('/documents/prewrite/' + iddocument).then((res) => {
                // if( ( isMobile === true && Cookies.get('forceDeskTop') !== 'true' )  &&  !( res.data.data[0].idcategory_1 === 1 || res.data.data[0].idcategory_1 === 3 || res.data.data[0].idcategory_1 === 99 ) ) {
                //     window.location = "/";
                //     return false
                // }
                const loadData = '{}'
                const templateData = res.data.data[0].template_data
                templateData.outputSections.map((output, output_key) => this.preParsing(output, output_key))
                this.props.setTemplateData(templateData)
                const bindData = JSON.parse(loadData)
                this.props.setBindData(bindData, true)
                this.setState({
                    docTitle: res.data.data[0].title,
                    docOutputTitle: res.data.data[0].template_data.outputTitle,
                    docOutputTitleUnderline: res.data.data[0].template_data.outputTitle_underline,
                    inputSections: res.data.data[0].template_data.inputSections,
                    foundDoc: true,
                    docData:
                        {
                            title: res.data.data[0].title,
                            h1: res.data.data[0].h1,
                            iddocument: this.props.iddocument,
                            price: res.data.data[0].price,
                            dc_price: res.data.data[0].dc_price,
                            idcategory_1: res.data.data[0].idcategory_1,
                            description: res.data.data[0].description,
                            dc_rate: res.data.data[0].dc_rate,
                            name: '내용증명'
                        },
                    templateData: templateData
                })
                let referer = new URLSearchParams(window.location.search).get('referer')
                let refererHash = window.location.hash
                if (!!referer && !!refererHash) referer += refererHash
                if (!!referer) this.backUrl = referer
                else this.backUrl = '/category/' + res.data.data[0].idcategory_1
            })

        }
        window.addEventListener('scroll', this.listenToScroll)
        document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount () {
        document.removeEventListener('click', this.handleClick)
    }

    handleClick (e) {
        if (this.node.contains(e.target)) {
            if (e.target.nodeName.toUpperCase() === 'INPUT' || e.target.nodeName.toUpperCase() === 'SELECT' || e.target.className === 'field_tooltip' || e.target.className === 'section_tooltip') {
                // this.loginCheckBeforePayment();
                let userInfo = User.getInfo()
                if (!userInfo) {
                    alert('회원 전용 서비스 입니다. 로그인 또는 회원 가입을 해주세요.')
                    window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
                    // this.setState({
                    //     dialogOpen: true
                    // })
                }
            }
        }
    }

    handleAddress = (data) => {
        let fullAddress = data.address
        let extraAddress = ''
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
        }

        let modifiedData = {}

        modifiedData[this.props.bindData.addressId] = fullAddress
        modifiedData[this.props.bindData.addressId + '_sido'] = data.sido
        modifiedData[this.props.bindData.addressId + '_sigungu'] = data.sigungu

        this.props.setBindData(modifiedData)
        // window.location.href = "javascript:history.go(-2);";
        window.location.href = '#close'
    }

    preCalculate (variable, variable_key) {
        let thisClass = this
        let resultValue = ''
        let lastChangedBindData = this.props.lastChangedBindData
        let highlighted = false

        let parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                if (thisClass.customTag.isCustomTag(name, attribs)) {
                    let { result, binding, notEmptyBinding, allbound, isHighlighted } = thisClass.customTag.invoke(name, attribs)
                    if (!isNaN(result)) result = CommonUtil.pureNumberToCommaNumber(result)
                    if (isHighlighted) highlighted = true
                    resultValue += result
                }
            },
            ontext: function (text) {

            },
            onclosetag: function (tagname) {

            },
            onend () {

            }
        }, { decodeEntities: true })

        parser.write(variable.value)

        this.props.bindData[variable.name] = resultValue
        if (highlighted) lastChangedBindData.push(variable.name)
        this.customTag.setBindData(this.props.bindData, this.props.lastChangedBindData)
    }

    sectionSelect = (section) => {
        section = section.split('|')[0]
        section = Number(section) + 1
        var curSection = this.state.sectionSelect
        // if( section >= 3 && this.state.docData.idcategory_1 != 2 ) {
        //     alert("결제 후 작성하실 수 있습니다.")
        // }
        if (curSection < section) {
            this.setState({
                sectionSelect: section
            })
        }
    }

    showPaymentPop = () => {
        this.setState({
            showPaymentPop: true
        })
    }

    changeHandler = async(v) => {
            await this.history.replace('/preview/'+v);
            await this.setState({
                templateData: {}
            }, () => {
                setTimeout(this.componentDidMount(), 500)
            })
    }

    render () {
        if (!!this.props.templateData) {
            this.nextSave = new Date()
            this.nextSave.setSeconds(this.nextSave.getSeconds() + 3) // Big Date

            if (!!this.props.templateData.variables)
                this.props.templateData.variables.map((variable, variable_key) => this.preCalculate(variable, variable_key))
            this.outputDomID = 0
            this.highlightedOutputDomIDs = []

            this.counter.reset()
            this.customTag.setBindData(this.props.bindData, this.props.lastChangedBindData)
            this.renderHtml = ''
            this.props.templateData.outputSections.map((output, output_key) => this.preParsing(output, output_key))

            let style_Output = {}
            switch (this.state.fixedOutput) {
                case 'top':
                    style_Output = { position: 'fixed', top: '10px' }
                    break
                case 'bottom':
                    style_Output = { position: 'fixed', bottom: '502px' }
                    break
            }

            return (
                <Fragment>
                    <div className="wrap_autoform_main">
                        <div className='mobile autoform_header'>
                            {
                                (!!this.state.mobilePreview) ?
                                    <Fragment>
                                        <div className="back" onClick={() => this.setState({ mobilePreview: false })}>
                                            <img src="/autoform_img/icon-back-m.svg" alt="뒤로가기"/>
                                        </div>
                                        <div className="title-p">자동작성 미리보기</div>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <div className="title">자동작성</div>
                                        <div className="back" onClick={() => window.location.href = this.backUrl}>
                                            <img src="/autoform_img/icon-back-m.svg" alt="뒤로가기"/>
                                        </div>
                                        <div className="preview" onClick={(e) => this.setState({ mobilePreview: true })}>미리보기</div>
                                    </Fragment>
                            }

                        </div>
                        <div className="wrap_autoform_section">

                            {/** 상단 문서 작성하기 버튼 */}
                            <AutoformSave
                                document={this.state.docData.iddocument}
                                category={this.state.docData.idcategory_1}
                                setEditable={this.setEditable}
                                btnEditable={this.state.contentEditable}
                                inputStatus={this.state.inputStatus}
                            />

                            {/** 작성 폼 */}
                            <div className="autoform_main preview" ref={node => this.node = node}>
                                {/** 작성폼 - 미리보기를 눌렀을경우 mobile_hide */}
                                <div className={`autoform_main_input ${this.state.mobilePreview === true && 'mobile_hide'}`}>
                                    <div className='guide'>
                                        <div className='title'>
                                            <h4>입력사항 안내</h4>
                                            <div className={!!this.state.guideOpen ? 'toggle open' : 'toggle'}
                                                 onClick={() => this.setState({
                                                     guideOpen: this.state.guideOpen === true ? false : true
                                                 })}

                                            >{this.state.guideOpen === true ? '닫기' : '열기'}</div>
                                        </div>
                                        {!!this.state.guideOpen ?
                                            <div className='list'>
                                                <ul>
                                                    <li>아래 질문은 문서 작성을 위해 변호사와 상담하는 내용들입니다.</li>
                                                    <li>아래 질문에 답변하셔야 법적조치 등 나머지 내용이 자동으로 완성됩니다.</li>
                                                    <li>질문에 답변을 시작하면 언제든지 결제 후 내용을 확인하실 수 있습니다.</li>
                                                </ul>
                                                {/* <div>아래 버튼을 눌러 문서의 샘플을 확인해보세요.</div>
                                        <button>샘플 보기</button> */}
                                            </div>
                                            :
                                            null
                                        }
                                        {!!this.state.guideOpen ?
                                            <div className="background" onClick={() => this.setState({ guideOpen: false })}></div> : null
                                        }

                                    </div>
                                    <SelectPartnerShip
                                        iddocument={Number(this.props.iddocument)}
                                        changeHandler={this.changeHandler}
                                    />
                                    <SelectLoans
                                        iddocument={Number(this.props.iddocument)}
                                        changeHandler={this.changeHandler}
                                    />
                                    <ArticleOfAssociation
                                        iddocument={Number(this.props.iddocument)}
                                        changeHandler={this.changeHandler}
                                    />
                                    {/* <LaborContract
                                    iddocument={Number( this.props.iddocument )}
                                    changeHandler = {this.changeHandler}
                                >

                                </LaborContract> */}
                                    {
                                        (!!this.state.templateData.inputSections) &&
                                        this.state.templateData.inputSections.map((inputsection, inputsection_key) =>
                                            <InputSection key={inputsection_key} index={inputsection_key} section={inputsection}
                                                          loginCheckBeforePayment={(inputsection_key >= 2) ? this.loginCheckBeforePayment : null}
                                                          showPaymentPop={this.showPaymentPop}
                                                          sectionSelect={this.sectionSelect}
                                            />
                                        )
                                    }
                                    <div className="autoform_output_preview">
                                        <div>
                                            <span>로폼이 제공하는 UI/UX, 프로그램, 콘텐츠, 디자인 등은 특허법, 저작권법, 부정경쟁방지법 등에 의해 보호 받고 있습니다.<br/> 무단 복제, 유사한 변형, 사용 등에 대하여는 <br
                                                className="mobile"/> 법적 책임이 있음을 알려드립니다.</span>
                                            <a href="#learnmore">
                                                자세히 보기 〉
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/** 미리보기 */}
                                <div className={`autoform_main_output ${this.state.mobilePreview === false && 'mobile_hide'}`}>
                                    {/* <AutoformSave document={this.props.document}></AutoformSave> */}
                                    <AutoformPreview ref={this.preview}
                                                     resetLastChangedBindData={this.props.resetLastChangedBindData}
                                                     showPaymentPop={this.state.showPaymentPop}
                                                     loginCheckBeforePayment={this.loginCheckBeforePayment}
                                                     idcategory_1={this.state.docData.idcategory_1}
                                                     sectionSelect={this.state.sectionSelect}
                                                     docData={this.state.docData}
                                                     userInfo={User.getInfo()}
                                                     isMobile={this.state.isMobile}
                                    >
                                        <div className="autoform_output_title">{this.props.templateData.outputTitle}
                                            {this.props.templateData.outputTitle_underline &&
                                            <div>
                                                <div className="textline"></div>
                                                <div className="textline"></div>
                                            </div>
                                            }
                                        </div>
                                        <div className="wrap_autoform_output_content blur" dangerouslySetInnerHTML={{ __html: CommonUtil.htmlDecode(this.renderHtml) }}/>
                                    </AutoformPreview>
                                </div>
                                <PaymentDefault 
                                    docData={this.state.docData}
                                    iddocument={this.props.iddocument}
                                    bindData={this.props.bindData}
                                    loginCheckBeforePayment={this.props.loginCheckBeforePayment}
                                    return_url={'/instructions/' + this.props.iddocument}
                                    docProps={this.props}
                                    open={this.state.payOpen}
                                    onClose={()=>this.setState({payOpen:false})}
                                />
                                <div className="layer-payment mobile">
                                    <div className="infos">
                                        <div className="doc-title">{this.state.docData.h1}</div>
                                        <div className="doc-price">
                                            <span>
                                            {
                                                (Number(this.state.docData.iddocument) === 50) ?
                                                    '19,800'
                                                    :
                                                    <NumberFormat value={this.state.docData.price} displayType={'text'} thousandSeparator={true}></NumberFormat>
                                            }
                                            원</span>
                                            <span><NumberFormat value={this.state.docData.dc_price} displayType={'text'} thousandSeparator={true}></NumberFormat>원</span>
                                        </div>
                                    </div>
                                    <button onClick={() =>  [1, 3, 99].indexOf( Number( this.state.docData.idcategory_1) ) >= 0?this.setState({payOpen:true}):this.loginCheckBeforePayment()}>{(this.state.docData.dc_price === 0) ? '작성하기' : '결제하기'}</button>
                                    {
                                        (Number(this.state.docData.iddocument) === 53 && this.state.mobileAlert53 === true) ?
                                            <div className="mobile-alert-53">
                                                <div className="close" onClick={() => this.setState({ mobileAlert53: false })}><img src="/common/close-x-normal.svg"/></div>
                                                <span>투자계약서는 계약 내용이 길고 복잡하여 <br/> PC에서 작성할 것을 권장드립니다</span>
                                            </div> : null
                                    }
                                </div>
                            </div>

                        </div>
                        <div id="open" className="white_content">
                            <div className="autoform_postcode">
                                {/* <a className="x_btn" href="javascript:history.back();"> */}
                                <a className="x_btn" href="#close">
                                    <img src="/autoform_img/x_btn_white.png" width="48" height="48" alt="x_btn"/>
                                </a>
                                <DaumPostcode onComplete={this.handleAddress}/>
                            </div>
                        </div>
                        <div id="learnmore" className="white_content">
                            <div className='wrap_learmore'>
                                <div className="legalnotice_x_btn">
                                    <a href="#close">
                                        {/* <a href="javascript:history.back();"> */}
                                        <img src="/autoform_img/x_btn_white.png" width="32" height="32" alt="x_btn"/>
                                    </a>
                                </div>
                                <div className='wrap_legalnotice_header'>
                                    <div className='legalnotice_header_name'>
                                        지식재산권 등 보호에 관한 내용
                                    </div>
                                </div>
                                <div className='wrap_learmore_content'>
                                    로폼의 법률문서 자동작성 프로그램에서 제공하는 아웃풋의 현출을 위한 인풋 창의 입력 방식과
                                    내용, 인풋의 특정 내용 선택에 따른 아웃풋 조항의 현출 방식과 내용, 이에 관한 UI/UX, 디자인 등 본 프로그램 구성과 내용은 모두
                                    아미쿠스렉스의 상당한 투자와 노력으로 만들어진 것으로<br></br>
                                    특허법, 저작권법, 부정경쟁방지법 등에 의해 보호받는 프로그램, 콘텐츠 및 저작물입니다.<br></br>
                                    따라서 인풋창과 아웃풋의 구동 방식과 내용, 인풋창의 UI, 디자인의 무단 복제는 물론,
                                    그 내용을 유사한 형식이나 내용으로의 변형, 사용하는 행위는 등 모두 위법하여 금지되는 행위임을 알려드리며,
                                    이에 반하는 일체의 행위는 민사상 책임은 물론 형사상 책임을 지게 되니 이에 유의하시기 바랍니다.
                                </div>
                            </div>
                        </div>
                        <Dialog
                            open={this.state.dialogOpen}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent className="dialog_content member_dialog">
                                <DialogContentText id="alert-dialog-description">
                                    회원 전용 서비스 입니다. <br/>
                                    로그인 또는 회원가입을 해주세요.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions className='dialog_buttons member_dialog'>
                                <Button onClick={(e) => this.goSignIn()} color="primary" autoFocus>
                                    로그인
                                </Button>
                                <Button onClick={(e) => this.goSignUp()} color="primary">
                                    회원가입
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <Payment
                        iddocument={this.props.iddocument}
                        docData={this.state.docData}
                        bindData={this.props.bindData}
                        loginCheckBeforePayment={this.loginCheckBeforePayment}
                        return_url={'/instructions/' + this.props.iddocument}
                    />
                    <div id="promotion" className="white_content">
                        <div className="payment_modal">
                            <div className="title">프로모션 코드 등록
                                <a className="xbtn" href="javascript:history.back();">
                                    <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"></img>
                                </a>
                            </div>

                            <div className="info">
                                프로모션 코드를 입력하세요.
                            </div>
                            <div className="promotion_form">
                                <input className="code_input" placeholder="프로모션 코드를 입력해주세요."/>
                                <button type="button" className="promotion_submit_btn" onClick={() => this.onPromotion(this.props.iddocument)}>등록</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            if (!((window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && this.props.document === 'dropfile')) {
                return (
                    <div></div>
                )
            } else {
                return (
                    <div className='files'>
                        <Files onChange={file => { this.fileReader.readAsText(file[0]) }}>
                            Drop files here or click to upload
                        </Files>
                    </div>
                )
            }
        }
    }

    componentDidUpdate () {
        if (!!this.props.templateData) {
            this.updateScrollInfo()
            if (this.highlightedOutputDomIDs.length > 0) {
                let a4 = document.getElementById('output_a4')
                let isVisible = false
                let selectedId = -1
                let minSelectedGap = 10000000 // BigNumber;
                for (let i = 0; i < this.highlightedOutputDomIDs.length; i++) {
                    let el = document.getElementById(`output_${this.highlightedOutputDomIDs[i]}`)
                    if (!el) continue
                    let pos = el.offsetTop - a4.offsetTop
                    if (a4.scrollHeight < pos && pos < a4.scrollHeight + a4.offsetHeight) {
                        isVisible = true
                        break
                    }
                    selectedId = i

                }
                if (!isVisible) {
                    let el = document.getElementById(`output_${this.highlightedOutputDomIDs[selectedId]}`)
                    let scrollValue = (el.offsetTop - a4.offsetTop) - 80
                    // a4.onscroll(0, (el.offsetTop - a4.offsetTop) - 80);
                    window.$('#output_a4').animate({ scrollTop: scrollValue }, 400)
                }
            }
        }
    }

}

export default withAutoformContext(Prewritemain)
