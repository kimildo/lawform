import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import dynamic from 'next/dynamic'
import { withRouter, useRouter } from 'next/router'

import DocDelegate from 'utils/doc_delegate'

const Header = dynamic(() => import('components/common/header'), { ssr: false })
const PageView = dynamic(() => import('components/doc/page_view'), { ssr: false })
const Toolbar = dynamic(() => import('components/doc/toolbar'), { ssr: false })
const SidebarLawyerRequestComplete = dynamic(() => import('components/doc/sidebar_lawyer_request_complete'), { ssr: false })
// const DocDelegate = dynamic(() => import('utils/doc_delegate'),{ssr:false})

const defaultState = {
    ui: {
        delegate: new DocDelegate()
    },
    data: {
        writing_idx: 0,
        writing_peer_review_idx: 0
    },
    msg: {}
}

class DocPreview extends Component {

    static async getInitialProps ({ router }) {
        return {}
    }

    constructor (props) {
        super(props)
        this.state = defaultState
    }

    componentDidMount () {
        this.setState({
            data: {
                writing_idx: this.props.router.query.writing_idx,
                writing_peer_review_idx: this.props.router.query.writing_peer_review_idx
            }
        })
    }

    render () {

        const { data, delegate } = this.state
        return (
            <>
                <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
                <Header peer_review={true} service_type={1}/>
                <div className="row">
                    <Toolbar delegate={delegate} title="미리보기" showaccept={true}/>
                </div>
                <div className="doc-container">
                    <SidebarLawyerRequestComplete showbtn={false} showaccept={true} preview={true} writing_peer_review_idx={data.writing_peer_review_idx}/>
                    <div className="main-content sidebar-padd">
                        <PageView delegate={delegate} showtabs={true} tabhide={2} tabactive={1} showaccept={true} preview={true} idx={data.writing_idx}
                                  writing_peer_review_idx={data.writing_peer_review_idx}/>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(DocPreview)
