import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import User from '../../../utils/user';
import Category from './category'
import Payment from './payment'
// import Product from './product'

class Document extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            userSubscription:null
        };
        this.userInfo = User.getInfo();
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
    
    render() {
        return (
            <div className="main">
                <div className="visual">
                    <h1>스타트업 필수문서</h1>
                    <div></div>
                </div>
                <h2>스타트업이 창업, 성장, 투자에 과정에서 발생하는 리스크 방지를 위한 교육 및 법률문서 패키지</h2>
                <Payment  userSubscription={this.state.userSubscription} userInfo={this.userInfo}/>
                <Category userSubscription={this.state.userSubscription} userInfo={this.userInfo}/>
                {/* <hr /> */}
            </div>
        );
    }
}

export default Document;
