import React, { Component } from 'react'
import Link from 'next/link'
import User from 'utils/user'
import Api from 'utils/apiutil'
import moment from 'moment'
import Router from 'next/router'
import 'scss/startup/solution.scss'
import 'scss/startup/solution-report.scss'
import { Radar, HorizontalBar } from 'react-chartjs-2'

class Report extends Component {

    constructor (props) {
        super(props)
        this.state = {
            availableUser: null,
            answerData:null,
            userAnswers:null,
            userCompletedSections:[],
            scoreAsort:[],
            questions:{},
            scores:[]
        }

        this.userInfo = User.getInfo()
    }

    componentDidMount () {
        Api.sendPost('/solution/getAvailableSoutionUser',{},this.props.token).then((result) => {
            if (!!result.data.data) {
                this.setState({
                    availableUser: result.data.data
                })
            }
        })
        let run = async() => {
            await this.getSectionQuestions(1,'A')
            await this.getSectionQuestions(1,'B')
            await this.getSectionQuestions(2,'A')
            await this.getSectionQuestions(2,'B')
            await this.getSectionQuestions(3,'A')
            await this.getSectionQuestions(3,'B')
            await this.getSectionQuestions(4,'A')
            await this.getSectionQuestions(4,'B')
            await this.getAnswerData()
            await this.getUserAnswers()
        }
        run()
    }

    getSectionQuestions = async( section, q_type='B' ) => {
        let params = {
            section,
            q_type:q_type
        }
        let sectionQuestions = this.state.questions
        await Api.sendPost('/solution/getQuestionData', params, this.props.token ).then(result=>{
            let reArr = async(data) =>{
                let arr = {}
                await data.map((item,index) => {
                    arr[item.lsq_idx]=item
                })
                return arr
            }
            reArr(result.data.data).then(res=>{
                if( typeof sectionQuestions[section] === 'undefined' ) sectionQuestions[section]={}
                sectionQuestions[section][q_type] = res
                this.setState({
                    questions: sectionQuestions
                })
            })

        })
    }

    getAnswerData = () => {
        Api.sendPost('/solution/getAnswerData', {
            userInfo: this.userInfo
        }, this.props.token).then((result) => {
            if (result.status === 'ok' && result.data.status === 'ok') {
                let resultData = result.data.data
                if (!!resultData && resultData.length > 0) {
                    this.setState({
                        answerData: result.data.data[0]
                    })
                }
            }
        })
    }

    getUserAnswers = async () => {
        let { checkedItems } = this.state
        let data = await Api.sendPost('/solution/getUserSolutionAnswers',{},this.props.token).then((result) => {
            if (result.status === 'ok' && result.data.status === 'ok') {
                return result.data.data
            }
            return false
        })
        let completedSections = await this.getCompletedSections(data)
        this.setState({
            userAnswers:data,
            userCompletedSections:completedSections.data,
            scoreAsort:completedSections.scoreAsort
        })
    }

    getCompletedSections = async ( answers ) => {
        let completed = []
        let scoreA = 0
        let score = 0
        let scoreAsort = []
        let scores = []
        await answers.map((item,key)=> {
            scoreA = 0
            if( item.status === 1 ) {
                if( !completed[item.section] ) completed[item.section] = []
                scoreA = this.getAnswersScoreA( item.answer )
                if( item.question_type==='A' ) {
                    scores[item.section] = {A:scoreA}
                    if( scoreAsort.length <= 0 ) {
                        scoreAsort.push(item.section)
                    } else {
                        if( scoreA > completed[scoreAsort[0]].A.score  ) {
                            scoreAsort.unshift(item.section)
                        } else {
                            scoreAsort.push(item.section)
                        }
                    }
                }
                if( item.question_type==='B' ) {
                    score = this.getAnswersScore( item.answer , item.section )
                }
                this.setState({
                    scores:scores
                })
                completed[item.section][item.question_type]=item.question_type==='A'?{ answer:item.answer,score:scoreA }:{ answer:item.answer,score:score.score, scoreH:score.scoreH, scoreM:score.scoreM, scoreD:score.scoreD, sumScoreD:score.sumScoreD }
            }
        })
        return { data:completed , scoreAsort}
    }

    getAnswersScore = ( answers , section , q_type = 'B' ) => {
        let scorePerM = [0,[6.25,30,90],[11.1,22,95],[12.5,18,145],[16.6,12,20]]
        let score = 0
        let scoreA = Number(this.state.scores[section].A)
        let scoreH = 0
        let scoreM = 0
        let scoreD = 0
        let sumScoreD = 0
        answers.map((item,index) => {
            if( item.ans === 'Y') {
                switch( this.state.questions[section][q_type][item.lsq_idx].item ) {
                    case 'H': 
                        // score += scorePerM[section][0] * 1.3;
                        scoreH += scorePerM[section][0] * 1.3;
                        break;
                    case 'M': 
                        // score += scorePerM[section][0];
                        scoreM += scorePerM[section][0];
                        break;
                    // case 'D': score += scorePerM[section][0] * -1.3; 
                    //     scoreD += scorePerM[section][0] * -1.3;
                    //     sumScoreD += scorePerM[section][0] * -1.3;
                    //     break;
                }
            } else if( item.ans === 'N' ) {
                if( this.state.questions[section][q_type][item.lsq_idx].item === 'D') {
                    scoreD += scorePerM[section][0] * -1.3;
                    sumScoreD += scorePerM[section][0] * -1.3;
                } else {
                    if( this.state.questions[section].A[ this.state.questions[section][q_type][item.lsq_idx].dep_lsq_idx /**  */ ].dep_lsq_idx !== null ) {
                        /** 추가(상위) deb 값이 있는 경우 */
                        // score += Number( this.state.questions[section].A[ this.state.questions[section].A[ this.state.questions[section][q_type][item.lsq_idx].dep_lsq_idx ].dep_lsq_idx ].answers[1].val )
                        // sumScoreD += Number( this.state.questions[section].A[ this.state.questions[section].A[ this.state.questions[section][q_type][item.lsq_idx].dep_lsq_idx ].dep_lsq_idx ].answers[1].val )
                    } else {
                        // score += Number( this.state.questions[section].A[this.state.questions[section][q_type][item.lsq_idx].dep_lsq_idx].answers[1].val )
                        // sumScoreD += Number( this.state.questions[section].A[this.state.questions[section][q_type][item.lsq_idx].dep_lsq_idx].answers[1].val )
                    }
                }
            } else if( item.ans === 'U' ) {
                // score -= scorePerM[section][2] / scorePerM[section][1]
                sumScoreD -= scorePerM[section][2] / scorePerM[section][1]
            }
        })
        sumScoreD -= ( 100 - scoreA )
        score = ( scoreH + scoreM ) + sumScoreD
        // console.log("ALl", scoreH, scoreM,  sumScoreD, score , "sum:", ( scoreH+scoreM ) + sumScoreD)

        if( score <= 20 ) score = 20
        if( score > 100 ) score = 100
        return { score:Math.round(score) , scoreH:Math.round(scoreH) , scoreM:Math.round(scoreM) , scoreD:Math.round(scoreD), sumScoreD:Math.round(sumScoreD) }
    }

    getAnswersScoreA = ( answers ) => {
        let score = 100
        answers.map((item, key) => {
            if( Number.isInteger( item.val ) ) 
                score += item.val
        })
        return score
    }

    analysisDesc = (data, section, dep, subTitle) => {
        const questions = this.state.questions[section].B
        var high = []
        var deduct = []
        var analysis = ( ) => {
            data.map((item)=>{
                if( item.ans === 'Y' ) {
                    if( questions[item.lsq_idx].dep_lsq_idx === dep ) {
                        if( questions[item.lsq_idx].item === 'D' ) {
                            deduct.push(questions[item.lsq_idx].report_description.Y[0])
                        } else {
                            high.push(questions[item.lsq_idx].report_description.Y[0])
                        }
                    }
                }
            })
        }
        analysis()
        return (
            <>
            { high.length > 0?
                <p>
                    { subTitle[dep].H.replace('%REPLACE%','아래와 같은 정책을 수립하여 집행되도록 ') }
                    <ul>
                    {
                        high.map((item,key) => 
                        <li>{item}</li>
                        )
                    }
                    </ul>
                </p>:null
            }
            { deduct.length > 0?
                <p>
                    { subTitle[dep].D.replace('%REPLACE%','아래와 같은 정책을 수립하여 집행되도록 ') }
                    <ul>
                    {
                        deduct.map((item,key) => 
                        <li>{item}</li>
                        )
                    }
                    </ul>
                </p>:null
            }
            </>
        )

    }

    sumScore( type ) {
        var sum = 0
        this.state.userCompletedSections.map((item, index)=>{
            if( !!item.B ) {
                sum += item.B[type]
            }
        })
        return sum
    }

    totalSummaryDesc( sectionText ) {
        let score = []
        let scoreTexts = []
        let retText = ""
        this.state.userCompletedSections.map((item, index)=>{
            if( !!item.B&&!!item.B.score ) {
                score[index] = item.B.score
                scoreTexts[index] = this.scoreAText( item.B.score )
            }
        })

        // scoreTexts = [null,'미흡','개선필요','미흡','미흡']
        if( scoreTexts.length > 0 ) {
            /** 모두 우수/양호 */
            if( scoreTexts.indexOf( '미흡' ) < 0 && scoreTexts.indexOf( '개선필요' ) < 0 ) {
                return( <> 실사자료에 의할 때 개략적으로는, <span className="bold comma-list">
                            { scoreTexts.map((item,index)=>
                                <>
                                { (item === '우수' || item === '양호')?<span>{sectionText[index]}</span>:null }
                                </>
                            )}
                            </span>는 <span className="blue slash-list">
                            { scoreTexts.indexOf( '우수' ) > -1?<span>우수</span>:null}
                            { scoreTexts.indexOf( '양호' ) > -1?<span>양호</span>:null}
                            </span>하게 관리될 수 있는 구조가 설정되어 있습니다. 
                            구체적으로는 아래의 실사 테마 중 해당 부분의 내용을 참고하세요.</> )
            } else 
            /** 모두 미흡/개선필요 */
            if( scoreTexts.indexOf( '우수' ) < 0 && scoreTexts.indexOf( '양호' ) < 0 ) {
                return( <>실사자료에 의할 때 개략적으로는, <span className="bold comma-list">
                            { scoreTexts.map((item,index)=>
                                <>
                                { (item === '개선필요' || item === '미흡')?<span>{sectionText[index]}</span>:null }
                                </>
                            )}
                            </span>는 <span className="red slash-list">
                            { scoreTexts.indexOf( '개선필요' ) > -1?<span>개선필요</span>:null}
                            { scoreTexts.indexOf( '미흡' ) > -1?<span>미흡</span>:null}
                            </span>한 구조를 현재 가지고 있는 것으로 보입니다.
                            구체적으로는 아래의 실사 테마 중 해당 부분의 내용을 참고하세요.</> )
            } else {
            /** 혼합 */
                return( <>실사자료에 의할 때 개략적으로는, <span className="bold comma-list">
                            { scoreTexts.map((item,index)=>
                                <>
                                { (item === '우수' || item === '양호')?<span>{sectionText[index]}</span>:null }
                                </>
                            )}
                            </span>는 <span className="blue slash-list">
                            { scoreTexts.indexOf( '우수' ) > -1?<span>우수</span>:null}
                            { scoreTexts.indexOf( '양호' ) > -1?<span>양호</span>:null}
                            </span>하게 관리될 수 있는 구조가 설정되어 있습니다. 반면 <span className="bold comma-list">
                            { scoreTexts.map((item,index)=>
                                <>
                                { (item === '개선필요' || item === '미흡')?<span>{sectionText[index]}</span>:null }
                                </>
                            )}
                            </span>는 <span className="red slash-list">
                            { scoreTexts.indexOf( '개선필요' ) > -1?<span>개선필요</span>:null}
                            { scoreTexts.indexOf( '미흡' ) > -1?<span>미흡</span>:null}
                            </span>한 구조를 현재 가지고 있는 것으로 보입니다.
                구체적으로는 아래의 실사 테마 중 해당 부분의 내용을 참고하세요.</> )
            }
        }
    }
    
    scoreAText = (score) => {
        let text = "미흡"
        if( score >= 76 ) {
            text = "우수"
        } else if( score < 76 && score >= 51 ) {
            text = "양호"
        } else if( score < 51 && score >= 26 ) {
            text = "개선필요"
        }
        return text
    }

    render () {
        const { availableUser } = this.state
        const sectionText = [
            null,
            '경영권 상실/강화',
            '인사/노무',
            '지재권/회사 자산 보호',
            '투자가치 극대화',
        ]
        var data = {
            labels: sectionText.filter((_, i) => i > 0),
            datasets: [
                {
                    label: '내 점수',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(0, 80, 206, 1)',
                    pointBackgroundColor: 'rgba(0, 80, 206, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [
                        !!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].A&&!!this.state.userCompletedSections[1].B?this.state.userCompletedSections[1].B.score:0,
                        !!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].A&&!!this.state.userCompletedSections[2].B?this.state.userCompletedSections[2].B.score:0,
                        !!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].A&&!!this.state.userCompletedSections[3].B?this.state.userCompletedSections[3].B.score:0,
                        !!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].A&&!!this.state.userCompletedSections[4].B?this.state.userCompletedSections[4].B.score:0,
                    ]
                }
            ]
        }

        const options = {
            legend: {
                display: false
             },
             tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.index];
                        label += ": "+tooltipItem.yLabel
                        return label;
                    },
                    title: function(tooltipItem, data) {
                        return false; 
                    }
                }
             },
            scale: {
                angleLines: {
                    display: false,
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    stepSize: 20
                },
                gridLines : {
                    color: [
                        'rgba(0, 0, 0, 0.1)',
                        'rgba(0, 0, 0, 0.1)',
                        'rgba(0, 0, 0, 0.1)',
                        'rgba(0, 0, 0, 0.1)',
                        'rgba(0, 0, 0, 0.8)'
                    ],
                    lineWidth: [
                        1,
                        1,
                        1,
                        1,
                        2
                    ]
                }
            }
        }

        const data2 = {
            labels: sectionText.filter((_, i) => i > 0),
            datasets: [
                {
                    label: '상위권항목',
                    backgroundColor: 'rgba(179, 200, 233, 1)',
                    borderColor: 'rgba(179, 200, 233, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(179, 200, 233, 1)',
                    hoverBorderColor: 'rgba(179, 200, 233, 1)',
                    data: [
                        !!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].B?this.state.userCompletedSections[1].B.scoreH:0,
                        !!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].B?this.state.userCompletedSections[2].B.scoreH:0,
                        !!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].B?this.state.userCompletedSections[3].B.scoreH:0,
                        !!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].B?this.state.userCompletedSections[4].B.scoreH:0,
                    ]
                },
                {
                    label: '중위권항목',
                    backgroundColor: 'rgba(21, 55, 108, 1)',
                    borderColor: 'rgba(21, 55, 108, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(21, 55, 108, 1)',
                    hoverBorderColor: 'rgba(21, 55, 108, 1)',
                    data: [
                        !!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].B?this.state.userCompletedSections[1].B.scoreM:0,
                        !!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].B?this.state.userCompletedSections[2].B.scoreM:0,
                        !!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].B?this.state.userCompletedSections[3].B.scoreM:0,
                        !!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].B?this.state.userCompletedSections[4].B.scoreM:0,
                    ]
                },
                {
                    label: '감점항목',
                    backgroundColor: 'rgba(255, 46, 22, 1)',
                    borderColor: 'rgba(255, 46, 22, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255, 46, 22, 1)',
                    hoverBorderColor: 'rgba(255, 46, 22, 1)',
                    data: [
                        !!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].B?this.state.userCompletedSections[1].B.sumScoreD:0,
                        !!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].B?this.state.userCompletedSections[2].B.sumScoreD:0,
                        !!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].B?this.state.userCompletedSections[3].B.sumScoreD:0,
                        !!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].B?this.state.userCompletedSections[4].B.sumScoreD:0,
                    ]
                },
                {
                    label: '환산점수',
                    backgroundColor: 'rgba(0, 80, 206, 1)',
                    borderColor: 'rgba(0, 80, 206, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0, 80, 206, 1)',
                    hoverBorderColor: 'rgba(0, 80, 206, 1)',
                    data: [
                        !!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].B?this.state.userCompletedSections[1].B.score:0,
                        !!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].B?this.state.userCompletedSections[2].B.score:0,
                        !!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].B?this.state.userCompletedSections[3].B.score:0,
                        !!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].B?this.state.userCompletedSections[4].B.score:0,
                    ]
                }

            ]
        };

        const options2 = {
            legend: {
               labels: {
                //    fontSize:10
                responsive:false,
                maintainAspectRatio:false
               }
           }
       }

        const subTitle = {
            2:{
                title:"경영권 강화를 위한 정관 운영",
                H:"귀사는 현재 %REPLACE%정관을 운영하고 있는바, 이는 귀사의 현 경영진이 지속적으로 경영권을 강화 시켜가는데 안정적인 역할을 할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%정관을  운영하고 있는바, 이는 귀사의 경영권의 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            4:{
                title:"경영권 강화를 위한 주주간 약정",
                H:"귀사는 현재 %REPLACE%주요 주주간 서면 약정을 하고 있는바, 이는 귀사의 현 경영진이 지속적으로 경영권을 강화 시켜가는데 안정적인 역할을 할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%주요 주주간 서면 약정을  운영하고 있는바, 이는 귀사의 경영권의 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            5:{
                title:"경영권 강화를 위한 주주명부 운영",
                H:"귀사는 현재 %REPLACE%주주명부 운영을 하고 있는바, 이는 귀사의 현 경영진이 지속적으로 경영권을 강화 시켜가는데 안정적인 역할을 할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%으로 주주명부 운영을 하고 있는바, 이는 귀사의 경영권의 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            9:{
                title:"경영권 강화를 위한 동업계약 체결",
                H:"귀사는 현재 %REPLACE%으로 동업체 출자자 사이의  동업계약서에 해당하는 서면 약정을 하고 있는바, 이는 귀사의 현 경영진이 지속적으로 경영권을 강화 시켜가는데 안정적인 역할을 할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%으로 동업체 출자자 사이의  동업계약서에 해당하는 서면 약정을  운영하고 있는바, 이는 귀사의 경영권의 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            51:{
                title:"인사/노무 관리 역량 강화를 위한 임원계약 운영",
                H:"귀사는 현재 %REPLACE%임원계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 주요 임원에 대한 체계적 관리 역량을 강화할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%임원계약서 등에 규정하여 운영하고 있는바, 이는 귀사의 임원에 대한 인사/노무 관리에 관련된 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            53:{
                title:"인사/노무 관리 역량 강화를 위한 근로계약 운영",
                H:"귀사는 현재 %REPLACE%근로계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 주요 임원에 대한 체계적 관리 역량을 강화할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%근로계약서 등에 규정하여 운영하고 있는바, 이는 귀사의 직원에 대한 인사/노무 관리에 관련된 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            54:{
                title:"인사/노무 관리 역량 강화를 위한 스톡옵션 운영",
                H:"귀사는 현재 %REPLACE%정관, 주주총회 결의를 기초로 실제 각 임, 직원에게 구체적인 스톡옵션 부여 약정을 체결하여 운영하고 있는바, 이는 귀사의 주요 임원에 대한 체계적 관리 역량을 강화할 것으로 판단됩니다.",
                D:null},
            80:{
                title:"지재권 등 회사자산 보호를 위한 NDA, 용역계약 등 외부 계약 운영 시스템",
                H:"귀사는 현재 %REPLACE%NDA, MOU, 용역계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 지식재산권 등 주요 자산에 대한 체계적인 보호를 위한 역량을 강화할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%NDA, MOU, 용역계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 지식재산권 등 주요 자산에 대한 외부의 침해, 유출에 관련된 분쟁을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            81:{
                title:"지재권 등 회사자산 보호를 위한 임직원 계약서, 서약서 등 내부 계약 운영 시스템",
                H:"귀사는 현재 %REPLACE%임직원 계약서, 주주간계약서, 서약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 지식재산권 등 주요 자산에 대한 체계적인 보호를 위한 역량을 강화할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%임원계약서, 근로계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 지식재산권 등 주요 자산에 대한 내부 임직원이나 주오 주주로부터의 침해, 유출로 인한 회사의 위험을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
            101:{
                title:"투자가치 극대화를 위한 회사 지배구조, 투자구조",
                H:"귀사는 현재 %REPLACE%정관, 투자계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 투자가치 극대화를 위한 역량을 강화할 것으로 판단됩니다.",
                D:"또한 귀사는 %REPLACE%정관, 투자계약서 등에 정하고 이에 따라 운영하고 있는바, 이는 귀사의 투자와 관련된 분쟁이나 위험을 사전에 예방하는데 큰 역할을 할 수 있는 조치를 취하고 있습니다."},
        }
        var existDeps = []

        const issueText = {
            1:{
                H:"스타트업 기업의 경영권 강화 이슈와 관련된 평가 항목으로 귀사에 현재 미진하여 향후 보완되면 좋을 항목은 아래와 같습니다.",
                M:"스타트업 기업의 경영권을 안정적으로 유지할 수 있는 사항과 관련된 평가 항목으로, 귀사에 현재 미진하여 향후 보완되면 좋을 사항은 아래와 같습니다.",
                D:"아래의 사항은 스타트업 기업의 경영권 분쟁을 일으킬 원인이 될 수 있는 것으로, 귀사는 현재 이와 관련된 법적 리스크를 해결하지 못한 상태로, 이를 지속할 경우 경영권 상실 등으로 리걸 리스크가 현실화 될 가능성이 높은 사항 입니다.이에 아래와 같은 사항에 대해서는 조속히 변경, 보완을 권고 드립니다.",
                U:"귀사는 아래의 이슈 사항에 대해 아직 정확한 현황을 파악하고 있지 못하고 있습니다. 아래의 미파악 사항은 회사의 경영권 유지, 강화나 혹은 경영권 변동, 상실에 중요한 요소이기 때문에, 이에 관련된 사항이나 조항의 유무, 현재의 운용 실태를, 권고 사항란에 예시로 기재된 내부 법률문서나 계약서를 통해 우선 파악하시길 권고 드립니다."
            },
            2:{
                H:"스타트업 기업의 인사/노무 관리 역량 강화 이슈와 관련된 평가 항목으로 귀사에 현재 미진하여 향후 보완되면 좋을 항목은 아래와 같습니다.",
                M:"스타트업 기업의 인사/노무 관리를 안정적으로 하기 위한 사항과 관련된 평가 항목으로, 귀사에 현재 미진하여 향후 보완되면 좋을 사항은 아래와 같습니다. ",
                D:"아래의 사항은 스타트업 기업의 인사/노무 관리에 관한 분쟁을 일으킬 원인이 될 수 있는 것으로, 귀사는 현재 이와 관련된 법적 리스크를 해결하지 못한 상태로, 이를 지속할 경우 정상적인 인사/노무 관리가 진행되지 못하는 등으로 회사의 리스크가 현실화 될 가능성이 높은 사항 입니다.이에 아래와 같은 사항에 대해서는 조속히 변경, 보완을 권고 드립니다.",
                U:"귀사는 아래의 이슈 사항에 대해 아직 정확한 현황을 파악하고 있지 못하고 있습니다. 아래의 미파악 사항은 회사의 인사/노무의 체계적 관리와 역량 강화에 중요한 요소이기 때문에, 이에 관련된 사항이나 조항의 유무, 현재의 운용 실태를, 권고 사항란에 예시로 기재된 내부 법률문서나 계약서를 통해 우선 파악하시길 권고 드립니다."
            },
            3:{
                H:"스타트업 기업의 지재권 및 회사 자산 보호 역량 강화 이슈와 관련된 평가 항목으로 귀사에 현재 미진하여 향후 보완되면 좋을 항목은 아래와 같습니다.",
                M:"스타트업 기업의 지재권 및 회사 자산 보호를 안정적으로 하기 위한 사항과 관련된 평가 항목으로, 귀사에 현재 미진하여 향후 보완되면 좋을 사항은 아래와 같습니다. ",
                D:"아래의 사항은 스타트업 기업의 지재권 및 회사 자산 보호에 관한 분쟁을 일으킬 원인이 될 수 있는 것으로, 귀사는 현재 이와 관련된 리스크를 해결하지 못한 상태로, 이를 지속할 경우 정상적인 지재권 및 회사 자산 보호 강화가 진행되지 못하는 등으로 회사의 리스크가 현실화 될 가능성이 높은 사항 입니다.이에 아래와 같은 사항에 대해서는 조속히 변경, 보완을 권고 드립니다.",
                U:"귀사는 아래의 이슈 사항에 대해 아직 정확한 현황을 파악하고 있지 못하고 있습니다. 아래의 미파악 사항은 회사의 지재권 및 회사 자산의 체계적 보호와 관리 역량 강화에 중요한 요소이기 때문에, 이에 관련된 사항이나 조항의 유무, 현재의 운용 실태를, 권고 사항란에 예시로 기재된 내부 법률문서나 계약서를 통해 우선 파악하시길 권고 드립니다."
            },
            4:{
                H:"스타트업 기업의 투자가치 극대화와 관련된 평가 항목으로 귀사에 현재 미진하여 향후 보완되면 좋을 항목은 아래와 같습니다.",
                M:"스타트업 기업의 투자 적격성의 안정적 확보를 하기 위한 사항과 관련된 평가 항목으로, 귀사에 현재 미진하여 향후 보완되면 좋을 사항은 아래와 같습니다. ",
                D:"아래의 사항은 스타트업 기업의 투자와 관련된 분쟁을 일으킬 원인이 될 수 있는 것으로, 귀사는 현재 이와 관련된 리스크를 해결하지 못한 상태로, 이를 지속할 경우 정상적인 투자가 진행되지 못하는 등으로 회사의 리스크가 현실화 될 가능성이 높은 사항 입니다.이에 아래와 같은 사항에 대해서는 조속히 변경, 보완을 권고 드립니다.",
                U:"귀사는 아래의 이슈 사항에 대해 아직 정확한 현황을 파악하고 있지 못하고 있습니다. 아래의 미파악 사항은 회사의 투자의 적격성 확보 및 투자가치의 극대화를 위한 역량 강화에 중요한 요소이기 때문에, 이에 관련된 사항이나 조항의 유무, 현재의 운용 실태를, 권고 사항란에 예시로 기재된 내부 법률문서나 계약서를 통해 우선 파악하시길 권고 드립니다."
            }
        }
        var td = 0
        return (<>
            {(!this.props.popoup) &&
            <div className="main">
                <div className="visual">
                    <h1>스타트업(모의)실사</h1>
                    <div></div>
                </div>
            </div>
            }

            <div className="solution-report"  
                onContextMenu={(e) => {e.preventDefault(); return false;}} 
                onDragStart={(e) => {e.preventDefault(); return false;}} 
                onSelect={(e) => {e.preventDefault(); return false;}} 
            >
                <section className="report-header">
                    <span>실사보고서</span>
                </section>
                <section className="report-contents">

                    <section className="report-header-contents">
                        <div className="report-logo">
                            <img src="/instructions/certifications/04/law-form.png" width="100%" alt=""/>
                        </div>
                        <div className="report-head-info">
                            <span>서울 영등포구 의사당대로 83 위워크 6층(서울시 핀테크랩)</span>
                            <span>TEL : 02 - 6207 - 0264</span>
                            <span>https://lawform.io</span>
                        </div>
                        <div className="report-head-warn">
                        본 보고서는 회사의 설립, 운영, 성장, 투자 등 주요 이슈를 법률, 경영, 투자의 측면에서 분석하여 관리하는 데 참고하고 특히 귀사의 경영권 보호, 임/직원의 인사 및 노무관리, 회사의 지적재산권과 자산의 보호, 투자적격성 증대 등에 관한 확인된 회사의 이슈를 해결하기 위해 제공되는 스타트업 실사 솔루션 프로그램을 활용하는데에도 참고하시기 바랍니다. 한편, 본 보고서는 귀사가 제공한 설문 답변, 자료를 기초로 위 회사의 주요 이슈에 관해 수집된 테이터를 프로그램화하여 산정된 기준을 자동적으로 적용하여 도출된 것으로 실제 기업의 설립, 운영, 투자에 관한 보다 구체적인 실제 상황이나 관련 법률 위험이 발생하게 된 구체적인 상황에 따른 결과 등은 본 보고서상 보고된 내용과 달리할 수도 있습니다. 본 보고서를 제공하는 목적과 다른 목적으로 사용 및 수신이 이외의 제3자가 무단으로의 사용을 금함을 알려드립니다.
                        </div>
                    </section>
                    { this.state.answerData !== null?
                    <section className="report-contents-result">
                        <ol className="root-group">
                            <li>
                                <span>기업기본정보</span>
                                <ul className="company-info">
                                    <li>기업명: {this.state.answerData.company_name}</li>
                                    <li>대표자: {this.state.answerData.company_owner}</li>
                                    <li>본점 소재지: {this.state.answerData.head_office_addr}</li>
                                    <li>회사 전화번호: {this.state.answerData.tel}</li>
                                    <li>주업종: {this.state.answerData.main_business}</li>
                                </ul>
                            </li>
                            <li>
                                <span>실사결과보고</span>
                                <ol className="result-group">

                                    <li>
                                        <div className="title">기업 이슈 관리 역량평가를 위한 실사테마</div>
                                        <div className="desc">귀사의 회사의 설립, 조직 구성, 운영, 투자 등 회사의 주요 이슈에 관한 상황을 확인하기 위해 아래와 같은 항목의 실사대상 테마에 대한 분석을 진행하였습니다. 실사 방법은 귀사가 제공한 정보와 자료에 국내외 회사의 설립, 조직 구성, 운영, 투자 등에 관한 일반적인 법규와 절차, 특히 스타트업 등 초기 창업이나 중소기업 규모에서의 평균적인 운영 실태에 관한 데이터를 프로그램화하여 산정된 기준을 자동적으로 적용하여 도출된 것으로 상대적 평가 내용 입니다.
                                        </div>
                                        <div className="desc">
                                            {
                                                sectionText.map((item, key) => {
                                                    if( key > 0 ) {
                                                        if( !!this.state.userCompletedSections[key] 
                                                            && 
                                                            !!this.state.userCompletedSections[key]['A'] 
                                                            && 
                                                            !!this.state.userCompletedSections[key]['B'] ) {
                                                            return (
                                                                <p className="theme-title on">{item}</p>
                                                            )
                                                        } else {
                                                            return (
                                                                <p className="theme-title">{item}</p>
                                                            )
                                                        }
                                                    }
                                                })
                                            }
                                        </div>
                                    </li>

                                    <li>
                                        <div className="title">기업 이슈 관리 역량 평가를 위한 실사 점수</div>
                                        <div className="desc">
                                            <p>STEP1. 기업 실사 결과 개요</p>
                                        </div>
                                        <div className="desc">
                                            회사의 지배구조, 인사/노무 관리나 회사의 자산 보호에 관한 기초 시스템의 구축, 향후 투자를 받기 위한 기초적인 구조가 어느 정도 설정이 되었는지 여부와 이러한 구조하
                                            에서 각 회사 활동에 관련된 구체적인 이슈가 해결되거나 회사의 성장이나 주주 등 이해관계인의 이익이 극대화 될 수 있도록 실제 회사의 설립, 운영, 성장, 투자 등에 관련된
                                            이슈가 관리되고 있는지를 실사한 결과 입니다.
                                        </div>
                                        <div className="desc">
                                            {this.totalSummaryDesc( sectionText )}
                                        </div>
                                        <div className="result-graph">
                                            <Radar data={data} options={options}/>
                                        </div>

                                        <div className={'divided'}></div>

                                        <div className="desc">
                                            <p>STEP2. 기업 실사 테마별 개요</p>
                                        </div>
                                        {!!this.state.userCompletedSections[1]&&!!this.state.userCompletedSections[1].A&&!!this.state.userCompletedSections[1].B?
                                        <div className="desc">
                                            <p className="theme-title on">경영권 상실/강화</p>
                                            귀사의 경영권의 안정성 보장을 위하여 회사의 지배구조, 주주나 출자자의  구성 및 협약과 그 관리를 위한 법적, 제도적 기초 장치의 설정과 설정된 취지에 맞는 운영이 비교적 <span className={['우수','양호'].indexOf(this.scoreAText( this.state.userCompletedSections[1].B.score))>-1?"blue":"red"}>{this.scoreAText( this.state.userCompletedSections[1].B.score)}</span>하게 진행된 것으로 집계되었습니다.
                                        </div>:null
                                        }
                                        {!!this.state.userCompletedSections[2]&&!!this.state.userCompletedSections[2].A&&!!this.state.userCompletedSections[2].B?
                                        <div className="desc">
                                            <p className="theme-title on">인사/노무</p>
                                            귀사 임, 직원의 안정적 관리, 역량 극대화를 위하여 회사와 임, 직원 사이의 구성 및 협약과 그 관리를 위한 통한 법적, 제도적 기초 장치의 설정과 설정된 취지에 맞는 운영이 비교적 <span className={['우수','양호'].indexOf(this.scoreAText( this.state.userCompletedSections[2].B.score))>-1?"blue":"red"}>{this.scoreAText( this.state.userCompletedSections[2].B.score)}</span>하게 진행된 것으로 집계되었습니다.
                                        </div>:null
                                        }
                                        {!!this.state.userCompletedSections[3]&&!!this.state.userCompletedSections[3].A&&!!this.state.userCompletedSections[3].B?
                                        <div className="desc">
                                            <p className="theme-title on">지재권/회사 자산 보호</p>
                                        귀사의 지식재산권, 자산의 보호를 위하여 귀사의 지식재산권, 자산의 비밀 보호 대상 선정 및 관리 등을 위한 통한 법적, 제도적 기초 장치의 설정과 설정된 취지에 맞는 운영이 비교적 <span className={['우수','양호'].indexOf(this.scoreAText( this.state.userCompletedSections[3].B.score))>-1?"blue":"red"}>{this.scoreAText( this.state.userCompletedSections[3].B.score)}</span>하게 진행된 것으로 집계되었습니다.
                                        </div>:null
                                        }
                                        {!!this.state.userCompletedSections[4]&&!!this.state.userCompletedSections[4].A&&!!this.state.userCompletedSections[4].B?
                                        <div className="desc">
                                            <p className="theme-title on">투자가치 극대화</p>
                                            귀사의 향후 투자와 관련되어  귀사의 회사 가치, 주주의 가치가 극대화 될 수 있는 통한 법적, 제도적 기초 장치의 설정과 설정된 취지에 맞는 운영이 비교적 <span className={['우수','양호'].indexOf(this.scoreAText( this.state.userCompletedSections[4].B.score))>-1?"blue":"red"}>{this.scoreAText( this.state.userCompletedSections[4].B.score)}</span>하게 진행된 것으로 집계되었습니다
                                        </div>:null
                                        }
                                        <div className={'divided'}></div>

                                        <div className="desc">
                                            <p>STEP3. 기업 실사 합계 점수표</p>
                                        </div>
                                        <div className="report-table">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>실사테마</th>
                                                    <th>상위급항목</th>
                                                    <th>중위급항목</th>
                                                    <th>감점항목</th>
                                                    <th>환산점수</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    sectionText.map((item, key) => {
                                                        if( item !== null )
                                                        return (
                                                            <tr>
                                                                <td>{item}</td>
                                                                <td>{!!this.state.userCompletedSections[key]&&!!this.state.userCompletedSections[key].B?this.state.userCompletedSections[key].B.scoreH:'-'}</td>
                                                                <td>{!!this.state.userCompletedSections[key]&&!!this.state.userCompletedSections[key].B?this.state.userCompletedSections[key].B.scoreM:'-'}</td>
                                                                <td>{!!this.state.userCompletedSections[key]&&!!this.state.userCompletedSections[key].B?this.state.userCompletedSections[key].B.sumScoreD:'-'}</td>
                                                                <td>{!!this.state.userCompletedSections[key]&&!!this.state.userCompletedSections[key].B?this.state.userCompletedSections[key].B.score:'-'}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <td>합계</td>
                                                    <td>{this.sumScore( 'scoreH' )}</td>
                                                    <td>{this.sumScore( 'scoreM' )}</td>
                                                    <td>{this.sumScore( 'sumScoreD' )}</td>
                                                    <td>{this.sumScore( 'score' )}</td>
                                                 </tr>
                                                </tfoot>
                                            </table>
                                            <div className="report-table-desc">* 환산 점수는, 실사를 한 각 테마 별로 구성하고 있는 상위급, 하위급, 감점 각 항목에서 나온 점수를 우선 집계한 후(이하 ‘합계 점수’)를 각 기업이 속한 동종 업계 현황, 스타트업 등 기업의 환경을 고려해 산정된 가중치 등 변환 기준을 합계 점수에 적용하여 환산된 점수 입니다. 
                                            </div>
                                        </div>
                                        <div className="result-graph">
                                            <HorizontalBar data={data2} options={options2} />
                                        </div>
                                    </li>

                                    <li>
                                        <div className="title">기업 실사 결과 테마별 상세내용</div>
                                        { /** section loop */  }
                                        { [1,2,3,4].map((sectionIdx,index) => 
                                            <>
                                            {!!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].A&&this.state.userCompletedSections[sectionIdx].B?
                                            <>
                                        <div className="desc">
                                            <p>테마{sectionIdx}. {sectionText[sectionIdx]}</p>
                                        </div>
                                        <div className="desc">
                                            <div className={'depth-1'}>
                                                가. 기업 구조 및 운영 현황
                                            </div>
                                            <div className={'depth-2'}>
                                                {
                                                    !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].A&&
                                                    this.state.userCompletedSections[sectionIdx].A.answer.map((item, index) => 
                                                    <>
                                                        {
                                                        item.lsq_idx!==1&&!!this.state.questions[sectionIdx]['A'][item.lsq_idx].report_description&&
                                                        !!this.state.questions[sectionIdx]['A'][item.lsq_idx].report_description[item.ans]&&
                                                        !!this.state.questions[sectionIdx]['A'][item.lsq_idx].report_description[item.ans][0]?
                                                        <p>{"- "+this.state.questions[sectionIdx]['A'][item.lsq_idx].report_description[item.ans][0]}</p>:null
                                                        }
                                                    </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="desc">
                                            <div className={'depth-1'}>
                                                나. 구체적 이슈별 검토
                                            </div>
                                            <div className={'depth-2'}>
                                                <p>1) 개요</p>
                                                <div style={{display:'none'}}>
                                                {existDeps = []}
                                                </div>
                                                {
                                                    !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                    this.state.userCompletedSections[sectionIdx].B.answer.map((item, index) =>
                                                    <div style={{display:'none'}}>
                                                    { 
                                                        existDeps.indexOf(this.state.questions[sectionIdx].B[item.lsq_idx].dep_lsq_idx) < 0?
                                                        <>
                                                        { existDeps.push(this.state.questions[sectionIdx].B[item.lsq_idx].dep_lsq_idx)}
                                                        </>
                                                        :null
                                                    }
                                                    </div>
                                                    )
                                                }
                                                {
                                                    existDeps.map((dep, index) => 
                                                    <div className="answer-detail-analysis">
                                                        <div className={'detail-analysis-title'}>
                                                            {!!subTitle[dep]?
                                                                subTitle[dep].title:"-"
                                                            }
                                                        </div>
                                                        <div className={'detail-analysis-desc'}>
                                                            {
                                                                !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                                this.analysisDesc( this.state.userCompletedSections[sectionIdx].B.answer, sectionIdx, dep , subTitle)
                                                            }
                                                        </div>
                                                    </div>
                                                    )
                                                }
                                            </div>
                                            <div className={'depth-2'}>
                                                <p>2) 질문별 구체적 진단 결과</p>
                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-title'}>가) 기업 구조 및 기초 운영 관련 사항</div>
                                                    <div className={'detail-analysis-desc'}>
                                                        {
                                                            !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].A&&
                                                            this.state.userCompletedSections[sectionIdx].A.answer.map((item, index) =>
                                                            <>
                                                                {
                                                                    item.lsq_idx!==1&&item.ans !== 'Y'?
                                                                    <p>{!!this.state.questions[sectionIdx].A[item.lsq_idx].report_description[item.ans]?
                                                                        this.state.questions[sectionIdx].A[item.lsq_idx].report_description[item.ans][item.ans==='Y'?0:1]:null}</p>:null
                                                                }
                                                            </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-title'}> 나) 구체적 각 개별 이슈 관련 사항</div>
                                                    <div className={'detail-analysis-remark'}>
                                                        - 아래 결과는 각 실사 테마의 각 질문에 관한 사항이 존재하지 아니하는 것으로 답변한 것에 대한 각 평가 입니다.
                                                    </div>
                                                </div>
                                                {/* 상세질문에대한 답변 loop */}
                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-desc blue'}>
                                                        상위급항목: <br/>
                                                        {issueText[sectionIdx].H}
                                                    </div>
                                                </div>
                                                <div className="issue-list">
                                                {
                                                    !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                    this.state.userCompletedSections[sectionIdx].B.answer.map((item, index) =>
                                                    <>
                                                    { item.ans === 'N'?
                                                        <>
                                                            {this.state.questions[sectionIdx].B[item.lsq_idx].item === 'H'?
                                                            <div className="answer-detail-analysis">
                                                                <div className={'detail-analysis-title detail-analysis-question'}>Q. {this.state.questions[sectionIdx].B[item.lsq_idx].question?this.state.questions[sectionIdx].B[item.lsq_idx].question:null}</div>
                                                                <div className={'detail-analysis-desc'}>
                                                                    <p>A. 아니오</p>
                                                                    <p>
                                                                        {!!this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]?this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]:null}
                                                                    </p>
                                                                </div>
                                                            </div>:null
                                                            }
                                                        </>:null
                                                    }
                                                    </>
                                                    )
                                                }
                                                </div>
                                                <div className={'divided'}></div>
                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-desc blue'}>
                                                        중위급항목: <br/>
                                                        {issueText[sectionIdx].M}
                                                    </div>
                                                </div>
                                                <div className="issue-list">
                                                {
                                                    !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                    this.state.userCompletedSections[sectionIdx].B.answer.map((item, index) =>
                                                    <>
                                                        { item.ans === 'N'?
                                                        <>
                                                            {this.state.questions[sectionIdx].B[item.lsq_idx].item === 'M'?
                                                            <div className="answer-detail-analysis">
                                                                <div className={'detail-analysis-title detail-analysis-question'}>Q. {this.state.questions[sectionIdx].B[item.lsq_idx].question?this.state.questions[sectionIdx].B[item.lsq_idx].question:null}</div>
                                                                <div className={'detail-analysis-desc'}>
                                                                    <p>A. 아니오</p>
                                                                    <p>
                                                                        {!!this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]?this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]:null}
                                                                    </p>
                                                                </div>
                                                            </div>:null
                                                            }
                                                        </>:null
                                                        }
                                                    </>
                                                    )
                                                }
                                                </div>
                                                <div className={'divided'}></div>
                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-desc blue'}>
                                                        감점항목: <br/>
                                                        {issueText[sectionIdx].D}
                                                    </div>
                                                </div>
                                                <div className="issue-list">
                                                {
                                                    !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                    this.state.userCompletedSections[sectionIdx].B.answer.map((item, index) =>
                                                    <>
                                                        { item.ans === 'N'?
                                                        <>
                                                            {this.state.questions[sectionIdx].B[item.lsq_idx].item === 'D'?
                                                            <div className="answer-detail-analysis">
                                                                <div className={'detail-analysis-title detail-analysis-question'}>Q. {this.state.questions[sectionIdx].B[item.lsq_idx].question?this.state.questions[sectionIdx].B[item.lsq_idx].question:null}</div>
                                                                <div className={'detail-analysis-desc'}>
                                                                    <p>A. 아니오</p>
                                                                    <p>
                                                                        {!!this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]?this.state.questions[sectionIdx].B[item.lsq_idx].report_description.N[1]:null}
                                                                    </p>
                                                                </div>
                                                            </div>:null
                                                            }
                                                        </>:null
                                                        }
                                                    </>
                                                    )
                                                }
                                                </div>
                                                <div className={'divided'}></div>
                                                {/* 상세질문에대한 답변 loop */}

                                                <div className="answer-detail-analysis">
                                                    <div className={'detail-analysis-desc blue'}>
                                                        미답변항목: <br/>
                                                        {issueText[sectionIdx].U}
                                                    </div>
                                                </div>
                                                <div className={'divided'}></div>
                                                <div className="answer-detail-analysis">
                                                    <div className="report-table">
                                                        <table>
                                                            <thead>
                                                            <tr>
                                                                <th>현재 미파악된 이슈사항</th>
                                                                <th>권고</th>
                                                            </tr>
                                                            <tr style={{display:'none'}}>
                                                                <td colSpan='2'>{  td = 0 }</td>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                !!this.state.userCompletedSections[sectionIdx]&&!!this.state.userCompletedSections[sectionIdx].B&&
                                                                this.state.userCompletedSections[sectionIdx].B.answer.map((item, index) =>
                                                                <>
                                                                    {
                                                                        item.ans === 'U'?
                                                                    <tr>
                                                                        <td>{!!this.state.questions[sectionIdx].B[item.lsq_idx].report_description.U[0]?this.state.questions[sectionIdx].B[item.lsq_idx].report_description.U[0]:null}</td>
                                                                        <td>{!!this.state.questions[sectionIdx].B[item.lsq_idx].report_description.U[1]?this.state.questions[sectionIdx].B[item.lsq_idx].report_description.U[1]:null}</td>
                                                                        <td style={{display:'none'}}>{ td += 1 }</td>
                                                                    </tr>
                                                                    :null
                                                                    }
                                                                </>
                                                                )
                                                            }
                                                            {
                                                                td === 0?
                                                                <tr>
                                                                    <td colSpan='2' className="empty-row" >해당 사항 없음</td>
                                                                </tr>
                                                                :null
                                                            }
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                                <div className={'divided'}></div>
                                            </div>
                                        </div>
                                        </>:null}
                                        </>
                                        )}
                                        { /** section loop end */  }
                                    </li>
                                </ol>


                            </li>
                        </ol>
                    </section>
                    :null
                    }

                </section>
            </div>
            {/* <div className="noprint floating">
                <div>
                    인쇄안함
                </div>
            </div> */}

        </>)
    }
}

export default Report

