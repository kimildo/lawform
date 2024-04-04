import React, { Component } from 'react';

class LaborContract extends Component {
    

    componentDidMount() {
    }

    render() {
        return (
            (  [30,56].indexOf( Number( this.props.iddocument ) ) > -1 )&&
            <div class="autoform_inputsection">
                <div class="autoform_inputsection_sectiontitle">
                    <div class="autoform_input_section_name_table">
                        <div class="autoform_input_section_name">
                            <div class="wrap_autoform_input_section_name">
                                <div style={{fontSize: 20}}>
                                    <div style={{display:'block',whiteSpace:'nowrap'}}>근로 유형</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="autoform_input_section_tooltip"></div>
                </div>
                {/* <div class="section_guide">
                    <p><strong>유의사항</strong></p>
                    <p></p>
                </div> */}
                <span>
                    <div>
                        <div class="autoform_inputsection_field down">
                            <div class="autoform_inputsection_fieldtitle">
                                <span class="field_title">근로 유형</span>
                                <div class="autoform_input_section_tooltip"></div>
                            </div>
                            <div class="autoform_inputsection_wrapobjects">
                                <select class="autoform_inputsection_select" name="select_partnership" onChange={(e)=>this.props.changeHandler(e.target.value)}>
                                    <option class="autoform_inputsection_select" hidden="hidden" selected="selected">클릭하여 근로 유형을 선택해주세요.</option>
                                    <option class="autoform_inputsection_select" value={30}>정규직, 기간제(계약직)</option>
                                    <option class="autoform_inputsection_select" value={56}>단시간제(알바등)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default LaborContract;