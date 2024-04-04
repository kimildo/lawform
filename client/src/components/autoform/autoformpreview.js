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
         editBind:{}
        }
    }

    handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            // document.execCommand('insertHTML', false, '<br /><br />');
            // e.preventDefault();
        }
        if(e.key === 'Backspace'){
            if(  e.target.textContent.trim() === "" ){
                var r = document.getElementById( e.target.id);
                if(!!r) r.remove();
            }
        }
    }

    render() {
        return (
            <div className="autoform_output_field" id="output" ref={this.setDOMElement} >
                <div className="autoform_output_a4" id="output_a4" onContextMenu={(e) => {e.preventDefault(); return false;}} onKeyDown={this.handleKeyPress} onBlur={this.handleEdit} >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default withAutoformContext(AutoformPreview);