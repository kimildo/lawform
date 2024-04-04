import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import dynamic from 'next/dynamic'
import User from '../../utils/user'
import { useRouter } from 'next/router'
const Header = dynamic(() => import('../../components/common/header_new'),{ssr:false})
const Profile = dynamic(() => import('../../components/lawyer/profile'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})

if( process.browser ) {
    if(!User.getInfo()) {
        window.location = '/'
    }
}


class LawyerProfile extends Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    render () {
        return (
            <div className="magazine lawyer">
                <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true} active={'lawyer_profile'}/>
                <Profile/>
                <Footer/>
            </div>
        )
    }
}

export default LawyerProfile
