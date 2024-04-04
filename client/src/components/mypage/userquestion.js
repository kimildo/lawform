import React, { Component, Fragment } from 'react';
// import '../../scss/mypage/userquestion.scss';
// import '../../scss/mypage/questionmodal.scss';
// import '../../scss/common/paging.scss';
import Link from 'next/link';
import User from '../../utils/user';
import Api from '../../utils/apiutil';
import moment from 'moment';
import Cookies from 'js-cookie';

class Userquestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addBtn: false,
            userData: {},
            questionData: [],
            modalIdx: null,
            openIdx: null,
            modalQuestion: null,
            modalKeyIdx: null,
            currentPage: 1,
            pages: 1,
            total: 0,
            isMobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        }
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
    }

    btn1() {
        this.setState({ addBtn: true });
    }
    btn2() {
        this.setState({ addBtn: false });
    }

    componentDidMount() {
        let userInfo = User.getInfo();
        if( !!userInfo ) { // Logged In
            this.pageHandler({page:1});
            this.setState ({
                userStatus : "Y"
            })
        } else {
            alert("로그인 후 이용하세요.");
            window.location = "/";
        }
    }

    modifyQuestion(idx,question,index) {
        this.setState({
            modalIdx : idx,
            modalQuestion : question,
            modalKey : index
        },()=>{
            window.location = "#questionmodal"
        })
    }


    onHandleChange(e) {
        this.setState({
            modalQuestion: e.target.value
        });
    //    this.props.modalQuestion( e.target.value )
        }

    onHandleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        var params = {
            idx : this.state.modalIdx,
            question : data.get('question')
        }
        if( !params.idx ) alert("등록오류입니다. 관리자에게 문의해주십시오.");
        Api.sendPost('/user/updateqna', params).then((result) => {
            if( result.status === 'ok' ) {
                // console.log( this.state.modalKey )
                // console.log( " data :",this.state.questionData[0][this.state.modalKey].question )
                var newQuestionData = this.state.questionData;
                newQuestionData[0][this.state.modalKey].question = data.get('question');
                this.setState({
                    modalIdx: null,
                    questionData: newQuestionData
                }, () => {
                    alert('수정되었습니다.');
                    window.location.href = "javascript:history.go(-1);";  
                });
            }
        });
    }
    

    deleteQuestion(idx) {
        var params = {
            idx : idx,
        }
        if( !params.idx ) alert("접근오류입니다. 잠시 후 다시 시도해 주십시오.");
        Api.sendDelete('/user/deleteqna', params).then((result) => {
            if( result.status === 'ok' ) {
                this.pageHandler({page:this.state.currentPage}) 
                alert("삭제되었습니다.")
            } else {
                alert("권한이 없습니다.")

            }
        });
    }

    openAnswer(e,idx,index,status) {
        this.setState({
            openIdx : idx
        })
    }

    closeAnswer() {
        this.setState({
            openIdx : null
        })
    }

    pageHandler(e) {
        var params = {
            page:e.page,
            per:10,
            order:'registerdate',
            sort:'desc'
        }
        Api.sendPost('/user/listqna', params ).then(res => {
            var pages =  Math.ceil(res.data.total/params.per)
            if( res.data.data ) {
            this.setState({ questionData: [res.data.data], pages:pages , currentPage:e.page, total : res.data.total })
            } else {
                this.setState({ questionData: []})
            }
        })

    }

    render() {

        const paging_wrap = {
            margin: '40px'
        }
        let paging = []
        let pages = this.state.pages;
        for (var i = 1; i < pages+1; i++) {
            const page = i
            if( this.state.currentPage === i ) paging.push(<span className="paging_num"><strong>{i}</strong></span>);
            else paging.push(<span className="paging_num" style={{cursor:'pointer'}} ref={i} onClick={(e) => { this.pageHandler({page}) }}  >{i}</span>);
        }


        return (
            <div className="wrap_userfavorite">
                <div className="wrap_writingdoc" ></div>
                <div className="mobile total">
                    전체 {(!!this.state.total) ? this.state.total : 0} 건
                </div>
                <table className="table" style={{width:'93%', margin:'40px auto'}}>
                    <thead>
                        <tr className="point_row point_header">
                            <th className="question_table_cell question_header_1 middle">
                                <span>번호</span>
                            </th>
                            <th className="question_table_cell question_header_2 middle" width='300'>
                                <span>내용</span>
                            </th>
                            <th className="question_table_cell question_header_3 middle">
                                <span>등록일</span>
                            </th>
                            <th className="question_table_cell question_header_4 middle">
                                <span>답변 상태</span>
                            </th>
                            <th className="question_table_cell question_header_5 middle">
                                <span></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                        this.state.questionData.map( (items) => 
                                items.map((item,index) =>
                            <Fragment>
                            <tr className="question_row" onClick={(e) => this.openAnswer(e,item.idx,index, item.status)}>
                                <td className="question_table_cell question_content_1 middle idx">
                    {((this.state.currentPage-1)*10)+index+1}
                                </td>
                                <td className="question_table_cell question_content_2 middle" >
                                    <div
                                        // onClick={(e) => this.openAnswer(e,item.idx,index, item.status)}
                                        style={{cursor:'pointer'}}
                                    >{item.question}</div>
                                </td>
                                <td className="question_table_cell question_content_3 middle">
                                    {
                                        ( this.state.isMobile && Cookies.get('forceDeskTop') !== 'true' ) ?
                                            <span>등록일 : {moment(item.registerdate).format('YYYY년 MM월 DD일')}</span>
                                            :
                                            <span>{moment(item.registerdate).format('YYYY.MM.DD')}</span>
                                    }

                                </td>
                                <td className="question_table_cell question_content_4 middle">
                                    { ( item.status === "Y" )? <strong style={{color:'#5373a7'}}>답변 완료</strong>:<span>처리 중</span> }
                                </td>
                                <td className="question_table_cell question_content_5 middle">
                                    <img src="/mypage_img/mobile/icon_2.svg" alt="plus_btn"
                                    onClick={(e) => this.openAnswer(e,item.idx,index, item.status)} 
                                    className={(this.state.openIdx === item.idx )?"question_hide":"question_block"}
                                    style={{cursor:'pointer'}}
                                    />
                                    <img src="/mypage_img/mobile/icon_1.svg"
                                    alt="minus_btn" 
                                    onClick={(e) => this.closeAnswer(e)}  
                                    className={(this.state.openIdx === item.idx )?"question_block ":"question_hide"}
                                    style={{cursor:'pointer'}}
                                    />
                                </td>
                            </tr>

                            <tr  className={(this.state.openIdx === item.idx )?"question_contents":"question_hide"}>
                                <td colSpan="5" className="question_table_cell wrap_question_detail middle">
                                    <div className="question_detail">
                                        <div className="q">Q.</div>
                                        <span className='mobile q_mark'>Q.</span>
                                        <div className="q_detail">
                                            {item.question}
                                        </div>
                                    </div>
                                    { ( item.status === "Y" )? 
                                    <div className="question_detail">
                                        <div className="a">A.</div>
                                        <span className='mobile a_mark'>A.</span>
                                        <div className="a_detail" style={{marginLeft:15}}>
                                            {item.answer.split('\n').map(function(item, key) {
                                            return (
                                                <span key={key}>
                                                {item}
                                                <br/>
                                                </span>
                                            )
                                            })}
                                        </div>
                                    </div>
                                    :""                                    
                                    }
                                    <div className="question_btn">
                                        <img src="/mypage_img/q_insert_btn.png" className="q_insert_btn" alt="문의수정" style={{cursor:'pointer'}} onClick={(e) => this.modifyQuestion(item.idx,item.question,index) } />
                                        <img src="/mypage_img/q_delete_btn.png" className="q_delete_btn" alt="문의삭제" style={{cursor:'pointer'}}
                                        // onClick={(e) => this.deleteQuestion(item.idx) }  
                                        onClick={() => {if(window.confirm('삭제하시겠습니까?')){this.deleteQuestion(item.idx)};}}
                                        />
                                    </div>
                                </td>
                                <div className="mobile question_btns">
                                    <img src="/mypage_img/q_insert_btn.png" className="q_insert_btn" alt="문의수정" style={{cursor:'pointer'}} onClick={(e) => this.modifyQuestion(item.idx,item.question,index) } />
                                    <img src="/mypage_img/q_delete_btn.png" className="q_delete_btn" alt="문의삭제" style={{cursor:'pointer'}}
                                        // onClick={(e) => this.deleteQuestion(item.idx) }
                                         onClick={() => {if(window.confirm('삭제하시겠습니까?')){this.deleteQuestion(item.idx)};}}
                                    />
                                </div>
                            </tr>
                        </Fragment>
                                )
                            )
                            
                        }

                    </tbody>
                </table>
                <div style={paging_wrap}>
                    <div className="paging_wrap">
                        {/* <div className="inline_box">
                            <img src="paging_img/paging_left.png" className="paging_btn" alt="leftpaging_left" />
                        </div> */}
                        <div className="inline_box">
                        {paging}
                        </div>
                        {/* <div className="inline_box">
                            <img src="paging_img/paging_right.png" className="paging_btn" alt="paging_right" />
                        </div> */}
                    </div>
                </div>
                <div id="questionmodal" className="questionmodal">
                    <div className="wrap_qna">
                    <div className="header">
                        <span>1:1 이용문의</span>
                        <div className="btn_close">
                            <a href="javascript:history.back();"><img src="/mypage_img/btn_close.png" width="16" height="16" alt="x_btn"></img></a>
                        </div>
                    </div>
                    <form onSubmit={this.onHandleSubmit} >
                    <div className="inputs">
                        <div className="input_id">
                            <textarea name="question" 
                            placeholder="사용하시면서 불편하신 점이 있다면 편하게 말씀해 주세요. 
    회원님이 문의하신 내역은 마이페이지에서 확인하실 수 있습니다."
                            ref="question"
                            onChange={this.onHandleChange}
                            value={this.state.modalQuestion}/>
                        </div>
                        <div style={{margin:15, textAlign:'center' }}>
                            <button type="submit" className="btn_submit" >1:1 문의 수정하기</button>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }
}

export default Userquestion;
