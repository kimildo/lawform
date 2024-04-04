import React, { Component } from 'react';
// import '../../scss/autoform/autoformtitle.scss';
import API from '../../utils/apiutil';
import User from '../../utils/user';
import jQuery from "jquery";
import Signin from '../common/signin';
import { Helmet } from "react-helmet";
window.$ = window.jQuery = jQuery;
class Title extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docData:{
                h2:""
            }
        };
    }
    componentWillMount() {
        API.sendGet('/documents/preview/' + this.props.iddocument).then((res)=>{
            if( res.data.status === 'ok' ) {
                this.setState({
                    docData : res.data.data[0]
                })
                console.log( this.state.docData )
            } else {
                alert('해당문서가 없습니다.')
                window.location.href = '/'
            }
        });
    }

    render() {
        return (
            <div className="wrap_preview_title">
                <div className="preview_title">
                    <div className="wrap_preview_title_main">
                        <h1>{this.state.docData.h1}</h1>
                        <span className="subheading">{this.state.docData.context}</span>
                    </div>
                </div>
            </div>
        ); 
    }
}

export default Title;