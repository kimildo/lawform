import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import '../../scss/autoform/autoformmain.scss';
// import Api from '../../utils/apiutil';
import { withAutoformContext } from '../../contexts/autoform';
import API from '../../utils/apiutil';


class AutoformPreview extends Component {
    static propTypes = {
        onOverflowChange: PropTypes.func,
        children: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        style: {},
    };

    constructor(props) {
        super(props);
        this.state = {
         printFile : "",
         tester: ""
        }
    }

    componentDidMount() {
    API.sendGet('/user/info').then((res) => {
        const userData = res.data.userData;
        this.setState({ tester: userData.tester });
    });
}
    
    render() {
        let style_a4 = {height : window.innerHeight - 133};
        if(this.state.tester === 'Y'){
            style_a4 = {
                height : window.innerHeight - 133,
                msUuserSelect: 'auto',
                mozUserSelect: 'auto',
                webkitUserSelect: 'auto',
                khtmlUserSelect: 'auto',
                userSelect: 'auto',
            }
        }
        return (
            <div className="autoform_output_field" id="output" ref={this.setDOMElement} >
                {/* <div className="autoform_output_a4" id="output_a4" style = {style_a4}onContextMenu={(e) => {e.preventDefault(); return false;}} > */}
                <div className="autoform_output_a4" id="output_a4" style = {style_a4}onContextMenu={(e) => {e.preventDefault(); return false;}} >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default withAutoformContext(AutoformPreview);