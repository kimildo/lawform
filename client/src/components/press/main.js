import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import User from '../../utils/user';
import Api from '../../utils/apiutil';
import Newsitem from '../newsitem/content';
import Notice from '../customer/notice';
import Paging from '../common/paging';

const defaultState = {
    tab:2,
    tag:null,
    tags:[],
    viewPage:'press',
    newsPage:null,
    page:1,
    per:12    
}

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState
        this.userInfo = User.getInfo()
    }

    render() {
        return (
            <div className="main">
                <div className="visual">
                    <h2>로폼소식</h2>
                    <h3 className="mobile_hide">로폼의 다양한 소식을 만나보세요.</h3>
                </div>
                <div className="contents">
                    {/* <ul className="tabs">
                        <li><Link href="/magazine" as="/magazine" ><a>법률실전</a></Link></li>
                        <li className='active'>로폼 소식</li>
                    </ul> */}
                    <section>
                        <ul className="tags">
                            <li className={!this.props.page?'active':null}><Link href="/press" as="/press"><a>보도자료</a></Link></li>
                            <li className={this.props.page==='notice'?'active':null}><Link href="/press/notice"  as="/press/notice"><a>공지사항</a></Link></li>
                        </ul>
                        {
                            this.props.page === 'notice'?
                            <Notice header={false} idx={null} />
                            :
                            <Newsitem header={false} />
                        }

                    </section>
                    
                </div>
            </div>
        );
    }
}

export default Main;
