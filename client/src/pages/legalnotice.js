import React, { Component } from 'react'
import Link from 'next/link'
import { Helmet } from "react-helmet"
import { useRouter } from "next/router"
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})
const LegalNotice = dynamic(() => import('../components/common/legalnotice'),{ssr:false})
// import '../scss/common/legalnotice.scss';

class Legalnotice extends Component {
    constructor( props ) {
        super(props)
        this.state = {
            hash:null
        }
        this.updateHash = this.updateHash.bind(this)
    }

    updateHash(event) {
        this.setState({hash: window.location.hash.replace('#','')})
    }
    componentDidMount() {
        if(!!window.location.hash) this.setState({hash: window.location.hash.replace('#','')})
        else this.setState({hash: 'terms'})
        window.addEventListener('hashchange', this.updateHash, false)
    }
    componentWillUnmount() {
        window.removeEventListener('hashchange', this.updateHash, false)
    }
    

    render () {
        return (
            <div className="legalnotice">
                <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                <Header theme="dark" styles={{position:'absolute',top:0}} className="mobile_hide"/>
                <div className="wrap">
                    <h1>ⓘ 약관 및 정책</h1>
                    <ul className="tabs">
                        <li className={this.state.hash==='terms'?'active':''}><a href="#terms">서비스 이용약관</a></li>
                        <li className={this.state.hash==='privacy'?'active':''}><a href="#privacy">개인정보 처리방침</a></li>
                        <li className={this.state.hash==='disclaimer'?'active':''}><a href="#disclaimer">면책 공고</a></li>
                    </ul>
                    {
                        !!this.state.hash?
                    <LegalNotice type={this.state.hash}/>
                    :null
                    }
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Legalnotice