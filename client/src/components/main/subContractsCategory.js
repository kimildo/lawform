import React, { Component } from 'react';

const category = {
    textAlign: 'center',
    float: 'left',
    padding: '11px 20px 15px 20px',
    height: '24px',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#878d91'
};

class SubContractsCategory extends Component {
    render() {
        return (
            <div style={category}>
                {this.props.title}
            </div>
        );
    }
}

export default SubContractsCategory;