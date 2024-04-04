import React, { Component } from 'react';
import ToolTip from './tooltip'
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';
import InputText from './inputtext';
import InputSelect from './inputselect';
import InputCheckbox from './inputcheckbox';
import InputRadio from './inputradio';
import InputAddress from './inputaddress';
import InputCalendar from './inputcalendar';
import InputEtc from './inputetc';

class InputField extends Component {

    isVisible() {
        let field = this.props.field;
        let visible = true;
        if (!!field.caseCount) {
            let isAllTrue = true;
            let isOneTrue = false;
            for (let index = 0; index < field.caseFields.length; index++) {
                if (field.caseFields[index].bool === 'true' ||  !field.caseFields[index].bool){
                    if (field.caseFields[index].value === this.props.bindData[field.caseFields[index].name]) {
                        isOneTrue = true;
                    }
                    else isAllTrue = false;
                }
                else if (field.caseFields[index].bool === 'false'){
                    if (field.caseFields[index].value !== this.props.bindData[field.caseFields[index].name]) {
                        isOneTrue = true;
                    }
                    else isAllTrue = false;
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
                            <InputText key={`${i}_${key}`} text={text} repeat={repeat} index={index} necessary={necessary}/>
                        )
                    });
                    break;
                case 'select':
                    components.push(
                        <InputSelect key={i} select={obj.select}
                            options={obj.selectFields} bindingId={obj.selectBinding} necessary={necessary}/>);
                    break;
                case 'checkbox':
                    obj.checkboxFields.map((checkbox, key) => {
                        components.push(
                            <InputCheckbox key={`${i}_${key}`}
                                content={checkbox.content}
                                bindingId={checkbox.binding} necessary={necessary}/>
                        )
                    });
                    break;
                case 'radio':
                    components.push(
                        <InputRadio key={i}
                            radios={obj.radioFields}
                            direction={obj.radioDirection}
                            bindingId={obj.radioBinding} />
                    );
                    break;
                case 'address':
                    components.push(
                        <InputAddress key={i}
                            bindingId_address={obj.addressBinding}
                            bindingId_addressDetail={obj.addressDetailBinding} 
                            repeat={repeat} index={index} necessary={necessary}/>
                    );
                    break;
                case 'calendar':
                    components.push(
                        <InputCalendar key={i}
                            bindingId={obj.calendar_Binding}
                            immovableLeftText = {obj.calendar_immovableLeftText}
                            immovableRightText = {obj.calendar_immovableRightText}
                            placeholder = {obj.calendar_placeholder}
                        />
                    );
                    break;
                case 'extra_input':
                    components.push(
                        <InputEtc key={i}
                            bindingId={obj.extraBinding}
                            direction = {obj.extraType}
                        />
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
                        <ToolTip type='field' uniqueKey={this.props.uniqueKey} exampletooltip={field.exampletooltip} explaintooltip={field.explaintooltip} guidetooltip={field.guidetooltip}/>
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

export default withAutoformContext(InputField);