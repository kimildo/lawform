import React from 'react';
import dynamic from 'next/dynamic'
import { Helmet } from "react-helmet"
import '../../scss/startup/v2.scss';
const Header = dynamic(() => import('components/common/header_startup'),{ssr:false})
const Qna = dynamic(() => import('components/startup/v2/qna'),{ssr:false})

// const Footer = dynamic(() => import('../components/startup/footer'),{ssr:false})

const Startup = () => {
    return (
        <div className="startup">
            <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
            <Header active="qna" theme="dark" />
            <Qna/>
        </div>
    );
};

export default Startup;