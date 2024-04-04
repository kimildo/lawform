import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import {withRouter} from 'next/router'

// // import '../scss/component/layout.scss'
// import '../scss/page/doc/container.scss'

import API from '../../../../../utils/apiutil'
import DocDelegate from '../../../../../utils/doc_delegate'
import helper_url from '../../../../../helper/helper_url'

const Header = dynamic(() => import('../../../../../components/common/header'),{ssr:false})
const PageView = dynamic(() => import('../../../../../components/doc/page_view'),{ssr:false})
const Toolbar = dynamic(() => import('../../../../../components/doc/toolbar'),{ssr:false})
const SidebarLawyerEdit = dynamic(() => import('../../../../../components/doc/sidebar_lawyer_edit'),{ssr:false})

class DocLawyerEdit extends Component {
    static async getInitialProps({router}) {
        return { }
    }
    constructor (props) {
        super(props)
        const router = props.router;
        this.state = {
            ui: {
                delegate: new DocDelegate()
            },
            data: {
                writing_idx: Number(router.query.writing_idx),
                writing_peer_review_idx: Number(router.query.writing_peer_review_idx),
                document_idx: 0,
                category_idx: 0
            },
            msg: {
                unable_to_load_writing: '문건 불러올때 문제가 생겼습니다. 다시 시도 해주세요'
            }
        }
    }

    componentDidMount () {
        let that = this
        let state = this.state
        API.sendPost(helper_url.api.writing.get, { 'idx': this.state.data.writing_idx }).then((result) => {
            if ('status' in result && result.status === 'ok') {
                state.data.category_idx = result.data.data.category_idx
                state.data.document_idx = result.data.data.document_idx
                that.setState(state)
                return
            }
            // alert(that.state.msg.unable_to_load_writing)
            // window.history.back()
        })
    }

    render () {
        return (
            <div>
                <Header peer_review={true} service_type={1}/>
                <div className="row">
                    <Toolbar delegate={this.state.ui.delegate} writing_peer_review_idx={this.state.data.writing_peer_review_idx} title="문서 검토" showcomplete={true}/>
                </div>
                <div className="doc-container">
                    <SidebarLawyerEdit lawyermode="true" slide_mode="true" writing_peer_review_idx={this.state.data.writing_peer_review_idx}/>
                    <div className="main-content">
                        <PageView showstamp={true} stamptype={1} addpadding={true} idx={this.state.data.writing_idx}/>
                        <PageView showstamp={true} stamptype={2} delegate={this.state.ui.delegate} mode="edit" idx={this.state.data.writing_idx}
                                  writing_peer_review_idx={this.state.data.writing_peer_review_idx}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter( DocLawyerEdit )
