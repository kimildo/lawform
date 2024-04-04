import React, { Component, Fragment } from 'react'
import API from 'utils/apiutil'
import User from 'utils/user'
import Router from 'next/router'
import moment from 'moment';

class Docs extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            userSubscription:{
                regdatetime:null,
                enddate:null
            },
            writingList:[]
        };
        this.userInfo = User.getInfo();

    }
    componentDidMount() {
        User.getSubscription().then(result=>{
            if( !!result ) {
                this.setState({
                    userSubscription:result
                })
                this.pageHandler({page:1,listType:'subscription',category:null})
            }
        });
    }

    pageHandler (e) {

        let params = {
            page: e.page,
            per: 3,
            order: 'w.registerdate',
            sort: 'desc',
            listType: e.listType,
            category: e.category
        }
        let stateParam = { writingList: [], pages: 1, currentPage: 1, selectDocs: [], totalDocs: 0 }

        API.sendGet('/writing/list', params).then((res) => {
            let pages = Math.ceil(res.data.total / params.per)
            if (res.data.status === 'ok') {
                stateParam = { writingList: res.data.data, pages: pages, currentPage: e.page, selectDocs: [], totalDocs: res.data.total }
            }
            this.setState(stateParam)
        })
    }
    
    render() {
        return (
            <div className="docs">
                {this.userInfo?
                <h2>
                    {/* {this.userInfo.username}님, 안녕하세요! */}
                    프로그램 이용현황
                </h2>
                :null
                }
                <section>
                    <h5>최근 작성한 스타트업 필수문서
                        <div className="sub-text">이용기간 :  
                            {moment( this.state.userSubscription.regdatetime ).format('Y.MM.DD')} ~ { moment( this.state.userSubscription.enddate).format('Y.MM.DD') } (D-{this.state.userSubscription.dayleft})</div>
                        <button className="rectangle mobile_hide" onClick={()=>Router.push('/mydocument').then((() =>window.scrollTo(0,0) ))}>내문서 보관함 <img src="/images/common/arrow-right-white.svg" /></button>
                    </h5>
                    <ul className="docs-list">
                        { this.state.writingList.length > 0 ?
                            this.state.writingList.map((item,index)=>
                            <li>
                                <div className="title">{item.title}</div>
                                <div className="date">최근작성일 : {moment( item.modifieddate).format('Y.MM.DD')}</div>
                                <button className="view-doc" onClick={()=>Router.push('/autoform/'+item.idwriting)}>바로가기 <img src="/images/common/arrow-right-grey.svg" /></button>
                            </li>
                            ):
                            <li className="empty">
                                <div className="title">아직 작성한 문서가 없습니다. </div>
                                <button className="view-doc" onClick={()=>Router.push('/startup/document')}>바로가기 <img src="/images/common/arrow-right-grey.svg" /></button>
                            </li>
                        }
                    </ul>
                    <div className="noti">* 스타트업 필수문서 외 구매 문서는 내문서 보관함에서 확인 가능합니다.</div>

                </section>
            </div>
        );
    }
}

export default Docs;
