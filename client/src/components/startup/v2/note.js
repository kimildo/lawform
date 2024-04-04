import React, { Component, Fragment } from 'react'
import User from 'utils/user'
import Router from 'next/router'
import Paging from 'components/common/paging'
import API from 'utils/apiutil'

//const JsonData = require('json/note.json')
import { Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

class Note extends Component {

    constructor (props) {
        super(props)

        this.state = {
            selectedTabs: 'list',
            qnaData: [],
            openAnswer: null,
            currentPage: 1,
            perPage: 3
        }
        this.setPage = this.setPage.bind(this)
    }

    componentDidUpdate (prevProps) {
        if (prevProps !== this.props) this.setList()
    }

    showQna (idx) {
        if (this.state.showQna === idx) {
            this.setState({
                showQna: null
            })
        } else {
            this.setState({
                showQna: idx
            })
        }

    }

    openAnswer (openAnswer) {
        const userInfo = User.getInfo()
        if (!!userInfo) {
            if (this.state.openAnswer === openAnswer) {
                this.setState({
                    openAnswer: null
                })
            } else {
                this.setState({
                    openAnswer
                })
            }
        } else {
            alert('회원 전용 서비스 입니다. 로그인 또는 회원 가입을 해주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent('/startup/document')
        }

    }

    condition (category, subcategory) {
        if (!this.props.category && !this.props.subcategory) {
            return true
        }
        if (category === this.props.category && subcategory === 'ALL') {
            return true
        } else {
            if (!!this.props.subcategory) {
                return (category === this.props.category && this.props.subcategory === subcategory)
            } else {
                if (category === this.props.category) {
                    return true
                }
            }
        }
    }

    setPage (page) {
        this.setState({
            currentPage: page,
            openAnswer: null
        })
    }

    getData = async () => {

        let jsonData = {}
        const { issueCategory } = this.props
        return await API.sendPost('/solution/getLawissueData', { category: issueCategory }).then((result) => {

            if (result.status === 'ok' && result.data.status === 'ok') {

                let data = result.data.data

                data.map((item) => {

                    if (jsonData[item.tag] === undefined) {
                        jsonData[item.tag] = {}
                    }

                    if (jsonData[item.tag][item.sub_tag] === undefined) {
                        jsonData[item.tag][item.sub_tag] = []
                    }

                    let tmp = {
                        'Q': item.title,
                        'A': item.contents,
                    }

                    if (!!item.guide_text) {
                        tmp['GUIDE'] = {
                            'TEXT': item.guide_text,
                            'LINK': item.guide_link_no
                        }
                    }

                    if (!!item.reference_text) {
                        tmp['REFERENCE'] = {
                            'TEXT': item.reference_text,
                            'LINK': item.reference_link
                        }
                    }

                    jsonData[item.tag][item.sub_tag].push(tmp)

                })

                //console.log('jsonData', jsonData)
                return jsonData
            }

            return false
        })

    }

    setList () {
        let loop = async (jsonData) => {
            let array = []

            if (jsonData !== false) {
                await Object.getOwnPropertyNames(jsonData).map((catkey, catindex) =>
                    Object.getOwnPropertyNames(jsonData[catkey]).map((subkey, subindex) =>
                        this.condition(catkey, subkey) &&
                        jsonData[catkey][subkey].map((item, index) =>
                            array.push(item)
                        )
                    )
                )
            }

            await this.setState({
                qnaData: array,
                openAnswer: null,
                currentPage: 1,
            })

            return array
        }

        this.getData().then((data) => {
            loop(data)
        })
    }

    addDocument (iddocuments) {
        var sub_idx = this.props.userSubscription.idx
        if (!iddocuments) {
            alert(' 선택된 문서가 없습니다. 문서를 선택해주세요.')
            return false
        } else {
            let params = { iddocuments: iddocuments, sub_idx: sub_idx }
            API.sendPost('/user/subscription/addDoc', params).then(result => {
                if (result.status === 'ok') {
                    // alert('해당문서가 지급되었습니다.');
                    Router.push('/autoform/' + result.data.idwriting)
                } else {
                    alert('문서지급에 실패했습니다.')

                }
            })
        }
    }

    render () {
        return (
            <div className="note">
                <h5><span>관련 교육자료</span>
                    <hr className="mobile_hide"/>
                </h5>

                <ul className="note-list">
                    {(!!this.state.qnaData) &&
                        this.state.qnaData.slice(this.state.currentPage * this.state.perPage - this.state.perPage, this.state.currentPage * this.state.perPage).map((item, index) =>
                            <li>
                                <question className={this.state.openAnswer === index ? 'open' : ''} onClick={() => this.openAnswer(index)}>
                                    {item.Q}
                                </question>
                                {this.state.openAnswer === index ?
                                    <answer>
                                        <div className="answer-box">
                                            <div className="answer-box-contents" dangerouslySetInnerHTML={{ __html: item.A }}></div>
                                            {(!!item.REFERENCE) && <button onClick={() => Router.push(item.REFERENCE.LINK)} dangerouslySetInnerHTML={{ __html: item.REFERENCE.TEXT }}/>}
                                        </div>
                                        {(!!item.GUIDE) &&
                                            <div className="answer-link">
                                                <div className="description">{item.GUIDE.TEXT}</div>
                                            </div>
                                        }
                                    </answer>
                                    : null}
                            </li>
                        )
                    }
                </ul>
                {(this.state.qnaData.length > 0) && <Paging page={this.state.currentPage} per={this.state.perPage} total={this.state.qnaData.length} setPage={this.setPage}/>}
            </div>
        )
    }
}

export default Note
