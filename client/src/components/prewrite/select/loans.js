import React, { Component } from 'react';

class Loans extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            tooltipDisplay:'none',
            marginTop:0
        }
        this.interest = React.createRef();
        this.moneyback = React.createRef();
    }

    componentDidMount() {
    }
    changeHandler=(e)=>{
        // console.log( 'e', e.target.name )
        let interest = this.interest.current.value.toUpperCase();
        let moneyback = this.moneyback.current.value.toUpperCase();
        if( interest === 'Y' && moneyback === 'Y' ) {
            alert('문서 준비중입니다.')
        }
        if( interest === 'Y' && moneyback === 'N' ) {
            this.props.changeHandler(46);
        }
        if( interest === 'N' && moneyback === 'Y' ) {
            this.props.changeHandler(45);
        }
        if( interest === 'N' && moneyback === 'N' ) {
            this.props.changeHandler(9);
        }
    }

    tooltipOpen = (e) =>{
        this.setState({
            tooltipDisplay:'block',
            marginTop:180
        });
    }

    tooltipClose = (e) =>{
        this.setState({
            tooltipDisplay:'none',
            marginTop:0
        });
    }


    render() {
        return (
            (  [9,45,46].indexOf( Number( this.props.iddocument ) ) > -1 )&&
            <div class="autoform_inputsection"  style={{marginTop:this.state.marginTop}}>
                <div class="autoform_inputsection_sectiontitle">
                    <div class="autoform_input_section_name_table">
                        <div class="autoform_input_section_name">
                            <div class="wrap_autoform_input_section_name">
                                <div style={{fontSize: 20}}>
                                    <div style={{display:'block',whiteSpace:'nowrap'}}>돈 빌려준 유형</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="section_guide">
                    <p><strong>유의사항</strong></p>
                    <p>돈을 빌려준 조건(이자 약정 여부)과 현재 빌려준 돈을 일부 받았는지 여부에 따라서 지급명령을 통해 받을 수 있는 원금 및 이자 등의 금액이 달라집니다. 따라서, 돈을 빌려준 조건과 일부 받은 사실 유무를 아래에서 정확히 선택하세요.  (선택 사항이 달라지면, 그 유형에 따른 지급명령 신청서를 다시 구매 하셔야 합니다.)</p>
                </div>
                <span>
                    <div>
                        <div class="autoform_inputsection_field down">
                            <div class="autoform_inputsection_fieldtitle">
                                <span class="field_title">이자 약정이 있는지 여부</span>
                                <div class="autoform_input_section_tooltip"></div>
                            </div>
                            <div class="autoform_inputsection_wrapobjects">
                                <select class="autoform_inputsection_select" name="select_interest" ref={this.interest} onChange={(e)=>this.changeHandler(e)}>
                                    <option class="autoform_inputsection_select" hidden="hidden" selected="selected">클릭하여 이자 약정 여부를 선택해주세요</option>
                                    <option class="autoform_inputsection_select" value='Y'>이자 약정이 있음 </option>
                                    <option class="autoform_inputsection_select" value='N'>이자 약정이 없음 </option>
                                </select>
                            </div>
                            <div class="autoform_inputsection_fieldtitle">
                                <span class="field_title">돈을 변제 받은 적이 있는지 여부</span>
                                <div class="autoform_input_section_tooltip"></div>
                            </div>
                            <div class="autoform_inputsection_wrapobjects">
                                <select class="autoform_inputsection_select" name="select_moneyback" ref={this.moneyback} onChange={(e)=>this.changeHandler(e)}>
                                    <option class="autoform_inputsection_select" hidden="hidden" selected="selected">클릭하여 돈을 받은 적이 있는지 선택해주세요.</option>
                                    <option class="autoform_inputsection_select" value='N'>돈을 전부 못받음</option>
                                    <option class="autoform_inputsection_select" value='Y'>돈을 일부 받음</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default Loans;