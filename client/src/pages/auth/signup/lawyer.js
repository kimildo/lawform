import React from 'react'
import dynamic from 'next/dynamic'
import User from '../../../utils/user'

const Header = dynamic(() => import('../../../components/common/header'),{ssr:false})
const Footer = dynamic(() => import('../../../components/common/footer'),{ssr:false})
const SignupMain = dynamic(() => import('../../../components/auth/signup/main'), { ssr: false })
const LawyerSignup = dynamic(() => import('../../../components/auth/lawyerSignup'), { ssr: false })

const Main = () => {

    if (process.browser) {
        if (!!User.getInfo()) {
            window.location.href = '/'
        }
    }

    return (
        <>
            <Header/>
            <div id={'signup'}>
                {/*<Header theme={'dark'} styles={{ position: 'absolute' }} />*/}
                <SignupMain type={'lawyer'}/>
            </div>
            <Footer/>
        </>

    )
}

export default Main