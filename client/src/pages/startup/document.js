import React from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
// import 'scss/startup/v2m.scss';
import 'scss/startup/v2.scss'

const Header = dynamic(() => import('components/common/header_startup'), { ssr: false })
// const Main = dynamic(() => import('../components/startup/main'),{ssr:false})
const Main = dynamic(() => import('components/startup/v2/document'), { ssr: false })

// const Footer = dynamic(() => import('../components/startup/footer'),{ssr:false})

const Document = pageProps => {
    return (
        <div className="startup">
            <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
            <Header active="startup" theme="dark"/>
            <Main {...pageProps}/>
        </div>
    )
}

Document.getInitialProps = async (ctx) => {

    const issue = (!!ctx.query.section) ? Number(ctx.query.section) : 1

    return {
        issue: issue
    }
}

export default Document