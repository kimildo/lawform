import React, { Component } from 'react';
import Link from 'next/link';

// import '../../scss/component/layout.scss';
// import '../../scss/component/table.scss';
// import '../../scss/component/button.scss';
// import '../../scss/component/input.scss';
// import '../../scss/component/align.scss';
// import '../../scss/component/text.scss';
// import '../../scss/component/list.scss';

// import '../../scss/page/doc/container.scss';

import PageView from './page_view';
import Toolbar from './toolbar';

class Preview extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        var that = this;
        return (
            <div>
                <div className="row">
                    <Toolbar/>
                </div>
                <div className="doc-container">
                    <div className="sidebar">
                        
                    </div>
                    <div className="main-content sidebar-padd">
                        <PageView/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Preview;
