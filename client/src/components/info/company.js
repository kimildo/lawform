import React, { Component } from 'react';
import Link from 'next/link';
// import '../../scss/info/company.scss';
import { Helmet } from "react-helmet"
class Companyinfo extends Component {
    render() {
        return (
            <div className="company_info">
                <div className="visual">
                    <h1>회사 소개</h1>
                    <div>아미쿠스렉스(Amicus Lex)</div>
                </div>
                <div className="section">
                    <img src="/info_img/company-section-1.jpg" />
                </div>
                <div className="section">
                    <img src="/info_img/company-section-2.jpg" />
                </div>
                <div className="section">
                    <img src="/info_img/company-section-3.jpg" />
                </div>
                <div className="banner">

                </div>
                <div className="section" style={{paddingLeft:42,paddingBottom:42}}>
                    <img src="/info_img/company-section-4.jpg" />
                </div>
                <div className="links">
                    <Link href="/press"><img src="/info_img/company-link-press.jpg" /></Link>
                    <Link href="/service"><img src="/info_img/company-link-service.jpg" /></Link>
                </div>
            </div>
        );
    }
}

export default Companyinfo;
