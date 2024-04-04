import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from 'utils/user'
import API from 'utils/apiutil'
import Router from 'next/router'
import moment from 'moment'
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Product from '../product'

const data = require('json/startup.json')
const categorys = Object.getOwnPropertyNames(data)

console.log( 'categorys : ', categorys )
console.log( 'data : ', data )
class Examples extends Component {

    constructor (props) {
        super(props)
        this.state = {
            completedSolution:[],
            sectionTab:1,
            documentList:null
        }
        this.userInfo = User.getInfo()
    }

    componentDidMount () {
        this.getSolutionCompleted()
        this.setTabAll()
        this.handleSectionTab( this.props.section)
    }

    setTabAll() {
        var documentList = {}
        var sectionDocumentList = {
            1:{},
            2:{},
            3:{},
            4:{}
        }
        
        let sectionKey = {}
        sectionKey[1] = [26,39,31,32]
        sectionKey[2] = [38,30,56,26,35]
        sectionKey[3] = [33,36,37,39,38,30,54,34,63,64,70,55,59]
        sectionKey[4] = [26,53,57,39,31,54,38,58]
        var all = async() => {
            Object.keys(data).forEach(function(k){
                Object.keys(data[k]).forEach(function(key){
                    Object.keys(data[k][key]).forEach(function(n){
                        if( !!n ) { 
                            // console.log( sectionKey[1].indexOf( Number(n) ) )
                            documentList[n]=data[k][key][n] 
                            Object.keys(sectionKey).forEach( function(section){
                                if( sectionKey[section].indexOf( Number(n) ) > -1 ) {
                                    sectionDocumentList[section][n] = data[k][key][n] 
                                }
                            })


                            // if( sectionKey[1].indexOf( Number(n) ) > -1 ) {
                            //     sectionDocumentList[1][n] = data[k][key][n] 
                            // }
                            // if( sectionKey[2].indexOf( Number(n) ) > -1 ) {
                            //     sectionDocumentList[2][n] = data[k][key][n] 
                            // }
                            // if( sectionKey[3].indexOf( Number(n) ) > -1 ) {
                            //     sectionDocumentList[3][n] = data[k][key][n] 
                            // }
                            // if( sectionKey[4].indexOf( Number(n) ) > -1 ) {
                            //     sectionDocumentList[4][n] = data[k][key][n] 
                            // }
                        }

                    })
                });
            })
            // console.log( 'sectionDocumentList', sectionDocumentList )
            await this.setState({
                documentList,
                sectionDocumentList
            })
        }
        all()
    }

    getSolutionCompleted = async() => {
        API.sendPost('/solution/getUserSolutionCompleted').then(res => {
            if (res.data.data) {
                    let completedSolution = res.data.data.split(',')
                    
                    this.setState({ completedSolution })
            }
        })
    }

    handleSectionTab = async(n = 1) => {
        this.setState({
            sectionTab:n
        })
    }

    goSolution = async( n=1 ) => {
        this.props.handleTab(1)
        this.props.handleSectionTab(n)
    }


    render () {
        const { sectionTab,completedSolution } = this.state
        // console.log(this.state.documentList)
        return (
            <>
                <div className="solution-guide">
                    <ul>
                        <li>진단평가를 통해 도출된 리스크 분석 및 개선안을 기초로 최적화된 맞춤 교육&솔루션을 추천드리고 있습니다. </li>
                        <li>안내된 솔루션을 수행(리스크 개선을 위한 법률문서 작성) 해주세요. </li>
                        <li>안내된 맞춤 교육 콘텐츠를 활용하여 해당 직무관련자의 업무 능력을 향상시켜보세요.</li>
                    </ul>
                </div>

                <Element className="solution-section" name="que" id="que">
                    <ul>
                        <li className={`multi ${(sectionTab === 1) ? 'active' : ''}`} onClick={() => this.handleSectionTab(1)}><span>경영권<br/>상실/강화</span></li>
                        <li className={`single ${(sectionTab === 2) ? 'active' : ''}`} onClick={() => this.handleSectionTab(2)}>인사/노무</li>
                        <li className={`multi ${(sectionTab === 3) ? 'active' : ''}`} onClick={() => this.handleSectionTab(3)}>지재권/<br/>회사 자산 보호</li>
                        <li className={`multi ${(sectionTab === 4) ? 'active' : ''}`} onClick={() => this.handleSectionTab(4)}>투자 가치<br/>극대화</li>
                    </ul>
                </Element>
                {sectionTab === 1?
                <div className="examples">
                    { completedSolution.indexOf('1')>-1?
                    <>
                        {/* <button onClick={()=>this.goSolution(1)}>경영권 상실/강화</button> */}
                        <Product list={this.state.sectionDocumentList[1]} />
                    </>
                    :<div className="incomplete">진단평가를 완료해주세요. <br />진단평가 완료 후 실습을 진행하실 수 있습니다.
                        <button onClick={()=>this.goSolution(1)}>진단하기</button>
                    </div>
                    }
                </div>:null
                }
                {sectionTab === 2?
                <div className="examples">
                    { completedSolution.indexOf('2')>-1?
                    <>
                        {/* <button onClick={()=>this.goSolution(2)}>인사/노무</button> */}
                        <Product list={this.state.sectionDocumentList[2]} />
                    </>
                    :<div className="incomplete">진단평가를 완료해주세요. <br />진단평가 완료 후 실습을 진행하실 수 있습니다.
                        <button onClick={()=>this.goSolution(2)}>진단하기</button>
                    </div>
                }
                </div>:null
                }
                {sectionTab === 3?
                <div className="examples">
                    { completedSolution.indexOf('3')>-1?
                    <>
                        {/* <button onClick={()=>this.goSolution(3)}>지재권/회사 자산 보호</button> */}
                        <Product list={this.state.sectionDocumentList[3]} />
                    </>
                    :<div className="incomplete">진단평가를 완료해주세요. <br />진단평가 완료 후 실습을 진행하실 수 있습니다.
                        <button onClick={()=>this.goSolution(3)}>진단하기</button>
                    </div>
                }
                </div>:null
                }
                {sectionTab === 4?
                <div className="examples">
                    { completedSolution.indexOf('4')>-1?
                    <>
                        {/* <button onClick={()=>this.goSolution(4)}>투자 가치 극대화</button> */}
                        <Product list={this.state.sectionDocumentList[4]} />
                    </>
                    :<div className="incomplete">진단평가를 완료해주세요. <br />진단평가 완료 후 실습을 진행하실 수 있습니다.
                        <button onClick={()=>this.goSolution(4)}>진단하기</button>
                    </div>
                }
                </div>:null
                }
            </>
        )
    }
}

export default Examples

