import React, { Component, Fragment } from 'react'
import User from 'utils/user'
import Api from 'utils/apiutil'
import Moment from 'moment'
class Notice extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            boardData:[],
            activeIndex:null
        };
        this.userInfo = User.getInfo();

    }
    componentDidMount() {
        let userInfo = User.getInfo();
        if( !!userInfo ) { // Logged In
            this.setState ({
                userStatus : "Y"
            })
            this.getContent( 1 )
        } else {
            alert("로그인 후 이용하세요.");
            window.location = "/";
        }
    }

    componentDidUpdate(prevProps) {
        if( this.props.board !== prevProps.board ) {
            this.getContent( 1 )
        }
    }

    getContent( page ) {
        var params = {
            per:12,
            page:page,
            board:this.props.board
        }
        Api.sendPost('/board/list', params ).then(res => {
            if( res.data.result !== null ) {
                if( res.data.status === 'ok' & res.data.result.total > 0 ){
                    this.setState({boardData:res.data.result.rows})
                } 
            } else {
                this.setState({boardData:[]})
            }
        })    
    }


    render() {

        let paging = []
        let pages = this.state.pages;
        for (var i = 1; i < pages+1; i++) {
            const page = i
            if( this.state.currentPage === i ) paging.push(<span className="paging_num"><strong>{i}</strong></span>);
            else paging.push(<span className="paging_num" style={{cursor:'pointer'}} ref={i} onClick={(e) => { this.pageHandler({page}) }}  >{i}</span>);
        }


        return (
            <ul className="notice-list">
                {
                this.state.boardData.length > 0?
                this.state.boardData.map((item,index)=>
                    <li 
                    key={index}
                    className={ this.state.activeIndex === index?"active":"" }
                    >   
                        <div className="row" 
                            onClick={()=> this.setState({activeIndex:this.state.activeIndex === index?null:index}) }
                        >
                            <div className="title">{!!item.subject?<span>[{item.subject}]</span>:null} {item.title}</div>
                            <div className="date">{Moment(item.regdatetime).format('YYYY-MM-DD')}</div>
                        </div>
                        <div className="content" dangerouslySetInnerHTML={{__html:item.content}} ></div>
                    </li>
                ):
                <li className="empty">공지사항이 없습니다.</li>
                }
            </ul>           
        );
    }
}

export default Notice;
