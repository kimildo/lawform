import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { withRouter, useRouter } from 'next/router'
// // import '../scss/component/layout.scss'
// import '../scss/page/doc/container.scss'

import API from 'utils/apiutil'
import DocDelegate from 'utils/doc_delegate'
import helper_url from 'helper/helper_url'
import User from 'utils/user'
import { isIE } from 'react-device-detect'

const Header = dynamic(() => import('components/common/header'), { ssr: false })
const PageView = dynamic(() => import('components/doc/page_view'), { ssr: false })
const Toolbar = dynamic(() => import('components/doc/toolbar'), { ssr: false })
const SidebarLawyerReview = dynamic(() => import('components/doc/sidebar_lawyer_review'), { ssr: false })

const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

class DocLawyerReviewRequest extends Component {

    static async getInitialProps ({ router }) {
        return { }
    }

    constructor (props) {
        super(props)
        this.state = {
            ui: {
                delegate: new DocDelegate()
            },
            data: {
                writing_idx: 0,
                document_idx: 0,
                category_idx: 0
            },
            msg: {
                unable_to_load_writing: '문건 불러올때 문제가 생겼습니다. 다시 시도 해주세요'
            }
        }

        if (!!isIE && host === 'https://lawform.io') {
            if (process.browser) {
                alert('해당 기능은 IE 브라우저는 지원하지 않습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.')
                window.history.back()
            }
        }

    }

    getWritingInfo = async () => {

        let writing_idx = this.props.router.query.id

        if (!User.getInfo()) {
            if (process.browser) {
                window.location = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            }
            return
        }

        return await API.sendPost(helper_url.api.writing.get, { 'idx': writing_idx }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                return  {
                    category_idx: result.data.data.category_idx,
                    document_idx: result.data.data.document_idx,
                    writing_idx: writing_idx
                }
            }

            alert(this.state.msg.unable_to_load_writing)
            window.history.back()
        })
    }

    componentDidMount () {
        this.getWritingInfo().then((data) => {
            this.setState({ data: data })
        })
    }

    render () {
        return (
            <div>
                <Header/>
                {(!!this.state.data.document_idx && !!this.state.data.category_idx) && <>
                    <div className="row">
                        <Toolbar
                            delegate={this.state.ui.delegate}
                            showservice={true}
                            showeditdoc={true}
                            showreview={true}
                            type={2}
                            shownew={false}
                            showsave={false}
                            showprint={true}
                            showdownload={true}
                            writing_idx={this.state.data.writing_idx}
                            document_idx={this.state.data.document_idx}
                            category_idx={this.state.data.category_idx}
                        />
                    </div>
                    <div className="doc-container">
                        <SidebarLawyerReview writing_idx={this.state.data.writing_idx} category_idx={this.state.data.category_idx} document_idx={this.state.data.document_idx}/>
                        <div className="main-content sidebar-padd">
                            <PageView delegate={this.state.ui.delegate} idx={this.state.data.writing_idx}/>
                        </div>
                    </div>
                </>
                }
            </div>
        )
    }
}

export default withRouter(DocLawyerReviewRequest)
