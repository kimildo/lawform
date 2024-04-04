import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import DocDelegate from 'utils/doc_delegate'

// // import '../scss/component/layout.scss'
// // import '../scss/component/table.scss'
// // import '../scss/component/button.scss'
// // import '../scss/component/input.scss'
// // import '../scss/component/align.scss'
// // import '../scss/component/text.scss'
// // import '../scss/component/list.scss'
// import '../scss/page/doc/container.scss'
import { withRouter, useRouter } from 'next/router'
import { isIE } from 'react-device-detect'

const Header = dynamic(() => import('components/common/header'), { ssr: false })
const PageView = dynamic(() => import('components/doc/page_view'), { ssr: false })
const Toolbar = dynamic(() => import('components/doc/toolbar'), { ssr: false })
const SidebarLawyerRequestComplete = dynamic(() => import('components/doc/sidebar_lawyer_request_complete'), { ssr: false })
const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

class DocLawyerRevision extends Component {

    static async getInitialProps ({ router }) {
        return {}
    }

    constructor (props) {
        super(props)
        const router = props.router
        this.state = {
            ui: {
                delegate: new DocDelegate(),
            },
            data: {
                // writing_idx: 3117,
                // writing_peer_review_idx: 26
                writing_idx: router.query.writing_idx,
                writing_peer_review_idx: router.query.writing_peer_review_idx
            },
            msg: {}
        }

        if (!!isIE && host === 'https://lawform.io') {
            if (process.browser) {
                alert('해당 기능은 IE 브라우저는 지원하지 않습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.')
                window.history.back()
            }
        }

    }

    componentDidMount () {
        const { router } = this.props
        this.setState({ data: router.query })
    }

    render () {
        //console.log( this.props )
        let tabactive = 1, hash = 2
        // let tabactive = 1, hash = Number(window.location.hash.replace('#', ''))
        if (hash === 1 || hash === 2) {
            tabactive = hash
        }

        return (
            <div>
                <Header/>
                <div className="row">
                    <Toolbar
                        title="문서 작성하기"
                        delegate={this.state.ui.delegate}
                        mode="revision"
                        showservice={true}
                        shownew={false}
                        showsave={false}
                        showeditdoc={true}
                        showprint={true}
                        showdownload={true}
                        writing_peer_review_idx={this.state.data.writing_peer_review_idx}
                        writing_idx={this.state.data.writing_idx}
                    />
                </div>
                <div className="doc-container">
                    <SidebarLawyerRequestComplete writing_peer_review_idx={this.state.data.writing_peer_review_idx}/>
                    <div className="main-content sidebar-padd">
                        <PageView
                            delegate={this.state.ui.delegate}
                            showtabs={true}
                            tabactive={tabactive}
                            mode="revision"
                            showprocess={true}
                            idx={this.state.data.writing_idx}
                            writing_peer_review_idx={this.state.data.writing_peer_review_idx}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(DocLawyerRevision)
