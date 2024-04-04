import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';
import CommonUtil from '../../../utils/commonutil'
class InputText extends Component {

    onNumber = (e) => {
        let value = e.target.value;
        value = value.replace(/[A-Za-z!@#$%^&.,*+\-()]/g, '');
        value = CommonUtil.pureNumberToCommaNumber(value);
        let modifiedData = {};
        let repeat = this.props.repeat;
        let index = this.props.index;
        if(repeat === 'true'){
            // modifiedData[e.target.name+'_'+index] = e.target.value;
            modifiedData[e.target.name+'_'+index] = value;
        }

        else{
            modifiedData[e.target.name] = value;
        }
        // modifiedData[e.target.name] = value;
        this.props.setBindData(modifiedData);
    }

    onInput = (e) => {
        if(!!e.target.value){
            // e.target.style.border='solid blue 1px';
            // console.log(e.target)
        }
        let modifiedData = {};
        let repeat = this.props.repeat;
        let index = this.props.index;
        if(repeat === 'true'){
            modifiedData[e.target.name+'_'+index] = e.target.value;
        }

        else{
            modifiedData[e.target.name] = e.target.value;
        }

        this.props.setBindData(modifiedData);
    }

    onlyNumberInput( Ev )
    {
        if (window.event) // IE코드
            var code = window.event.keyCode;
        else // 타브라우저
            var code = Ev.which;
     
        if ((code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code === 8 || code === 9 || code === 13 || code === 46)
        {
            window.event.returnValue = true;
            return;
        }
     
        if (window.event)
            window.event.returnValue = false;
        else
            Ev.preventDefault();    
    }


    onUserId = (e) => {
        let value = e.target.value;
        value = value.replace(/[A-Za-z!@#$%^&.,*+\()]/g, '');
        let modifiedData = {};
        let repeat = this.props.repeat;
        let index = this.props.index;
        if(repeat === 'true'){
            // modifiedData[e.target.name+'_'+index] = e.target.value;
            modifiedData[e.target.name+'_'+index] = value;
        }

        else{
            modifiedData[e.target.name] = value;
        }
        this.props.setBindData(modifiedData);
    }


    componentWillUnmount() {
        let modifiedData = {};
            modifiedData[this.props.text.binding] = '';
        this.props.setBindData(modifiedData);
    }

    necessaryCheck() {
        let necessary = this.props.necessary;
        
        let necessaryCheck = {};

        if(necessary){            
            necessaryCheck = this.props.text.binding;
            this.props.checkNecessary(necessaryCheck);
        }
    }

    componentDidMount() {
        this.necessaryCheck();
    }

    render() {
        let text = this.props.text;
        let bindingId = text.binding;
        let index = text.binding;

        let immovableLeft = { display: '' };
        let immovableRight = { display: '' };
        let immovableInput = { display: '' };

        if (!!text.immovableLeftText || !!text.immovableRightText) {

            if (!text.immovableLeftText || text.immovableLeftText === '') {

                immovableRight = { display: ''};
                immovableInput = { borderRadius: "4px"};
                immovableLeft = { display: 'none' };
            }

            if (!text.immovableRightText || text.immovableRightText === '') {
                immovableRight = { display: 'none' };

                immovableInput = { borderRadius: "4px" };
                immovableLeft = { display: ''};
            }


            return (
                <div className="wrap_autoform_inputsection_text_dual" 
                // name={bindingId+'cover'}
                >
                    <div style={immovableLeft} className="wrap_immovableDualLeftText">
                        <span>{text.immovableLeftText}</span>
                    </div>
                    <div className="wrap_autoform_inputsection_text_dual_input">

                        {
                            text.currency === true &&
                            <input style={immovableInput}
                                className="autoform_inputsection_text_dual_input"
                                placeholder={text.placeholder}
                                type="text"
                                name={bindingId}
                                onKeyDown = {this.onlyNumberInput}
                                value={this.props.bindData[bindingId]}
                                pattern="/[0-9]/"
                                onInput={this.onNumber}>
                            </input>
                        }
                        {
                            text.currency !== true && text.userid !== true &&
                            <input style={immovableInput}
                                className="autoform_inputsection_text_dual_input"
                                placeholder={text.placeholder}
                                type="text"
                                name={bindingId}
                                value={this.props.bindData[bindingId]}
                                onChange={this.onInput}>
                            </input>
                        }
                         {
                        text.userid === true &&
                        <input className="autoform_inputsection_text_dual_input"
                            placeholder={text.placeholder}
                            type="text"
                            id={bindingId}
                            name={bindingId}
                            // onKeyDown = {this.onlyNumberInput}
                            value={this.props.bindData[bindingId]}
                            onChange={this.onUserId} maxLength="8">
                        </input>
                        }
                    </div>
                    <div style={immovableRight} className="immovableDualRightText">
                        {text.immovableRightText}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="wrap_autoform_inputsection_text"
                // name={bindingId+'_cover'}
                ><div>
                    {
                    text.userid !== true &&
                    <input className="autoform_inputsection_text"
                        placeholder={text.placeholder}
                        type="text"
                        name={bindingId}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onInput}>
                    </input>
                    }
                    {
                    text.userid === true &&
                    <input className="autoform_inputsection_text"
                        placeholder={text.placeholder}
                        type="text"
                        id={bindingId}
                        name={bindingId}
                        // onKeyDown = {this.onlyNumberInput}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onUserId} maxLength="8">
                    </input>
                    }
                    </div>
                </div>
  
            )
        }
    }
}

export default withAutoformContext(InputText);