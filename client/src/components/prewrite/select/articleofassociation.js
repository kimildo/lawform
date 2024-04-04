import React, { Component } from 'react';

class ArticleOfAssociation extends Component {
    

    componentDidMount() {
    }

    render() {
        return (
            (  [20,26].indexOf( Number( this.props.iddocument ) ) > -1 )&&
            <div class="autoform_inputsection">
                <div class="autoform_inputsection_sectiontitle">
                    <div class="autoform_input_section_name_table">
                        <div class="autoform_input_section_name">
                            <div class="wrap_autoform_input_section_name">
                                <div style={{fontSize: 20}}>
                                    <div style={{display:'block',whiteSpace:'nowrap'}}>정관 유형</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="autoform_input_section_tooltip"></div>
                </div>
                <div class="section_guide">
                    <p><strong>유의사항</strong></p>
                    <p>원시정관은 회사 설립 시 작성하는 정관이며, 변경정관은 회사 설립 후 정관을 변경할 사정이 발생된 경우 작성하는 것으로 양자는 발기인의 기재 여부 등에 차이가 있습니다.
따라서, 현 상황에 맞는 정관 유형을 정확히 선택하시길 바랍니다. (선택사항이 달라지면, 그 유형에 따른 정관을 다시 구매하셔야 합니다.) </p>
                </div>
                <span>
                    <div>
                        <div class="autoform_inputsection_field down">
                            <div class="autoform_inputsection_fieldtitle">
                                <span class="field_title">주식회사 설립 여부</span>
                                <div class="autoform_input_section_tooltip"></div>
                            </div>
                            <div class="autoform_inputsection_wrapobjects">
                                <select class="autoform_inputsection_select" name="select_partnership" onChange={(e)=>this.props.changeHandler(e.target.value)}>
                                    <option class="autoform_inputsection_select" hidden="hidden" selected="selected">클릭하여 정관 유형을 선택해주세요.</option>
                                    <option class="autoform_inputsection_select" value={26}>주식회사를 설립할 예정으로 정관이 필요함(원시정관)</option>
                                    <option class="autoform_inputsection_select" value={20}>이미 주식회사를 설립했으나 정관변경이 필요함(변경정관)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default ArticleOfAssociation;