import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'
import User from '../utils/user'

const Header = dynamic(() => import('../components/common/header_new'), { ssr: false })
const Main = dynamic(() => import('../components/legalsolution/main'), { ssr: false })
const Footer = dynamic(() => import('../components/common/footer'), { ssr: false })

const Legalsoution = () => {

    if (process.browser) {
        if (!User.getInfo()) {
            window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            return
        }
    }

    return (
        <Fragment>
            <Header theme='dark' styles={{ position: 'absolute' }}/>
            <Main/>
            <Footer/>
        </Fragment>
    )
}

export default Legalsoution