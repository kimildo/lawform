import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '../../common/modal'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import API from '../../../utils/apiutil'
import User from '../../../utils/user'

const styles = theme => ({
    root: {
        marginTop: 24,
        marginLeft: 24
    }
});

class Nda extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: User.getInfo(),
            show_modal: false,
            answers: [],
            isDoc: 'N'
        }
    }

    showModal = () => {
        this.setState({
            show_modal: true
        })
    }

    closeModal = () => {
        this.setState({
            show_modal: false
        })
    }

    handleChange = (e, idx) => {
        this.state.answers[idx] = e.target.value;
    }

    checkIsDoc = (e) => {
        this.setState({
            isDoc: e.target.value
        })
    }

    handleSubmit = (e) => {

        const qLen = 2
        if (this.state.isDoc === 'Y' && this.state.answers.length < qLen) {
            alert('모든 질문에 답변해 주세요')
            return false
        }

        let params = {
            userInfo : this.state.userInfo,
            dataType: 11,
            data: this.state.answers
        }

        API.sendPost( '/solution/setSolutiondata', params).then((result) => {
            if( result.status === 'ok' ) {
                alert('등록되었습니다. ');
                this.closeModal()
            } else {
                alert("등록에 실패했습니다. 잠시 후 이용해주십시오");
            }
        });

    }

    render() {

        const { classes } = this.props;
        const questions = [
            {
                groupTitle: '상위급항목 : 업무협약의 성공적인 진행에 영향을 미치는 항목입니다',
                questions: [
                    {q:'비밀정보가 담긴 서류 등의 사본도 반환하기로 규정하였습니까?', value: '1', index: 0},
                    {q:'본 NDA 체결후 제공된 비밀정보를 기초로 상대방이 생산한 추가 정보나 지적재산권에 대한 귀속 규정이 있습니까?', value: '1', index: 1},
                ]
            },
            {
                groupTitle: '중위급항목 : 스타트업 기업의 핵심 가치에 대한 권리에 관련된 분쟁을 예방할 수 있는 항목입니다.',
                questions: [
                    {q:'NDA 체결 당사자 회사의 각 임직원들의 본 보호대상 비밀을 기초로 업무를 수행 중 지득한 정보, 아이디어, 지적재산권에 대해서도 회사의 지식재산권에 포함되어 비밀준수를 하는 것으로 되어 있는 조항이 있습니까?', value: '1', index: 2},
                    {q:'영업망, 고객리스트 등에 대해서도 비밀도 분류하여 보호하고 있습니까?', value: '1', index: 3},
                    {q:'상대방이 제공하지 아니하였더라도, 당사자중 하나가 상대방의 영업시설이나 공장 등에 방문하여 지득한 정보도 보호대상 비밀정보로 정하였는가요?', value: '1', index: 4},
                    {q:'비밀보호 대상 정보라도 상대방과 무관하게 독자적으로 획득한 정보나 당사자 약정으로 사전 합의한 정보 등의 경우 비밀유지 보호 대상 제외 규정이 있습니까?', value: '1', index: 5},
                    {q:'NDA 약정 위반시, 패널티(위약벌) 조항이 있습니까?', value: '1', index: 6},
                ]
            },
            {
                groupTitle: '감점 항목: 평가 항목 대상 조건을 충족하지 못할 경우 법적 패널티 등 리걸 리스크가 현저히 있는 사항입니다.',
                questions: [
                    {q:'회사의 핵심 기술 등에 대하여 비밀보호 대상으로 규정한 규정이 없습니까?', value: '-10', index: 7},
                    {q:'상대방에 비해 귀사가 비밀유지 의무를 더 적게 혹은, 같게 부담하고 있지 않습니까?', value: '-10', index: 8}
                ]
            }
        ]

        const contents = questions.map((row) =>
            <Fragment>
                <h4 style={{marginTop:'15px', borderBottom: '2px solid #CDCDCD'}}>{row.groupTitle}</h4>
                <div>
                    <ol>
                    {
                        row.questions.map((r, index) =>
                            <li>
                                <span>{r.q}</span>
                                <RadioGroup aria-label="gender" name="question" className="input-group" onChange={(e)=>this.handleChange(e, r.index)}  >
                                    <FormControlLabel data-key={index} value={r.value} control={<Radio color="default" className="radio" />} label="예" />
                                    <FormControlLabel data-key={index} value="0" control={<Radio color="default" className="radio" />} label="아니오" />
                                </RadioGroup>
                            </li>
                        )
                    }
                    </ol>
                </div>
            </Fragment>
        );


        return (
            <Fragment>
                <li className={this.props.classes.card}><h2 onClick={(e)=> this.showModal()} className={this.props.classes.h2}>NDA </h2></li>
                <Modal
                    open={this.state.show_modal}
                    onClose={(e)=> this.closeModal()}
                    width={980}
                    className="show-write-review"
                    scroll="body"
                >
                    <div className="default-dialog-title" style={{textAlign:'left'}}>NDA
                        <span className="close" onClick={(e)=> this.closeModal()} ><img src="/common/close-white.svg" alt="" /></span>
                    </div>
                    <div className="content">
                        <li>
                            <span>NDA가 있습니까?</span>
                            <RadioGroup aria-label="gender" name="question" value={this.state.isDoc} className="input-group" onChange={this.checkIsDoc}  >
                                <FormControlLabel value="Y" control={<Radio color="default" className="radio" />} label="예" />
                                <FormControlLabel value="N" control={<Radio color="default" className="radio" />} label="아니오" />
                            </RadioGroup>
                        </li>
                        {this.state.isDoc === 'Y' && contents}
                        <div className="step-button-single" onClick={this.handleSubmit}>
                            <button type="button" className="submit" >제출하기</button>
                        </div>
                    </div>
                </Modal>

            </Fragment>
        )
    }

}

Nda.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Nda);