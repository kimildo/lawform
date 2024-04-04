import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';

class InputAddress extends Component {
    
    onInput = (e) => {
        let modifiedData = {};
        let repeat = this.props.repeat;
        let index = this.props.index;

        if (e.target.id === 'address') {
            if(repeat === 'true'){
                modifiedData['addressId_'+index] = e.target.name;
            }
            else{
                modifiedData['addressId'] = e.target.name;
            }
            modifiedData['addressId'] = e.target.name;
            window.location ='#open';
        } else { 
            if(repeat === 'true'){
                modifiedData[e.target.name+'_'+index] = e.target.value;
            }
            else{
                modifiedData[e.target.name] = e.target.value;
            }
        }
        this.props.setBindData(modifiedData);
    }
    
    componentWillUnmount() {
        let modifiedData = {};
        let repeat = this.props.repeat;
        let index = this.props.index;   
        modifiedData[this.props.bindingId_address] = '';
        modifiedData[this.props.bindingId_addressDetail] = '';
        this.props.setBindData(modifiedData);
    }

    necessaryCheck() {
        let necessary = this.props.necessary;
        
        let necessaryCheck = {};

        if(necessary){            
            necessaryCheck = this.props.bindingId_address;
            this.props.checkNecessary(necessaryCheck);
        }
    }

    componentDidMount() {
        this.necessaryCheck();
    }

    render() {
        return (
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
                                type="input" name={this.props.bindingId_address}
                                value={this.props.bindData[this.props.bindingId_address]}
                                onClick={this.onInput}
                                >
                            </input>
                    </div>
                    </div>
                </div>
                <div className="wrap_autoform_inputsection_addresstext">
                    <input className="autoform_inputsection_text"
                        placeholder="나머지 주소를 입력하세요."
                        type="text"
                        name={this.props.bindingId_addressDetail}
                        value={this.props.bindData[this.props.bindingId_addressDetail]}
                        onChange={this.onInput}>
                    </input>
                </div>
            </div>
        )
    }
}

export default withAutoformContext(InputAddress);