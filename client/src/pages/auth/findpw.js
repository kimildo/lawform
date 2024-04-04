import React from 'react'
import dynamic from 'next/dynamic'
import User from '../../utils/user'

const Header = dynamic(() => import('../../components/common/header'), { ssr: false })
const FindUser = dynamic(() => import('../../components/auth/finduser'), { ssr: false })
const Footer = dynamic(() => import('../../components/common/footer'), { ssr: false })
// const User = dynamic(() => import("../utils/user"),{ssr:false})

const FindAuthPage = () => {

    if (process.browser) {
        if (!!User.getInfo()) {
            window.location.href = '/'
        }
    }

    return (
        <>
            <Header/>
            <div id={'find-user-info'}>
                <FindUser tab={'pw'}/>
            </div>
            <Footer/>
        </>

    )
}

export default FindAuthPage