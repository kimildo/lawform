import React, { Component } from 'react';

class PartnerShip extends Component {
    
    constructor(props) {
        super(props);
        this.state={
            tooltip:false
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            (  [31,32].indexOf( Number( this.props.iddocument ) ) > -1 )&&
            <div class="autoform_inputsection" style={{marginTop:!!this.state.tooltip?170:0}}>
                <div class="autoform_inputsection_sectiontitle">
                    <div class="autoform_input_section_name_table">
                        <div class="autoform_input_section_name">
                            <div class="wrap_autoform_input_section_name">
                                <div style={{fontSize: 20}}>
                                    <div style={{display:'block',whiteSpace:'nowrap'}}>동업 유형</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="autoform_input_section_tooltip">
                        <div>
                            <div class="wrap_tooltip" id="tooltip_10" >
                                <div class="tooltip" style={{display:!!this.state.tooltip?'block':'none'}}>
                                    <div class="tooltip_x" onClick={()=> this.setState({tooltip:false})}><img src="/autoform_img/x_btn_white.png" width="20" height="20" alt="x_btn"/></div>
                                    <div></div><div></div>
                                    <div>
                                        <p><strong># 변호사의 설명</strong></p>
                                        <p>동업자가 동업을 추진하기 위해 주식회사의 형태로 할지? 아니면 주식회사가 아닌 조합, 콘소시엄 등 법인격 없는 사업체로 할지?에 따라 의사결정 방법, 이익분배 방법 등이 상이한 바, 위 두가지 유형 중 하나를 먼저 선택하셔야 합니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="section_tooltip" style={{backgroundSize: 'cover', width: 30, height: 30}} onClick={()=>this.setState({tooltip:true})}></div>
                        </div>
                    </div>
                </div>
                <span>
                    <div>
                        <div class="autoform_inputsection_field down">
                            <div class="autoform_inputsection_fieldtitle">
                                <span class="field_title">동업후 주식회사 설립 여부</span>
                                <div class="autoform_input_section_tooltip"></div>
                            </div>
                            <div class="autoform_inputsection_wrapobjects">
                                <select class="autoform_inputsection_select" name="select_partnership" onChange={(e)=>this.props.changeHandler(e.target.value)}>
                                    <option class="autoform_inputsection_select" hidden="hidden" selected="selected">클릭하여 주식회사 설립 여부를 선택해주세요.</option>
                                    <option class="autoform_inputsection_select" value={32}>주식회사를 설립할 예정</option>
                                    <option class="autoform_inputsection_select" value={31}>주식회사를 설립할 예정 없음</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default PartnerShip;