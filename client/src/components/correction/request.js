import React, { Component } from 'react';
import ReactDOM from "react-dom";
// import '../../scss/correction/correction.scss';
// import '../../scss/correction/request.scss';
// import '../../scss/style.scss';
import Requestbar from './requestbar'
import Requestside from './requestside'
import Requestcontent from './requestcontent'

class Correctionrequest extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div>
                <div className="request-layout">
                    <div className="topbar">
                        <Requestbar></Requestbar>
                    </div>
                    <div className="vertical-layout">
                        <div className="vertical-column">
                            <Requestside></Requestside>
                        </div>
                        <div className="vertical-column">
                            <Requestcontent></Requestcontent>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Correctionrequest;
