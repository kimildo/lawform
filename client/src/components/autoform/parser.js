import React, { Component, Fragment } from 'react'
// import '../../scss/autoform/autoformmain.scss'
import CustomTag from '../../utils/customtag'
import Counter from '../../utils/counter'
import { withAutoformContext } from '../../contexts/autoform'
import API from '../../utils/apiutil'
import jQuery from 'jquery'
import preParser from './preparser'
import { Previewer } from 'pagedjs'
import pdfUtil from './pdfUtil'

window.$ = window.jQuery = jQuery

class Parser extends Component {
    constructor (props) {
        super(props)

        this.state = {
            content: ''
        }
        this.counter = new Counter()
        this.customTag = new CustomTag(this.props.bindData)
        this.inlineKeys = []
        this.parser = preParser
    }

    getDocData = (token = this.props.token) => {
        API.sendPost('/writing/auth/', { token }).then((res) => {
            console.log(res)
            if (res.status === 'ok') {
                const loadData = res.data[0].binddata
                const templateData = res.data[0].template_data
                this.props.setTemplateData(templateData)
                const bindData = JSON.parse(loadData)
                this.props.setBindData(bindData, true)
            } else {
                alert('권한없음!!')
            }
        }).then(() => {
            API.sendPost('/writing/loadedit', { idwriting: document }).then((res) => {
                if (res.status === 'ok') {
                    if (!!res.data.content && res.data.content.length > 0) {
                        let content = res.data.content.split(`contenteditable="true"`).join(`contenteditable="${this.state.contentEditable}"`)
                        this.setState({
                            content: content,
                            inputStatus: 'disable',
                            inputOver: { display: 'block' }
                        })
                    }
                }
            })
        })
    }

    componentDidMount () {
        let token = this.props.token
        if (this.props.params) {
        } else {
            if (!((window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && document === 'dropfile')) {
                this.getDocData(token)
            }
        }
        window.addEventListener('scroll', this.listenToScroll)
        this.setPage()
    }

    setPage () {
        let paged = new Previewer()
        if (!!this.props.templateData) {
            var params = {
                bindData: this.props.bindData,
                templateData: this.props.templateData
            }
            const parsed = this.parser(params)
            if (!!parsed && parsed !== null && parsed !== '') {
                var html = `<div class="autoform_output_title">${this.props.templateData.outputTitle}
                    <div>
                        <div class="textline"></div>
                        <div class="textline"></div>
                    </div>
                    </div>
                    
                `
                var classed = `<div class="wrap_autoform_output_content"  id="output_content" >${parsed}</div>`
                paged.preview(html + `<div>${parsed}</div>`, ['/assets/css/paged.css'], document.body.paged).then((result) => {
                    pdfUtil({ html: html + classed })
                    return result
                })
            } else {
                return false
            }
        } else {
            return false
        }
    }

    render () {
        var page = this.setPage()
        return (<div className="paged">{!!page ? page : null}</div>)
    }
}

export default withAutoformContext(Parser)