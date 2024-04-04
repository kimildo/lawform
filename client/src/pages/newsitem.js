import React, {Fragment} from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Content = dynamic(() => import('../components/newsitem/content'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})

const Newsitem = () => {
    return (
        <Fragment>
            <Header theme='dark' styles={{position:'absolute'}}/>
            <Content />
            <Footer />
        </Fragment>
    );
};

export default Newsitem;