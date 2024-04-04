/**
 * 스타트업 실사진단 페이지
 *
 * author kimildo
 */

import React, { Component } from 'react'
import '../../scss/legalsolution.scss'

import { isMobile } from 'react-device-detect'
import StepZilla from 'react-stepzilla'
import { Font } from '@react-pdf/renderer'

import { Step1, Step2, Step3, Step4, Step5, Step6, Step7, StepFinal } from '../legalsolution/diagnosis'
import DiagnosisResult from '../legalsolution/results'
import SolutionDocs from '../legalsolution/docs'
import FinalResult from '../legalsolution/finalResult'

import Modal from '../common/modal'
import User from '../../utils/user'
import API from '../../utils/apiutil'

Font.register({ family: 'Dotum', format: 'truetype', src: '/assets/fonts/Nanum.ttf' })
Font.register({ family: 'DotumBold', format: 'truetype', src: '/assets/fonts/NanumBold.ttf' })
Font.register({ family: 'NanumMyeongjo', format: 'truetype', src: '/assets/fonts/NanumMyeongjo.ttf' })

export default class Main extends Component {

    constructor (props) {
        super(props)
        this.state = {
            curTab: 0,
            tabs: ['프로그램소개', '1. 집체교육', '2. 자가진단', '3. 솔루션 수행', '4. 수행결과'],
            diagnosisOpen: false,
            diagnosisStepFinal: false,
            reviewOpen: false,
            isMobile: isMobile,
            curStep: 0,
            step1: null,
            step2: null,
            step3: null,
            step4: null,
            step5: null,
            step6: null,
            step7: null,
            userInfo: User.getInfo(),
            availableUser: {
                idusers: null,
                group_text: null
            },
            form: {}
        }
    }

    componentDidMount () {

        this.loginCheck()
        let hash = Number(window.location.hash.replace('#', ''))
        if (hash > 0) this.setTab(hash, false)
        this.getDiagnosisAnswer()
    }

    getDiagnosisAnswer () {

        let userInfo = User.getInfo()
        let diagnosisAnswer

        if (!!window.sessionStorage.getItem('diagnosisAnswer')) {

            diagnosisAnswer = JSON.parse(window.sessionStorage.getItem('diagnosisAnswer'))
            this.setState({ diagnosisStepFinal: true })
            this.setState(diagnosisAnswer)

        } else {

            API.sendPost('/solution/getSolutiondata', {
                userInfo: userInfo,
                dataType: 0
            }).then((result) => {
                if (result.status === 'ok') {
                    let resultData = (result.data !== undefined && result.data.data !== undefined && result.data.data[0] !== undefined) ? result.data.data[0].col : false
                    if (!!resultData) {
                        diagnosisAnswer = {
                            step1: resultData.step1,
                            step2: resultData.step2,
                            step3: resultData.step3,
                            step4: resultData.step4,
                            step5: resultData.step5,
                            step6: resultData.step6,
                            step7: resultData.step7,
                        }

                        this.setState({ diagnosisStepFinal: true })
                        this.setState(diagnosisAnswer)

                        if (process.browser) {
                            window.sessionStorage.setItem('diagnosisStepFinal', 'true')
                            window.sessionStorage.setItem('diagnosisAnswer', JSON.stringify(diagnosisAnswer))
                        }

                    }
                }
            })
        }
    }

    resetSolutionData = () => {

        window.sessionStorage.clear()
        this.setState({
            diagnosisStepFinal: false
        })

        API.sendPost('/solution/delSolutiondata', {
            userInfo: this.state.userInfo,
            dataType: 0
        }).then((result) => {

        })

    }

    loginCheck = async () => {

        let data = await API.sendPost('/solution/getAvailableSoutionUser', { userInfo: this.state.userInfo }).then((result) => {
            if (result.status === 'ok' && result.data.status === 'ok') {
                return result.data.data[0]
            }
            return false
        })

        if (!data || !data.idusers) {
            alert('스타트업 실사 솔루션 수행 권한이 없습니다.\n' + '이용을 원하시면 문의를 남겨주세요.')
            window.location.href = '/startup'
            return
        }

        this.setState({
            availableUser: data
        }, () => {

        })

    }

    setTab = (n = 0, histroy = true) => {
        this.setState({
            curTab: n
        }, () => {
            if (!!histroy) window.location.hash = '#' + n
        })
    }

    linkEduDocument = () => {
        if (false === this.loginCheck()) {
            return false
        }
    }

    openDiagnosis = () => {

        if (false === this.loginCheck()) {
            return
        }

        API.sendPost('/solution/getDocuments', {
            userInfo: this.state.userInfo
        }).then((result) => {
            if (result.status === 'ok') {
                if (!!result.data.data.length) {
                    alert('솔루션 수행 중에는 기본 진단을 다시 진행하실 수 없습니다.')
                    return
                } else {
                    if (this.state.diagnosisStepFinal === true) {
                        if (!!window.confirm('다시 진단하기를 진행하시면 기존에 답변한 데이터는 초기화됩니다. 진행 하시겠습니까?')) {
                            this.resetSolutionData()
                        } else {
                            return
                        }
                    }
                }
            }

            this.setState({
                diagnosisOpen: true
            })
        })
    }

    closeDiagnosis = () => {
        this.setState({
            diagnosisOpen: false
        })
    }

    stepCheck = (stepNum, inputValue) => {

        if (!this.state.userInfo) {
            this.loginCheck()
            return false
        }

        let canNextStep = true
        stepNum = Number(stepNum)

        if (stepNum > -1) {
            switch (stepNum) {
                case 0:
                    if (!!inputValue) this.setState({ step1: inputValue })
                    if (!inputValue && !this.state.step1) canNextStep = false
                    break
                case 1:
                    if (!!inputValue) this.setState({ step2: inputValue })
                    if (!inputValue && !this.state.step2) canNextStep = false
                    break
                case 2:
                    if (!!inputValue) this.setState({ step3: inputValue })
                    if (!inputValue && !this.state.step3) canNextStep = false
                    break
                case 3:
                    if (!!inputValue) this.setState({ step4: inputValue })
                    if (!inputValue && !this.state.step4) canNextStep = false
                    break
                case 4:
                    if (!!inputValue) this.setState({ step5: inputValue })
                    if (!inputValue && !this.state.step5) canNextStep = false
                    break
                case 5:
                    if (!!inputValue) this.setState({ step6: inputValue })
                    if (!inputValue && !this.state.step6) canNextStep = false
                    break
                case 6:
                    if (!!inputValue) this.setState({ step7: inputValue })
                    if (!inputValue && !this.state.step7) canNextStep = false
                    break
            }
        }

        if (false === canNextStep) alert('질문에 답변해 주세요')
        return canNextStep
    }

    getState = () => {
        return {
            step1: this.state.step1,
            step2: this.state.step2,
            step3: this.state.step3,
            step4: this.state.step4,
            step5: this.state.step5,
            step6: this.state.step6,
            step7: this.state.step7,
            diagnosisStepFinal: this.state.diagnosisStepFinal
        }
    }

    sendReport = (closeModal = false) => {

        const answer = this.getState()
        this.setState({ diagnosisStepFinal: true })
        window.sessionStorage.setItem('diagnosisStepFinal', 'true')
        window.sessionStorage.setItem('diagnosisAnswer', JSON.stringify(answer))

        if (!!closeModal) {
            this.closeDiagnosis()
        } else {
            API.sendPost('/solution/setSolutiondata', {
                userInfo: this.state.userInfo,
                solution_step_data: this.getState()
            }).then((result) => {
                if (result.status !== 'ok') {
                    alert('Fail')
                }
            })
        }
    }

    render () {
        return (
            <>

                {(!!this.state.isMobile) &&
                <div className="mobile mypage_tab_nav_wrap">
                    <nav className="tab_nav_contents">
                        {
                            Object.keys(this.state.tabs).map((tag, key) =>
                                <li className={(this.state.curTab === key) ? 'tab active' : 'tab'} onClick={(e) => this.setTab(key)} key={key}>
                                    <a>{this.state.tabs[key]}</a>
                                </li>
                            )
                        }
                    </nav>
                </div>
                }

                <div className='legalsoution_wrap'>
                    <div className="solution-header">
                        <div className="header-title">
                            <p>{(!!this.state.availableUser.group_text) ? this.state.availableUser.group_text : '귀 업체'}의</p>
                            <p>지속적인 성장을 응원합니다.</p>
                        </div>
                    </div>
                    <div>
                        <ul className="solution-tabs">
                            {
                                Object.keys(this.state.tabs).map((tag, key) =>
                                    <li className={(this.state.curTab === key) ? 'tab active' : 'tab'} onClick={(e) => this.setTab(key)} key={key}>
                                        <a>{this.state.tabs[key]}</a>
                                    </li>
                                )
                            }
                        </ul>
                        <div className="wrap_writingdoc">
                            <div className="writingdoc_top">
                                <div className="document_guide step-wrapper">
                                    {(this.state.curTab === 0) && /** 프로그램소개 */
                                    <>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    <span className="oval">스타트업 실사</span> <span className="oval">솔루션</span>이 뭔가요?
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                스타트업 실사 솔루션이란, 투자자가 투자 전 투자대상 기업의 법률적 위험을 체크하는 행위인 스타트업 실사를 대비하기 위한 법률이슈관리 프로그램을 말합니다.<br/>
                                                로폼이 도입한 법률액셀러레이팅 프로그램으로 법률이슈 관리의 핵심인 법률문서를 중심으로 이루어집니다.
                                            </div>
                                        </div>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    <span className="oval">어떻게</span> 진행되나요?
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                <p><strong>1단계 : 오리엔테이션 및 집체교육</strong></p>
                                                <span> - 법률 액셀러레이팅 프로그램 (스타트업 실사 솔루션) 소개, 스타트업 실사 솔루션 사용법 설명과 스타트업 실사의 이해 집체교육이 이루어집니다.</span><br/>
                                                <span> - 스타트업 기업 개별 법률이슈의 수요조사가 이루어집니다</span>
                                            </div>
                                            <div className="step-child step-desc">
                                                <p><strong>2단계 : 자가진단 및 진단보고</strong></p>
                                                <span> - 법률 문서를 기초로 기업의 조직, 인사노무 등 경영의 중요 정보와 재무 상태 등을 지속적으로  Scale-Up 및 투자 역량을 강화할 수 있는 관점에서</span><br/>
                                                <span>경영 진단이 이루어집니다.</span><br/>
                                                <span> - 기업의 단계, 업종 등 상태에 따라 필요한 법률문서의 보유여부와 보유한 법률문서의 리스크 정도를 중점적으로 체크하게 됩니다.</span>
                                            </div>
                                            <div className="step-child step-desc">
                                                <p><strong>3단계 : 솔루션 수행</strong></p>
                                                <span> - 수행 기업은 자가진단 결과 보고에 따라 필요한 법률문서의 작성을 사업기간 내에 수행하게 됩니다.</span>
                                            </div>
                                            <div className="step-child step-desc">
                                                <p><strong>4단계 : 법률이슈 관리 역량 결과 도출</strong></p>
                                                <span> - 솔루션 수행 결과에 따라 수행 기업이 작성하고 보유하게 된 법률문서를 기초로 스타트업 실사 리스트에 따른 기업의 법률위험도 관리 역량 결과를 도출합니다.</span>
                                            </div>
                                        </div>
                                    </>
                                    }

                                    {(this.state.curTab === 1) &&
                                    <>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    스타트업 실사 솔루션의 1단계인 <span className="oval">오리엔테이션</span>과 <span className="oval">집체교육</span>은 현장에서 진행됩니다.
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                <p>교육자료가 필요하신 분들은 아래의 내용을 참고해주세요</p>
                                                <div className="step-button-single">
                                                    <button className="buttonReviewRequestImage" onClick={(e) => this.linkEduDocument()}>교육내용 보기</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    }

                                    {(this.state.curTab === 2) &&
                                    <>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    스타트업 실사 솔루션의 2단계인 <span className="oval">자가진단</span>은, 크게 2개의 파트에서 진단이 진행됩니다.
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                <div className="description">
                                                    <strong>STEP1 : 스타트업 실사 솔루션 기본 진단</strong><br/>
                                                    <span>기본진단은 ① 기업조직의 안정성 및 투명성 평가 ② 인사노무 관리 평가 ③ 지식재산권 관리 평가 측면에서 기업의 단계와 상황에 따라 필수적으로 보유해야하는 법률문서 리스트를 도출하는 것이 목적입니다.  (스타트업 실사 중, 기업자산의 유동성 및 우발채무 평가는 재무제표를 기초로 진행되는바, 이는 교육자료를 통하여 자가 진단해보는 것을 추천 드립니다)</span>
                                                </div>
                                                <div className="step-button-single">
                                                    <button className="buttonReviewRequestImage" onClick={(e) => this.openDiagnosis()}>
                                                        {(this.state.diagnosisStepFinal === false) && '진단하기'}
                                                        {(this.state.diagnosisStepFinal === true) && '다시 진단하기'}
                                                    </button>
                                                </div>
                                                <div className="description">
                                                    <strong>STEP2: 스타트업 실사 솔루션 문서별 심화진단</strong><br/>
                                                    <span>심화진단은 기본진단에서 도출된 필수보유 문서를 보유했는지 여부, 보유하고 있다면 그 필수문서의 법률적 리스크가 어느 정도 되는지를 평가하게 됩니다.</span>
                                                </div>
                                                <div className="diagnosis-paper-top">
                                                    <strong>STEP1 기본진단 결과</strong><br/>
                                                    {(this.state.diagnosisStepFinal === true) && <span>각 결과별로 진단하기 버튼을 눌러 문서별 심화진단을 실시해주세요. </span>}

                                                </div>
                                                <div className="diagnosis-paper">
                                                    {
                                                        (this.state.diagnosisStepFinal === false)
                                                            ? <div className="diagnodis-default"><span style={{ cursor: 'pointer' }} onClick={(e) => this.openDiagnosis()}>STEP1 : 스타트업 실사 솔루션 기본 진단을 먼저 실시해주세요.</span>
                                                            </div>
                                                            : <DiagnosisResult getState={this.getState} setTab={this.setTab}/>
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                        <Modal
                                            open={this.state.diagnosisOpen}
                                            onClose={(e) => this.closeDiagnosis()}
                                            width={700}
                                            height={655}
                                            className="show-write-review"
                                            scroll="body"
                                        >
                                            <div className="default-dialog-title" style={{ textAlign: 'left' }}>STEP1 : 스타트업 실사 솔루션 기본 진단
                                                <span className="close" onClick={(e) => this.closeDiagnosis()}><img src="/common/close-white.svg" alt=""/></span>
                                            </div>
                                            <div className="content">
                                                <h4>질문에 답해주세요.<br/>
                                                    진단은 세가지 부문으로 구성되어 있습니다.<br/>
                                                    모두 완료하시면 필수작성 법률문서 리스트가 도출됩니다.<br/>
                                                </h4>
                                                <div className='step-progress'>
                                                    <StepZilla steps={[
                                                        { name: 'Q1.', component: <Step1 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q2.', component: <Step2 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q3.', component: <Step3 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q4.', component: <Step4 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q5.', component: <Step5 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q6.', component: <Step6 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        { name: 'Q7.', component: <Step7 stepCheck={this.stepCheck} getState={this.getState}/> },
                                                        {
                                                            name: 'Complete',
                                                            component: <StepFinal stepCheck={this.stepCheck} getState={this.getState} sendReport={this.sendReport}/>
                                                        },
                                                    ]}
                                                               showSteps={false}
                                                               startAtStep={this.state.curStep}
                                                               nextButtonText={'다음'}
                                                               backButtonText={'이전'}
                                                               nextTextOnFinalActionStep={'다음'}
                                                        /*onStepChange={step => {
                                                            this.setState({curStep: step})
                                                            window.sessionStorage.setItem("curStep", step)
                                                        }}*/
                                                    />
                                                </div>
                                            </div>
                                        </Modal>

                                    </>
                                    }

                                    {(this.state.curTab === 3) &&
                                    <>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    스타트업 실사 솔루션의 3단계
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                <div className='complete_section'>
                                                    {
                                                        (this.state.diagnosisStepFinal === false)
                                                            ? <span>2단계 자가진단 완료시 솔루션이 필요한 문서 리스트를 확인하실 수 있습니다.</span>
                                                            : <SolutionDocs getState={this.getState}/>
                                                    }
                                                    {/*<span>솔루션 결과 수행을 위한 분석이 진행중입니다. <br/>결과 분석은 1주일간 진행되며, 분석 완료 후 솔루션에 필요한 문서 리스트가 자동으로 생성됩니다.</span>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    }

                                    {(this.state.curTab === 4) &&
                                    <>
                                        <div className="step-content">
                                            <h5 className="step-child step-title">
                                                <div className="box_1"/>
                                                <span className="h_span">
                                                    스타트업 실사 솔루션의 4단계
                                                </span>
                                                <hr className="hr"/>
                                            </h5>
                                            <div className="step-child step-desc">
                                                <div className='complete_section'>
                                                    <FinalResult getState={this.getState} setTab={this.setTab}/>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}