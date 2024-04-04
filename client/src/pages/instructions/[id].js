import React, {Fragment} from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from "react-helmet"
import {useRouter} from 'next/router'
// import Header from '../../components/common/header';
// import Content from '../components/instructions/content';
// import Footer from '../../components/common/footer';
const Header = dynamic(() => import('../../components/common/header'),{ssr:false})
const Content = dynamic(() => import('../../components/instructions/content'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})

const Instructions = () => {
    const router = useRouter();
    return (
        <Fragment>
            <Header></Header>
            <Content document={router.query.id}/>
            <Footer></Footer>
        </Fragment>
    );
};

Instructions.getInitialProps = async () => {
    return { }
}

export default Instructions;