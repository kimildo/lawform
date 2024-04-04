import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';

class InputText extends Component {

    constructor(props) {
        super(props);
    }

    onInput = (e) => {
        let modifiedData = {};
        modifiedData[e.target.name] = e.target.value;
        this.props.setBindData(modifiedData);
    }

    componentWillUnmount() {
        let modifiedData = {};
        modifiedData[this.props.bindingId] = '';
        this.props.setBindData(modifiedData);
    }

    renderOptions(option, key) {
        if (key === 0) {
            return (
                <option className="autoform_inputsection_select" key={key} hidden>
                    {option.content}
                </option>
            )
        }
        else {
            return (
                <option className="autoform_inputsection_select" key={key} >
                    {option.content}
                </option>
            )
        }
    }

    necessaryCheck() {
        let necessary = this.props.necessary;
        
        let necessaryCheck = {};

        if(necessary){            
            necessaryCheck = this.props.bindingId;
            this.props.checkNecessary(necessaryCheck);
        }
    }

    componentDidMount() {
        this.necessaryCheck();
    }

    render() {
        let bindingId = this.props.bindingId;
        let options = this.props.options;
        return (
            <select className="autoform_inputsection_select" 
                defaultValue={options[0].content} name={bindingId} 
                value={this.props.bindData[bindingId]} 
                onChange={this.onInput}>

                {options.map((option, optionKey) => this.renderOptions(option, optionKey))}
            </select>
        )
    }
}

export default withAutoformContext(InputText);