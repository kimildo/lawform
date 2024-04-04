module.exports = {
    dateTimeToYYMMDD (datetime, type = 'dot') {
        let year = datetime.getFullYear()
        let year2 = year % 100
        let month = datetime.getMonth() + 1
        let day = datetime.getDate()
        switch (type) {
            case 'KR':
                return `${year}년 ${month}월 ${day}일`
            case 'dot2':
                return `${year2}. ${month}. ${day}.`
            case 'dot':
            default:
                return `${year}. ${month}. ${day}.`
        }
    },

    commaNumberToPureNumber (text) {
        return text.replace(/,/g, '')
    },

    pureNumberToCommaNumber (num) {
        let regexp = /\B(?=(\d{3})+(?!\d))/g
        return num.toString().replace(regexp, ',')
    },

    plusUnderBar (str, additionalStr) {
        return str + '_' + additionalStr
    },

    overrideBindingText (bindData, text, forEval, highlight_Ids, fieldtype, numbering, repeatnumber) {
        let nowIdx = 0
        let newText = ''
        let isThereBinding = false
        let isThereNotEmptyBinding = false
        let isAllBound = true
        let isHighlighted = false
        const circleOrder = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮']

        while (true) {
            let openBind = text.indexOf('{{', nowIdx)
            if (openBind === -1) break
            let closeBind = text.indexOf('}}', openBind)
            isThereBinding = true
            newText += text.substr(nowIdx, openBind - nowIdx) //Normal Text
            let bindingId = text.substr(openBind + 2, closeBind - (openBind + 2))
            let bindType = bindingId.substr(0, 4)
            let bindRepeat = []
            let bindExtra = []
            if (bindType === 'rep_') {
                if (bindData.fieldRepeat === 'true') {
                    let repeatText = []
                    for (let i = 0; i <= bindData.fieldRepeatCnt; i++) {
                        bindRepeat[i] = bindingId + '_' + i
                        if (bindData && bindData[bindRepeat[i]]) {
                            isThereNotEmptyBinding = true
                            if (forEval) {
                                let numberText = this.commaNumberToPureNumber(bindData[bindRepeat[i]])
                                if (isNaN(numberText)) numberText = 0
                                newText += numberText
                            } else {
                                if (highlight_Ids && highlight_Ids.indexOf(bindRepeat[i]) >= 0) {
                                    isHighlighted = true
                                    repeatText[i] = `&lt;span style="background-color:#15376c; color:white; padding-left:10px; padding-right:10px; font-weight: bold;"&gt${bindData[bindRepeat[i]]}&lt;/span&gt;`
                                } else {
                                    repeatText[i] = bindData[bindRepeat[i]] // Binding  
                                }
                            }
                        } else {
                            if (forEval) newText += '0'
                            isAllBound = false
                        }
                        fieldtype = 'repeat'
                    }
                    return {
                        overrideText: repeatText,
                        binding: isThereBinding,
                        notEmptyBinding: isThereNotEmptyBinding,
                        allBound: isAllBound,
                        isHighlighted: isHighlighted,
                        fieldtype: fieldtype,
                        repeatnumber: bindData.fieldRepeatCnt
                    }
                }

            }

            if (bindType === 'etc_') {
                if (bindData.extraRepeat === 'true') {
                    for (let i = 0; i <= bindData.extraRepeatCnt; i++) {
                        bindExtra[i] = bindingId + '_' + i
                        if (bindData && bindData[bindExtra[i]]) {
                            isThereNotEmptyBinding = true
                            if (forEval) {
                                let numberText = this.commaNumberToPureNumber(bindData[bindExtra[i]])
                                if (isNaN(numberText)) numberText = 0
                                newText += numberText
                            } else {

                                if (highlight_Ids && highlight_Ids.indexOf(bindExtra[i]) >= 0) {
                                    isHighlighted = true
                                    newText += `&lt;span style="background-color:#15376c; color:white; padding-left:10px; padding-right:10px; font-weight: bold;"&gt${bindData[bindExtra[i]]}&lt;/span&gt;`
                                } else {
                                    newText += `&lt;p style="text-indent:-18px; padding-left:31px;"&gt&lt;span&gt${circleOrder[numbering]}&lt;/span &lt;span&gt&nbsp${bindData[bindExtra[i]]}&lt;/span&gt&lt;/p&gt;`
                                    if (bindData.extraRepeatCnt !== i) numbering++
                                }
                            }
                        } else {
                            if (forEval) newText += '0'
                            isAllBound = false
                        }
                    }
                }
                fieldtype = 'etc'
            }

            if (bindData && bindData[bindingId]) {
                isThereNotEmptyBinding = true
                if (forEval) {
                    let numberText = this.commaNumberToPureNumber(bindData[bindingId])
                    if (isNaN(numberText)) numberText = 0
                    newText += numberText
                } else {
                    if (highlight_Ids && highlight_Ids.indexOf(bindingId) >= 0) {
                        isHighlighted = true
                        newText += `&lt;span  class="showText highlight" style="background-color:#15376c; color:white; padding-left:10px; padding-right:10px; font-weight: bold;"&gt${bindData[bindingId]}&lt;/span&gt;`
                    } else newText += `&lt;span class="showText"&gt${bindData[bindingId]}&lt;/span&gt;` // Binding
                }
            } else {
                if (forEval) newText += '0'
                isAllBound = false
            }

            nowIdx = closeBind + 2
        }
        newText += text.substr(nowIdx, text.length - nowIdx)
        return {
            overrideText: newText,
            binding: isThereBinding,
            notEmptyBinding: isThereNotEmptyBinding,
            allBound: isAllBound,
            isHighlighted: isHighlighted,
            fieldtype: fieldtype,
            lastnumbering: numbering
        }
    },

    htmlDecode (input) {
        let e = document.createElement('div')
        e.innerHTML = input
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
    },

    htmlEncode (s) {
        let el = document.createElement('div')
        el.innerText = el.textContent = s
        s = el.innerHTML
        return s
    },

    josa (word) {
        if (typeof word !== 'string') return null
        let lastLetter = word[word.length - 1]
        let uni = lastLetter.charCodeAt(0)
        if (uni < 44032 || uni > 55203) return null
        return (uni - 44032) % 28 !== 0
    },

    // IE 여부
    isIE () {
        return /*@cc_on!@*/!!window.document.documentMode
    }

}