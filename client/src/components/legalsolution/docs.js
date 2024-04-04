/**
 * 솔루션 수행 (3단계)
 * 제공된 문서 보는탭
 *
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../../utils/apiutil'
import User from '../../utils/user'
import { styles } from './documents/docStyle'
import { withStyles, Typography, Tab, Tabs, AppBar } from '@material-ui/core'
import Modal from '../common/modal'

function TabContainer (props) {
    return (
        <Typography {...props} component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
}

class SolutionDocs extends Component {

    constructor (props) {
        super(props)
        this.state = {
            activeTabIndex: 0,
            dialogOpen: false,
            userInfo: User.getInfo(),
            steps: this.props.getState(),
            docsData: [],
            answerData: []
        }
    }

    componentDidMount () {
        this.getDocs()
        this.getAnswerData()
    }

    getDocs = () => {
        if (!this.state.userInfo) {
            alert('error')
            return
        }

        let params = {
            userInfo: this.state.userInfo
        }

        API.sendPost('/solution/getDocuments', params).then((result) => {
            if (result.status === 'ok') {
                this.setState({
                    docsData: result.data.data
                })
            }
        })
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

    isIE = () => {
        return /*@cc_on!@*/!!document.documentMode
    }

    linkautoform = (idwriting) => {
        if (!!this.isIE()) {
            //alert('법률문서 자동작성은 IE 브라우저를 정식으로 지원하지 않습니다. 크롬 혹은 Edge를 이용해주세요.')
            //this.setState({dialogOpen: true})
            if (!window.confirm('로폼의 문서 작성 및 수정은 크롬 혹은 Edge 브라우저에 최적화 되어 있습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.\n\n계속 진행하시겠습니까?')) {
                return
            }
        }

        window.location = '/autoform/' + idwriting
    }

    getTabContetns = (data) => {

        const { classes } = this.props
        const noDocuments = '작성 가능한 문서가 없습니다.'
        const desc = (!this.state.activeTabIndex)
            ? ' 아래의 문서 리스트는 귀사의 자가진단에 따라 귀사의 상황에 따라 반드시 작성해야하지만 아직 작성되지 않은 문서들입니다. 솔루션 수행 기간 내에 아래의 문서를 작성해주세요'
            : ' 아래의 문서 리스트는 귀사의 자가진단에 따라 귀사의 상황에서 귀사가 작성한 문서의 법률적 위험이 있어, 이를 보완할 필요가 있는 문서의 리스트입니다. 만일, 계약을 완료한 경우에는 귀사의 리스크를 숙지하는 용도로 활용할 수 있습니다.'

        const thead = <>
            <thead className={classes.thead}>
            <tr className={classes.tr}>
                <th style={{ paddingLeft: 10 }}>문서명</th>
                <th style={{ textAlign: 'right', paddingRight: 43 }}>문서작성</th>
            </tr>
            </thead>
        </>

        return <TabContainer>
            <div style={{ marginBottom: 25, lineHeight: '25px' }}>{desc}</div>
            <table className={classes.table}>
                {thead}
                <tbody className={classes.tbody}>
                {
                    data.length > 0 && data.map((rowData, key) => (
                        <tr className={classes.trDoc} key={key}>
                            <td className={classes.tdDocTitle}><strong>{rowData.title}</strong></td>
                            <td className={classes.tdButton}>
                                <button className={(!!rowData.binddata) ? 'comment_write' : 'comment_write writeable'} onClick={() => this.linkautoform(rowData.idwriting)}>
                                    {(!!rowData.binddata) ? '문서수정' : <strong>문서작성</strong>}
                                </button>
                            </td>
                        </tr>
                    ))
                }
                {(!data.length) && <tr className={classes.tr}>
                    <td colSpan={2}>{noDocuments}</td>
                </tr>}
                {/*{(!docsListTab1.length && !docsListTab2.length) && <tr><td colSpan={2}>{noDocuments}</td></tr>}*/}
                </tbody>
            </table>
        </TabContainer>

    }

    handleChange = (e) => {

    }

    render () {

        const { activeTabIndex, docsData, answerData, steps } = this.state
        let docsListTab1 = [], docsListTab2 = []
        if (docsData.length > 0) {
            docsData.map((row) => {
                switch (true) {
                    case row.iddocuments === 20 && steps.step1 === 'Y' && (!answerData.articles_incorporation || !answerData.articles_incorporation.length) :
                    case row.iddocuments === 26 && steps.step1 === 'Y' && (!answerData.articles_incorporation || !answerData.articles_incorporation.length) :
                    case row.iddocuments === 39 && (steps.step1 === 'Y' && steps.step2 === 'Y') && (!answerData.sharehoders_agreement || !answerData.sharehoders_agreement.length) :
                    case row.iddocuments === 31 && (steps.step1 !== 'Y' && steps.step2 === 'Y') && (!answerData.partnership_agreement || !answerData.partnership_agreement.length) :
                    case row.iddocuments === 38 && (!answerData.executive_employment || !answerData.executive_employment.length) :
                    case row.iddocuments === 34 && steps.step3 === 'Y' && (!answerData.employee_agreement || !answerData.employee_agreement.length) :
                    case row.iddocuments === 30 && steps.step3 === 'Y' && (!answerData.labor_contract || !answerData.labor_contract.length) :
                    case row.iddocuments === 50 && steps.step3 === 'Y' && (!answerData.labor_contract || !answerData.labor_contract.length) :
                    case row.iddocuments === 56 && steps.step3 === 'Y' && (!answerData.labor_contract || !answerData.labor_contract.length) :
                    case row.iddocuments === 35 && steps.step5 === 'Y' && (!answerData.stock || !answerData.stock.length) :
                    case row.iddocuments === 33 && steps.step6 === 'Y' && (!answerData.nda || !answerData.nda.length) :
                    case row.iddocuments === 54 && steps.step6 === 'Y' && (!answerData.joint_arrangement || !answerData.joint_arrangement.length) :
                    case row.iddocuments === 36 && steps.step6 === 'Y' && (!answerData.mou || !answerData.mou.length) :
                    case row.iddocuments === 37 && steps.step6 === 'Y' && (!answerData.service_agreement || !answerData.service_agreement.length) :
                        docsListTab1.push(row)
                        break
                    default :
                        docsListTab2.push(row)
                }
            })
        }

        // console.log('stepData', this.state.steps)
        // console.log('docsListTab1', docsListTab1)
        // console.log('docsListTab2', docsListTab2)

        return (
            <>
                <AppBar position="static" color="default">
                    <Tabs
                        indicatorColor="primary"
                        textColor="primary"
                        value={activeTabIndex}
                        onChange={this.handleChange}
                    >
                        <Tab label="반드시 작성해야 하는 문서" onClick={() => this.setState({ activeTabIndex: 0 })}/>
                        <Tab label="보완하면 좋은 문서" onClick={() => this.setState({ activeTabIndex: 1 })}/>
                    </Tabs>
                </AppBar>
                {activeTabIndex === 0 && this.getTabContetns(docsListTab1)}
                {activeTabIndex === 1 && this.getTabContetns(docsListTab2)}
            </>
        )
    }
}

SolutionDocs.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SolutionDocs)