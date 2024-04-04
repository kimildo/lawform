import React, {Component, Fragment} from 'react';
import Link from 'next/link';

class MobileNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mobile mypage_tab_nav_wrap">
                <nav className="tab_nav_contents">
                    <Link href='/mydocument'><a className={this.props.active === 1 ? 'tab_nav_active':undefined}>내 문서 보관함</a></Link>
                    <Link href='/purchasehistory'><a className={this.props.active === 2 ? 'tab_nav_active':undefined}>구매내역</a></Link>
                    <Link href='/myquestion'><a className={this.props.active === 3 ? 'tab_nav_active':undefined}>1:1 문의내역</a></Link>
                    <Link href='/writingreview'><a className={this.props.active === 4 ? 'tab_nav_active':undefined}>편집요청내역</a></Link>
                </nav>
            </div>
        )
    }
}

export default MobileNav;