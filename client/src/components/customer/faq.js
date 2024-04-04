import React, { Component, Fragment } from 'react';
import API from '../../utils/apiutil';
import moment from 'moment';
import Paging from '../common/paging';
import { set } from 'react-ga';
import Link from 'next/link';

class Faq extends Component {

    constructor(props) {
        super(props);
        this.state = {
            faqArray:[],
            faqData:[],
            per:10,
            page:1
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
       
    }
    componentWillMount() {
        this.getData('all')
    }
    handleClick(e) {

    }

    getData(category) {
        let url  = '/customer/faq/'+category;
        let per = this.state.per; 
        let page = 1;
        let start = ( per * ( page - 1 ) );

        API.sendGet( url ).then((result) => {
            let data = result.data.data.slice( start, start+per );
            this.setState({
                faqArray:data,
                faqData:result.data.data,
                activeKey:0,
                category:category,
                page:page
            })
        });

    }
    
    setPage = (page) => {
        let per = this.state.per; 
        let start = ( per * ( page - 1 ) );
        let data = this.state.faqData.slice( start, start+per );
        this.setState({
            faqArray:data,
            page:page
        })
    }

    showArticle(e,key) {
        if( this.state.activeKey === key ){
            this.setState({
                activeKey:0
            })
    
        } else {
            this.setState({
                activeKey:key
            })
    
        }

    }
    render() {
        return (
            <div>
                <div className="cs-title">
                    <h2>자주하는 질문</h2>
                    <h3>원하는 답변을 찾지 못하셨으면, 1:1 이용문의를 이용해주세요.</h3>
                    {/* <Link href="/customer/qna"><button type="button" >문의하기</button></Link> */}
                </div>
                <div>
                    <ul className="cs-faq-category">
                        <li onClick={(e)=>{ this.getData('all') }} className={(this.state.category === 'all')?'active':''}>전체</li>
                        <li onClick={(e)=>{ this.getData(1) }} className={(this.state.category === 1)?'active':''}>내용증명</li>
                        <li onClick={(e)=>{ this.getData(2) }} className={(this.state.category === 2)?'active':''}>지급명령</li>
                        <li onClick={(e)=>{ this.getData(4) }} className={(this.state.category === 4)?'active':''}>합의서</li>
                        <li onClick={(e)=>{ this.getData(0) }} className={(this.state.category === 0)?'active':''}>서비스 이용관련</li>
                    </ul>
                    <ul className="cs-lists">
                    {
                        this.state.faqArray.length > 0 && this.state.faqArray.map((item,key)=>
                        
                        <li key={key} onClick={(e) => {this.showArticle(e,key+1)}} className={(this.state.activeKey === key+1)?'active':''}>
                            <div className="question">{key+1+( (this.state.page*this.state.per)-this.state.per )}. {item.question.replace(/\n/g, <br/>)}</div>
                            <div className="answer">
                                {
                                item.answer.split(/\n/g).map((a, key) =>
                                    <Fragment key={key}>
                                        {a}<br/>
                                    </Fragment>
                                )}
                            </div>
                        </li>
                        )
                    }
                    </ul>
                    {
                        ( this.state.faqData.length > 0 )&&
                        <Paging  total={this.state.faqData.length} page={this.state.page} per={10} setPage={this.setPage} />
                    }
                    
                </div>
            </div>
        );
    }
}

export default Faq;