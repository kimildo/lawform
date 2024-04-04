import CommonUtil from './commonutil';
import Jurisdiction from './jurisdiction';
import moment from 'moment';
class CustomTag {
    constructor(bindData) {
        this.bindData = bindData;
        this.lastChangedBindData = [];
        let thisClass = this;
        this.customTags = {
            'nowdate': { func: thisClass._nowdate },
            'eval': { func: thisClass._eval },
            'stampprice': { func: thisClass._stampprice },
            'transmittalfee': { func: thisClass._transmittalfee },
            'jurisdiction': { func: thisClass._jurisdiction },
            'switch': { func: thisClass._switch },
            'group': { func: thisClass._group },
            'dateadd' : { func : thisClass._dateadd },
            'nowdateadd' : { func : thisClass._nowdateadd }
        }
    }

    setBindData(bindData, lastChangedBindData) {
        this.bindData = bindData;
        this.lastChangedBindData = lastChangedBindData;
    }

    isCustomTag(tagName) {
        return !!this.customTags[tagName] && !!this.customTags[tagName].func;
    }

    invoke(tagName, attribs) {
        if (!!this.customTags[tagName] && !!this.customTags[tagName].func) {
            return this.customTags[tagName].func(attribs);
        }
        else return;
    }

    _nowdate = (attribs) => {
        return { result: CommonUtil.dateTimeToYYMMDD(new Date(), 'KR') };
    }
    _dateadd = (attribs) => {
        var bindingId = attribs.origindate;
        if ( !!this.bindData[bindingId] ) {
            var plusedDate = moment(this.bindData[bindingId]).add(attribs.plus, 'days');
            var date = moment(plusedDate).format('YYYY.MM.DD');  
            return {result: date, binding : true, notEmptyBinding: true};
        }
        else return {result: "", binding: true, notEmptyBinding: false};
    }

    _nowdateadd = (attribs) => {
        var date = moment().add(attribs.plus, 'days').format('YYYY.MM.DD');
        return {result: date, binding : true, notEmptyBinding: true};
    }

    _eval = (attribs) => {
        let result = '';
        let isThereBinding = false;
        let isThereNotEmptyBinding = false;

        if (!!attribs.exp) {
            let { overrideText, binding, notEmptyBinding } = CommonUtil.overrideBindingText(this.bindData, attribs.exp, true);
            if (binding) isThereBinding = true;
            if (notEmptyBinding) {
                isThereNotEmptyBinding = true;
                try {
                    result += eval(overrideText);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        return { result: result, binding: isThereBinding, notEmptyBinding: isThereNotEmptyBinding };
    }

    _jurisdiction = (attribs) => {
        let result = '';
        let isThereBinding = false;
        let isThereNotEmptyBinding = false;

        if (attribs.binding) {
            var bindingId = attribs.binding;
            isThereBinding = true;
            if (!!this.bindData[bindingId]) {
                isThereNotEmptyBinding = true;
                let sido = this.bindData[CommonUtil.plusUnderBar(bindingId, 'sido')];
                let sigungu = this.bindData[CommonUtil.plusUnderBar(bindingId, 'sigungu')];

                if (attribs.type === 'prosecution') {
                    result += Jurisdiction.findProsecutor(sido, sigungu);
                } else { //court is default
                    result += Jurisdiction.findCourt(sido, sigungu);
                }
            }
        }
        return { result: result, binding: isThereBinding, notEmptyBinding: isThereNotEmptyBinding };
    }

    _stampprice = (attribs) => {
        let result = 1000;
        let isThereBinding = false;
        let isThereNotEmptyBinding = false;

        if (attribs.binding) {
            var bindingId = attribs.binding;
            isThereBinding = true;

            if (!!this.bindData[bindingId] && !isNaN(CommonUtil.commaNumberToPureNumber(this.bindData[bindingId]))) {
                isThereNotEmptyBinding = true;
                let principal = CommonUtil.commaNumberToPureNumber(this.bindData[bindingId]);
                let normalStampPrice = 0;
                if (principal < 10000000) {
                    normalStampPrice = principal * 0.0050;
                } else if (principal < 100000000) {
                    normalStampPrice = principal * 0.0045 + 5000;
                } else if (principal < 1000000000) {
                    normalStampPrice = principal * 0.0040 + 55000;
                } else { // 10억 이상
                    normalStampPrice = principal * 0.0035 + 555000;
                }
                switch (attribs.type) {
                    case 'paymentorder': normalStampPrice = normalStampPrice * 0.1; break;  // 지급명령 1/10
                    case 'reconciliation': normalStampPrice = normalStampPrice * 0.2; break;   // 화해신청 1/5
                }
                if (normalStampPrice < 1000) normalStampPrice = 1000;
                normalStampPrice = Math.floor(normalStampPrice * 0.01) * 100;
                result = normalStampPrice;
            }
        }
        if (!!result) result = CommonUtil.pureNumberToCommaNumber(result);
        return { result: result, binding: isThereBinding, notEmptyBinding: isThereNotEmptyBinding };
    }

    _group = (attribs) => {
        let result = '';
        let isThereBinding = false;
        let isThereNotEmptyBinding = false;
        let highLighted = false;

        let resultArray = [];
        for (let i = 0; i < 10; i++) {
            let itemName = `item${i}`;
            if (!!attribs[itemName]) {
                let text = attribs[itemName];
                let { overrideText, binding, notEmptyBinding, allBound, isHighlighted } = CommonUtil.overrideBindingText(this.bindData, text, false, this.lastChangedBindData)
                
                if (!!overrideText) resultArray.push(overrideText);
                if (binding) isThereBinding = true;
                if (notEmptyBinding) isThereNotEmptyBinding = true;
                if (isHighlighted) highLighted = isHighlighted;
            }
        }
        if (resultArray.length === 0) { result = ''; }
        else if (resultArray.length === 1) { result = resultArray[0]; }
        else {
            let len = resultArray.length;
            for (let i = 0; i < len; i++) {
                result += resultArray[i];
                if (i === len - 1) { }
                else if (i === len - 2) result += ' 및 ';
                else result += ', ';
            }
        }

        return { result: result, binding: isThereBinding, notEmptyBinding: isThereNotEmptyBinding, isHighlighted: highLighted };
    }

    _transmittalfee = (attribs) => {

    }

    _switch = (attribs) => {
        let result = '';
        let isThereBinding = false;
        let isThereNotEmptyBinding = false;
        let highlighted = false;

        if (!!attribs.binding && this.bindData[attribs.binding]) {

            let caseIndex = 1;
            let compareCase = this.bindData[attribs.binding];
            let resultValue = undefined;

            while (true) {
                if (!!attribs[`case${caseIndex}`] && !!attribs[`value${caseIndex}`]) {
                    if (compareCase === attribs[`case${caseIndex}`]) {
                        resultValue = attribs[`value${caseIndex}`];
                    }
                }
                else break;
                caseIndex++;
            }

            if (resultValue === undefined && !!attribs.default) {
                resultValue = attribs.default;
            }
            if (!!resultValue) {
                let { overrideText, binding, notEmptyBinding, allBound, isHighlighted } = CommonUtil.overrideBindingText(this.bindData, resultValue, false, this.lastChangedBindData);

                if (binding) isThereBinding = true;
                if (notEmptyBinding) isThereNotEmptyBinding = true;
                if (isHighlighted) highlighted = isHighlighted;
                resultValue = overrideText;

                result += resultValue;
            }
        }
        if (highlighted) {
            console.trace();
        }
        return { result: result, binding: isThereBinding, notEmptyBinding: isThereNotEmptyBinding, isHighlighted: highlighted };
    }



}
export default CustomTag;
