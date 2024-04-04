import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../../../utils/apiutil'
import User from '../../../utils/user'
import { withStyles, Checkbox, FormGroup, FormControlLabel, Button, Paper } from '@material-ui/core'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { styles } from './docStyle'
import { getQuestions, getDocumentName, getDocumentPoint } from './questions'
import Document from './document'

class ResultDocs extends Component {

    constructor (props) {
        super(props)
        this.state = {
            userInfo: User.getInfo(),
            steps: this.props.getState(),
            answers: [],
            partTotal: 0,
            part1Point: 0,
            part2Point: 0,
            part3Point: 0,
            totalPoint: 0,
            totalTopPoint: 0,
            totalMiddlePoint: 0,
            totalMinusPoint: 0,
            tables: [],
            docsData: [],
            companyInfo: {
                company_name: null,
                company_owner: null,
                head_office_addr: null,
                main_business: null,
                tel: null,
            }
        }

        this.addDocument = this.addDocument.bind(this)
    }

    componentDidMount () {
        //console.log('mount :: ', 1)
        //console.log('state :: ', this.state.steps)
        this.setDocumentPoint()
        this.getDocs()
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

    addDocument = () => {

        if (this.state.docsData.length > 0) {
            return
        }

        if (!window.confirm('솔루션 수행 중에는 자가 진단 수정 및 재진단이 불가능합니다.\n' + '진단 결과 확인 후 솔루션 수행을 시작해주세요 ')) {
            return
        }

        if (!this.state.userInfo) {
            alert('error')
            return
        }

        const state = this.state
        let addDoc = []
        if (state.steps.step1 === 'Y') {
            addDoc.push(20) // 변경정관(주식회사용)
            addDoc.push(26) // 원시정관(주식회사용)
        }

        if (state.steps.step5 === 'Y') addDoc.push(35) //스톡옵션계약서
        if (state.steps.step1 === 'Y' && state.steps.step2 === 'Y') addDoc.push(39) //주주간계약서
        if (state.steps.step3 === 'Y') {
            addDoc.push(34) // 입사자서약서
            addDoc.push(30) // 근로계약서
        }
        if (state.steps.step1 === 'N' && state.steps.step2 === 'Y') addDoc.push(31) //동업계약서

        if (state.steps.step6 === 'Y') {
            if (state.steps.step7.indexOf(1) > -1) addDoc.push(36) // 업무협약서
            if (state.steps.step7.indexOf(2) > -1) addDoc.push(54) // 공동사업약정서
            if (state.steps.step7.indexOf(3) > -1) addDoc.push(37) // 용역계약서
            if (state.steps.step7.indexOf('Y') > -1) addDoc.push(33) // NDA
        }

        addDoc.push(38) // 임원계약서

        let params = {
            userInfo: this.state.userInfo,
            addDocs: addDoc
        }

        API.sendPost('/solution/addDocuments', params).then((result) => {
            if (result.status === 'ok') {
                if (result.data.status !== 'ok') {
                    alert('fail')
                    return
                }
            } else {
                alert('fail')
                return
            }

            this.props.closeFinalResult(true)

        })

    }

    /** 점수 계산 */
    setDocumentPoint = () => {

        /** 기본진단 점수 계산 */
        let part1Point = 0, part2Point = 0, part3Point = 0

        part1Point += (this.state.steps.step1 === 'Y' && this.state.steps.step2 === 'Y') ? 100 : 0
        part1Point += (this.state.steps.step1 === 'Y' && this.state.steps.step2 === 'N') ? 80 : 0
        part1Point += (this.state.steps.step1 === 'N' && this.state.steps.step2 === 'Y') ? 30 : 0
        part1Point += (this.state.steps.step1 === 'N' && this.state.steps.step2 === 'N') ? 10 : 0

        part2Point += (this.state.steps.step3 === 'Y') ? 50 : 0
        part2Point += (this.state.steps.step5 === 'Y') ? 10 : 5

        if (this.state.steps.step6 === 'Y' && this.state.steps.step7.length > 0) {
            this.state.steps.step7.map((row) => (
                <>
                    {(row === 1) && (part3Point += 10)}
                    {(row === 2) && (part3Point += 12)}
                    {(row === 3) && (part3Point += 8)}
                    {(row === 'Y') && (part3Point += 10)}
                </>
            ))
        }

        this.setState({
            partTotal: Number(part1Point + part2Point + part3Point),
            part1Point: part1Point,
            part2Point: part2Point,
            part3Point: part3Point,
        })

        /** 문서 답변에 대한 점수 계산 */
        API.sendPost('/solution/getAnswerData', {
            userInfo: this.state.userInfo
        }).then((result) => {

            if (result.status === 'ok' && result.data.status === 'ok') {

                let resultData = result.data.data[0]
                if (!!resultData) {

                    const state = this.state

                    let totalPoint = 0, totalTopPoint = 0, totalMiddlePoint = 0, totalMinusPoint = 0
                    let tables = [
                        { data: [], title: 'PART 1.  기업조직의 안정성 및 투명성 관리 영역' },
                        { data: [], title: 'PART 2.  인사노무 관리 영역' },
                        { data: [], title: 'PART 3.  지식재산권 관리' },
                    ]

                    let docnum, docName, docPoint, result = Object.keys(resultData).map((key) => {

                        docnum = 0
                        switch (key) {
                            case 'articles_incorporation':
                                docnum = (state.steps.step1 === 'Y') ? 1 : 0
                                break
                            case 'stock':
                                docnum = (state.steps.step5 === 'Y') ? 2 : 0
                                break
                            case 'sharehoders_agreement':
                                docnum = (state.steps.step1 === 'Y' && state.steps.step2 === 'Y') ? 3 : 0
                                break
                            case 'employee_agreement':
                                docnum = (state.steps.step3 === 'Y') ? 4 : 0
                                break
                            case 'labor_contract':
                                docnum = (state.steps.step3 === 'Y') ? 5 : 0
                                break
                            case 'partnership_agreement':
                                docnum = (state.steps.step1 === 'N' && state.steps.step2 === 'Y') ? 6 : 0
                                break
                            case 'executive_employment':
                                docnum = 7
                                break
                            case 'mou':
                                docnum = (state.steps.step6 === 'Y' && state.steps.step7.indexOf(1) > -1) ? 8 : 0
                                break
                            case 'joint_arrangement':
                                docnum = (state.steps.step6 === 'Y' && state.steps.step7.indexOf(2) > -1) ? 9 : 0
                                break
                            case 'service_agreement':
                                docnum = (state.steps.step6 === 'Y' && state.steps.step7.indexOf(3) > -1) ? 10 : 0
                                break
                            case 'nda':
                                docnum = (state.steps.step6 === 'Y' && state.steps.step7.indexOf('Y') > -1) ? 11 : 0
                                break
                        }

                        if (!!docnum) {

                            docName = getDocumentName(docnum)
                            docPoint = getDocumentPoint(docnum)

                            if (!!resultData[key] && resultData[key].length > 0) {
                                let sumPoint = 0, sumTopPoint = 0, sumMiddlePoint = 0, sumMinusPoint = 0
                                getQuestions(docnum).map((row, k) => {
                                    row.questions.map((r) => {

                                        let qPoint = Number(r.value)
                                        let qAnswer = Number(resultData[key][r.index])
                                        if (qPoint === 9999 || qPoint === -9999) qPoint = 0

                                        if (qAnswer !== 0) {

                                            totalPoint += qPoint //총 점수합
                                            sumPoint += qPoint  //문서별 점수합

                                            switch (k) {
                                                case 0:
                                                    totalTopPoint += qPoint
                                                    sumTopPoint += qPoint
                                                    break
                                                case 1:
                                                    totalMiddlePoint += qPoint
                                                    sumMiddlePoint += qPoint
                                                    break
                                                case 2:
                                                    totalMinusPoint += qPoint
                                                    sumMinusPoint += qPoint
                                                    break
                                            }
                                        }
                                    })
                                })

                                tables[(docPoint[2] - 1)].data.push([docName, sumTopPoint, sumMiddlePoint, sumMinusPoint, sumPoint])
                            } else {
                                totalPoint += docPoint[1]
                                totalMinusPoint += docPoint[1]
                                tables[(docPoint[2] - 1)].data.push([docName, 0, 0, docPoint[1], docPoint[1]])
                            }
                        }

                        return [key, resultData[key]]
                        //return key;
                    })

                    this.setState({
                        totalPoint: totalPoint,
                        totalTopPoint: totalTopPoint,
                        totalMiddlePoint: totalMiddlePoint,
                        totalMinusPoint: totalMinusPoint,
                        tables: tables,
                        resultData: resultData,
                        companyInfo: {
                            company_name: resultData.company_name,
                            company_owner: resultData.company_owner,
                            head_office_addr: resultData.head_office_addr,
                            main_business: resultData.main_business,
                            tel: resultData.tel,
                        }
                    })

                }
            }
        })

    }

    render () {

        const { classes } = this.props
        const subCategoryTitle = [
            '가. 법률 이슈 관리 역량 평가를 위한  기업 현황',
            '나. 법률 위험 관리를 위한 필수 작성 문서',
            '다. 각 필수 문서에 기초한 역량 평가 결과'
        ]
        const noDocument = '- 작성이 필요한 문서가 없음'
        const subCategoryText = [
            '귀사의 상황에 관해 필수적으로 갖추어야 할 문서가 없는 경우 또는 문서는 있으나 해당 질문에 대해 , \'아니오\' 를 선택한 경우에는 관련 법률 리스크에 대한 진단 의견이 도출됩니다.',
            '귀사의 상황에 관해 필수적으로 갖추어야 할 문서가 있으며 해당 질문에 대해  ‘예’ 를 선택한 경우에는 관련 점수가 부여됩니다.'
        ]
        const subCategoryTextList = <ul className='sub-category-text'>
            <li>{subCategoryText[0]}</li>
            <li>{subCategoryText[1]}</li>
        </ul>

        let part1 = [], part2 = []

        switch (true) {
            case (this.state.steps.step1 === 'Y') :
                part1.push('1');
                (this.state.steps.step2 === 'Y') && part1.push('3')
                break
            case (this.state.steps.step1 !== 'Y' && this.state.steps.step2 === 'Y') :
                part1.push('6')
                break
        }

        part1.push('7')

        if (this.state.steps.step3 === 'Y') {
            part2.push('5')
            part2.push('4')
        }

        if (this.state.steps.step5 === 'Y') {
            part2.push('2')
        }

        let exContContents = '- 외부계약 없음', exCont = []
        if (this.state.steps.step6 === 'Y' && this.state.steps.step7.length > 0) {
            if (this.state.steps.step7.indexOf(1) > -1) exCont.push('제휴관계')
            if (this.state.steps.step7.indexOf(2) > -1) exCont.push('공동사업관계')
            if (this.state.steps.step7.indexOf(3) > -1) exCont.push('용역관계')
            exContContents = (exCont.length > 0) && exCont.join(', ') + '의 외부계약이 있음'
        }

        return (
            <>
                <div className="result-content">
                    <h4>
                        {(!!this.state.steps.diagnosisStepFinal) &&
                        <>
                            <div className='result-title'>
                                <span>자가진단 결과 보고서</span>
                                <hr/>
                                <img src="/instructions/certifications/04/law-form.png" alt=''/>
                                <div className='addr'>
                                    <span>서울 영등포구 의사당대로 83 위워크 6층(서울시 핀테크랩)</span>
                                    <span>TEL : 02 - 6207 - 0264, https://lawform.io </span>
                                </div>
                            </div>
                            <div className='result-head'>
                                    <span>
                                         본 보고서는 귀사가 스타트업 실사 솔루션 프로그램 상의 자가진단을 수행한 결과 도출된 법률이슈 관리 현황의 분석 결과를 보고 드리고 있습니다.
                                        본 보고서를 참고하여 귀사의 법률이슈 상태를 확인하고, 다음 단계인 스타트업 실사 솔루션을 수행하는데 참고하시기 바랍니다.
                                        한편, 본 보고서는 귀사가 자가 진단한 자료에 근거하여 도출된 것으로 실제 기업이 투자를 받거나 법률 위험이 발생하게 된 구체적인
                                        상황에 따른 결과 등은 본 보고서상 보고된 실제 결과와 달리할 수도 있습니다. 본 보고서를 제공하는 목적과 다른 목적으로 사용 및 수신이
                                        이외의 제3자가 무단으로의 사용을 금함을 알려드립니다.
                                    </span>
                            </div>
                            <div className='result-list'>
                                <ul className='category'>

                                    <li>
                                        <span className='title'>기업 기본 정보</span>
                                        <hr className='left'/>
                                        <hr/>
                                        <ul className='company-info'>
                                            <li>기업명: {(!!this.state.companyInfo.company_name) ? this.state.companyInfo.company_name : '-'}</li>
                                            <li>대표자: {(!!this.state.companyInfo.company_owner) ? this.state.companyInfo.company_owner : '-'}</li>
                                            <li>본점 소재지: {(!!this.state.companyInfo.head_office_addr) ? this.state.companyInfo.head_office_addr : '-'}</li>
                                            <li>회사 전화번호: {(!!this.state.companyInfo.tel) ? this.state.companyInfo.tel : '-'}</li>
                                            <li>주생산품: {(!!this.state.companyInfo.main_business) ? this.state.companyInfo.main_business : '-'}</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <span className='title'>자가진단 결과보고</span>
                                        <hr className='left'/>
                                        <hr/>
                                        <ul className='category-level'>
                                            <li>
                                                <div>법률 이슈 관리 역량 평가를 위한 자가진단 영역</div>
                                                <div className='form-group'>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked color="primary" value="checkedA"/>} label="기업 조직의 안정성 및 투명성 관리"/>
                                                        <FormControlLabel control={<Checkbox checked color="primary" value="checkedA"/>} label="인사노무 관리"/>
                                                        <FormControlLabel control={<Checkbox checked color="primary" value="checkedA"/>} label="지식재산권 관리 "/>
                                                    </FormGroup>

                                                </div>
                                            </li>
                                            <li>
                                                <div>법률 이슈 관리 역량 평가를 위한 자가진단 점수</div>
                                                <div>

                                                    <span className='sub-title'>STEP1. 기본진단: 평가점수 <u>{this.state.partTotal}점</u>  / 총점 200점</span>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>기업 조직의 안정성 및 투명성 관리(총점 100점): <u>{this.state.part1Point}점</u></span>
                                                            <span>인사노무 관리(총점 60점): <u>{this.state.part2Point}점</u></span>
                                                            <span>지식재산권 관리(총점 40점): <u>{this.state.part3Point}점</u></span>
                                                        </li>
                                                    </ul>
                                                    <span className='sub-title'>STEP2. 심화진단 평가점수 <u>{this.state.totalPoint}점</u> / 총점 400점</span>
                                                    <span className='point-table'>
                                                            심화진단 전체평가

                                                                <Table className={classes.table} aria-label="심화진단 전체평가">
                                                                    <TableHead className={classes.pointThead}>
                                                                        <TableRow>
                                                                            <TableCell/>
                                                                            <TableCell style={{ fontSize: 13 }} align={'right'}>총점</TableCell>
                                                                            <TableCell style={{ fontSize: 13 }} align={'right'}>상위급항목</TableCell>
                                                                            <TableCell style={{ fontSize: 13 }} align={'right'}>중위급항목</TableCell>
                                                                            <TableCell style={{ fontSize: 13 }} align={'right'}>감점항목</TableCell>
                                                                            <TableCell style={{ fontSize: 13 }} align={'right'}>점수</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody className={classes.tbody}>
                                                                        <TableRow className={classes.tr}>
                                                                            <TableCell align='right' component="th" scope="row">전체 합계</TableCell>
                                                                            <TableCell align='right' component="th" scope="row">400</TableCell>
                                                                            <TableCell align='right' component="th" scope="row">{this.state.totalTopPoint}</TableCell>
                                                                            <TableCell align='right' component="th" scope="row">{this.state.totalMiddlePoint}</TableCell>
                                                                            <TableCell align='right' component="th" scope="row">{this.state.totalMinusPoint}</TableCell>
                                                                            <TableCell align='right' component="th" scope="row">{this.state.totalPoint}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>


                                                            <br/>
                                                            심화진단 세부내용

                                                                <Table className={classes.table} aria-label="심화진단 세부내용" size="small">
                                                                {
                                                                    this.state.tables.map((row, key) =>
                                                                        <>
                                                                            <TableHead className={classes.pointThead} key={key}>
                                                                                <TableRow>
                                                                                    <TableCell style={{ fontSize: 13 }} colSpan={5}>{row.title}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell style={{ fontSize: 13 }}>문서명</TableCell>
                                                                                    <TableCell style={{ fontSize: 13 }} align={'right'}>상위급항목</TableCell>
                                                                                    <TableCell style={{ fontSize: 13 }} align={'right'}>중위급항목</TableCell>
                                                                                    <TableCell style={{ fontSize: 13 }} align={'right'}>감점항목</TableCell>
                                                                                    <TableCell style={{ fontSize: 13 }} align={'right'}>점수</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody style={{ borderCollapse: 'separate' }} className={classes.tbody}>
                                                                                {
                                                                                    !!row.data.length && row.data.map((r, k) =>
                                                                                        <TableRow className={classes.tr} key={k}>
                                                                                            {r.map((rr, kk) => (
                                                                                                <TableCell align={(kk > 0) ? 'right' : 'left'} key={kk}>{rr}</TableCell>
                                                                                            ))}
                                                                                        </TableRow>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    !row.data.length &&
                                                                                    <TableRow className={classes.tr}>
                                                                                        <TableCell align={'center'} colSpan={5}>해당되는 항목이 없습니다.</TableCell>
                                                                                    </TableRow>
                                                                                }
                                                                            </TableBody>
                                                                        </>
                                                                    )
                                                                }
                                                                </Table>

                                                        </span>
                                                </div>

                                            </li>
                                            <li>
                                                <div>법률 이슈 관리 역량 평가를 위한 자가진단 상세내용</div>
                                                <div>
                                                    <span className='sub-title'>PART 1. 기업 조직의 안정성 및 투명성 관리</span>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[0]}</span>
                                                            <span className='check'>- 법인을 설립{(this.state.steps.step1 === 'Y') ? '함' : '하지 않음'}</span>
                                                            {(this.state.steps.step1 === 'Y' && this.state.steps.step2 === 'Y') && <span className='check'>- 주주가 2인이상임</span>}
                                                            {(this.state.steps.step1 === 'Y' && this.state.steps.step2 !== 'Y') && <span className='check'>- 주주가 2인미만임</span>}
                                                            {(this.state.steps.step1 !== 'Y' && this.state.steps.step2 === 'Y') && <span className='check'>- 출자자가 2인이상임</span>}
                                                            {(this.state.steps.step1 !== 'Y' && this.state.steps.step2 !== 'Y') && <span className='check'>- 출자자가 2인미만임</span>}
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[1]}</span>
                                                            {(this.state.steps.step1 === 'Y') && <span className='check'>- 정관</span>}
                                                            {(this.state.steps.step1 === 'Y' && this.state.steps.step2 === 'Y') && <span className='check'>- 주주간계약서</span>}
                                                            {(this.state.steps.step1 !== 'Y' && this.state.steps.step2 === 'Y') && <span className='check'>- 동업계약서</span>}
                                                            <span className='check'>- 임원계약서</span>
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[2]}</span>
                                                            {subCategoryTextList}
                                                            {
                                                                part1.length > 0 && part1.map((row, index) => (
                                                                    <Document key={index} docnum={row} docuseq={(index + 1)} editAble={false}/>
                                                                ))
                                                            }
                                                            {(!part1.length) && <span className='check'>{noDocument}</span>}
                                                        </li>
                                                    </ul>

                                                    <span className='sub-title'>PART 2. 인사노무 관리 평가</span>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[0]}</span>
                                                            <span className='check'>- 채용한 직원이{(this.state.steps.step3 === 'Y') ? '있음' : '없음'}</span>
                                                            <span className='check'>- 스톡옵션을{(this.state.steps.step5 === 'Y') ? '부여함' : '부여하지 않음'}</span>
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[1]}</span>
                                                            {(this.state.steps.step3 === 'Y') && <span className='check'>- 근로계약서</span>}
                                                            {(this.state.steps.step3 === 'Y') && <span className='check'>- 입사자서약서</span>}
                                                            {(this.state.steps.step5 === 'Y') && <span className='check'>- 스톡옵션계약서</span>}
                                                            {(this.state.steps.step3 === 'N') && <span className='check'>{noDocument}</span>}
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[2]}</span>
                                                            {subCategoryTextList}
                                                            {
                                                                part2.length > 0 && part2.map((row, index) => (
                                                                    <Document key={index} docnum={row} docuseq={(index + 1)} editAble={false}/>
                                                                ))
                                                            }
                                                            {(!part2.length) && <span className='check'>{noDocument}</span>}
                                                        </li>
                                                    </ul>

                                                    <span className='sub-title'>PART 3. 지식재산권관리</span>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[0]}</span>
                                                            <span className='check'>{exContContents}</span>
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[1]}</span>
                                                            {
                                                                this.state.steps.step6 === 'Y' && this.state.steps.step7.map((row, key) => (
                                                                    <>
                                                                        {(row === 1) && <span key={key} className='check'>- 업무협약서</span>} {/** 업무협약서 */}
                                                                        {(row === 2) && <span key={key} className='check'>- 공동사업약정서</span>} {/** 공동사업 */}
                                                                        {(row === 3) && <span key={key} className='check'>- 용역계약서</span>} {/** 용역 */}
                                                                        {(row === 'Y') && <span key={key} className='check'>- NDA</span>} {/** NDA */}
                                                                    </>
                                                                ))
                                                            }
                                                            {(this.state.steps.step6 !== 'Y') && <span className='check'>{noDocument}</span>}
                                                        </li>
                                                    </ul>
                                                    <ul className='sub-category'>
                                                        <li>
                                                            <span>{subCategoryTitle[2]}</span>
                                                            {subCategoryTextList}
                                                            {
                                                                this.state.steps.step6 === 'Y' && this.state.steps.step7.map((row, index) => (
                                                                    <>
                                                                        {(row === 1) && <Document key={index} docnum="8" docuseq={(index + 1)} editAble={false}/>} {/** 업무협약서 */}
                                                                        {(row === 2) && <Document key={index} docnum="9" docuseq={(index + 1)} editAble={false}/>} {/** 공동사업 */}
                                                                        {(row === 3) && <Document key={index} docnum="10" docuseq={(index + 1)} editAble={false}/>} {/** 용역 */}
                                                                        {(row === 'Y') && <Document key={index} docnum="11" docuseq={(index + 1)} editAble={false}/>} {/** NDA */}
                                                                    </>
                                                                ))
                                                            }
                                                            {(this.state.steps.step6 !== 'Y') && <span className='check'>{noDocument}</span>}
                                                        </li>
                                                    </ul>

                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            {(this.state.docsData.length === 0) &&
                            <div className='result-exe-button'>
                                <Button variant="contained" color='primary' onClick={() => this.addDocument()}>솔루션 수행하기</Button>
                            </div>
                            }

                        </>
                        }
                        {
                            (!this.state.steps.diagnosisStepFinal) &&
                            <span>심화진단 전체 결과는 모든 문서의 진단을 완료 후 확인하실 수 있습니다.</span>
                        }
                    </h4>
                </div>
            </>
        )
    }
}

ResultDocs.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ResultDocs)


