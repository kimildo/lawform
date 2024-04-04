import React, { Component } from 'react'
import Link from 'next/link'
import User from '../../utils/user'
import { Helmet } from 'react-helmet'

class Common extends Component {

    constructor (props) {
        super(props)
        this.state = {
            userStatus: 'N',
            userName: ''
        }

        this.userInfo = User.getInfo()
        this.refererPath = encodeURIComponent(window.location.pathname)

        if (!this.userInfo) {
            alert('로그인 후 이용하세요.')
            window.location = '/auth/signin?referer=' + this.refererPath
        }
    }

    componentDidMount () {

        if (this.userInfo.account_type === 'A') {
            window.location = '/lawyer/profile'
            return
        }

        this.setState({
            userStatus: 'Y',
            userName: this.userInfo.username,
            path: this.refererPath,
        })
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (this.state.userStatus !== 'Y')
    }

    render () {
        return (
            <div className="mypage">
                <div className="visual">
                    <h1>마이페이지</h1>
                </div>
                <ul className="mypage_tabs">
                    <li className={this.props.active === 'mydocument' ? 'active' : null}><Link href="/mydocument" as="/mydocument"><a>내 문서 보관함</a></Link></li>
                    <li className={this.props.active === 'purchasehistory' ? 'active' : null}><Link href="/purchasehistory" as="/purchasehistory"><a>구매내역</a></Link></li>
                    <li className={this.props.active === 'myquestion' ? 'active' : null}><Link href="/myquestion" as="/myquestion"><a>1:1 문의내역</a></Link></li>
                    <li className={this.props.active === 'writingreview' ? 'active' : null}><Link href="/writingreview" as="/writingreview"><a>편집요청내역</a></Link></li>
                </ul>
            </div>
        )
    }
}

export default Common
