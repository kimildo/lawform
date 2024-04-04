/**
 * 솔루션 수행결과 (4단계)
 * 최종 결과
 *
 *
 */

import React, { Component } from 'react'
import API from '../../utils/apiutil'
import User from '../../utils/user'
import { styles } from './documents/docStyle'
import { withStyles } from '@material-ui/core'
import Modal from '../common/modal'
import FinalResultDocs from './documents/finalResultDocs'
import jQuery from 'jquery'

window.$ = window.jQuery = jQuery
class FinalResults extends Component {

    constructor (props) {
        super(props)
        this.state = {
            userInfo: User.getInfo(),
            finalResultAble: false,
            finalResultOpen: false,
            docsData: [],
            answerData: []
        }
    }

    getDocStateData = () => {
        return this.state.docsData
    }

    getAnswerStateData = () => {
        return this.state.answerData
    }

    getAnswerData = () => {
        API.sendPost('/solution/getAnswerData', {
            userInfo: this.state.userInfo
        }).then((result) => {
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

    openFinalResult = () => {

        const state = this.state

        // @todo
        if (state.userInfo.iss !== 'lawform-solution-admin' && !(window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io')) {
            alert('결과 보고서는 2020. 1. 에 제공될 예정입니다.')
            return
        }

        state.finalResultOpen = true
        this.setState(state)

    }

    getDocumentResult = () => {
        if (!this.state.userInfo) {
            alert('error')
            return
        }

        API.sendPost('/solution/getDocuments', { userInfo: this.state.userInfo }).then((result) => {
            if (result.status === 'ok') {
                let docData = result.data.data
                let finalResultAble = true

                docData.forEach((row) => {
                    if (!row.binddata) {
                        return (finalResultAble = false)
                    }
                })

                this.setState({
                    finalResultAble: finalResultAble,
                    docsData: result.data.data
                })
            }
        })

    }

    componentDidMount = () => {
        this.getAnswerData()
        this.getDocumentResult()
    }

    closeFinalResult = () => {
        this.setState({ finalResultOpen: false })
        window.location.reload(true)
    }

    printFinalResult = () => {
        window.$('#final_result_print_btn').hide()
        window.$('.default-dialog-title').hide()
        window.$('body').css({
            overflow: 'scroll',
            width: 900,
            margin: '0 auto'
        }).html(window.$('.show-final-result').html())
        window.print()
        window.location.reload()
    }

    render () {

        const { docsData, finalResultAble } = this.state
        const { classes } = this.props

        return (
            <>
                <div className={classes.root}>
                    <span>3단계 솔루션 수행에 따른 결과를 확인하실 수 있습니다. "아래"의 버튼을 눌러 최종결과를 확인해 주세요.
                    {
                        // (docsData.length > 0 && finalResultAble === true)
                        //     ? ' 아래의 버튼을 눌러 최종결과를 확인해 주세요.'
                        //     : ' 자가진단과 솔루션 수행 완료 후 확인해 주세요.'
                    }
                    </span>
                </div>

                <div className={classes.resultBox}>
                    <div className={classes.finalResultButtonWraper}>
                        <h2 className={classes.h2} onClick={this.openFinalResult}>스타트업 실사 솔루션 수행 결과 보고서</h2>
                    </div>
                </div>

                <Modal
                    open={this.state.finalResultOpen}
                    onClose={this.closeFinalResult}
                    width={900}
                    id="final-result-paper"
                    className="show-final-result"
                    scroll="body"
                >
                    <div className="default-dialog-title" style={{ textAlign: 'left' }}>스타트업 실사 솔루션 수행 결과 보고서
                        <span className="close" onClick={this.closeFinalResult}><img src="/common/close-white.svg" alt=""/></span>
                    </div>
                    <FinalResultDocs getState={this.props.getState} getDocs={this.getDocStateData} getAnswers={this.getAnswerStateData} printFinalResult={this.printFinalResult}/>
                </Modal>

            </>
        )
    }
}

export default withStyles(styles)(FinalResults)