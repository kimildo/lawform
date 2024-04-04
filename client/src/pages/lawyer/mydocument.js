import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { metaDataService } from 'components/common/metas'
import Seo from 'components/common/seo'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('components/common/header_new'), { ssr: false })
const Mydocument = dynamic(() => import('components/lawyer/mydocument'), { ssr: false })
const Footer = dynamic(() => import('components/common/footer'), { ssr: false })

class LawyerMydocument extends Component {

    constructor (props) {
        super(props)
        // this.state = {
        //     'ui': {},
        //     'data': {
        //         'request_type': router.query.request_type
        //     },
        //     'msg': {}
        // }
    }

    render () {
        return (
            <div className="magazine lawyer">
                <Seo metaData={metaDataService}/>
                <Header theme={'dark'} styles={{ position: 'absolute' }} peer_review={true}/>
                <Mydocument/>
                <Footer/>
            </div>
        )
    }
}

export default LawyerMydocument
