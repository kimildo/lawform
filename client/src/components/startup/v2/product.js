import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from 'utils/user'
import API from 'utils/apiutil'
import Router from 'next/router'
import Paging from 'components/common/paging';

class Product extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            docList:props.list,
            userSubscription:null,
            activePros:null,
            currentPage:1,
            perPage:3
        };
        this.userInfo = User.getInfo();
        this.setPage = this.setPage.bind(this)

    }
    componentDidMount() {
        User.getSubscription().then(result=>{
            if( !!result ) {
                this.setState({
                    userSubscription:result
                })
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            docList:props.list,
            currentPage:1
        })
    }
    
    addDocument( iddocuments ) {
        var sub_idx = this.state.userSubscription.idx;
        if( !iddocuments ){
            alert( " 선택된 문서가 없습니다. 문서를 선택해주세요." );
            return false;
        } else {
            let params = { iddocuments:iddocuments , sub_idx:sub_idx }
            API.sendPost('/user/subscription/addDoc', params ).then( result => {
                if( result.status === 'ok' ){
                    // alert('해당문서가 지급되었습니다.');
                    Router.push("/autoform/"+result.data.idwriting)
                } else {
                    alert('문서지급에 실패했습니다.');

                }
            });
        }
    }

    setPage( page, per ) {
        this.setState({
            currentPage:page
        })
    }
    render() {
        return (
            <div className="product">
                <section>
                    <h5><span >필수문서</span><hr className="mobile_hide" /></h5>
                    <ul className="items">
                        {!!this.state.docList?Object.getOwnPropertyNames(this.state.docList).reverse().slice(this.state.currentPage*this.state.perPage - this.state.perPage,this.state.currentPage*this.state.perPage).map((item,index)=>
                        <li key={index}>
                            <icon><img src="/category_img/icons/doc_30.svg" /></icon>
                        <title>{this.state.docList[item].title}<subtitle>{this.state.docList[item].description?this.state.docList[item].description:null}</subtitle></title>
                        { !!this.state.userSubscription?
                            <button className="write" ><a onClick={()=>this.addDocument(item)}>작성하기</a></button>
                            :
                            <button className="preview" ><Link href={"/preview/"+item} >미리보기</Link></button>
                        }
                            {!this.state.docList[item].education&&!!this.state.docList[item].pros?
                                <pros className={this.state.activePros===index?"active":""}>
                                    <h6>관련 교육 포인트</h6>
                                    <div className="opener mobile" onClick={()=>this.state.activePros===index?this.setState({activePros:null}):this.setState({activePros:index})}>관련 교육 포인트</div>
                                    <ul>
                                        {this.state.docList[item].pros.map((item, index)=>
                                        <li key={index}>{item}</li>
                                        )}
                                    </ul>
                                </pros>
                                :null
                            }
                            {!!this.state.docList[item].education?
                                <pros className={this.state.activePros===index?"active":""}>
                                    <h6>관련 교육 자료</h6>
                                    <div className="opener mobile" onClick={()=>this.state.activePros===index?this.setState({activePros:null}):this.setState({activePros:index})}>관련 교육 자료</div>
                                    <ul>
                                        {this.state.docList[item].education.map((item, index)=>
                                        <li key={index}><Link href={item.link}><a>{item.text}</a></Link></li>
                                        )}
                                    </ul>
                                </pros>
                                :null
                            }
                        </li>
                        ):null}
                    </ul>
                    {!!this.state.docList &&
                    <Paging page={this.state.currentPage} per={this.state.perPage} total={Object.getOwnPropertyNames(this.state.docList).length} setPage={this.setPage} />
                    }
                </section>
            </div>
        );
    }
}

export default Product;
