import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';

class InputCheckbox extends Component {

    
    onInput = (e) => {
        let modifiedData = {};
        
        modifiedData[e.target.name + '_checked'] = e.target.checked;
        
        if (e.target.checked === true) modifiedData[e.target.name] = e.target.value;
        else modifiedData[e.target.name] = '';

        this.props.setBindData(modifiedData);
    }

    componentWillUnmount() {
        let modifiedData = {};
        modifiedData[this.props.bindingId + '_checked'] = '';
        modifiedData[this.props.bindingId] = '';
        this.props.setBindData(modifiedData);
    }
    // necessaryCheck() {
    //     let necessary = this.props.necessary;
        
    //     let necessaryCheck = {};

    //     if(necessary){            
    //         necessaryCheck = this.props.bindingId;
    //         this.props.checkNecessary(necessaryCheck);
    //     }
    // }

    // componentDidMount() {
    //     this.necessaryCheck();
    // }

    render() {
        let bindingId = this.props.bindingId;
        let content = this.props.content;
        return (
            <div className="autoform_inputsection_wrapcheckbox">
                <input className="autoform_inputsection_checkbox" id={bindingId} type="checkbox" name={bindingId} 
                       value = {content} checked={this.props.bindData[bindingId + '_checked']} 
                       onClick={this.onInput}>
                </input>
                <label htmlFor={bindingId} className="autoform_inputsection_checkboxlabel">
                    <div className="autoform_inputsection_checkbox_text">
                        {content}
                    </div>
                </label>
            </div>
        )
    }
}

export default withAutoformContext(InputCheckbox);