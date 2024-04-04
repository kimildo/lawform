import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Modal from '../../common/modal'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import API from '../../../utils/apiutil'
import User from '../../../utils/user'
import { getQuestions, getOptions } from './questions'
import { styles } from './docStyle'
import { View, Text } from '@react-pdf/renderer'

class Document extends Component {

    constructor (props) {
        super(props)
        this.state = {
            userInfo: User.getInfo(),
            show_modal: false,
            answers: [],
            isDoc: 'N',
            docnum: Number(this.props.docnum),
            queMaxNum: 0,
            docTitle: '',
            docQuestion: '',
            isGetAnswers: false,
            hasAnswers: false,
            editAble: (this.props.editAble === undefined || this.props.editAble === null) ? true : this.props.editAble
        }
    }

    componentDidMount () {

        let qOpt = getOptions(this.state.docnum)
        this.setState(qOpt)

        if (this.state.editAble === false && !this.state.isGetAnswers) {
            this.getSubmitData()
        }
    }

    showModal = () => {
        API.sendPost('/solution/getDocuments', {
            userInfo: this.state.userInfo
        }).then((result) => {
            if (result.status === 'ok') {
                if (!!result.data.data.length) {
                    alert('솔루션 수행 중에는 문서별 심화 진단을 다시 진행하실 수 없습니다.')
                } else {
                    this.setState({ show_modal: true })
                    if (!this.state.isGetAnswers) this.getSubmitData()
                }
            }
        })
    }

    closeModal = () => {
        this.setState({
            show_modal: false
        })
    }

    handleChange = (e, idx) => {

        let tVal = e.target.value
        this.state.answers[idx] = tVal
        if (!!this.state.hasAnswers) {
            this.setState(state => {
                const answers = state.answers.map((item, j) => {
                    if (j === idx) return tVal
                    else return item
                })
                return {
                    answers
                }
            })
        }

        //console.log("answers", this.state.answers)
        //console.log("idx", idx)
    }

    checkIsDoc = (e) => {
        this.setState({
            isDoc: e.target.value
        })
    }

    getSubmitData = () => {

        let params = {
            userInfo: this.state.userInfo,
            dataType: this.state.docnum
        }

        API.sendPost('/solution/getSolutiondata', params).then((result) => {
            if (result.status === 'ok') {
                let resultData = result.data.data[0].col
                //console.log(this.state.docTitle + ' answers', resultData)
                if (!!resultData && resultData.length > 0) {
                    this.state.answers[this.props.docnum] = resultData
                    this.setState({
                        isDoc: 'Y',
                        answers: resultData,
                        isGetAnswers: true,
                        hasAnswers: true
                    })
                }
            }
        })

    }

    handleSubmit = () => {

        const qLen = this.state.queMaxNum
        if (this.state.isDoc === 'Y' && this.state.answers.length < qLen) {
            alert('모든 질문에 답변해 주세요')
            return false
        }

        if (this.state.isDoc === 'N') {
            this.setState({
                answers: []
            })
        }

        let params = {
            userInfo: this.state.userInfo,
            dataType: this.state.docnum,
            data: (this.state.isDoc === 'Y') ? this.state.answers : []
        }

        API.sendPost('/solution/setSolutiondata', params).then((result) => {
            let msg = '등록에 실패했습니다. 잠시 후 이용해주십시오.'
            if (result.status === 'ok') {
                msg = '등록되었습니다.'
            }

            alert(msg)
            this.closeModal()

        })

    }

    render () {

        const { classes } = this.props
        let docquestion = getQuestions(this.state.docnum)

        const questions = docquestion.map((row, k) =>
            <div key={k}>
                <h4 style={{ marginTop: '15px', borderBottom: '2px solid #CDCDCD' }}>{row.groupTitle}</h4>
                <div>
                    <ol>
                        {
                            row.questions.map((r, key) =>
                                <li key={key}>
                                    {(this.state.editAble === true) && <>
                                        <span>{r.q}</span>
                                        <RadioGroup aria-label="gender" name={'question-' + r.index}
                                                    value={this.state.answers[r.index]}
                                                    className="input-group" onChange={(e) => this.handleChange(e, r.index)}>
                                            <FormControlLabel data-key={key} value={r.value} control={<Radio color="default" className="radio"/>} label="예"/>
                                            <FormControlLabel data-key={key} value="0" control={<Radio color="default" className="radio"/>} label="아니오"/>
                                        </RadioGroup>
                                    </>
                                    }
                                </li>
                            )
                        }
                    </ol>
                </div>
            </div>
        )

        const rtnContent = (this.state.editAble === true) ?
            <>
                <li className={classes.card}><h2 onClick={() => this.showModal()} className={classes.h2}>{this.state.docTitle} </h2></li>
                <Modal open={this.state.show_modal} onClose={() => this.closeModal()} width={980} className="show-write-review" scroll="body">
                    <div className="default-dialog-title" style={{ textAlign: 'left' }}>{this.state.docTitle}
                        <span className="close" onClick={(e) => this.closeModal()}><img src="/common/close-white.svg" alt=""/></span>
                    </div>
                    <div className="content">
                        <div>
                            <span>{this.state.docTitle} 문서가 있습니까? <strong className='bold'>{(this.state.editAble === false) && ((this.state.isDoc === 'Y') ? '예' : '아니오')}</strong></span>
                            <RadioGroup aria-label="gender" name="question" value={this.state.isDoc} className="input-group" onChange={this.checkIsDoc}>
                                <FormControlLabel value="Y" control={<Radio color="default" className="radio"/>} label="예"/>
                                <FormControlLabel value="N" control={<Radio color="default" className="radio"/>} label="아니오"/>
                            </RadioGroup>
                        </div>
                        {this.state.isDoc === 'Y' && questions}
                        <div className="step-button-single">
                            <button type="button" className="submit" onClick={this.handleSubmit}>제출하기</button>
                        </div>
                    </div>
                </Modal>
            </>
            :
            <View style={{marginBottom: 10}}>
                <Text style={{fontFamily: 'Dotum', color:'#15376c'}}>
                    <Text>{(!!this.props.docuseq) && '(' + this.props.docuseq + ') '} {this.state.docTitle}에 관한 평가</Text>
                    {(!this.state.answers || this.state.answers.length === 0) && <Text> - {this.state.docEmptyWarn}</Text>}
                    {(!!this.state.answers && this.state.answers.length > 0) && <Text> - 귀사가 작성한 {this.state.docTitle} 에 관한 자가 진단 사항 및 그에 따른 진단 결과는 아래와 같습니다.</Text>}
                </Text>

                {(!this.state.answers || this.state.answers.length === 0) &&
                <Text style={{padding:10, border: 1, fontSize: 10,
                    borderStyle: 'solid',
                    borderColor: '#E0E0E0',
                    backgroundColor: '#eeeff1'}}>
                    <Text style={{textIndent:5}}>{this.state.docWarn}</Text>
                </Text>
                }

                {/** 답변이 있을 경우에 문서가 있다고 판단함 */}
                {
                    (!!this.state.answers && this.state.answers.length > 0) &&
                    <View>
                        {
                            docquestion.map((row) =>
                                row.questions.map((r, key) =>
                                    <View key={key} style={{fontSize: 10, padding:5}}>
                                        <Text>
                                            <Text>Q. {r.q} </Text>
                                            {/** 긍정질문 */}
                                            {(Number(this.state.answers[r.index]) > 0 && r.value > 0) && <Text>예 ({((Number(r.value) === 9999) ? 0 : Number(r.value))}점)</Text>}
                                            {(Number(this.state.answers[r.index]) === 0 && r.value > 0) && <Text style={{fontFamily: 'DotumBold', textDecoration:'underline'}}>아니오</Text>}
                                            {/** 부정질문 */}
                                            {(Number(this.state.answers[r.index]) === 0 && r.value < 0) && <Text>아니오</Text>}
                                            {(Number(this.state.answers[r.index]) < 0 && r.value < 0) && <Text style={{fontFamily: 'DotumBold', textDecoration:'underline'}}>예</Text>}
                                            {(Number(this.state.answers[r.index]) < 0 && r.value < 0) && <Text>({((Number(r.value) === -9999) ? 0 : Number(r.value))}점)</Text>}
                                        </Text>
                                        {((Number(this.state.answers[r.index]) === 0 && r.value > 0) || (Number(this.state.answers[r.index]) < 0 && r.value < 0)) &&
                                        <Text style={{padding:10, border: 1, borderStyle: 'solid', borderColor: '#E0E0E0', backgroundColor: '#eeeff1', textIndent:5}}>{r.recommend}</Text>
                                        }
                                    </View>
                                )
                            )
                        }
                    </View>
                }

            </View>

        return (rtnContent)
    }

}

export default withStyles(styles)(Document)