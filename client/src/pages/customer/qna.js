import React from 'react'
// import { Helmet } from "react-helmet"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Header = dynamic(() => import('components/common/header_new'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })
const CsTop = dynamic(() => import('components/customer/top'), { ssr: false })
const CsMenu = dynamic(() => import('components/customer/menu'), { ssr: false })
const Qna = dynamic(() => import('components/customer/qna'), { ssr: false })

const Service = () => {
    const router = useRouter()
    let pathnames = router.pathname.split('/')
    let idx = (pathnames[3]) ? pathnames[3] : null

    return (
        <div className="customer">
            {/* <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} /> */}
            <Header theme='dark' styles={{ position: 'absolute' }}/>
            <div className="customer-service">
                <CsTop/>
                <div className="cs-content">
                    <CsMenu service={router.query.service}/>
                    <div className='cs-service'>
                        <Qna idx={idx}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Service