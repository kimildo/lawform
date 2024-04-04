import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import DaumPostcode from 'react-daum-postcode'
// // import 'scss/autoform/autoformmain.scss'
import AutoformPreview from './autoformpreview'
import AutoformSave from './autoformsave'
import htmlparser from 'htmlparser2'
import CommonUtil from 'utils/commonutil'
import CustomTag from 'utils/customtag'
import Counter from 'utils/counter'
import Files from 'react-files'
import InputSection from './input/inputsection'
import { withAutoformContext } from 'contexts/autoform'
import API from 'utils/apiutil'
import { Dialog, DialogActions, Button } from '@material-ui/core'
// import { number } from 'prop-types';
import jQuery from 'jquery'

window.$ = window.jQuery = jQuery

class Autoformmain extends Component {

    constructor (props) {
        super(props)
        this.state = {
            fixedOutput: 'none',
            inputStatus: 'enable',
            contentEditable: 'false',
            content: '',
            inputOver: { display: 'none' },
            mobilePreview: false,
            iddocuments: null,
            documentData: null
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
        this.nextSave.setMonth(this.nextSave.getMonth() + 10) // Big Date
        this.saveInterval = setInterval(() => {
            let now = new Date()
            if (now > this.nextSave) {
                let document = this.props.document
                let params = {
                    bindData: this.props.bindData,
                    document: document
                }
                API.sendPost('/writing/writingdata/', params).then((res) => {})
                this.nextSave = new Date()
                this.nextSave.setMonth(this.nextSave.getMonth() + 10) // Big Date
            }
        }, 500)
        this.inlineKeys = []

        // IE에서 startsWith 지원이 안됨 재정의해서 씀
        if (!String.prototype.startsWith) {
            console.log('ie')
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0
                return this.indexOf(searchString, position) === position
            }
        }

    }

    preParsing = (output, output_key) => {
        let text = output.law_text
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
                for (var i = 0; i < output.bindFields.length; i++) {
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
            newHtml += `&lt;br/ &gt;&lt;p style='padding: 0 0 5px 0;'&gt;&lt;strong  contentEditable='${thisClass.state.contentEditable}'  &gt${this.counter.increase('provision')}(${output.provision_title})&lt;/strong&gt;&lt;/p&gt;`
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
                            newHtml += ` contentEditable='${thisClass.state.contentEditable}'  editable=${thisClass.outputDomID - 1} &gt;`
                        }
                    } else {
                        newHtml += `&lt;${name} id=output_${thisClass.outputDomID++}`
                        let keys = Object.keys(attribs)
                        for (let i = 0; i < keys.length; i++) {
                            newHtml += ` ${keys[i]}='${attribs[keys[i]]}'`
                        }
                        if (name.toUpperCase() !== 'HR') {
                            newHtml += ` contentEditable='${thisClass.state.contentEditable}' editable=${thisClass.outputDomID - 1} &gt;`
                        } else {
                            newHtml += ` &gt;`
                        }
                    }
                }
            },
            ontext: function (text) {

                let orderText = ''
                if (lastTag.toUpperCase() === 'P') {
                    let { type, str } = thisClass.counter.isOrdering(text)
                    isLast_P_TagOrdering = (type !== undefined)
                    if (isLast_P_TagOrdering) {
                        var numbering = thisClass.counter.increase(type)
                        orderText += `&lt;span contentEditable='${thisClass.state.contentEditable}'  editable=${thisClass.outputDomID++} listtype=${type}  style='text-indent:-18px; padding-left:18px; display:inline-block;'&gt;${numbering} ` // for outdent
                        text = str
                    } else {
                        if (text.trim().startsWith('-')) {
                            isLast_P_TagOrdering = true
                            str = text.substr(1, text.length - 1).trim()
                            orderText += `&lt;span contentEditable='${thisClass.state.contentEditable}'  editable=${thisClass.outputDomID++}  listtype='dash' style='text-indent:-9px; padding-left:9px; display:inline-block;'&gt;- ` // for outdent
                            text = str
                        }
                    }
                } else {
                    if (lastTag.toUpperCase() === 'STRONG') {
                        thisClass.counter.reset()
                    }
                }


                let { overrideText, binding, notEmptyBinding, isHighlighted, fieldtype, lastnumbering, repeatnumber } = CommonUtil.overrideBindingText(bindData, text, false, thisClass.props.lastChangedBindData, '', thisClass.counter.countindex('circle'), '')
                //    let { overrideText, binding, notEmptyBinding, isHighlighted } = CommonUtil.overrideBindingText(bindData, text, false, thisClass.props.lastChangedBindData);

                if (isHighlighted) {
                    thisClass.highlightedOutputDomIDs.push(thisClass.outputDomID - 1)
                }
                if (binding) isThereBinding = true
                if (notEmptyBinding) isThereNotEmptyBinding = true
                if (fieldtype === 'etc' && orderText === '') {
                    thisClass.counter.lastindex('circle', Number(lastnumbering))
                }

                if (overrideText === 'undefined') overrideText = ''
                newHtml += orderText + overrideText

            },
            onclosetag: function (tagname) {
                if (thisClass.inlineKeys.indexOf(output_key) === -1) {
                    if (tagname.toUpperCase() === 'P' && isLast_P_TagOrdering) {
                        newHtml += `&lt;/span&gt;`
                    }
                    newHtml += `&lt;/${tagname}&gt;`
                }
            },
            onend () {

            }
        }, { decodeEntities: true })

        if (!window.document.documentMode) {}

        parser.write(output.law_text)
        parser.end()

        if (!(isThereBinding && !isThereNotEmptyBinding)) {
            this.renderHtml += newHtml
        } else {
            this.counter.rollback()
        }

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

    setEditable = () => {

        if (this.state.inputStatus === 'enable') {
            this.setState({
                alertEdit: true
            })
        }

        if (this.state.contentEditable === 'false') {
            this.props.resetLastChangedBindData()
            this.setState({ contentEditable: 'true', content: this.state.content.split(`contenteditable="false"`).join(`contenteditable="true"`), inputStatus: 'disable' })
        } else {
            let html = document.getElementById('output_content').innerHTML
            let params = {
                idwriting: this.props.document,
                content: html
            }
            API.sendPost('/writing/useredit/', params).then((res) => {})
            this.setState({
                contentEditable: 'false',
                content: html.split(`contenteditable="true"`).join(`contenteditable="false"`),
                inputStatus: 'disable',
                inputOver: { display: 'block' }
            })
        }

    }

    getDocData = (document = this.props.document) => {

        API.sendGet('/writing/loadinfo/' + document).then((res) => {
            const loadData = res.data[0].binddata
            const templateData = res.data[0].template_data
            templateData.outputSections.map((output, output_key) => this.preParsing(output, output_key))

            this.props.setTemplateData(templateData)
            const bindData = JSON.parse(loadData)
            this.props.setBindData(bindData, true)
            this.setState({
                iddocuments: res.data[0].iddocuments,
                documentData: res.data[0]
            })

            if (!!this.state.documentData && !!this.state.documentData.writing_peer_idx && this.state.documentData.writing_peer_processing_status !== 3) {
                this.setState({
                    inputStatus: 'disable'
                })
            }

        }).then(() => {
            API.sendPost('/writing/loadedit', { idwriting: document }).then((res) => {
                if (res.status === 'ok') {
                    if (!!res.data.content && res.data.content.length > 0) {
                        let content = res.data.content.split(`contenteditable="true"`).join(`contenteditable="${this.state.contentEditable}"`)
                        this.setState({
                            content: content,
                            inputStatus: 'disable',
                            inputOver: { display: 'block' }
                        })
                    }
                }
            })
        })
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

    clickHandler (e) {
        let classes = e.target.className.split(' ')
        if (classes.indexOf('disable') > -1) {
            this.setState({
                alertDisable: true
            })
        }
    }

    render () {

        //console.log('state', this.state)
        //console.log('templateData', this.props.templateData)
        //console.log('this.props.document', this.props.document)
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

            // switch (this.state.fixedOutput) {
            //     case 'top': style_Output = { position: 'fixed', top: '10px' }; break;
            //     case 'bottom': style_Output = { position: 'fixed', bottom: '502px' }; break;
            // }
            return (
                <div className="wrap_autoform_main">
                    <div className='mobile autoform_header'>
                        {
                            (!!this.state.mobilePreview) ?
                                <Fragment>
                                    <div className="back" onClick={() => this.setState({ mobilePreview: false })}>
                                        <img src="/autoform_img/icon-back-m.svg" alt="뒤로가기"/>
                                    </div>
                                    <div className="title-p">자동작성</div>
                                </Fragment>
                                :
                                <Fragment>
                                    <div className="title">자동작성</div>
                                    <div className="back" onClick={() => window.location.href = '/mydocument'}>
                                        <img src="/autoform_img/icon-back-m.svg" alt="뒤로가기"/>
                                    </div>
                                    <div className="preview" onClick={(e) => this.setState({ mobilePreview: true })}>미리보기</div>
                                </Fragment>
                        }

                    </div>
                    <div className="wrap_autoform_section">
                        <AutoformSave
                            document={this.props.document}
                            setEditable={this.setEditable}
                            btnEditable={this.state.contentEditable}
                            inputStatus={this.state.inputStatus}
                            getDocData={this.getDocData}
                        />
                        <div className="autoform_main">
                            <div className="input-over" style={this.state.inputOver}>
                                문서를 직접 편집 후에는 수정할 수 없습니다.<br/>
                                다시 입력을 원하시는 경우 상단의 새로작성을 클릭해주세요.
                            </div>
                            <div className={`autoform_main_input ${this.state.inputStatus} ${this.state.mobilePreview === true && 'mobile_hide'}`}
                                 onClick={(e) => this.clickHandler(e)}>
                                {
                                    this.props.templateData.inputSections.map((inputsection, inputsection_key) =>
                                        <InputSection key={inputsection_key} index={inputsection_key} section={inputsection} />
                                    )
                                }
                                <div className="autoform_output_preview">
                                    <div>
                                        <span>로폼이 제공하는 UI/UX, 프로그램, 콘텐츠, 디자인 등은 특허법, 저작권법, 부정경쟁방지법 등에 의해 보호 받고 있습니다.<br/> 무단 복제, 유사한 변형, 사용 등에 대하여는 법적 책임이 있음을 알려드립니다.</span>
                                        <a href="#learnmore">
                                            자세히 보기 〉
                                            {/* <img src="/autoform_img/learnmore_btn.svg" width="80" height="19" alt="learnmore_btn" /> */}
                                        </a>
                                    </div>
                                </div>

                            </div>
                            <div className={`autoform_main_output autoform ${this.state.mobilePreview !== true && 'mobile_hide'}`}>
                                <AutoformPreview ref={this.preview} resetLastChangedBindData={this.props.resetLastChangedBindData}>
                                    <div className="autoform_output_title">{this.props.templateData.outputTitle}
                                        {this.props.templateData.outputTitle_underline &&
                                        <div>
                                            <div className="textline"/>
                                            <div className="textline"/>
                                        </div>
                                        }
                                    </div>
                                    <div className="wrap_autoform_output_content" id="output_content"
                                         dangerouslySetInnerHTML={{ __html: (this.state.content.length > 0) ? this.state.content : CommonUtil.htmlDecode(this.renderHtml) }}
                                         ref="output_content"/>
                                    {
                                        (!!this.state.iddocuments && this.state.iddocuments === 50) &&
                                        <div className="autoform-labor-event" style={{ display: this.state.showEvent50Pop }}>
                                            <div className="close" onClick={() => this.setState({ showEvent50Pop: 'none' })}>
                                                <img src="/common/small-x-10-white.svg" alt="이벤트 팝업 닫기"/>
                                            </div>
                                            <Link href="/preview/34"><img src="/images/event/event-50-write.svg"/></Link>
                                        </div>
                                    }
                                </AutoformPreview>
                            </div>
                        </div>
                    </div>
                    <div id="open" className="white_content">
                        <div className="autoform_postcode">
                            {/* <a className="x_btn" href="javascript:history.back();"> */}
                            <a className="x_btn" href="#close">
                                <img src="/autoform_img/x_btn_white.png" width="48" height="48" alt="x_btn"/>
                            </a>
                            <DaumPostcode onComplete={this.handleAddress} className="postcode"/>
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
                                아미쿠스렉스의 상당한 투자와 노력으로 만들어진 것으로<br/>
                                특허법, 저작권법, 부정경쟁방지법 등에 의해 보호받는 프로그램, 콘텐츠 및 저작물입니다.<br/>
                                따라서 인풋창과 아웃풋의 구동 방식과 내용, 인풋창의 UI, 디자인의 무단 복제는 물론,
                                그 내용을 유사한 형식이나 내용으로의 변형, 사용하는 행위는 등 모두 위법하여 금지되는 행위임을 알려드리며,
                                이에 반하는 일체의 행위는 민사상 책임은 물론 형사상 책임을 지게 되니 이에 유의하시기 바랍니다.
                            </div>
                        </div>
                    </div>
                    <Dialog
                        open={this.state.alertDisable}
                        onClose={() => this.setState({ alertDisable: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_disable"
                        scroll="body"
                    >
                        <div className="dialog-title">
                            {(!!this.state.documentData && !!this.state.documentData.writing_peer_idx && this.state.documentData.writing_peer_processing_status !== 3) ? '변호사 서비스 진행 중에는' : '문서 편집 중에는'}
                            <br/>좌측 질문지 영역을 수정할 수 없습니다.
                        </div>
                        <DialogActions className="buttons">
                            <Button
                                onClick={() => this.setState({ alertDisable: false })}
                                color="primary"
                                className="cancel">
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else {
            if (!((window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && this.props.document === 'dropfile')) {
                return <div/>
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

    componentDidMount () {

        let document = this.props.document
        if (this.props.params) {

        } else {
            if (!((window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && document === 'dropfile')) {
                this.getDocData(document)
            }
        }

        window.addEventListener('scroll', this.listenToScroll)

    }

    componentWillUnmount () {

    }

    componentDidUpdate = () => {

        if (!!this.props.templateData) {
            let highlight = window.$('.highlight:first').closest('p').position()
            let a4 = window.$('#output_a4')
            if (!!highlight) {
                console.log('highlight', highlight.top, a4)
                let pos = highlight.top + a4.scrollTop()
                console.log('pos', pos)
                a4.animate({ scrollTop: (pos - 50) }, 400)
            }
        }
    }

}

export default withAutoformContext(Autoformmain)