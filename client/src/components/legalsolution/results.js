/**
 * STEP1 기본진단에 따른 문서결과
 */

import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './documents/docStyle'
import Modal from '../common/modal'
import Document from './documents/document'
import ResultDocs from './documents/resultDocs'
import UTIL from '../../utils/commonutil'

class DiagnosisResult extends Component {

    constructor (props) {
        super(props)
        let diagnosisAnswer = this.props.getState()
        this.state = {
            finalResult: false,
            modal_articles_incorporation: false,
            modal_stock: false
        }
    }

    componentWillReceiveProps (nextProp) {
        this.getStepResult()
    }

    componentDidMount () {
        this.getStepResult()
    }

    getStepResult = () => {
        let diagnosisAnswer = this.props.getState()
        this.setState({
            step1: diagnosisAnswer.step1,
            step2: diagnosisAnswer.step2,
            step3: diagnosisAnswer.step3,
            step4: diagnosisAnswer.step4,
            step5: diagnosisAnswer.step5,
            step6: diagnosisAnswer.step6,
            step7: diagnosisAnswer.step7
        })
    }

    openFinalResult = () => {
        this.setState({
            finalResult: true
        })
    }

    closeFinalResult = (moveTab = false) => {
        this.setState({
            finalResult: false
        })

        if (moveTab === true) {
            this.props.setTab(3)
        }

        window.location.reload(true)
    }

    render () {

        const { classes } = this.props
        return (
            <>
                <div className={classes.root}>
                    <div>① 기업조직의 안정성 및 투명성 평가 결과</div>
                    <ul className={classes.cards}>
                        {/** 정관 */}
                        {(this.state.step1 === 'Y') && <Document docnum="1"/>}

                        {/** 주주간계약서 */}
                        {(this.state.step1 === 'Y' && this.state.step2 === 'Y') && <Document docnum="3"/>}

                        {/** 동업계약서 */}
                        {(this.state.step1 === 'N' && this.state.step2 === 'Y') && <Document docnum="6"/>}

                        {/** 임원 */}
                        {(this.state.step1) && <Document docnum="7"/>}
                    </ul>
                </div>
                <div className={classes.root}>
                    <div>② 인사노무 관리 평가 결과</div>
                    <ul className={classes.cards}>
                        {/** 근로계약서 */}
                        {(this.state.step3 === 'Y') && <Document docnum="5"/>}

                        {/** 입사자서약서 */}
                        {(this.state.step3 === 'Y') && <Document docnum="4"/>}

                        {/** 스톡옵션계약서 */}
                        {(this.state.step5 === 'Y') && <Document docnum="2"/>}
                    </ul>
                    <div style={{ padding: 10 }}>
                        {(this.state.step3 !== 'Y' && this.state.step5 !== 'Y') &&
                        <>
                            <span>작성이 필요한 문서가 없습니다.<br/></span>
                            <span>인사노무 관련 법률문서에는 근로계약서, 입사자서약서, 스톡옵계약서가 있습니다.</span><br/>
                            <span>위 모든 문서는 로폼에서 작성 가능합니다.</span>
                        </>
                        }
                    </div>
                </div>

                <div className={classes.root}>
                    <div>③ 지식재산권 관리 평가 결과</div>
                    {((!!this.state.step6 && this.state.step6 === 'Y')) &&
                    <ul className={classes.cards}>
                        {(this.state.step7.indexOf(1) > -1) && <Document docnum="8"/>} {/** 업무협약서 */}
                        {(this.state.step7.indexOf(2) > -1) && <Document docnum="9"/>} {/** 공동사업 */}
                        {(this.state.step7.indexOf(3) > -1) && <Document docnum="10"/>} {/** 용역 */}
                        {(this.state.step7.indexOf('Y') > -1) && <Document docnum="11"/>} {/** NDA */}
                    </ul>
                    }
                    <div style={{ padding: 10 }}>
                        {((!this.state.step6 || this.state.step6 === 'N' || this.state.step7.indexOf('N') > -1)) &&
                        <>
                            <span>작성이 필요한 문서가 없습니다.<br/></span>
                            <span>지식재산권 관리 평가 관련 법률문서에는 업무협약서, 공동사업약정서, 용역계약서, NDA 가 있습니다.</span><br/>
                            <span>위 모든 문서는 로폼에서 작성 가능합니다.</span>
                        </>
                        }
                    </div>
                </div>

                <div className={classes.resultBox}>
                    <div className={classes.resultMoreWraper}>
                        <h2 className={classes.h2} onClick={this.openFinalResult}>전체 결과보기</h2>
                    </div>
                </div>

                <Modal
                    open={this.state.finalResult}
                    onClose={this.closeFinalResult}
                    width={900}
                    className="show-final-result"
                    scroll="body"
                >
                    <div className="default-dialog-title" style={{ textAlign: 'left' }}>전체결과보기
                        <span className="close" onClick={(e) => this.closeFinalResult()}><img src="/common/close-white.svg" alt=""/></span>
                    </div>
                    <ResultDocs getState={this.props.getState} closeFinalResult={this.closeFinalResult} setTab={this.props.setTab}/>
                </Modal>

            </>
        )
    }
}

export default withStyles(styles)(DiagnosisResult)