import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from '../../../../utils/user'
import API from '../../../../utils/apiutil'
import moment from 'moment'
import Router from 'next/router'
import 'scss/startup/solution.scss'

class Progress extends Component {

    constructor (props) {
        super(props)
        this.state = {
            availableUser: {
                idusers: null,
                group_text: null,
                solution_use_period_start: null,
                solution_use_period_end: null
            },
            userSolutionLastModifedSection:null
        }

        this.userInfo = User.getInfo()
    }

    componentDidMount () {
        User.getAvailableSoutionUser().then((data) => {
            // console.log( 'progress',data )
            if (!!data)  {
                this.setState({
                    availableUser: data
                })
                this.getUserSolutionLastModify()
            }
        })
        
    }

    getUserSolutionLastModify = async() => {
        let sections = [1,2,3,4]
        let completeSection = []
        let lastModifiedTemp = null
        await API.sendPost('/solution/getUserLastModify').then((result) => {
            let data = result.data.data
            data.map((item,index)=>{
                if( sections.indexOf( item.section ) > -1 && item.count >= 2 ) {
                    completeSection.push( item.section )
                }
                if( item.lastModifiedTemp === 'Y' ) {
                    lastModifiedTemp = item.section
                }
            })
        })
        let inCompleteSection = sections.filter(x => completeSection.indexOf(x) < 0 );
        if( !!lastModifiedTemp ) {
            this.setState({userSolutionLastModifedSection:lastModifiedTemp})
        } else {
            if( inCompleteSection.length > 0 ){
                this.setState({userSolutionLastModifedSection:inCompleteSection.shift()})
            }
        }
    }

    render () {

        const { availableUser } = this.state
        const solutionLink = !!this.state.userSolutionLastModifedSection?`/startup/solution?section=${this.state.userSolutionLastModifedSection}#que`:'/startup/solution'
        const sectionText = {
            1: '경영권 상실/강화',
            2: '인사/노무',
            3: '지재권/회사 자산 보호',
            4: '투자가치 극대화',
        }

        return (<>

            {(!!availableUser.idusers && !!this.userInfo) &&
            <div className="docs solution-progress">
                <section>
                    <h5>나의 스타트업 실사 진행 현황</h5>
                    <ul className="solution-program-text">
                        <li>법률실사 프로그램 : {availableUser.group_text}</li>
                        <li>{availableUser.solution_use_period_start} ~ {availableUser.solution_use_period_end}</li>
                    </ul>
                    <div className="solution-progress-btn">
                        <Link href={solutionLink}><a>스타트업 실사 계속하기 <img src="/images/common/arrow-right-white.svg" alt={'arrow'}/></a></Link>
                    </div>
                    <ul className="solution-program-list">
                        <li>
                            <div className={'title'}>{sectionText[1]}</div>
                            <div className={'desc'}><b>아래 진행하기 버튼을 눌러<br /> 참여 프로그램을 진행해주세요.</b></div>
                            <div className={'button cur-progress'} onClick={()=>window.location = `/startup/solution?section=1#que`}><a>진행하기</a></div>
                        </li>
                        <li>
                            <div className={'title'}>{sectionText[2]}</div>
                            <div className={'desc'}><b>아래 진행하기 버튼을 눌러<br /> 참여 프로그램을 진행해주세요.</b></div>
                            <div className={'button cur-progress'} onClick={()=>window.location = `/startup/solution?section=2#que`}><a>진행하기</a></div>
                        </li>
                        <li>
                            <div className={'title'}>{sectionText[3]}</div>
                            <div className={'desc'}><b>아래 진행하기 버튼을 눌러<br /> 참여 프로그램을 진행해주세요.</b></div>
                            <div className={'button cur-progress'} onClick={()=>window.location = `/startup/solution?section=3#que`}><a>진행하기</a></div>
                        </li>
                        <li>
                            <div className={'title'}>{sectionText[4]}</div>
                            <div className={'desc'}><b>아래 진행하기 버튼을 눌러<br /> 참여 프로그램을 진행해주세요.</b></div>
                            <div className={'button cur-progress'} onClick={()=>window.location = `/startup/solution?section=4#que`}><a>진행하기</a></div>
                        </li>
                    </ul>
                </section>
            </div>
            }



        </>)
    }
}

export default Progress

