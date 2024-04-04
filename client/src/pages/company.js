import React, {Fragment} from 'react';
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Companyinfo = dynamic(() => import('../components/info/company'),{ssr:false})
const Footer = dynamic(() => import('../components/common/footer'),{ssr:false})

const Company = () => {
    return (
        <Fragment>
            <div>
                <Header theme='dark' styles={{position:'absolute'}}/>
                <Companyinfo />
                <Footer />
            </div>
        </Fragment>
    );
};

export default Company;