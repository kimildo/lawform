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

class Service extends Component {

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

        const qLen = 17
        if (this.state.isDoc === 'Y' && this.state.answers.length < qLen) {
            alert('모든 질문에 답변해 주세요')
            return false
        }

        let params = {
            userInfo : this.state.userInfo,
            dataType: 10,
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
                groupTitle: '상위급항목 : 용역으로 인해 사업체의 존립 및 성장에 영향을 미치는 항목입니다. ',
                questions: [
                    {q:'수탁자의 경업금지의무 규정이 없습니까? ', value: '1', index: 0},
                    {q:'수탁자의 비밀유지의무 위반시 손해배상 외의 패널티(위약금, 위약벌 등)가 있습니까? ', value: '1', index: 1},
                    {q:'수탁자의 경업금지 위반시 손해배상 외의 패널티(위약금, 위약벌 등)가 있습니까? ', value: '1', index: 2},
                    {q:'수탁자의 지식재산권 보호 규정 위반시 손해배상 외의 패널티(위약금, 위약벌 등)가 있습니까? ', value: '1', index: 3},
                    {q:'위탁자가 용역 산출물로 인한 2차적 산출물 및 이로인한 이득에 대해 권리를 보유하도록 하는 규정이 있습니까?', value: '1', index: 4},
                ]
            },
            {
                groupTitle: '중위급항목 : 용역 관계로 인한 분쟁일 예방할 수 있는 항목입니다. ',
                questions: [
                    {q:'용역을 수행하는 인력에 대한 구체적인 조건을 명시한 규정이 있습니까?', value: '1', index: 5},
                    {q:'용역을 수행하는 인력의 변경이 있는 경우 귀사에게 사전 통지를 하도록 규정하였습니까?', value: '1', index: 6},
                    {q:'계약 후 용역의무에 착수하도록 하는 규정이 있습니까? ', value: '1', index: 7},
                    {q:'대금지금은 적어도 2번 이상 나눠서 지급하도록 규정하였습니까?', value: '1', index: 8},
                    {q:'대금지급은 결과물을 받고 검수한 이후에 지급하도록 규정하였습니까?', value: '1', index: 9},
                    {q:'대금지급은 수탁자(용역을 이행하는 사람) 명의의 계좌로 지급하도록 규정하였습니까?', value: '1', index: 10},
                    {q:'용역수행 과정에 대한 보고의무를 규정하였습니까?', value: '1', index: 11},
                    {q:'정기적인 혹은 용역결과를 보고하는 기준에 대해 규정하였습니까?', value: '1', index: 12},
                ]
            },
            {
                groupTitle: '감점 항목: 평가 항목 대상 조건을 충족하지 못할 경우 법적 패널티 등 리걸 리스크가 현저히 있는 사항입니다.',
                questions: [
                    {q:'용역물의 소유권을 용역자가 갖도록 하는 규정이 없습니까?', value: '-10', index: 13},
                    {q:'용역물의 지식재산권의 귀속자를 위탁자로 하는 규정이 없습니까? ', value: '-10', index: 14},
                    {q:'비밀유지의무 규정이 없습니까?', value: '-10', index: 15},
                    {q:'용역수행자가 용역과정에서 제3자의 권리를 침해한 경우의 법적해결방법의 규정이 없습니까?', value: '-10', index: 16},
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
                <li className={this.props.classes.card}><h2 onClick={(e)=> this.showModal()} className={this.props.classes.h2}>용역계약서 </h2></li>
                <Modal
                    open={this.state.show_modal}
                    onClose={(e)=> this.closeModal()}
                    width={980}
                    className="show-write-review"
                    scroll="body"
                >
                    <div className="default-dialog-title" style={{textAlign:'left'}}>용역계약서
                        <span className="close" onClick={(e)=> this.closeModal()} ><img src="/common/close-white.svg" alt="" /></span>
                    </div>
                    <div className="content">
                        <li>
                            <span>용역계약서가 있습니까?</span>
                            <RadioGroup aria-label="gender" name="question" value={this.state.isDoc} className="input-group" onChange={this.checkIsDoc}  >
                                <FormControlLabel value="Y" control={<Radio color="default" className="radio" />} label="예" />
                                <FormControlLabel value="N" control={<Radio color="default" className="radio" />} label="아니오" />
                            </RadioGroup>
                        </li>
                        {this.state.isDoc === 'Y' && contents}
                        <div className="step-button-single" >
                            <button type="button" className="submit" onClick={this.handleSubmit} >제출하기</button>
                        </div>
                    </div>
                </Modal>

            </Fragment>
        )
    }

}

Service.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Service);