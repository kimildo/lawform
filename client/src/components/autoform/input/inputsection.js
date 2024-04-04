import React, { Component } from 'react';
import { Textfit } from 'react-textfit';
import { withAutoformContext } from '../../../contexts/autoform';
import ToolTip from './tooltip'
import InputField from './inputfield'
//import '../../../scss/autoform/autoformmain.scss';

class InputSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldRepeatCnt: 1
        }
    }

    onFieldAdd() {
        let fieldRepeatCnt = this.state.fieldRepeatCnt;
        let section = this.props.section;
        let fieldRepeat = section.fieldrepeat;
        fieldRepeatCnt++;

        this.setState({ fieldRepeatCnt: fieldRepeatCnt });
        
        this.props.setBindData({fieldRepeatCnt: fieldRepeatCnt,
                                fieldRepeat: fieldRepeat    });
    }

    onFieldSub() {
        let fieldRepeatCnt = this.state.fieldRepeatCnt;
        fieldRepeatCnt--;
        if (fieldRepeatCnt <= 0) {
            fieldRepeatCnt = 1;
            alert("한 개 이상의 항목은 남겨 두어야 합니다.")
        }
        this.setState({ fieldRepeatCnt: fieldRepeatCnt });
    }

    componentDidMount() {
        let fieldRepeatCnt = this.state.fieldRepeatCnt;
        let section = this.props.section;
        let fieldRepeat = section.fieldrepeat;
        
        // if(fieldRepeat === 'true'){
        //     this.props.setBindData({fieldRepeatCnt: fieldRepeatCnt,
        //                             fieldRepeat: fieldRepeat    });
        // }
    }


    sectionReset = (e, index=0) => {
        let bindData = this.props.bindData;
        let section =  this.props.section;
        section.fields.map((item)=>{
            item.objdataFields.map((field)=>{
                switch (field.type) {
                    case 'select': 
                        delete bindData[field.selectBinding];
                    break;
                    case 'text': 
                        field.textFields.map((item)=>{
                            delete bindData[item.binding];
                        })
                    break;
                    case 'address': 
                    delete bindData[field.addressBinding];
                    break;
                    case 'calendar':
                    delete bindData[field.calendar_Binding];
                    break;
                }
            });
        })
        if(window.confirm('초기화 하시겠습니까?')){
            this.props.setBindData(bindData);
        }
    }

    render() {
        let fieldRepeatCnt = this.state.fieldRepeatCnt;
        let uniqueKey = `${this.props.index}`;
        let section = this.props.section;

        let inputFields = [];

        for (let i = 0; i < fieldRepeatCnt; i++) {
            for (let j = 0; j < section.fields.length; j++) {
                let idx = i * section.fields.length + j;
                let newUniqueKey = `${uniqueKey}|${idx}`;
                // if (j+1 < section.fields.length) {
                    if (j >= 0) {
                    // if (section.fields[j].depth === '1' && section.fields[j+1].depth === undefined ) {
                    //     inputFields.push(
                    //         <div className="depth1">
                    //             <InputField key={idx} index={idx} field={section.fields[j]} uniqueKey={newUniqueKey} />
                    //         </div>
                    //     );
                    // }
                    if (section.fields[j].depth === '1' && section.fields[j-1].depth === '1' ) {
                        inputFields.push(
                            <div className="depth1" key={i}>
                                <InputField key={idx} index={i} field={section.fields[j]} uniqueKey={newUniqueKey} />
                            </div>
                        );
                    }
                    else {
                        inputFields.push(
                            <InputField key={idx} index={i} field={section.fields[j]} uniqueKey={newUniqueKey} repeat={section.fieldrepeat} />
                        );
                    }
                }


            }
        }

        return (
            <div className="autoform_inputsection">
                <div className="autoform_inputsection_sectiontitle">
                    <div className="autoform_input_section_name_table">
                        <div className="autoform_input_section_name">
                            <div className="wrap_autoform_input_section_name">
                                <Textfit mode="single" forceSingleModeWidth={false}>{section.title}</Textfit>
                            </div>
                        </div>
                    </div>
                    <ToolTip type='section' uniqueKey={uniqueKey} guidetooltip={section.guidetooltip} exampletooltip={section.exampletooltip} explaintooltip={section.explaintooltip} />
                    <div className="autoform_input_section_step"> 
                    <span className="autoform_input_section_step_num">{this.props.index + 1}</span> / {this.props.templateData.inputSections.length} 단계
                    {/* <span className="icon-refresh" onClick={(e)=>this.sectionReset(e,this.props.index)}><img src="/autoform_img/icon-refresh.svg" /></span> */}
                    </div>
                </div>
                {section.hasGuideTooltip === 'true' &&
                    <div className="section_guide" dangerouslySetInnerHTML={{ __html: section.guidetooltip }}></div>
                }

                {inputFields}

                {section.fieldrepeat === 'true' &&<div>
                    <button className="repeat_button_plus" onClick={() => { this.onFieldAdd() }}>+</button> 
                    
                    <button className="repeat_button_minus" onClick={() => { this.onFieldSub() }}>-</button>
                    </div>
                }
            </div>
        );
    }
}


export default withAutoformContext(InputSection);