/**
 * STEP1 기본진단
 *
 * step 1: 법인설립여부
 *     step 2: Y 주주 2인이상, N 출자자 2인이상
 * step 3: 직원채용여부
 *     step 4: Y 10인 미만
 * step 5: 스톡옵션부여여부 (step 3 === N or step 4 === N)
 * step 6: 외부계약 있는지여부
 *     step 7: Y "외부계약유형(중복체크가능)"	제휴관계 공동사업관계 용역관계
 *             N
 *
 *
 */

import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export class Step1 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val) => {
        let stepNum = 0
        let nextStepNum = stepNum + 1
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(nextStepNum)
        }

        return isDataValid
    }

    render() {
        return (
            <>
                <p className="step-title">PART 1. 기업조직의 안정성 및 투명성</p>
                <Paper className="step step1">
                    <div className="step-question">Q. 법인을 설립하셨습니까?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : "default"} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : "default"} onClick={()=>this.isValidated('N')}>아니오</Button>
                    </div>
                </Paper>
            </>
        )
    }
}

export class Step2 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val) => {
        let stepNum = 1
        let nextStepNum = stepNum + 1
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(nextStepNum)
        }

        return isDataValid
    }

    render() {
        return (
            <>
                <p className="step-title">PART 1. 기업조직의 안정성 및 투명성</p>
                <Paper className="step step2">
                    <div className="step-question">
                        {(this.state.step1 === 'Y') && "Q. 주주가 2인이상 입니까?"}
                        {(this.state.step1 === 'N') && "Q. 출자자 2인이상 입니까?"}
                    </div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : ""} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : ""} onClick={()=>this.isValidated('N')}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}

export class Step3 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val, jump = 3) => {
        let stepNum = 2
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(jump)
        }

        return isDataValid
    }

    render() {
        return (
            <>
                <p className="step-title">PART 2. 인사노무관리</p>
                <Paper className="step step2">
                    <div className="step-question">Q. 채용한 직원이 있습니까?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : ""} onClick={()=>this.isValidated('Y', 3)}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : ""} onClick={(e)=>this.isValidated('N', 4)}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}

export class Step4 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.props.jumpToStep(4)
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val, jump = 4) => {
        let stepNum = 3
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(jump)
        }
        return isDataValid
    }

    render() {
        return (
            <>
                <p className="step-title">PART 2. 인사노무관리</p>
                <Paper className="step step2">
                    <div className="step-question">Q. 10인미만?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : ""} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : ""} onClick={(e)=>this.isValidated('N')}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}

export class Step5 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val) => {
        let stepNum = 4
        let nextStepNum = stepNum + 1
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(nextStepNum)
        }

        return isDataValid;
    }

    render() {
        return (
            <>
                <p className="step-title">PART 2. 인사노무관리</p>
                <Paper className="step step2">
                    <div className="step-question">Q. 스톡옵션을 부여하셨습니까?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : ""} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : ""} onClick={(e)=>this.isValidated('N')}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}

export class Step6 extends Component {

    state = this.props.getState()

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val, jump = 6) => {
        let stepNum = 5
        let isDataValid = this.props.stepCheck(stepNum, val);
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(jump)
        }
        return isDataValid
    }

    render() {
        return (
            <>
                <p className="step-title">PART 3. 지식재산권관리 </p>
                <Paper className="step step2">
                    <div className="step-question">Q. 외부계약이 있습니까?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : ""} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : ""} onClick={(e)=>this.isValidated('N', 7)}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}

export class Step7 extends Component {

    //state = this.props.getState()
    state = {
        contract: []
    }

    constructor(props) {
        super(props);
        this.isValidated = this.isValidated.bind(this);
    }

    isValidated = (val, jump = 7) => {
        let stepNum = 6
        let contract = this.state.contract
        if (!!val) contract.push(val)

        let isDataValid = this.props.stepCheck(stepNum, contract)
        if (true === isDataValid) {
            this.setState({
                buttonVal: val
            })
            this.props.jumpToStep(jump)
        }
        return isDataValid
    }

    handleChange = (e) => {
        let contract = this.state.contract;
        let idx = contract.indexOf( Number(e.target.value) )
        if( idx > -1 ) contract.splice( idx, 1 )
        else contract.push( Number(e.target.value) )
        this.setState({ contract: contract })
    };

    render() {
        return (
            <>
                <p className="step-title">PART 3. 지식재산권관리 </p>
                <Paper className="step step2">
                    <div className="step-question">Q. 외부계약은 어떤 유형입니까? (중복체크가능)</div>
                    <div style={{paddingLeft: 20}}>
                        <FormGroup className="form-group" onChange={this.handleChange}>
                            <FormControlLabel
                                control={<Checkbox value="1" name="contract" className="checkbox" color="default" />}
                                label="제휴관계"
                            />
                            <FormControlLabel
                                control={<Checkbox value="2" name="contract" className="checkbox" color="default" />}
                                label="공동사업관계"
                            />
                            <FormControlLabel
                                control={<Checkbox value="3" name="contract" className="checkbox" color="default" />}
                                label="용역관계 "
                            />
                        </FormGroup>
                    </div>
                    <div className="step-question">Q. 외부 계약은 영업비밀 등 중요자산 정보를 포함하고 있습니까?</div>
                    <div className="step-question-button">
                        <Button color={((!!this.state.buttonVal && "Y" === this.state.buttonVal)) ? "primary" : "default"} onClick={()=>this.isValidated('Y')}>예</Button>
                        <Button color={((!!this.state.buttonVal && "N" === this.state.buttonVal)) ? "secondary" : "default"} onClick={()=>this.isValidated('N', 7)}>아니오</Button>
                    </div>
                </Paper>
            </>
        )}
}


export class StepFinal extends Component {

    constructor(props) {
        super(props)
        this.state = this.props.getState()
    }

    componentDidMount () {
        this.props.sendReport()
    }

    render() {
        return (
            <>
                <Paper className="step step4">
                    <div style={{textAlign: "center"}}><h2>모든 질문에 답하셨습니다. 감사합니다.</h2></div>
                    <div style={{textAlign: "center"}}>
                        <Button onClick={(e)=>this.props.jumpToStep(0)}>처음부터 다시</Button>
                        <Button onClick={(e)=>this.props.sendReport(true)}>진단결과보기</Button>
                    </div>
                </Paper>
            </>
        )}
}