import React, { Component } from 'react'
import preParser from 'components/autoform/preparser'

let helper_document = {
    get_html: (_template_data, _binddata) => {

        let params = { bindData: _binddata, templateData: _template_data }
        const parsed = preParser(params)
        //const parsed = ''
        return `
                <div class="autoform_output_title">${_template_data.outputTitle}
                        <div>
                            <div class="textline"></div>
                            <div class="textline"></div>
                        </div>
                    </div>
                <div class="wrap_autoform_output_content"  id="output_content" >${parsed}</div>
        `
    }
}

export default helper_document

