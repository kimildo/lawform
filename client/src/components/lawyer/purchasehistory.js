import React, { Component } from 'react'
// import '../../scss/mypage/userdocument.scss'
import API from '../../utils/apiutil'
import CommonUtil from '../../utils/commonutil'
import moment from 'moment'

class Purchasehistory extends Component {

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
        // API.sendGet('/payments/history').then((res) => {
        //     this.setState({ history: res.data.data });
        // });
        this.pageHandler({ page: 1 })

    }

    pageHandler (e) {
        var params = {
            page: e.page,
            per: 10,
            order: 'registerdate',
            sort: 'desc'
        }
        console.log(params)
        API.sendGet('/payments/history', params).then((res) => {
            var pages = Math.ceil(res.data.total / params.per)
            this.setState({ history: res.data.data, pages: pages, currentPage: e.page, total: res.data.total })
        })

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
        }
        return (
            <tr className="point_row" key={key}>
                <td className="writing_table_cell purchase_contents_1 middle">
                    {category_title}
                </td>
                <td className="writing_table_cell purchase_contents_2 middle">
                    {rowData.name}
                </td>
                <td className="writing_table_cell purchase_contents_3 middle">
                    {CommonUtil.pureNumberToCommaNumber(rowData.paid_amount)} 원

                </td>
                <td className="writing_table_cell purchase_contents_4 middle">
                    {moment(rowData.registerdate).format('YYYY년 MM월 DD일')}
                </td>
                {/* <td className="writing_table_cell purchase_contents_5 middle">
                    <img src="mypage_img/delete_btn.png" className="delete_btn" alt="delete_btn" />
                </td> */}
            </tr>
        )
    }

    render () {
        const paging_wrap = {
            margin: '40px',
            textAlign: 'center',

        }
        let paging = []
        let pages = this.state.pages
        for (var i = 1; i < pages + 1; i++) {
            const page = i
            if (this.state.currentPage === i) paging.push(<span className="paging_num" key={i}><strong>{i}</strong></span>)
            else paging.push(<span className="paging_num" style={{ cursor: 'pointer' }} ref={i} key={i} onClick={(e) => { this.pageHandler({ page }) }}>{i}</span>)
        }
        console.log(this.state.history)
        if (!!this.state.history) {
            return (
                <div className="wrap_writing_detail">
                    <div className="total">
                        전체 {(!!this.state.total) ? this.state.total : 0} 건
                    </div>
                    <table>
                        <thead>
                        <tr className="point_row point_header">
                            <th className="writing_table_cell purchase_header_1 middle">
                                <span>문서명</span>
                            </th>
                            <th className="writing_table_cell purchase_header_2 middle">
                                <span>제목</span>
                            </th>
                            <th className="writing_table_cell purchase_header_3 middle">
                                <span>가격</span>
                            </th>
                            <th className="writing_table_cell purchase_header_4 middle">
                                <span>구매일</span>
                            </th>
                            {/* <th className="writing_table_cell purchase_header_5 middle">
                                    <span>삭제</span>
                                </th> */}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.history.map((rowData, key) => this.renderRow(rowData, key))
                        }
                        </tbody>
                    </table>
                    <div style={paging_wrap}>
                        {paging}
                    </div>
                </div>
            )
        } else {
            return (<div className="wrap_writing_detail no_content">구매 내역이 없습니다.</div>)
        }

    }
}

export default Purchasehistory