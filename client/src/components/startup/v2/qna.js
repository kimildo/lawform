import React, { Component, Fragment } from 'react'
import User from 'utils/user'
import Api from 'utils/apiutil'
import Notice from './notice'
import Router from 'next/router';
import {Switch , FormControlLabel } from '@material-ui/core'
class Qna extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            selectedTabs:'notice',
            showQna:null,
            questionData: [],
            qnaQuestion:"",
            public:true,
            userProgram: {
                group_name:"제휴사"
            },
            userPrograms: [],
            userProgramsActive: false
        };
        this.userInfo = User.getInfo();

    }
    componentDidMount() {
        let userInfo = User.getInfo();
        if( !!userInfo ) { // Logged In
            let mount = async() => {
                await this.setState ({ userStatus : "Y" })
                await this.getProgram()
                // await this.pageHandler({page:1});
            }
            mount()        
            
        } else {
            alert("로그인 후 이용하세요.");
            Router.back()
        }
    }

    getProgram( index = 0 ) {
        let userInfo = User.getInfo();
        var params = {
            idusers:userInfo.idusers
        }
        Api.sendPost('/user/program', params ).then(res => {
            console.log( "1" )
            if( res.data.data ) {
                if( res.data.data.length > -1 ){
                    Api.sendPost('/user/boardpermission', params ).then(r => {
                        if( r.data.permission === true ) {
                            this.setState({ userProgram:res.data.data[index], userPrograms:res.data.data , userProgramsActive:false }, this.pageHandler({page:1, program_group:res.data.data[index].group_idx}))                            
                        } else {
                            alert( "이용권한이 없습니다.\n제휴사 서비스 이용문의는 로폼 이용문의 게시판에 “제휴사 서비스 문의”라고 남겨주세요. 담당자가 신속히 서비스 안내에 관한 회신을 드리고 있습니다.")
                            Router.push("/customer/qna")
                        }
                    })
                } else {
                    alert( "이용권한이 없습니다.\n제휴사 서비스 이용문의는 로폼 이용문의 게시판에 “제휴사 서비스 문의”라고 남겨주세요. 담당자가 신속히 서비스 안내에 관한 회신을 드리고 있습니다.")
                    Router.push("/customer/qna")
                 }
            }
        })
    }

    showQna(idx, showPublic, idusers ) {
        if( showPublic==='N' &&  this.userInfo.idusers !== idusers  ) {
            alert(`해당글은 작성자만 볼 수 있습니다.\n궁금한 점이 있으시면, 문의등록을 이용해주세요.`)
            return false;
        } else {
            if( this.state.showQna === idx ) {
                this.setState({
                    showQna:null
                })
            } else {
                this.setState({
                    showQna:idx
                })
            }
        }

    }

    pageHandler(e) {
        var params = {
            page:e.page,
            per:10,
            order:'registerdate',
            sort:'desc',
            program_group: e.program_group
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

    handleChange = (e, input) => {
        let userInfo = User.getInfo()
        if (input === 'question') {
            if (!userInfo) {
                alert('로그인 후에 이용해 주세요.')
                window.location.href = '/auth/signin?referer=' + encodeURIComponent('/customer/qna')
            } else {
                this.setState({ qnaQuestion: e.target.value })
            }
        }
        if (input === 'agree') this.setState({ qnaAgree: e.target.checked })
    }

    writeQuestion () {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('로그인 후에 이용해 주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent('/customer/qna')
            return false
        } else if (this.state.qnaQuestion === '') {
            alert('문의내용을 입력해주세요.')
            return false
        }
            //  else if( this.state.qnaAgree === false ) {
            //     alert('개인정보 수집에 동의해주세요.')
            //     return false;
        // } 
        else {

            var params = {
                question: this.state.qnaQuestion,
                phone: this.state.qnaPhone,
                email: this.state.qnaEmail,
                program_group: !!this.state.userProgram.group_idx?this.state.userProgram.group_idx:null,
                public: this.state.public
            }
            Api.sendPost('/customer/writeqna', params).then((result) => {
                if (result.status === 'ok') {
                    this.setState({
                        qnaQuestion: '',
                        qnaPhone: '',
                        qnaEmail: '',
                        qnaAgree: false,
                        selectedTabs:"list"
                    }, () => {
                        alert('회원님 감사합니다.\n문의가 등록 되었습니다.\n답변은 문의 등록 후 24시간 이내 회신을 원칙으로 하고 있습니다.\n답변 등록시 문자로 안내 드립니다.')
                        this.pageHandler({page:1,program_group:this.state.userProgram.group_idx})
                        this.setState({selectedTabs:'list'})
                    })
                }
            })

        }
    }

    render() {

        let paging = []
        let pages = this.state.pages;
        for (var i = 1; i < pages+1; i++) {
            const page = i
            if( this.state.currentPage === i ) paging.push(<span className="paging_num"><strong>{i}</strong></span>);
            else paging.push(<span className="paging_num" style={{cursor:'pointer'}} ref={i} onClick={(e) => { this.pageHandler({page,program_group:this.state.userProgram.group_idx}) }}  >{i}</span>);
        }


        return (
            <div className="qna">
                <div className="visual">
                    <h1>제휴사 전용 서비스</h1>
                    <div></div>
                </div>
                <div className="intro">
                    <h2>안녕하세요!<br /><span className="programs-wrap">
                        <div className={this.state.userProgramsActive===true?"program-name dropdown":"program-name"} onClick={()=>this.setState( prevState => ({ userProgramsActive: !prevState.userProgramsActive}) )}>
                            {this.state.userProgram.group_name}
                        </div>
                        {!!this.state.userPrograms.length>0 && this.state.userProgramsActive === true ?
                        <ul className="programs">
                        {this.state.userPrograms.map((item, index) => 
                            <li onClick={()=>this.getProgram( index )} key={index}>{item.group_name}</li>
                        )}
                        </ul>
                        :null}
                    </span> <br className="mobile" />전용공간입니다.</h2>
                    <h5></h5>
                </div>
                <div className="wrapper">
                    <ul className="tabs">
                        <li className={this.state.selectedTabs==="notice" ?"active":""} onClick={()=>this.setState({selectedTabs:'notice'})}>공지사항</li>
                        <li className={this.state.selectedTabs==="list" ?"active":""} onClick={()=>this.setState({selectedTabs:'list'})}>이용문의</li>
                        <li className={this.state.selectedTabs==="write"?"active":""} onClick={()=>this.setState({selectedTabs:'write'})}>문의등록</li>
                    </ul>
                    { this.state.selectedTabs==="notice" && !!this.state.userProgram && !!this.state.userProgram.program_board?
                    <Notice board={this.state.userProgram.program_board}/>:null
                    }
                    { this.state.selectedTabs==="list"?
                    <Fragment>
                    <ul className="qna-list">
                        {
                            this.state.questionData.map( (items) => 
                            items.map((item,index) =>
                                <li key={index}>
                                    <div className="type" ></div>
                                    <div className="title"><div className="ellipsis">{item.public==='N'?<span className="private">비공개 </span> :null}{item.question}</div></div>
                                    <div className={item.status==='Y'?"status answered":"status"} onClick={()=>this.showQna(index, item.public, item.idusers)} >
                                        {item.status==='Y'?"답변완료":"답변대기"}<span className={this.state.showQna === index?'open':'close'}></span>
                                    </div>
                                    {this.state.showQna === index?
                                    <div className={item.status==='Y'?"show-qna answered":"show-qna"}>
                                        <question>{item.question}</question>
                                        {item.status==='Y'?
                                        <Fragment>
                                            <hr />
                                            <answer>{item.answer}</answer>
                                        </Fragment>
                                        :null
                                        }

                                    </div>
                                    :null
                                    }
                                </li>
                            ))
                        }
                        {
                            this.state.questionData.map((item,index) =>{
                                
                            })
                        }
                        
                    </ul>
                    <div style={{margin:40}}>
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
                    </Fragment>
                    :null
                    }
                    { this.state.selectedTabs==="write"?
                    <div className="write">
                        {/* <div className="description">스타트업 프로그램 이용관련 문의를 남겨주세요. (스타트업 필수문서, 스타트업 실사, 투자실사 등)<br className="mobile_hide" />답변은 문의 등록 후 24시간 이내 회신되며, 답변 등록 시 문자로 안내 드립니다.</div> */}
                        <textarea type="text" value={this.state.qnaQuestion} className="question" onChange={(e) => {this.handleChange(e, 'question')}}
                            placeholder={'1. 상담하고 싶은 내용 또는 사용하시면서 궁금하신 점을 입력하여 주세요.\n\r2. 회원님이 문의하신 내역은 마이페이지에서 확인하실 수 있습니다.\n\r3. 비공개설정시, 문의 첫부분 약 20글자는 노출됩니다. 이 점 고려하여 문의작성을 해주세요.'}/>
                        <FormControlLabel 
                            className="public-switch"
                            control={<Switch
                            checked={this.state.public}
                            onChange={e=>{ this.setState({public:e.target.checked}) }}
                            color="primary"
                            />}
                            label="공개설정"
                        />
                        <button onClick={(e) => { this.writeQuestion() }}>문의 접수</button>
                    </div>
                    :null
                    }
                </div>
                
            </div>
            
        );
    }
}

export default Qna;
