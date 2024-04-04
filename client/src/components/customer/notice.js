import React, { Component, Fragment } from 'react'
import Api from '../../utils/apiutil'
import Link from 'next/link'
import moment from 'moment'
import Paging from '../common/paging'

class Notice extends Component {

    constructor (props) {
        super(props)
        this.state = {
            noticeArray: [],
            // noticeIdx:this.props.idx
            noticeArticle: {},
            selectedIdx: null,
            per: 5,
            page: 1
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount () {

    }

    componentWillMount () {
        if (this.props.idx) this.showArticle(this.props.idx)
        // let url  = '/customer/notice/';
        // API.sendGet( url ).then((result) => {
        //     this.setState({
        //         noticeArray:result.data.data
        //     })
        // });
        this.getBoardList(1)
    }

    getBoardList = async (page = 1) => {
        var params = {
            per: 12,
            page: page,
            board: 10
        }
        Api.sendPost('/board/list', params).then(res => {
            if (res.data.result !== null) {
                if (res.data.status === 'ok' & res.data.result.total > 0) {
                    this.setState({ noticeArray: res.data.result.rows })
                }
            }
        })
    }

    handleClick (e) {}

    setPage = (page) => {
        let per = this.state.per
        let start = (per * (page - 1))
        let data = this.state.noticeArray.slice(start, start + per)
        this.setState({
            noticeArray: data,
            page: page
        })
    }

    showArticle (idx) {
        if (this.state.noticeArticle.idx === idx) {
            this.setState({
                noticeArticle: {}
            })
        } else {
            Api.sendGet('/customer/notice/' + idx).then((result) => {
                if (result.data.status === 'ok') {
                    this.setState({
                        noticeArticle: result.data.data
                    }, () => {
                        console.log('noticeArticle', this.state.noticeArticle)
                    })
                }
            }).then(() => {
                // location.href = "/customer/notice/"+String(idx)
            })
        }
    }

    render () {
        return (
            <div className="cs-notice">
                {
                    this.props.header !== false ?
                        <div className="cs-title">
                            <h2>공지사항</h2>
                            <h3>로폼의 소식을 전해드립니다.</h3>
                        </div>
                        : null
                }
                <div className="cs-article">
                    <ul className="cs-lists">
                        {/* {
                        this.state.noticeArticle.idx && 
                        <Fragment>
                           {
                               this.state.noticeArticle.idx  &&
                               <Fragment>
                               <div className="header">
                                    <div  dangerouslySetInnerHTML={{__html:this.state.noticeArticle.title}} />
                                    <div>{ moment( this.state.noticeArticle.registerdate ).format('Y.MM.DD')}</div>
                                </div>
                                <div className="contents">
                                    {
                                        <div  dangerouslySetInnerHTML={{__html:this.state.noticeArticle.contents}} />
                                    }
                                    {
                                        this.state.noticeArticle.image&&
                                        <div className="image"><img src={"/uploads/notice/"+this.state.noticeArticle.image} alt={"upload"} /></div>
                                    }
                                </div>
                                <a className="btn-list" onClick={e=>this.setState({noticeArticle:{idx:null}})} >목록</a>
                                </Fragment>
                           }
                        </Fragment>
                    } */}
                        {
                            this.state.noticeArray.length > 0 && this.state.noticeArray.map((item, key) =>
                                <li key={key} onClick={(e) => this.setState({ selectedIdx: this.state.selectedIdx === item.idx ? null : item.idx })}
                                    className={this.state.selectedIdx === item.idx ? 'active' : ''}>
                                    <div className="title">{item.subject ? <span style={{ color: '#000' }}>[{item.subject}]</span> : null} {item.title}</div>
                                    <div>{moment(item.regdatetime).format('Y.MM.DD')}</div>
                                    {
                                        this.state.selectedIdx === item.idx ?
                                            <div className="contents">
                                                {
                                                    <div dangerouslySetInnerHTML={{ __html: item.content }}/>
                                                }
                                            </div> : null
                                    }
                                </li>
                            )
                        }
                    </ul>
                    {
                        (this.state.noticeArticle.length > 0) &&
                        <Paging total={this.state.noticeArray.length} page={this.state.page} per={10} setPage={this.setPage}/>
                    }
                </div>
            </div>
        )
    }
}

export default Notice