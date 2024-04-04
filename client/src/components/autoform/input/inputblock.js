import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';
import CommonUtil from '../../../utils/commonutil'
import Autoformmain from '../autoformmain';
class InputBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockRepeatCnt: 1,
            blockRepeat: 'true'
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

    onBlockAdd() {
        let blockRepeatCnt = this.state.blockRepeatCnt;
        blockRepeatCnt++;

        this.setState({ blockRepeatCnt: blockRepeatCnt, });
        this.props.setBindData({blockRepeatCnt: blockRepeatCnt,
            blockRepeat: 'true'    });

    }

    onBlockSub() {
        let blockRepeatCnt = this.state.blockRepeatCnt;
        blockRepeatCnt--;
        if (blockRepeatCnt <= 0) {
            blockRepeatCnt = 1;
            alert("한 개 이상의 항목은 남겨 두어야 합니다.")
        }
        else {
            this.setState({ blockRepeatCnt: blockRepeatCnt });
            this.props.setBindData({blockRepeatCnt: blockRepeatCnt,
                blockRepeat: 'true'    });
            let modifiedData = {};
            let bindingId = this.props.bindingId;
            modifiedData[bindingId+'_'+blockRepeatCnt] = '';
            this.props.setBindData(modifiedData);
        }
    }

    componentDidMount() {
        let blockRepeatCnt = this.state.blockRepeatCnt;
        let blockRepeat = this.state.blockRepeat;
        
        if(blockRepeat === 'true'){
            this.props.setBindData({blockRepeatCnt: blockRepeatCnt,
                                    blockRepeat: 'true'    });
        }
    }


    render() {
        let blockRepeatCnt = this.state.blockRepeatCnt;
        let bindingId = this.props.bindingId;

        let inputBlock = [];


        for (let i = 0; i < blockRepeatCnt; i++) {

            inputBlock.push(
                <div className="wrap_autoform_inputsection_text">

                    <input className="autoform_inputsection_text"
                        type="text"
                        name={bindingId}
                        id={i}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onInput}>
                    </input>

                    <input className="autoform_inputsection_text"
                        type="text"
                        name={bindingId}
                        id={i}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onInput}>
                    </input>
                    <input className="autoform_inputsection_text"
                        type="text"
                        name={bindingId}
                        id={i}
                        value={this.props.bindData[bindingId]}
                        onChange={this.onInput}>
                    </input>
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
                {inputBlock}
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <div className="repeat_button" onClick={() => { this.onBlockAdd() }}>
                        <div style={{ display: 'table-cell',verticalAlign:'bottom'  }}>
                            <img src='/detail_img/plus.png' alt='symbol' height="26"></img>
                        </div>
                        <div style={{ fontSize: '14px', display: 'table-cell',verticalAlign:'middle', paddingBottom:'6px' }}>추가</div>
                    </div>
                    <div className="repeat_button" onClick={() => { this.onBlockSub() }}>
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

export default withAutoformContext(InputBlock);