import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
import 'scss/startup/v2.scss';
const Header = dynamic(() => import('components/common/header_startup'), { ssr: false })
const Main = dynamic(() => import('components/magazine/main'), { ssr: false })
// const Footer = dynamic(() => import('components/common/footer'), { ssr: false })

class Education extends Component {

    constructor (props) {
        super(props)
        this.state = {}
    }

    componentDidMount () {
        if (!!window.location.hash) this.setState({ hash: window.location.hash.replace('#', '') })
        else this.setState({ hash: 'terms' })
        window.addEventListener('hashchange', this.updateHash, false)
    }

    componentWillUnmount () {
        window.removeEventListener('hashchange', this.updateHash, false)
    }

    render () {
        return (
            <div className="magazine education">
                <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                <Header styles={{ position: 'absolute' }} theme="dark"/>
                <Main/>
                {/* <Footer styles={{ backgroundColor: '#404040' }}/> */}
            </div>
        )
    }
}

export default Education