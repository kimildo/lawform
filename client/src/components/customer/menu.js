import React from 'react'
import Link from 'next/link'

const Menu = ({ service }) => {
    return (
        <div className="cs-menu">
            <ul>
                <li className={service === 'faq' ? 'active' : ''}><Link href="/customer/[service]" as="/customer/faq"><a>자주하는 질문</a></Link></li>
                <li className={service === 'qna' ? 'active' : ''}><Link href="/customer/[service]" as="/customer/qna"><a>1:1 이용문의</a></Link></li>
                {/* <li><Link href="/customer/counsel">무료 법률상담</Link></li> */}
                <li className={service === 'notice' ? 'active' : ''}><Link href="/customer/[service]" as="/customer/notice"><a>공지사항</a></Link></li>
            </ul>
        </div>
    )
}

export default Menu