import React, { Component } from 'react';
import dynamic from 'next/dynamic'
import { Helmet } from "react-helmet"
import Seo from '../../components/common/seo';
import { metaMagazine } from '../../components/common/metas';
// import '../../scss/magazine.scss';
const Header = dynamic(() => import('../../components/common/header_new'),{ssr:false})
const Main = dynamic(() => import('../../components/press/main'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})

class Notice extends Component {

    constructor(props) {
        super(props)
        this.state={
        }

    }

    render() {
        
        return (
            <div className="magazine">
                <Seo metaData = {metaMagazine} />
                <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                <Header styles={{position:'absolute'}} active="magazine" />
                <Main page='notice' />
                <Footer styles={{backgroundColor:'#404040'}}/>
            </div>
        );
    }
};

export default Notice;