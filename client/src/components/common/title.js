import React, { Component, Fragment} from 'react';
// import '../../scss/common/stars.scss';

class Stars extends Component {

    constructor(props) {
        super(props);
        this.state = {
          title: "",
          subtitle:""
        };
    }

    componentWillMount() {
        let title = this.props.title;
    }

    componentWillReceiveProps(nextProp) {
        this.setState({
            text:nextProp.text
        })
    }

    scoreToStars= ( score ) => {
                
    }

    render() {
        let score = this.props.score;
        let starsArray = []
        for ( let i=0; i<5; i++ ) {
            if( score >= 20 ){
                starsArray.push( 1 )
                score = score - 20
            } else if( score >= 10 ){
                starsArray.push( 0.5 )
                score = score - 10
            } else {
                starsArray.push( 0 )
            }
        }
        return (
            <Fragment>
            <ul className="stars" >
                {
                    starsArray.map((star,key) => {
                        switch(star) {
                            case 1: return <li key={key}><img src="../common/star_full.png" alt="Full Star" /></li>;
                            case 0.5: return <li key={key}><img src="../common/star_half.png" alt="Half Star" /></li>;
                            case 0: return <li key={key}><img src="../common/star_blank.png" alt="Blank Star" /></li>;
                        }
                    })
                }
            </ul>
            <span>{this.state.text}</span>
            </Fragment>
        );
    }
}
export default Stars;
