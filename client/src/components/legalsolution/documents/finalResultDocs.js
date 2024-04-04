import React, { Component } from 'react'
import User from '../../../utils/user'
import { styles } from './docStyle'
import { getQuestions, getDocumentName, getDocumentPoint, getDocumentWithDocumentId, getKeyName } from './questions'
import { PDFViewer , Link, Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer'
import { ScaleLoader } from 'react-spinners'

const pdfStyle = StyleSheet.create({
    page: {
        fontFamily: 'Dotum',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFF',
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    section: {
        fontFamily: 'Dotum',
        fontSize: 12,
        color: '#3e3e3e',
        padding: 10,
    },
    tableHead: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 10,
        padding: 10,
        backgroundColor: '#eeeff1',
        borderTop: 1, borderTopColor: '#e0e0e0', borderTopStyle: 'solid',
        borderBottom: 1, borderBottomColor: '#e0e0e0', borderBottomStyle: 'solid'
    },
    tableBody: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 10,
        padding: 10,
        backgroundColor: '#FFF',
        borderBottom: 1, borderBottomColor: '#e0e0e0', borderBottomStyle: 'solid'
    },
    resultDescBox: {
        fontSize: 10,
        border: 1,
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        backgroundColor: '#eeeff1',
        padding: '15px 15px 6px',
        margin: '10px 0'
    },
    hrLeft: {
        position: 'absolute',
        top: 20,
        width: 231,
        borderBottom: 3,
        borderBottomStyle: 'solid',
        borderBottomColor: '#15376c'
    },
    hrRight: {
        position:'absolute',
        top:20,
        left:231,
        width:313,
        borderBottom: 3,
        borderBottomStyle: 'solid',
        borderBottomColor: '#c8c8c8'
    },
    logo: {
        width: 80,
        marginLeft: 235
    },
})

class FinalResultDocs extends Component {

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
            },
            pdfLoading: true
        }
    }

    componentDidMount () {

        const state = this.state
        const answerData = this.props.getAnswers()

        state.companyInfo = {
            company_name: answerData.company_name,
            company_owner: answerData.company_owner,
            head_office_addr: answerData.head_office_addr,
            main_business: answerData.main_business,
            tel: answerData.tel,
        }

        this.setState(state)

    }

    /** 자가진단 점수계산 */
    setDocumentPoint = (docnum = 0, binddata = null) => {

        let diagnosisPoint = 0, totalPoint = 0, sectionDesc = []
        binddata = (!!binddata) ? JSON.parse(binddata) : null

        if (!!docnum) {
            const answers = this.props.getAnswers()
            const docPoint = getDocumentPoint(docnum)
            const keyName = getKeyName(docnum)

            diagnosisPoint = docPoint[1]

            if (!!answers[keyName] && answers[keyName].length > 0) {
                diagnosisPoint = 0
            }

            getQuestions(docnum).map((row, k) => {
                row.questions.map((r) => {

                    let qPoint = Number(r.value)
                    if (qPoint === 9999 || qPoint === -9999) qPoint = 0

                    if (!!answers[keyName] && answers[keyName].length > 0) {
                        let qAnswer = Number(answers[keyName][r.index])
                        if (qAnswer !== 0) {
                            diagnosisPoint += qPoint
                        }
                    }

                    if (!!binddata) {
                        if (!r.section && r.section_desc !== null) {
                            totalPoint += (qPoint > 0) ? qPoint : 0
                            //sectionDesc.push(r.section_desc)
                        }

                        if (!!r.section) {
                            let existSection = Object.keys(binddata).find(key => key === r.section)
                            if (!!existSection) {
                                totalPoint += (qPoint > 0) ? qPoint : 0
                                sectionDesc.push(r.section_desc)
                            }
                        }
                    }

                })
            })

            sectionDesc = Array.from(new Set(sectionDesc));

        }

        return [diagnosisPoint, totalPoint, sectionDesc]
    }

    pdfRenderCallback = () => {
        this.setState({
            pdfLoading: false
        })
    }

    render () {

        const docsData = this.props.getDocs()
        const answerData = this.props.getAnswers()
        const { steps, companyInfo } = this.state
        const { classes } = this.props

        let finalResult = [
            { reuiredDoc: [], gapDoc: [], title: 'PART 1.  기업조직의 안정성 및 투명성 관리 영역' },
            { reuiredDoc: [], gapDoc: [], title: 'PART 2.  인사노무 관리 영역' },
            { reuiredDoc: [], gapDoc: [], title: 'PART 3.  지식재산권 관리' },
        ]

        if (docsData.length > 0) {
            docsData.map((row) => {

                let docnum = getDocumentWithDocumentId(row.iddocuments)
                if (!!docnum) {
                    let partNum = getDocumentPoint(docnum)
                    let totalPointArr = this.setDocumentPoint(docnum, row.binddata)

                    row.doc_name = getDocumentName(docnum)
                    row.doc_point = getDocumentPoint(docnum)
                    row.diagnosis_sum_point = totalPointArr[0]
                    row.total_point = totalPointArr[1]
                    row.section_desc = totalPointArr[2]

                    partNum = partNum[2] - 1

                    switch (true) {
                        case row.iddocuments === 20 && steps.step1 === 'Y' && (!answerData.articles_incorporation || !answerData.articles_incorporation.length) :
                        //case row.iddocuments === 26 && steps.step1 === 'Y' && (!answerData.articles_incorporation || !answerData.articles_incorporation.length) :
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
                            finalResult[partNum].reuiredDoc.push(row)
                            break
                        case row.iddocuments === 26 :
                            break
                        default :
                            finalResult[partNum].gapDoc.push(row)
                    }
                }
            })
        }

        const tdWidth = [255, 80, 80, 80]

        return (
            <div id={'pdf-result'}>
                <PDFViewer style={{width:896,height:768}}>
                    <Document title={'스타트업 실사 솔루션 수행 결과 보고서 - ' + this.state.userInfo.username} author="아미쿠스렉스" onRender={this.pdfRenderCallback}>

                        <Page size="A4" style={pdfStyle.page}>

                            <View style={pdfStyle.section}>
                                <Text style={{fontSize: 16, fontFamily: 'DotumBold'}}>스타트업 실사 솔루션 수행 결과 보고서</Text>
                            </View>

                            <View style={{paddingLeft: 10, marginBottom:5}}>
                                <Text style={{ borderBottom: 2, borderBottomStyle: 'dashed', borderBottomColor: '#c8c8c8'}}/>
                            </View>

                            <View style={pdfStyle.section}>
                                <Image style={pdfStyle.logo} src="/instructions/certifications/04/law-form.png"/>
                            </View>

                            <View style={{fontFamily:'DotumBold', fontSize: 11, textAlign:'center'}}>
                                <Text>서울 영등포구 의사당대로 83 위워크 6층(서울시 핀테크랩)</Text>
                                <Text>TEL : 02-6925-0227, <Link src="https://lawform.io">https://lawform.io</Link></Text>
                            </View>

                            <View style={pdfStyle.section}>
                                <View style={{marginTop:20, fontSize: 11}}>
                                    <Text style={{paddingBottom: 2}}>ㅇ 수신 : {(!!companyInfo.company_owner) ? companyInfo.company_owner : '-'} 대표님</Text>
                                    <Text style={{paddingBottom: 2}}>ㅇ 발신 : 아미쿠스렉스(주)</Text>
                                    <Text style={{paddingBottom: 2}}>ㅇ 제목 : 스타트업 실사 솔루션을 수행 결과 보고서</Text>
                                </View>
                            </View>

                            <View style={pdfStyle.section}>
                                <View style={{border:1, borderColor:'#C8C8C8', borderStyle:'dashed', backgroundColor:'#E9E9E9', padding:10}}>
                                    <Text style={{fontSize:8, color:'#989898', fontFamily:'NanumMyeongjo'}}>
                                        &nbsp;&nbsp;본 보고서는 귀사가 스타트업 실사 솔루션 프로그램 상의 자가진단 결과 보고에 따라 귀사의 법률 위험을 개선하기 위한 권고 사항을 수행한 결과를 담고 있습니다. 본 보고서를 참고하여 귀사의 법률 위험의 감소 및 법률이슈 관리 역량을 확인할 수 있습니다. 한편, 본 보고서는 귀사가 본사의 스타트업 실사 솔루션의 시스템을 활용하여 도출된 결과를 나타내고 있으므로 실제 귀사가 투자를 받거나 법률 위험이 발생하게 된 구체적인 상황에 따른 결과 등 본 보고서에 보고된 실제 결과와 달리할 수도 있습니다. 본 보고서를 제공하는 목적과 다른 목적으로 사용 및 수신인 이외의 제3자의 무단 사용을 금함을 알려드립니다.
                                    </Text>
                                </View>
                            </View>

                            <View style={pdfStyle.section}>
                                <View style={{position:'relative'}}>
                                    <Text style={{fontSize:14, color:'#15376c', fontFamily: 'DotumBold'}}>Ⅰ. 기업 기본 정보</Text>
                                    <Text style={pdfStyle.hrLeft}/>
                                    <Text style={pdfStyle.hrRight}/>
                                </View>
                                <View style={{marginTop:15, fontSize: 11, color:'#7a7d8c'}}>
                                    <Text style={{padding:'3px 10px'}}>ㅇ 기업명: {(!!companyInfo.company_name) ? companyInfo.company_name : '-'}</Text>
                                    <Text style={{padding:'3px 10px'}}>ㅇ 대표자: {(!!companyInfo.company_owner) ? companyInfo.company_owner : '-'}</Text>
                                    <Text style={{padding:'3px 10px'}}>ㅇ 본점 소재지: {(!!companyInfo.head_office_addr) ? companyInfo.head_office_addr : '-'}</Text>
                                    <Text style={{padding:'3px 10px'}}>ㅇ 회사 전화번호: {(!!companyInfo.tel) ? companyInfo.tel : '-'}</Text>
                                    <Text style={{padding:'3px 10px'}}>ㅇ 주업종: {(!!companyInfo.main_business) ? companyInfo.main_business : '-'}</Text>
                                </View>
                            </View>

                            <View style={pdfStyle.section}>

                                <View style={{position:'relative'}}>
                                    <Text style={{fontSize:14, color:'#15376c', fontFamily: 'DotumBold'}}>Ⅱ. 스타트업 실사 수행 결과 보고</Text>
                                    <Text style={pdfStyle.hrLeft}/>
                                    <Text style={pdfStyle.hrRight}/>
                                </View>

                                <View style={{marginTop:20, paddingLeft:10, color:'#15376c'}}>
                                    <View style={{marginBottom:10}}>
                                        <Text style={{fontSize:14, fontFamily: 'DotumBold'}}>1. 스타트업 실사 솔루션 수행 영역</Text>
                                    </View>
                                    <View style={{fontSize: 11, color:'#7a7d8c'}}>
                                        {
                                            finalResult.map((row, key)  =>
                                                <Text style={{padding:'3px 10px'}}><Image style={{width:15}} src="/images/solution/web-20180101142045553930-1560x1397.png"/> {row.title}</Text>
                                            )
                                        }
                                    </View>
                                </View>

                                {/* 나중에 추가할지 몰라 나둠 by kimildo
                                <li>
                                    <div>수행 결과 개요</div>
                                    <div style={{marginTop: 10}}>
                                        <span style={{color: '#7a7d8c', fontWeight:'normal', textIndent: '0.5em'}}>
                                        귀사는 스타트업 실사 프로그램을 통해 자가 진단을 하였고, 이를 통해  귀사의 기업조직의 안정성 및 투명성, 인사노무 관리, 지식재산권 관리 등에 관한 귀사이 노출된 법적 위험의 구체적 내용을 파악한바, 그 내용은 이미 보고드린 자가진단결과 보고서 내용과 같습니다.
                                        스타트업 실사 프로그램은  자기진단결과 보고서에서 확인된 귀사의 법적 위험을 해소 또는 감소시키기 위해 필요한 솔루션을 귀사에게  제안하였고, 이에 귀사은 제안된 솔루션의 수용 여부를 판단한 후 실제로 아래와 같은 내용으로 솔루션을 구체적으로 수행하였습니다.
                                        이에 귀사이 솔루션을 수행하면서 작성된 구체적 법률문서나 게약서 내역을 아래와 같이 보고 드립니다. 귀사이 솔루션 수행 과정에서 작성하거나 보완된 법률문서나 계약서를 통해 실제로 감소된 귀사의 구체적인 법적 위험에 대해서는 이미 보고드린 자가진단 결과 보고서와 아래의 솔루션 수행 내역 중 해당 비고 부분을 참조하여 주시기 바랍니다.
                                        </span>
                                    </div>
                                </li>*/}

                                <View style={{marginTop:20, paddingLeft:10}} >
                                    <View style={{marginBottom:15, color:'#15376c'}}>
                                        <Text style={{fontSize:14, fontFamily: 'DotumBold'}}>2. 영역별 구체적인 솔루션 수행 내역</Text>
                                    </View>
                                    {
                                        finalResult.map((row, key)  => {

                                            let topTotal = 0, botTotal = 0, topDiagTotal = 0, botDiagTotal = 0
                                            let unwritten = 0, unwrittenBottom = 0
                                            let gapDocSec = []

                                            return (
                                                <View style={{color:'#7a7d8c', paddingLeft:10, marginBottom: 15 }}>

                                                    {(!!row.reuiredDoc.length) && <>
                                                        <View style={{fontFamily: 'DotumBold'}}>
                                                            <Text style={{padding:'3px 0', color:'#15376c', fontSize:14}}>{row.title}</Text>
                                                            <Text style={{padding:'10px 0', fontSize:11}}>(1) 반드시 작성해야 하는 문서 작성 솔루션 수행 결과</Text>
                                                        </View>

                                                        <View style={pdfStyle.tableHead}>
                                                            <Text style={{width:tdWidth[0]}}>문서명</Text>
                                                            <Text style={{width:tdWidth[1], textAlign:'center'}}>작성여부</Text>
                                                            <Text style={{width:tdWidth[2], textAlign:'right'}}>자가진단 점수</Text>
                                                            <Text style={{width:tdWidth[3], textAlign:'right'}}>점수 향상치</Text>
                                                        </View>
                                                        {
                                                            row.reuiredDoc.map((r, k) => {

                                                                topDiagTotal += r.diagnosis_sum_point
                                                                topTotal += r.total_point
                                                                unwritten += (!!r.binddata) ? 0 : 1

                                                                return (
                                                                    <View key={k} style={pdfStyle.tableBody}>
                                                                        <Text style={{width:tdWidth[0]}}>{(r.iddocuments === 35) ? r.doc_name : r.title}</Text>
                                                                        <Text style={{width:tdWidth[1], textAlign:'center'}}>{(!!r.binddata) ? '작성' : '미작성'}</Text>
                                                                        <Text style={{width:tdWidth[2], textAlign:'right'}}>{r.diagnosis_sum_point}</Text>
                                                                        <Text style={{width:tdWidth[3], textAlign:'right'}}>{r.total_point}</Text>
                                                                    </View>
                                                                )
                                                            })
                                                        }

                                                        <View style={pdfStyle.resultDescBox}>
                                                            {
                                                                (row.reuiredDoc.length === unwritten)
                                                                    ? <Text style={{marginBottom: 12}}>1. 귀사는 솔루션 수행을 진행하지 않아 자가진단 점수 {topDiagTotal} 점에서 향상된 점수가 없습니다.</Text>
                                                                    : <Text style={{marginBottom: (unwritten === 0) ? 7 : 12}}>{(row.reuiredDoc.length > unwritten && unwritten > 0) && '1.'} 귀사는 스타트업 실사 솔루션을 수행한 결과 자가진단 점수 {topDiagTotal} 에서 {topTotal} 점으로 향상되었습니다.</Text>
                                                            }

                                                            {/** 일부 작성 */}
                                                            {(row.reuiredDoc.length > unwritten && unwritten > 0) &&
                                                            <Text style={{marginBottom: 12, lineHeight: 1.5}}>
                                                                2. 다만, 위 표와 같이 미작성된 문서 &nbsp;
                                                                <Text style={{borderBottom:1, borderBottomStyle:'solid', borderBottomColor: '#000'}} debug={true}>{unwritten}</Text>
                                                                건 있으니 자가 진단 보고서를 참고하여 법률상 위험을 다시 한번 체크하시고, 솔루션 수행을 완료할 것을 권고 드립니다.
                                                            </Text>
                                                            }

                                                            {/** 모두 미작성 */}
                                                            {(row.reuiredDoc.length === unwritten && unwritten > 0) &&
                                                            <Text style={{marginBottom: 12, lineHeight: 1.5}}>2. 위 표와 같이 미작성된 문서에 대한 자가 진단 보고서를 참고하여 법률상 위험을 다시 한 번 체크하시고, 솔루션 수행을 완료할 것을 권고 드립니다.</Text>
                                                            }
                                                        </View>
                                                    </>}


                                                    {(!!row.gapDoc.length) && <>

                                                        <View style={{fontFamily: 'DotumBold'}}>
                                                            {(!row.reuiredDoc.length) && <Text style={{padding:'3px 0', color:'#15376c', fontSize:14}}>{row.title}</Text>}
                                                            <Text style={{padding:'10px 0', fontSize:11}}>({(!!row.reuiredDoc.length) ? 2 : 1}) 보완이 필요한 문서 작성 솔루션 수행 결과</Text>
                                                        </View>

                                                        <View style={pdfStyle.tableHead}>
                                                            <Text style={{width:tdWidth[0]}}>문서명</Text>
                                                            <Text style={{width:tdWidth[1], textAlign:'center'}}>작성여부</Text>
                                                            <Text style={{width:tdWidth[2], textAlign:'right'}}>자가진단 점수</Text>
                                                            <Text style={{width:tdWidth[3], textAlign:'right'}}>점수 향상치</Text>
                                                        </View>
                                                        {
                                                            row.gapDoc.map((r, k) => {

                                                                botDiagTotal += r.diagnosis_sum_point
                                                                botTotal += r.total_point
                                                                unwrittenBottom += (!!r.binddata) ? 0 : 1

                                                                return (
                                                                    <View key={k} style={pdfStyle.tableBody}>
                                                                        <Text style={{width:tdWidth[0]}}>{(r.iddocuments === 35) ? r.doc_name : r.title}</Text>
                                                                        <Text style={{width:tdWidth[1], textAlign:'center'}}>{(!!r.binddata) ? '보완' : '미보완'}</Text>
                                                                        <Text style={{width:tdWidth[2], textAlign:'right'}}>{r.diagnosis_sum_point}</Text>
                                                                        <Text style={{width:tdWidth[3], textAlign:'right'}}>{r.total_point}</Text>
                                                                    </View>
                                                                )
                                                            })
                                                        }

                                                        <View style={pdfStyle.resultDescBox}>
                                                            {(row.gapDoc.length === unwrittenBottom)
                                                                ? <Text style={{marginBottom: 12}}>1. 귀사는 솔루션 수행을 진행하지 않아 자가진단 점수 {botDiagTotal}점에서 향상된 점수가 없습니다.</Text>
                                                                : <Text style={{marginBottom: 12}}>1. 귀사는 스타트업 실사 솔루션을 수행한 결과 자가진단 점수 {botDiagTotal}에서 {botTotal}점으로
                                                                    {(botDiagTotal < botTotal && botTotal > 0) ? ' 향상 되었습니다.' : (botDiagTotal === botTotal) ? ' 변동이 없습니다.' : ' 감소 되었습니다.'}
                                                                </Text>
                                                            }

                                                            {(row.gapDoc.length > unwrittenBottom) &&
                                                            <View style={{marginTop:5, marginBottom: 12}}>
                                                                <Text>2. 귀사가 검토 또는 보완한 항목은 아래와 같습니다.</Text>
                                                                {
                                                                    row.gapDoc.map((r, k) => {
                                                                        return (
                                                                            (!!r.binddata) &&
                                                                            <Text style={{marginLeft:10, marginTop:8, lineHeight: 1.5}} key={k}>
                                                                                {(r.iddocuments === 35) ? r.doc_name : r.title} : 문서작성 {(!!r.section_desc.length) && ', ' + r.section_desc.join(', ')}
                                                                            </Text>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                            }


                                                            {(row.gapDoc.length > unwrittenBottom && unwrittenBottom > 0) &&
                                                            <Text style={{lineHeight: 1.5}}>다만, 위 표와 같이 미보완된 문서 <Text style={{borderBottom:1, borderBottomStyle:'solid'}}>{unwrittenBottom}</Text>건이 있으니 자가 진단 보고서를 참고하여 법률상 위험을 다시 한번 체크하시고, 솔루션 수행을 완료할 것을 권고 드립니다.</Text>
                                                            }

                                                            {(row.gapDoc.length === unwrittenBottom) &&
                                                            <Text style={{lineHeight: 1.5}}>2. 위 표와 같이 미보완된 문서에 대한 자가 진단 보고서를 참고하여 법률상 위험을 다시 한 번 체크하시고, 솔루션 수행을 완료할 것을 권고 드립니다.</Text>
                                                            }

                                                        </View>
                                                    </>}
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                            </View>

                        </Page>
                    </Document>
                </PDFViewer>

                <div className='result-exe-button'>
                    <div aria-label={'로딩이미지'} style={{width:'100%'}} className='sweet-loading'>
                        <div style={{width:30, margin:'30px auto'}}>
                            <ScaleLoader
                                css={pdfStyle.spiner}
                                sizeUnit={"px"}
                                height={35}
                                width={2}
                                radius={2}
                                margin='2px'
                                color={'#123abc'}
                                loading={this.state.pdfLoading}
                                //loading={true}
                            />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default FinalResultDocs


