import React from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
// import 'scss/startup/v2m.scss';
import 'scss/startup/v2.scss'
import 'scss/startup/solution.scss'
import Api from 'utils/apiutil'
import User from 'utils/user'
import { useRouter } from 'next/router'


const Header = dynamic(() => import('components/common/header_startup'), { ssr: false })
const Index = dynamic(() => import('components/startup/v2/solution/main'), { ssr: false })
// const Footer = dynamic(() => import('../components/startup/footer'),{ssr:false})

const Solution = pageProps => {

    const router = useRouter()
    return (
        <div className="startup solution">
            <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
            <Header active="startup" theme="dark"/>
            <Index {...pageProps} />
        </div>
    )
}

Solution.getInitialProps = async (ctx) => {

    const section = (!!ctx.query.section) ? Number(ctx.query.section) : 1
    const getGlobalQuestionData = await Api.sendPost('/solution/getQuestionData', {q_type: 'A', section: section})
    const userAnswerData = null

    // const userAnswerData = await API.sendPost('/solution/getUserSolutionAnswers', { section: section }).then((result) => {
    //     if (result.status === 'ok' && result.data.status === 'ok') {
    //         return result.data.data
    //     }
    //     return null
    // })

    return {
        section: section,
        userInfo: User.getInfo(),
        globalQuestionData: getGlobalQuestionData.data.data,
        userAnswerData: userAnswerData
    }
}

export default Solution