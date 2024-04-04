import React from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
import 'scss/startup/v2.scss'
import 'scss/startup/solution.scss'
import User from 'utils/user'
import { useRouter } from 'next/router'
import API from 'utils/apiutil'

const Header = dynamic(() => import('components/common/header_startup'), { ssr: false })
const Report = dynamic(() => import('components/startup/v2/solution/report'), { ssr: false })
// const Footer = dynamic(() => import('../components/startup/footer'),{ssr:false})

const SolutionReport = pageProps => {

    const router = useRouter()
    const pop = router.query.popoup

    return (
        <div className="startup solution">
            <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
            {(!pop) && <Header active="startup" theme="dark"/> }
            <Report {...pageProps} token={router.query.token} />
        </div>
    )
}

SolutionReport.getInitialProps = async (ctx) => {
    return {
        popoup: ctx.query.popoup
    }
}

export default SolutionReport