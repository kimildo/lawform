import React, { Fragment } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/common/header'), { ssr: false })
const Footer = dynamic(() => import('../components/common/footer'), { ssr: false })

const ErrorNotFound = () => {
    return (
        <Fragment>
            <Header/>
            <Error404/>
            <Footer/>
        </Fragment>
    )
}

export default ErrorNotFound

const Error404 = () => {
    const contentStyle = {
        minHeight: '166px',
        backgroundColor: '#1e265c'
    }
    return (
        <Fragment>
            <div className="category">
                <div className="top_img">
                    <div className="image_content">
                        <div className="img_text_1"><span className='q'></span><span style={{ display: 'inline-block', verticalAlign: 'text-top', lineHeight: '28px' }}>해당 페이지를 찾을 수 없습니다.</span></div>
                        <div className="img_text_2">
                            <Link href="/" as="/"><a style={{ color: '#fff' }}><u>홈으로 이동하기</u></a></Link>
                            <Link href="/customer/qna" as="/customer/qna"><a style={{ marginLeft: '20px', color: '#fff' }}><u>1:1 이용문의</u></a></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div style={contentStyle}/>
        </Fragment>
    )
}


