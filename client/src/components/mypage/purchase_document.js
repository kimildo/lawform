import React, { Component } from 'react'
// import 'scss/mypage/userdocument.scss';
import API from 'utils/apiutil'
import CommonUtil from 'utils/commonutil'
import moment from 'moment'
import Paging from 'components/common/paging'

class Purchase_document extends Component {

    constructor (props) {
        super(props)

        this.state = {
            history: null,
            currentPage: 1,
            pages: 1,
            total: 0
        }
    }

    componentDidMount () {
        this.pageHandler({ page: 1 })
    }

    setPage = (page) => {
        this.setState({ page: page }, () => {
            this.pageHandler({ page })
        })
    }

    pageHandler (e) {
        let params = {
            page: e.page,
            per: 10,
            order: 'registerdate',
            sort: 'desc'
        }

        //console.log('e.page', e.page)
        API.sendGet('/payments/history', params).then((res) => {
            let pages = Math.ceil(res.data.total / params.per)
            this.setState({ history: res.data.data, pages: pages, currentPage: e.page, total: res.data.total })
        })
    }

    showReceipt (url) {
        if (!!url) {
            let windowOpen = window.open(url, '', 'height=680,width=800')
            windowOpen.focus()
        }
    }

    renderRow (rowData, key) {

        let category_title = ''
        switch (rowData.category) {
            case 1:
                category_title = '내용증명'
                break
            case 2:
                category_title = '위임장'
                break
            case 3:
                category_title = '지급명령'
                break
            case 4:
                category_title = '합의서'
                break
            case 99:
                category_title = '기업필수문서'
                break
            default:
                category_title = '변호사 서비스'
        }

        const date_format = 'YYYY-MM-DD HH:mm'
        // 'YYYY년 MM월 DD일'
        let payment_date = moment(rowData.registerdate).format(date_format)
        let payment_status = (!!rowData.refund_date) ? '환불' : '결제'
        let refund_date = (!!rowData.refund_date) ? moment(rowData.refund_date).format(date_format) : null
        let refund_class = (!!rowData.refund_date) ? 'purchase_refund' : ''

        return (
            <tr className={`point_row`} key={key}>
                <td className={`writing_table_cell purchase_contents_1 middle`}>
                    {category_title}
                </td>
                <td className={`writing_table_cell purchase_contents_2 middle`}>
                    {rowData.name}
                </td>
                <td className={`writing_table_cell purchase_contents_3 middle ${refund_class}`}>
                    {CommonUtil.pureNumberToCommaNumber(rowData.paid_amount)} 원
                </td>
                <td className={`writing_table_cell purchase_contents_4 middle`}>
                    <span>{payment_date}</span>
                    <span>{refund_date}</span>
                </td>
                <td className={`writing_table_cell purchase_contents_5 middle ${refund_class}`}>
                    <div onClick={() => this.showReceipt(rowData.receipt_url)}>{payment_status}</div>
                    {/*<img src="mypage_img/delete_btn.png" className="delete_btn" alt="delete_btn" />*/}
                </td>
            </tr>
        )
    }

    render () {
        const paging_wrap = {
            margin: '40px',
            textAlign: 'center',
        }

        const { pages, total, currentPage, history } = this.state

        let paging = []
        for (let i = 1; i < pages + 1; i++) {
            let page = i
            if (currentPage === i) paging.push(<span className="paging_num" key={i}><strong>{i}</strong></span>)
            else paging.push(<span className="paging_num" style={{ cursor: 'pointer' }} ref={i} key={i} onClick={(e) => { this.pageHandler({ page }) }}>{i}</span>)
        }

        if (!!this.state.history) {
            return (
                <div className="wrap_writing_detail">
                    <div className="total">
                        전체 {(!!total) ? total : 0} 건
                    </div>
                    <table>
                        <thead>
                        <tr className="point_row point_header">
                            <th className="writing_table_cell purchase_header_1 middle">
                                <span>문서/서비스명</span>
                            </th>
                            <th className="writing_table_cell purchase_header_2 middle">
                                <span>제목</span>
                            </th>
                            <th className="writing_table_cell purchase_header_3 middle">
                                <span>가격</span>
                            </th>
                            <th className="writing_table_cell purchase_header_4 middle">
                                <span>구매일</span>
                                <span>(환불일)</span>
                            </th>
                            <th className="writing_table_cell purchase_header_5 middle">
                                <span>상태</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((rowData, key) => this.renderRow(rowData, key))}
                        </tbody>
                    </table>
                    <div style={paging_wrap}>
                        <Paging total={total} page={this.state.page} per={10} setPage={this.setPage}/>
                    </div>
                </div>
            )
        } else {
            return (<div className="wrap_writing_detail no_content">구매 내역이 없습니다.</div>)
        }

    }
}

export default Purchase_document
