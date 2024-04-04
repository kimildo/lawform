import React from 'react';
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Common = dynamic(() => import('../components/mypage/common'),{ssr:false})
const Userquestion = dynamic(() => import('../components/mypage/userquestion'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})
const MobileNav = dynamic(() => import('../components/mypage/mobileNav'),{ssr:false})

const Myquestion = () => {

    const field = {
        clear:'both',
        width: 1200,
        // float: 'left',
        paddingBottom: '48px',
        margin: '0px auto'
    }

    return (
        <div className="mypage">
            <Header theme='dark' styles={{position:'absolute'}}/>
            <div className='my_question_wrap'>
                <div>
                    <Common active="myquestion" />
                    <MobileNav active = {3}/>
                </div>
                <div style={field}>
                    <Userquestion></Userquestion>
                </div>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default Myquestion;