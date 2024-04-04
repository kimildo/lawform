import React, { Component } from 'react';
import moment from 'moment';
// import '../../scss/autoform/autoformmain.scss';

class InputField extends Component {

    isVisible() {
        let field = this.props.field;
        let visible = true;
        if (!!field.caseCount) {
            let isAllTrue = true;
            let isOneTrue = false;
            for (let index = 0; index < field.caseFields.length; index++) {
                if (field.caseFields[index].bool === 'true' ||  !field.caseFields[index].bool){
                    isAllTrue = false;
                }
                else if (field.caseFields[index].bool === 'false'){
                     isAllTrue = false;
                }          
            }
            if ((field.casetype === 'AND' && isAllTrue) || (field.casetype !== 'AND' && isOneTrue)) {
                visible = true;
            }
            else visible = false;
        }
        return visible;
    }

    applyDepth() {
        switch (this.props.field.depth) {
            // case '1': return { marginLeft: '55px', width: '300px', backgroundColor: '#eaeeef' }
            case '1': return { marginLeft: '55px', width: '300px', backgroundColor: '#eaeeef', paddingBottom: '11px' }
            case '2': return { marginLeft: '164px', width: '240px' }
            case '3': return { marginLeft: '246px', width: '158px' }
            default: // Including 0 or undefined
                return {};
        }
    }
    applyDerictionStyle() {
        switch (this.props.field.direction) {
            case 'down': return { }
            case 'right2': return { display: 'inline-block', width: '185px',  marginLeft: '-6px', padding: "3px 9px 0px 9px" }
            case 'right3': return { display: 'inline-block', width: '119px',  marginLeft: '-6px', padding: "3px 9px 0px 9px", }
            case 'right3-1': return { display: 'inline-block', width: '159px',  marginLeft: '-6px', padding: "3px 9px 0px 9px" }
            case 'right3-2': return { display: 'inline-block', width: '109px',  marginLeft: '-6px', padding: "3px 9px 0px 9px" }
            case 'right3-3': return { display: 'inline-block', width: '89px',  marginLeft: '-6px', padding: "3px 9px 0px 9px" }
            default: // Including 0 or undefined
                return {};
        }
    }
    applyDerictionClassDeriction1() {
        let fieldClass = 'autoform_inputsection_field';
        fieldClass += ' '+this.props.field.direction; 
        return  fieldClass;
    }
    applyDerictionClassDeriction2() {
        let fieldClass = 'autoform_inputsection_field_null';
        fieldClass += ' '+this.props.field.direction; 
        return  fieldClass;
    }
    

    getObjComponents(index) {
        let components = [];
        let objdata = this.props.field.objdataFields;
        let repeat = this.props.repeat;
        let necessary = this.props.field.necessary;
        for (let i = 0; i < objdata.length; i++) {
            let obj = objdata[i];
            switch (obj.type) {
                case 'text':
                    obj.textFields.map((text, key) => {
                        components.push(
                            <div className="wrap_autoform_inputsection_text" key={key}>
                                <div>
                                    <input className="autoform_inputsection_text"
                                        placeholder={text.placeholder}
                                        type="text"
                                        name={text.binding}
                                        onChange={this.onInput}>
                                    </input>
                                </div>
                            </div>
                        )
                    });
                    break;
                case 'select':
                    components.push(
                        <select className="autoform_inputsection_select" 
                            defaultValue={obj.selectFields[0].content} name={obj.selectBinding} 
                            key={obj.selectFields}
                            onChange={this.onInput}>
                            {obj.selectFields.map((option, optionKey) => <option className="autoform_inputsection_select" key={optionKey} >{option.content}</option>)}
                        </select>
                    );
                    break;
                case 'checkbox':
                    obj.checkboxFields.map((checkbox, key) => {
                        components.push(
                            <div className="autoform_inputsection_wrapcheckbox" key={key}>
                                <input className="autoform_inputsection_checkbox" id={checkbox.binding} type="checkbox" name={checkbox.binding} 
                                    value = {checkbox.content}
                                    onClick={this.onInput}>
                                </input>
                                <label htmlFor={checkbox.binding} className="autoform_inputsection_checkboxlabel">
                                    <div className="autoform_inputsection_checkbox_text">
                                        {checkbox.content}
                                    </div>
                                </label>
                            </div>
                        )
                    });
                    break;
                case 'calendar':
                let styleLeftText = { display: 'none' };
                let styleRightText = { display: 'none' };
                let bindCalendar = '';
                let current_date = moment().format('YYYY.MM.DD');
                if(bindCalendar !== "undefined"){
                }
                    components.push(
                        <div className="autoform_inputsection_calendar" key={i}>
                            <div style={styleLeftText} className="calendar_immovableLeftText">{this.props.immovableLeftText}</div>
                            <div className="wrap_calender">
                                <input type="text" readOnly="" placeholder={current_date} className="form-control"></input>
                            </div>
                            <div style={styleRightText} className="calendar_immovableRightText">{this.props.immovableRightText}</div>
                        </div>
                    );
                    break;

                case 'address':
                if(bindCalendar !== "undefined"){
                }
                    components.push(
                        <div>
                            <div className="wrap_immovableLeftAddress">
                                {/* <div className="immovableLeftAddress">
                                    <span>주소</span>
                                </div> */}
                                <div style={{borderRadius:'4px', paddingRight:'22px'}}>
                                <div className="wrap_autoform_inputsection_address">
                                        <input className="autoform_inputsection_address"
                                            placeholder="클릭하여 주소를 검색하세요."
                                            id="address"
                                            type="input" 
                                            >
                                        </input>
                                </div>
                                </div>
                            </div>
                            <div className="wrap_autoform_inputsection_addresstext">
                                <input className="autoform_inputsection_text"
                                    placeholder="나머지 주소를 입력하세요."
                                    type="text"
                                    >
                                </input>
                            </div>
                        </div>
                    );
                    break;
                        
            }
        }
        return components;
    }
    render() {
        let field = this.props.field;
        let index = this.props.index;
        let repeat = this.props.repeat;
        let additionalStyle = this.applyDepth(field.depth);
        let additionalDerictionStyle = this.applyDerictionStyle(field.direction);
        let additionalDerictionClass1 = this.applyDerictionClassDeriction1(field.direction);
        let additionalDerictionClass2 = this.applyDerictionClassDeriction2(field.direction);
        let additionalTitle; 

        if (field.depth === '1'){
            additionalTitle = { paddingTop: '11px'}
        }

        if (this.isVisible()) {
            return (
                <div style={additionalDerictionStyle}>
                { ((!!field.title && field.title !== '') )   &&
                <div style={additionalStyle} className={additionalDerictionClass1}>                    
                    <div style={additionalTitle} className="autoform_inputsection_fieldtitle">
                    {repeat === 'true' &&
                        <span className="field_title">{field.title} ({index+1})</span>
                    }
                    {(repeat === 'false' || !repeat) && !field.necessary &&
                        <span className="field_title">{field.title}</span>
                    }
                    {(repeat === 'false' || !repeat) && field.necessary &&
                        <span className="field_title">{field.title} <span style={{color:'red', fontSize:'20px'}}>*</span></span>
                    }
                        {/* <ToolTip type='field' uniqueKey={this.props.uniqueKey} exampletooltip={field.exampletooltip} explaintooltip={field.explaintooltip} guidetooltip={field.guidetooltip}/> */}
                    </div>
                    <div className="autoform_inputsection_wrapobjects">
                        
                        {(repeat === 'false' || !repeat) &&
                            this.getObjComponents()
                        }
                        {repeat === 'true' &&
                            this.getObjComponents(index)
                        }
                    </div>
                </div>
                }
                { (field.title === "" || !field.title)   &&
                <div style={additionalStyle} className={additionalDerictionClass2}>       
                        {/* <ToolTip type='field' uniqueKey={this.props.uniqueKey} exampletooltip={field.exampletooltip} explaintooltip={field.explaintooltip} /> */}
                    <div className="autoform_inputsection_wrapobjects">
                        {this.getObjComponents()}
                    </div>
                </div>
                }
                </div>
            );
        } return (<div></div>);
    }
}

export default InputField;