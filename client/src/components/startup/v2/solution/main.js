import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from 'utils/user'
import API from 'utils/apiutil'
import Survey from 'components/category/survey'
import Router from 'next/router'
import moment from 'moment'
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Examples from './examples'
class Main extends Component {

    constructor (props) {
        super(props)

        let globalQuestionData = this.props.globalQuestionData
        let curQuestion = globalQuestionData[0]
        let hash = window.location.hash
        let tab = (!!hash && hash === '#que') ? 1 : 0

        this.state = {
            userInfo: User.getInfo(),
            tab: tab,
            sectionTab: this.props.section,
            stateQuestionData: globalQuestionData,
            stateQuestionDataCnt: globalQuestionData.length,
            curStep: '',
            curQuestion: curQuestion,
            curPointer: 0,
            checkedItems: new Map(),
            answers: [],
            userAnswers: [],
            subQeustions: [],
            mobileBotActive: false,
            availableUser: {
                idusers: null,
                group_text: null,
                solution_use_period_start: null,
                solution_use_period_end: null
            },
            userSubscription: null,
            userProgram: null,
            userPrograms: [],
            paymentProductShow: false
        }

        this.userInfo = User.getInfo()
        this.boxRef = React.createRef()
        //console.log('props', this.props)

    }

    componentDidMount () {

        if (!this.userInfo) {
            this.handleQuestionReset('global', false)
            return
        }
        User.getAvailableSoutionUser().then((data) => {
            if (!!data) {
                this.setState({
                    availableUser: data
                })
                this.getUserAnswers()
            } else {
                this.handleQuestionReset('global', false)
            }
        })

        User.getSubscription().then(result => {
            //console.log('res', result)
            if (!!result) {
                this.setState({
                    userSubscription: result
                })
            }
        })

        if (!!this.userInfo) this.getProgram(this.userInfo.idusers)

        let hash = window.location.hash
        if (!!hash && hash === '#que') {
            scroller.scrollTo('que', {offset: 50})
        }

    }

    scrollToBottom = () => {

    }


    getProgram (idusers) {
        let params = {
            idusers: idusers
        }
        API.sendPost('/user/program', params).then(res => {
            if (res.data.data) {
                if (res.data.data.group_idx === null) {
                } else {
                    this.setState({ userProgram: res.data.data[0], userPrograms: res.data.data })
                }
            }
        })
    }

    getUserAnswers = async () => {

        const { section } = this.props
        let { checkedItems } = this.state

        let data = await API.sendPost('/solution/getUserSolutionAnswers', { section: section }).then((result) => {
            if (result.status === 'ok' && result.data.status === 'ok') {
                return result.data.data
            }
            return false
        })

        if (!data || !data.length) {
            this.handleQuestionReset('global', false)
            return
        }

        let answers = {}, subQuestions = [], idxs = []
        let curStep = 'global'

        data.some((item, key) => {
            answers[item.question_type] = { 'answer': item.answer, status: item.status }
        })

        if (Object.keys(answers).includes('A') && answers['A'].status === 1) {
            curStep = 'sub'
            answers['A'].answer.some((item, key) => {
                if (item.val === 'true' || item.val > -1) {
                    idxs.push(item.lsq_idx)
                }
            })

            this.handleGetSubQuestions(idxs, section).then((result) => {

                subQuestions = (!!result) ? result.data.data : []
                this.setState({
                    userAnswers: answers,
                    curStep: curStep,
                    subQeustions: subQuestions,
                }, () => {

                })
            })

            if (Object.keys(answers).includes('B') && answers['B'].status === 0) {
                checkedItems = new Map()
                answers['B'].answer.some((item, key) => {
                    checkedItems.set('lsq_idx_' + item.lsq_idx, item.val)
                })
                this.setState({
                    checkedItems: checkedItems
                })
            }
        }

        if ((Object.keys(answers).includes('A') && answers['A'].status === 1)
            && (Object.keys(answers).includes('B') && answers['B'].status === 1)
        ) {
            curStep = 'complete'
            this.setState({
                curStep: curStep,
            }, () => {
                //console.log('state', this.state)
            })
        }

    }

    handleGetQuestions = () => {

    }

    handleTab = (n = 0) => {
        if ([0, 1, 2].indexOf(n) === -1) {
            alert('준비중 입니다.')
        } else {
            this.setState({
                tab: n
            })
        }
    }

    handleSectionTab = (n = 1) => {
        // if (n !== 1) {
        //     alert('준비중 입니다.')
        //     return
        // }

        // this.setState({
        //     sectionTab: n
        // })

        window.location = `?section=${n}#que`

    }

    getQuestion = (idx, arr) => {

        let stateQuestionData = (!!arr) ? arr : [...this.state.stateQuestionData]
        let q = null
        stateQuestionData.some((item, key) => {
            if (item.lsq_idx === idx) {
                q = {
                    key: key,
                    item: item
                }
                return true
            }
        })

        return q
    }

    addSolutionAnswers = async (answers, answerType, section, status = 1) => {

        return await API.sendPost('/solution/addSolutionAnswers', {
            answers: answers,
            answerType: answerType,
            section: section,
            status: status,
        }).then((result) => {
            if (result.status !== 'ok' || result.data.status !== 'ok') {
                return false
            }
            return result
        })

    }

    handleSetAnswer = (ans_value = null, ans = null) => {

        let { curQuestion, answers, checkedItems, availableUser } = this.state
        const lastDepth = 3

        if (!this.userInfo) {
            if (!!window.confirm('로그인 후 이용 가능합니다.\n로그인 하시겠습니까?')) {
                window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            }
            return
        }

        if (!availableUser.idusers) {
            alert('이용권한이 없습니다.\n스타트업 실사 이용에 관한 문의는 로폼 이용 문의 게시판에\n“스타트업 실사 문의”라고 남겨주세요.\n담당자가 신속히 서비스 안내에 관한 회신을 드리고 있습니다.')
            return
        }

        let stateQuestionData = [...this.state.stateQuestionData]
        //console.log('state', this.state)

        let ans_lsq_idx = curQuestion.lsq_idx
        let next_lsq_idx = curQuestion.dep_lsq_idx
        let depth = curQuestion.depth

        if (ans_value === null) {
            for (let [key, value] of checkedItems) {
                ans_value = value.val
                ans = value.ans
            }
        }

        answers.push({ lsq_idx: ans_lsq_idx, val: ans_value, ans: ans })
        curQuestion = (!!stateQuestionData[0]) ? stateQuestionData[0] : null

        if (!next_lsq_idx) {
            stateQuestionData.shift()
        }

        if (ans_lsq_idx === 1 && ans_value === 'true') {
            let q1 = this.getQuestion(6, stateQuestionData)
            stateQuestionData.splice(q1.key, 1)
            let q2 = this.getQuestion(9, stateQuestionData)
            stateQuestionData.splice(q2.key, 1)
        }

        if (ans_lsq_idx === 1 && ans_value === 'false') {
            let q1 = this.getQuestion(6)
            let q2 = this.getQuestion(9)
            let q3 = this.getQuestion(10)
            stateQuestionData = [q2.item, q3.item]
            curQuestion = q1.item
            //next_lsq_idx = curQuestion.dep_lsq_idx
        }

        if (!!next_lsq_idx) {

            let nextQuestion = this.getQuestion(next_lsq_idx, stateQuestionData)
            stateQuestionData.splice(nextQuestion.key, 1)

            if (ans_value === 'true' || ans_value > -1) {
                curQuestion = nextQuestion.item
            } else if (ans_value === 'false' || ans_value < 0) {
                curQuestion = stateQuestionData[0]
                stateQuestionData.shift()
            }

            // if ((ans_value === 'false' || ans_value < 0) && stateQuestionData.length === 1 && nextQuestion.item.depth === lastDepth) {
            //
            // }
        }

        this.setState({
            stateQuestionData: stateQuestionData,
            stateQuestionDataCnt: stateQuestionData.length,
            curQuestion: curQuestion,
            answers: answers,
            checkedItems: new Map()
        }, () => {

        })
    }

    handleQuestionReset = (curStep = 'global', alert = true, remove = false) => {

        if (!!alert && !window.confirm('새로시작 하시면 공통질문 부터 시작되며\n"기존에 답변하신 데이터는 삭제"됩니다.\n새로시작 하시겠습니까?')) {
            return
        }

        const removeData = async () => {
            return await API.sendPost('/solution/resetUserAnswers', { section: this.state.sectionTab })
        }

        let stateQuestionData = [...this.props.globalQuestionData]
        let curQuestion = stateQuestionData[0]
        stateQuestionData.shift()

        this.setState({
            stateQuestionData: stateQuestionData,
            stateQuestionDataCnt: stateQuestionData.length,
            curStep: curStep,
            curQuestion: curQuestion,
            checkedItems: new Map(),
            subQeustions: [],
            userAnswers: [],
            answers: [],
        }, () => {
            if (remove === true) {
                removeData().then((result) => {
                    //console.log('del user data', result)
                })
            }
        })
    }

    handleOnchageCheckBox = e => {
        const item = e.target.name
        const isChecked = e.target.checked
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }), () => {
            //console.log('checkedItems', this.state.checkedItems)
        })
    }

    handleOnchageRadio = (e) => {

        //let { answers, curQuestion } = this.state
        const item = e.target.name
        const checkValue = JSON.parse(e.target.value)
        //answers.push({ lsq_idx: curQuestion.lsq_idx, val: checkValue.val, ans: checkValue.ans })

        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, checkValue) }), () => {
            //console.log('checkedItems', this.state.checkedItems)
        })
    }

    handleNextSubStep = () => {

        const { answers, sectionTab } = this.state
        let subQuestions = []

        this.addSolutionAnswers(answers, 'A', sectionTab).then((result) => {

            if (result.status !== 'ok' || result.data.status !== 'ok') {
                throw '1'
            }

            answers.some((item, key) => {
                if (item.val === 'true' || item.val > -1) {
                    subQuestions.push(item.lsq_idx)
                }
            })

            return this.handleGetSubQuestions(subQuestions, sectionTab)

        }).then((result) => {

            if (result.status !== 'ok' || result.data.status !== 'ok') {
                throw '2'
            }

            let subQeustions = result.data.data
            if (!subQeustions.length) {
                this.handleStepComplete()
                return
            }

            this.handleQuestionReset('sub', false)
            this.setState({
                curQuestion: null,
                subQeustions: subQeustions,
            })

        }).catch((err) => {
            alert('답변 저장중에 오류가 발생했습니다.\n' + err)
        })

    }

    handleGetSubQuestions = async (idxs, section = 1) => {

        if (!idxs || idxs.length === 0) {
            return {
                status: 'ok',
                data: {
                    status: 'ok',
                    data: []
                }
            }
        }

        return await API.sendPost('/solution/getSubQuestions', {
            idxs: idxs,
            section: section
        }).then((result) => {
            if (result.status !== 'ok' || result.data.status !== 'ok') {
                return false
            }
            return result
        })
    }

    handleStepComplete = (temp = false) => {

        const { checkedItems, subQeustions, sectionTab } = this.state

        let checkAns = []
        let curStep = 'complete'
        let status = 1
        let lsq_idx

        for (let [key, value] of checkedItems) {
            lsq_idx = key.replace('lsq_idx_', '')
            checkAns.push({ lsq_idx: Number(lsq_idx), val: value.val, ans: value.ans })
        }

        if (temp === false) {
            if (subQeustions.length > checkAns.length) {
                alert('모든 질문에 답변 바랍니다.')
                return
            }
        } else {
            status = 0
            curStep = 'sub'
        }

        this.addSolutionAnswers(checkAns, 'B', sectionTab, status).then((result) => {

            if (result.status !== 'ok' || result.data.status !== 'ok') {
                throw ''
            }

            if (temp === false) this.componentDidMount()
            alert('답변 저장이 완료되었습니다.')

        }).catch((err) => {
            alert('답변 저장중에 오류가 발생했습니다.\n' + err)
        })
    }

    handleGetUserAnswer = (idx, type = 'A') => {

        const userAnswersArr = this.state.userAnswers
        let that = this
        let answer = { val: null }

        if (userAnswersArr[type] !== undefined && !!userAnswersArr[type].answer.length) {

            const userAnswers = (userAnswersArr[type].answer)
            userAnswers.some((item, key) => {
                if (item.lsq_idx === idx) {
                    answer = item
                    return true
                }
            })
        }

        return answer
    }

    render () {

        const { curQuestion, curStep, subQeustions, tab, stateQuestionDataCnt, availableUser } = this.state
        const sectionText = {
            1: '경영권 상실/강화',
            2: '인사/노무',
            3: '지재권/회사 자산 보호',
            4: '투자가치 극대화',
        }

        return (
            <div className="main">

                <Survey banner={false} ref={e => { this.child = e }} title="스타트업 실사 무료진단 신청 문의 " description={<>무료 체험 신청을 원하시면 아래 내용을 작성해주세요.<br/> 1일 이내에 담당자가 다시 연락 드리겠습니다.</>}/>

                <div className="visual">
                    <h1>스타트업(모의)실사</h1>
                    <div></div>
                </div>
                <div className="solution-contents">
                    <div className="title">4대 분야에서 기업의 리스크를 진단하여 최적의 맞춤형 교육과 솔루션을 제공하는 프로그램 </div>
                    <div className="consumers">
                        {!!this.state.userSubscription_1 ?
                            <Fragment>
                                <label># 스타트업 실사를 법무팀처럼 활용하세요</label>
                                <ol className="order-list">
                                    <li>
                                        <label>리스크 진단</label>
                                        <ul className="check-list">
                                            <li>임직원, 거래관계 등 사업화 과정에서<br/> 스타트업이 가장 많이 겪는</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Fragment> :
                            <Fragment>
                                <label>이런 분들에게 필요해요!</label>
                                <ul className="check-list">
                                    <li>법무팀을 갖추지 못한 중소기업의 임직원들이 뭘해야 할지 모를 때</li>
                                    <li>기업 현황에 따른 맞춤형 교육&개선안을 받아보고 싶을 때</li>
                                    <li>스타트업의 실제 사례 데이터 기반의 커리큘럼이 필요할 때</li>
                                </ul>
                            </Fragment>
                        }
                    </div>
                    <div className={this.state.paymentProductShow === true ? 'product active' : 'product'}>
                        <div class="anchor mobile">
                            <div class="close" onClick={() => this.setState({ paymentProductShow: false })}>닫기</div>
                        </div>
                        {/* <div className="banner-sale mobile_hide"><img src="/images/startup/v2/banner-limit300.svg"/></div> */}
                        <div className="title mobile_hide">스타트업 실사</div>
                        {(!!this.state.userSubscription && !!this.state.availableUser.idusers) ?
                            <ul className="info subscription">
                                {!!this.state.userProgram ?
                                    <li>
                                        <label>이용상태 : 이용중</label>
                                        <div>* 본 이용권은 {this.state.userProgram.group_name}에서 지원하고 있습니다.</div>
                                    </li>
                                    :
                                    <li>
                                        <label>상품명</label>
                                        <div>스타트업 필수문서</div>
                                    </li>
                                }
                                <li>
                                    <label>이용기간</label>
                                    <div>{moment(this.state.userSubscription.regdatetime).format('Y.MM.DD')} ~ {moment(this.state.userSubscription.enddate).format('Y.MM.DD')}</div>
                                </li>
                            </ul>
                            :
                            <ul className="info">
                                <li>
                                    <div className="text">
                                        <p>스타트업 실사 이용에 관한 문의는 로폼 이용 문의 게시판에 <b>"스타트업 실사 문의"</b>라고 남겨주세요. 담당자가 신속히 서비스 안내에 관한 회신을 드리고 있습니다.</p>
                                    </div>
                                </li>
                            </ul>
                        }
                        <div className="plan">
                            <button className="subscription" onClick={() => Router.push('/customer/qna')}>이용문의</button>
                        </div>
                        {/* {
                            !!this.state.userProgram?
                            <div className="plan"><button className="subscription" onClick={()=>Router.push("/startup/qna")}>이용문의</button></div>
                            :
                            <div className="plan"><button className="subscription" onClick={()=>Router.push("/customer/qna")}>이용문의</button></div>
                        } */}

                    </div>

                    <div className="solution-main">
                        <ul className="solution-tabs">
                            <li className={`tab ${(this.state.tab === 0) ? 'active' : ''}`}><a onClick={() => this.handleTab(0)}>실사소개</a></li>
                            <li className={`tab ${(this.state.tab === 1) ? 'active' : ''}`}><a onClick={() => this.handleTab(1)}>진단평가</a></li>
                            <li className={`tab ${(this.state.tab === 2) ? 'active' : ''}`}><a onClick={() => this.handleTab(2)}>교육&실습</a></li>
                            {/* <li className={`tab ${(this.state.tab === 3) ? 'active' : ''}`}><a onClick={() => this.handleTab(3)}>교육자료</a></li> */}
                        </ul>
                        {(this.state.tab === 0) &&
                        <div className="solution-instruction">
                            <div className="text">
                                <ul>
                                    <li>스타트업 모의 실사는 법무팀이 없는 중소기업에게 데이터 기반의 리스크 분석을 통해 최적화된 맞춤형 교육, 개선안, 그리고 솔루션을 제공하는 프로그램입니다.</li>
                                    <li>법무팀이 없는 기업의 법률 관련 직무 임직원들의 업무 생산성을 높이며, 궁극적으로는 투자 역량 강화 및 지속적인 성장의 기초를 제공하는 것을 목적으로 합니다.</li>
                                    <li>중소기업의 대표(CEO), 최고 운영 책임자(CFO), 인사 노무 담당자, 계약 담당자, 보안 관리 책임자 등 분야에 따른 다양한 직무 구성원들의 사용을 권장 드립니다.</li>
                                </ul>
                            </div>
                            <div className="video">
                                {
                                    (!!this.state.videoload) ?
                                        <iframe
                                            className="youtube"
                                            width="565"
                                            height="320"
                                            src="https://www.youtube-nocookie.com/embed/41YKNvrdtH8?controls=1&autoplay=1&mute=1"
                                            frameborder="2"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                                            allowfullscreen="allowfullscreen"
                                        ></iframe>
                                        :
                                        <div className="play" onClick={() => this.setState({ videoload: true })}></div>
                                }
                            </div>
                        </div>
                        }
                        {(this.state.tab === 1) && <>
                            <div className="solution-guide">
                                <ul>
                                    <li>기업의 업종, 성장단계, 규모, 현재 상황에 따라 관리해야 할 리스크 사항을 체크하여 이를 개선하기 위한 교육 내용과 솔루션을 추천하는 시스템입니다.</li>
                                    <li>진단 평가는 총 4가지 분야로 이루어져 있으며, 프로그램 이용권한에 따라 진단 가능 분야는 다를 수 있습니다.</li>
                                    <li>각 분야별 공통 질문에 답변 후 진단하기 버튼을 누르면 진단이 시작됩니다.</li>
                                    <li>최종 완료가 된 진단에 한하여 결과보고서를 확인하실 수 있습니다.</li>
                                </ul>
                            </div>

                            <Element className="solution-section" name="que" id="que">
                                <ul>
                                    <li className={`multi ${(this.state.sectionTab === 1) ? 'active' : ''}`} onClick={() => this.handleSectionTab(1)}><span>경영권<br/>상실/강화</span></li>
                                    <li className={`single ${(this.state.sectionTab === 2) ? 'active' : ''}`} onClick={() => this.handleSectionTab(2)}>인사/노무</li>
                                    <li className={`multi ${(this.state.sectionTab === 3) ? 'active' : ''}`} onClick={() => this.handleSectionTab(3)}>지재권/<br/>회사 자산 보호</li>
                                    <li className={`multi ${(this.state.sectionTab === 4) ? 'active' : ''}`} onClick={() => this.handleSectionTab(4)}>투자 가치<br/>극대화</li>
                                </ul>
                            </Element>
                            {(tab === 1) &&
                            <div className="solution-step">
                                <div className="solution-step-title">
                                    <span>{sectionText[this.state.sectionTab]}</span>
                                </div>

                                {(curStep === 'global') && <>
                                    <div className="solution-step-qtitle">
                                        <div>공통질문</div>
                                        <ul>
                                            <li>정확한 스타트업 실사를 위한 사전질문 입니다.</li>
                                            <li>남은 질문의 개수는 답변에 따라 변동될 수 있습니다.</li>
                                        </ul>
                                    </div>

                                    <div className="solution-step-question-box">
                                        {(!!curQuestion) && <>

                                            <div className="solution-count-question">
                                                남은질문: {stateQuestionDataCnt}개
                                            </div>

                                            <div className="solution-step-question-text">
                                                {curQuestion.question}
                                            </div>

                                            {(curQuestion.answer_type === 'R') &&
                                            <div className="solution-step-answer-buttons">
                                                {
                                                    curQuestion.answers.map((item, key) => {
                                                        return (
                                                            <div className={`ans-btn ${(item.val === 'true' || item.val >= 0) ? 'ans-btn-true' : 'ans-btn-false'}`}
                                                                 onClick={() => this.handleSetAnswer(item.val, item.ans)}>{item.ans_text}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            }

                                            {(curQuestion.answer_type === 'C') &&
                                            <div className="solution-step-answer-checks">
                                                <ul>
                                                    {
                                                        curQuestion.answers.map((item, key) => {
                                                            return (
                                                                <li className={'checkbox'}>
                                                                    <input type="radio" value={JSON.stringify(item)} id={`anscheck_${key}`} name={`anscheck`}
                                                                           onChange={event => this.handleOnchageRadio(event)}/>
                                                                    <label htmlFor={`anscheck_${key}`}><span>{item.ans_text}</span></label>

                                                                    {/*<input type="radio" value={item.val} id={`anscheck_${key}`} name={`${key}`}*/}
                                                                    {/*       //onChange={this.handleOnchageCheckBox}*/}
                                                                    {/*       onChange={event => this.handleOnchageRadio(event)}*/}
                                                                    {/*/>*/}
                                                                    {/*<label htmlFor={`anscheck_${key}`}><span>{item.ans_text}</span></label>*/}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                                <div className={`ans-btn-next`} onClick={() => this.handleSetAnswer()}>다음</div>
                                            </div>
                                            }

                                        </>}

                                        {(!curQuestion) && <>
                                            <div className="solution-step-question-text">
                                                모든 공통 질문이 끝났습니다.<br/>
                                                아래 진단하기 버튼을 눌러 진단을 시작해주세요.
                                            </div>
                                            <div className="solution-step-answer-buttons">
                                                <div className="ans-btn ans-btn-false" onClick={() => this.handleQuestionReset()}>처음부터</div>
                                                <div className="ans-btn ans-btn-true" onClick={this.handleNextSubStep}>진단하기</div>
                                            </div>
                                        </>}
                                    </div>
                                </>
                                    // end of global
                                }


                                {(curStep === 'sub') && <>

                                    <div className="solution-step-qtitle">
                                        <div>스타트업 실사 진단</div>
                                        <ul>
                                            <li>
                                                귀사가 주식회사가 아닌 유한회사 형태인 경우에도 다음의 질문에 대한 답을 진행하세요.<br/>
                                                (단 ,아래의 질문 중 ‘주주’ 부분은 ‘사원’으로 간주하여 답변하세요.)
                                            </li>
                                        </ul>
                                    </div>

                                    {(subQeustions.length > 0) &&
                                    <div className="solution-step-question-box">
                                        <ul>
                                            {
                                                subQeustions.map((ques, key) => {

                                                    let subAnswer = this.handleGetUserAnswer(ques.lsq_idx, 'B')
                                                    console.log('subAnswer', subAnswer)
                                                    return (
                                                        <li className={'checkbox'}>
                                                            <p>{ques.question}</p>
                                                            <p className={'line'}/>
                                                            <p className={'sub-checkbox radio-check'}>
                                                                {
                                                                    ques.answers.map((item, seq) => {

                                                                        let defaultChecked = (subAnswer.val !== null && subAnswer.val === item.val)
                                                                        return (
                                                                            <span className={'answers-wrap'}>
                                                                                <input type="radio" value={JSON.stringify(item)} id={`anscheck_${key}_${seq}`} name={`lsq_idx_${ques.lsq_idx}`}
                                                                                       onChange={event => this.handleOnchageRadio(event)} defaultChecked={defaultChecked}/>
                                                                                <label htmlFor={`anscheck_${key}_${seq}`}><span>{item.ans_text}</span></label>
                                                                            </span>
                                                                        )
                                                                    })
                                                                }
                                                            </p>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>

                                        <div className="solution-step-answer-buttons triple">
                                            <div className="ans-btn ans-btn-false" onClick={() => this.handleQuestionReset('global', true, true)}>새로시작</div>
                                            <div className="ans-btn ans-btn-true" onClick={() => this.handleStepComplete(true)}>임시저장</div>
                                            <div className="ans-btn ans-btn-true" onClick={() => this.handleStepComplete()}>진단완료</div>
                                        </div>

                                    </div>
                                    }

                                </>
                                    // end of sub
                                }


                                {(curStep === 'complete') &&
                                <div className="solution-step-question-box">

                                    <div className="complete-warn">
                                        <span>“{sectionText[this.state.sectionTab]}”</span> 의 진단이 완료 되었습니다.<br/>
                                        하단의 결과보고서를 통해 결과를 확인하실 수 있습니다.<br/><br/>
                                        결과보고서는 각 분야별 통합 결과보고서로 제공됩니다.
                                    </div>

                                    <div className="solution-step-answer-buttons">
                                        <div className="ans-btn ans-btn-false" onClick={() => this.handleQuestionReset('global', true, true)}>다시진단</div>
                                        <div className="ans-btn ans-btn-true" onClick={() => Router.push('/startup/solution/report')}>결과보고서</div>
                                        <div className="ans-btn ans-btn-true" style={{backgroundColor:"#435062", width:180}} onClick={() => this.handleTab(2) } >교육&실습 바로가기</div>

                                    </div>

                                </div>
                                }

                            </div>
                            }


                        </>}
                        {(this.state.tab === 2) && <>
                                {
                                    console.log("userInfo",this.state.userInfo )
                                }
                            <Examples handleTab={this.handleTab} handleSectionTab = {this.handleSectionTab} section={this.state.sectionTab} />
                        </>}

                    </div>
                </div>
                { /* end of solution-contents*/}

                {(availableUser.idusers === null) ?
                    <div className="solution-ask" onClick={() => this.setState({ paymentProductShow: true })}>문의하기</div>
                    :
                    <div className="payment solution-ask">
                        <div className={`product ${(!!this.state.mobileBotActive) && 'active'}`}>
                            <div className="anchor mobile">
                                <div className="close" onClick={() => this.setState({ mobileBotActive: false })}>닫기</div>
                            </div>
                            <ul className="info subscription">
                                <li><label>상품명</label>
                                    <div>{availableUser.group_text}</div>
                                </li>
                                <li><label>이용기간</label>
                                    <div>{availableUser.solution_use_period_start} ~ {availableUser.solution_use_period_end}</div>
                                </li>
                            </ul>
                            <div className="plan">
                                <button className="subscription">이용중</button>
                            </div>
                        </div>
                        <button className="subscription-program mobile" onClick={() => this.setState({ mobileBotActive: true })}>이용중</button>
                    </div>
                }


            </div>
        )
    }
}

export default Main

