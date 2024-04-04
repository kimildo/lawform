import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import User from 'utils/user'

const Header = dynamic(() => import('components/common/header'), { ssr: false })
const SigninMain = dynamic(() => import('components/auth/signin'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })

const SigninPage = () => {

    if (process.browser) {
        if (!!User.getInfo()) {
            window.location.href = '/'
            return
        }
    }

    const router = useRouter()
    return (
        <>
            <Header/>
            <div id={'signin'}>
                <SigninMain referer={router.query.referer}/>
            </div>
            <Footer/>
        </>
    )
}

export default SigninPage