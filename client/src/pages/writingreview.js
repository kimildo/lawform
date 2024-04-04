import React from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
import User from 'utils/user'

const Header = dynamic(() => import('components/common/header_new'), { ssr: false })
const Common = dynamic(() => import('components/mypage/common'), { ssr: false })
const UserEditRequest = dynamic(() => import('components/mypage/usereditrequest'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })
const MobileNav = dynamic(() => import('components/mypage/mobileNav'), { ssr: false })

const Writingreview = () => {

    const field = {
        clear: 'both',
        width: 1200,
        paddingBottom: '48px',
        margin: '0px auto'
    }

    const userInfo = User.getInfo()

    return (
        <div className="mypage">
            <Header theme='dark' styles={{ position: 'absolute' }}/>
            <div className='my_question_wrap'>
                <div>
                    <Common active="writingreview"/>
                    <MobileNav active={4}/>
                </div>
                {(!!userInfo) &&
                <div style={field}>
                    <UserEditRequest/>
                </div>
                }
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Writingreview