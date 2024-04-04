import React from 'react'
import dynamic from 'next/dynamic'
import User from '../../../utils/user'

const Header = dynamic(() => import('../../../components/common/header'),{ssr:false})
const Footer = dynamic(() => import('../../../components/common/footer'),{ssr:false})

const SignupMainPage = () => {

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
                <div className={`wrap_signup`}>
                    <div className="wrap_signup_header">

                        <div className="signup_header_name">
                            <span>회원가입</span>
                        </div>

                        <div className="signup_header_choose_title">
                            <div>회원선택</div>
                            <div>회원 유형을 선택하시고 계속 진행해주세요.</div>
                        </div>

                        <div className="signup_header_choose_ico">
                            <ul>
                                <li><a href="/auth/signup/person" title="개인"><img src="/images/auth/person_c.svg" alt={'개인'}/></a></li>
                                <li><a href="/auth/signup/company" title="기업"><img src="/images/auth/company_c.svg" alt={'기업'}/></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default SignupMainPage