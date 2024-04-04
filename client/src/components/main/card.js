import React, { Component, Fragment } from 'react';

class Card extends Component {
    componentDidMount() {
        
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
                <li>
                    <h4>{this.props.title}</h4>
                    <div className="description">
                        {
                        this.props.description.split(/\n/g).map((r, key) =>
                            <Fragment key={key}>
                                {r}<br/>
                            </Fragment>
                        )}
                    </div>
                    <a href={(this.props.category !== 4) ? "/instructions/"+this.props.doc : "/preview/"+this.props.doc}><button >자세히 보기</button></a>
                    {
                        (this.props.icon)&&
                        <div className="icon">
                            <img src={"/common/category_icons/"+this.props.icon} alt={this.props.title} />
                        </div>
                    }
                </li>
        );
    }
}
export default Card;
