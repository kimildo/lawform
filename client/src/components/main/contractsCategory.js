import React, { Component } from 'react';

const category = 'li';

class ContractsCategory extends Component {
    render() {
        return (
            <span className={category}>
                {this.props.title} ({this.props.length})
            </span>
        );
    }
}

export default ContractsCategory;