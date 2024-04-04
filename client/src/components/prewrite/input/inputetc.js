import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';
import CommonUtil from '../../../utils/commonutil'
import Prewritemain from '../prewritemain';
class InputEtc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extraRepeatCnt: 1,
            extraRepeat: 'true'
        }
    }

  
    onInput = (e) => {
        let modifiedData = {};
        modifiedData[e.target.name+'_'+e.target.id] = e.target.value;
        this.props.setBindData(modifiedData);
        // Autoformmain.preParsing('①'+e.target.value)
    }


    componentWillUnmount() {
        let modifiedData = {};
        // modifiedData[this.props.text.binding] = '';
        this.props.setBindData(modifiedData);
    }

    onExtraAdd() {
        let extraRepeatCnt = this.state.extraRepeatCnt;
        extraRepeatCnt++;

        this.setState({ extraRepeatCnt: extraRepeatCnt, });
        this.props.setBindData({extraRepeatCnt: extraRepeatCnt,
            extraRepeat: 'true'    });

    }

    onExtraSub() {
        let extraRepeatCnt = this.state.extraRepeatCnt;
        extraRepeatCnt--;
        if (extraRepeatCnt <= 0) {
            extraRepeatCnt = 1;
            alert("한 개 이상의 항목은 남겨 두어야 합니다.")
        }
        else {
            this.setState({ extraRepeatCnt: extraRepeatCnt });
            this.props.setBindData({extraRepeatCnt: extraRepeatCnt,
                extraRepeat: 'true'    });
            let modifiedData = {};
            let bindingId = this.props.bindingId;
            modifiedData[bindingId+'_'+extraRepeatCnt] = '';
            this.props.setBindData(modifiedData);
        }
    }

    componentDidMount() {
        let extraRepeatCnt = this.state.extraRepeatCnt;
        let extraRepeat = this.state.extraRepeat;
        
        if(extraRepeat === 'true'){
            this.props.setBindData({extraRepeatCnt: extraRepeatCnt,
                                    extraRepeat: 'true'    });
        }
    }


    render() {
        let extraRepeatCnt = this.state.extraRepeatCnt;
        let bindingId = this.props.bindingId;

        let inputExtras = [];


        for (let i = 0; i < extraRepeatCnt; i++) {

            inputExtras.push(
                <div className="wrap_autoform_inputsection_text">
                    <input className="autoform_inputsection_text"
                        type="text"
                        name={bindingId}
                        id={i}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onInput}>
                    </input>

                </div>
            );
        }

        return (
            <div style={{paddingTop:'10px'}}>
                {inputExtras}
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <div className="repeat_button" onClick={() => { this.onExtraAdd() }}>
                        <div style={{ display: 'table-cell',verticalAlign:'bottom'  }}>
                            <img src='/detail_img/plus.png' alt='symbol' height="26"></img>
                        </div>
                        <div style={{ fontSize: '14px', display: 'table-cell',verticalAlign:'middle', paddingBottom:'6px' }}>추가</div>
                    </div>
                    <div className="repeat_button" onClick={() => { this.onExtraSub() }}>
                        <div style={{ display: 'table-cell',verticalAlign:'bottom'  }}>
                            <img src='/detail_img/minus.png' alt='symbol' height="26"></img>
                        </div>
                        <div style={{ fontSize: '14px', display: 'table-cell',verticalAlign:'middle', paddingBottom:'6px' }}>삭제</div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withAutoformContext(InputEtc);