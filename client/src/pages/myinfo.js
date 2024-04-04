import React from 'react'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Common = dynamic(() => import('../components/mypage/common'),{ssr:false})
const Userinfo = dynamic(() => import('../components/mypage/userinfo'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})

const Myinfo = () => {

    const bg = {
        // paddingTop: '48px',
        // paddingBottom: '88px',
        width: 1440,
        // height: 948,
        margin: '0 auto 50px'
    }

    const field = {
        width: 1000,
        // float: 'left',
        clear: 'both',
        margin: '0 auto'

    }

    return (
        <div className="mypage">
            <Header theme='dark' styles={{ position: 'absolute' }}/>
            {/* <div> */}
            <div className='my_info'>
                <div>
                    <Common/>
                </div>
                <div style={field}>
                    <Userinfo/>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Myinfo