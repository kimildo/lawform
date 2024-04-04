import React, { Component, Fragment } from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import User from '../../../utils/user'

const Header = dynamic(() => import('../../../components/common/header_new'), { ssr: false })
const Main = dynamic(() => import('../../../components/category/main'), { ssr: false })
const Footer = dynamic(() => import('../../../components/common/footer'), { ssr: false })

function Post (props) {

    const router = useRouter()
    let userInfo = User.getInfo()

    if (!!userInfo && userInfo.account_type === 'A') {
        router.push('/lawyer/category/' + router.query.id)
    }
    return (
        <div className={(!!userInfo && userInfo.account_type === 'A')?'category magazine lawyer':'category'}>
            {/* <Seo metaData = {MetaData} /> */}
            {(!!userInfo && userInfo.account_type === 'A') ?
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} active={'lawyer_category'}/>
                : <Header styles={{ position: 'absolute' }}/>
            }
            <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
            <Main category={Number(router.query.id)}/>
            <Footer/>
        </div>
    )
}

Post.getInitialProps = async () => {

    return {}
}

export default Post