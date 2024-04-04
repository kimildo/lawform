import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';

class InputRadio extends Component {
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
    
    renderRadio(radio, key) {
        let bindingId = this.props.bindingId;
        switch (this.props.direction) {
            case 'down':
                return (
                    <div className="autoform_inputsection_wrapradio" key={key}>
                        <input className="autoform_inputsection_radio" type="radio"
                            name={bindingId} id={bindingId + key}
                            value={radio.content}
                            onChange={this.onInput}>
                        </input>
                        <label htmlFor={bindingId + key} className="autoform_inputsection_radiolabel">
                            <span className="autoform_inputsection_radio_text">{radio.content}</span>
                        </label>
                    </div>
                )
            case 'right':
            default:
                return (
                    <span className="autoform_inputsection_wrapradio" key={key}>
                        <input className="autoform_inputsection_radio" type="radio"
                            name={bindingId} id={bindingId + key}
                            value={radio.content}
                            onChange={this.onInput}>
                        </input>
                        <label htmlFor={bindingId + key} className="autoform_inputsection_radiolabel">
                            <span className="autoform_inputsection_radio_text">{radio.content}</span>
                        </label>
                    </span>
                )
                break;
        }
    }

    render() {
        let radios = this.props.radios;

        return (
            <div className="autoform_inputsection_wrap_radio">
                {radios.map((radio, key) => this.renderRadio(radio, key))}
            </div>

        )
    }
}

export default withAutoformContext(InputRadio);