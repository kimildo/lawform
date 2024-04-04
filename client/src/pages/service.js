import React, {Fragment} from 'react';
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Serviceinfo = dynamic(() => import('../components/info/service'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})

const Service = () => {
    return (
        <Fragment>
            <Header theme='dark' styles={{position:'absolute'}}/>
            <Serviceinfo />
            <Footer />
        </Fragment>
    );
};

export default Service;