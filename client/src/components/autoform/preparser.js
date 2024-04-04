import React, { Component, Fragment } from 'react'
// import 'scss/autoform/autoformmain.scss';
import htmlparser from 'htmlparser2'
import CommonUtil from 'utils/commonutil'
import CustomTag from 'utils/customtag'
import Counter from 'utils/counter'
// import API from 'utils/apiutil';

const Preparser = (props) => {
    let customTag = new CustomTag(props.bindData)
    let renderHtml = ''
    // renderHtml += `&lt;div className="autoform_output_title"&gt;${props.templateData.outputTitle}`;
    // if( !!props.templateData.outputTitle_underline ){
    //     renderHtml += `
    //     &lt;div&gt;
    //         &lt;div className="textline"&gt;&lt;/div&gt;
    //         &lt;div className="textline"&gt;&lt;/div&gt;
    //     &lt;/div&gt;
    //     `
    // }
    // renderHtml += `&lt;/div&gt;`;

    let counter = new Counter()
    let inlineKeys = []
    let outputDomID = 0

    let preParsing = (output, output_key) => {

        let text = output.law_text
        let newHtml = ''
        let bindData = props.bindData
        let isThereBinding = false
        let isThereNotEmptyBinding = false

        if (output.counterreset === true) {
            counter.resetUnderProvision()
        }

        counter.snapshot()

        if (output.caseCount > 0) {
            let isVisible = false
            let allAnd = true
            let allOr = false
            for (let i = 0; i < output.caseCount; i++) {
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
                        if (!!props.bindData && !!output.bindFields[i].bindData) {
                            titleVisible = true
                        }
                    }
                }
            } else if (!output.bindFields) {
                titleVisible = true
            }

            if (titleVisible) {
                newHtml += `&lt;br/ &gt;&lt;p style='text-align: center; font-size:16px;'&gt;&lt;strong &gt${counter.increase('title')} ${output.section_title}&lt;/strong&gt;&lt;/p&gt;`
            }
        }

        if (!!output.provision_title) {
            if (output.Addendum) {
                counter.reset()
                newHtml += `&lt;br/ &gt;&lt;p style='padding: 0 0 5px 0;'&gt;&lt;strong&gt부 칙&lt;/strong&gt;&lt;/p&gt;`
            }
            newHtml += `&lt;br/ &gt;&lt;p style='padding: 0 0 5px 0;'&gt;&lt;strong &gt${counter.increase('provision')}(${output.provision_title})&lt;/strong&gt;&lt;/p&gt;`
        }

        let parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                if (customTag.isCustomTag(name, attribs)) {
                    let { result, binding, notEmptyBinding, isHighlighted } = customTag.invoke(name, attribs)
                    //if (!isNaN(result)) result = CommonUtil.pureNumberToCommaNumber(result);
                    newHtml += result
                    if (binding) isThereBinding = true
                    if (notEmptyBinding) isThereNotEmptyBinding = true
                } else {
                    lastTag = name
                    if (inlineKeys.indexOf(output_key - 1) === 1 && attribs.style !== 'display: inline;') {
                        newHtml += `&lt;/span&gt;&lt;/p&gt;`
                    }
                    if (name.toUpperCase() === 'P' && attribs.style === 'display: inline;') {
                        /** inline  */
                        if (inlineKeys.indexOf(output_key) === -1) {
                            inlineKeys.push(output_key)
                        }
                        inlineKeys.sort()
                        /** /inline  */

                        if (inlineKeys.indexOf(output_key - 1) === -1) {
                            newHtml += `&lt;${name} id=output_${outputDomID++}`
                            let keys = Object.keys(attribs)
                            for (let i = 0; i < keys.length; i++) {
                                newHtml += ` ${keys[i]}='${attribs[keys[i]].replace('display: inline;', '')}'`
                            }
                            newHtml += `editable=${outputDomID - 1} &gt;`
                        }
                    } else {
                        newHtml += `&lt;${name} id=output_${outputDomID++}`
                        let keys = Object.keys(attribs)
                        for (let i = 0; i < keys.length; i++) {
                            newHtml += ` ${keys[i]}='${attribs[keys[i]]}'`
                        }
                        if (name.toUpperCase() !== 'HR') {
                            newHtml += `  editable=${outputDomID - 1} &gt;`
                        } else {
                            newHtml += ` &gt;`
                        }

                    }
                }
            },
            ontext: function (text) {
                let orderText = ''
                if (lastTag.toUpperCase() === 'P') {
                    let { type, str } = counter.isOrdering(text)
                    isLast_P_TagOrdering = (type !== undefined)
                    if (isLast_P_TagOrdering) {
                        let numbering = counter.increase(type)
                        orderText += `&lt;span listtype=${type}  style='text-indent:-18px; padding-left:18px; display:inline-block;'&gt;${numbering} ` // for outdent
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
                } else {
                    if (lastTag.toUpperCase() === 'STRONG') {
                        counter.reset()
                    }
                }
                let { overrideText, binding, notEmptyBinding, isHighlighted, fieldtype, lastnumbering, repeatnumber } = CommonUtil.overrideBindingText(bindData, text, false, false, '', counter.countindex('circle'), '')

                if (binding) isThereBinding = true
                if (notEmptyBinding) isThereNotEmptyBinding = true
                if (fieldtype === 'etc' && orderText === '') {
                    counter.lastindex('circle', Number(lastnumbering))
                }

                if (overrideText === 'undefined')
                    overrideText = ''
                newHtml += orderText + overrideText
                // }

            },
            onclosetag: function (tagname) {
                if (inlineKeys.indexOf(output_key) === -1) {
                    if (tagname === 'p' || tagname === 'P') {
                        if (isLast_P_TagOrdering) {
                            newHtml += `&lt;/span&gt;`
                        }
                    }
                    newHtml += `&lt;/${tagname}&gt;`
                } else {

                }

            },
            onend () {
            }
        }, { decodeEntities: true })


        parser.write(output.law_text)
        parser.end()
        if (!(isThereBinding && !isThereNotEmptyBinding)) {
            renderHtml += newHtml
        } else {
            counter.rollback()
        }
    }

    props.templateData.outputSections.map((output, output_key) => preParsing(output, output_key))
    return CommonUtil.htmlDecode(renderHtml)
}

export default Preparser
