import React, { Component, Fragment } from 'react';
// import '../../scss/main/popup.scss';
import Cookies from 'js-cookie';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onPopup:false,
            offPopup:false
        }
    }

    componentDidMount() {
        // let offPopup =Cookies.get('offPopup');
        // if( offPopup !== 'true' ) {
        //     this.setState({
        //         onPopup:true
        //     })
        // }
    }

    closePopup() {
        if( this.state.offPopup === true ) Cookies.set('offPopup', true, { expires: 1, path: '/' });
        this.setState({
            onPopup:false
        })
    }

    handleChange(e) {
        if( e.target.name === 'offPopup' ){
            this.setState({
                offPopup: e.target.checked
            })
        }
      }

    goto() {
        window.open("/notice.html", "약관 변경사항", "width=800, height=500, left=80, top=50");
    }

    render() {
        return (
            <div className="mainLayerPopup">
                {
                !!this.state.onPopup &&
                <Fragment >
                    <div className='content' onClick={(e)=>this.goto()} style={{cursor:'pointer'}}>
                        <img className="popupImage" src="/main_img/popup/20190520term.jpg" />
                    </div>
                    <div className="bottom">
                        <span>오늘 하루 이 창을 열지 않음 <input type="checkbox" value='check' name="offPopup" onChange={this.handleChange.bind(this)}  />  </span>
                        <span onClick={(e)=> this.closePopup()} >[닫기]</span>
                    </div>
                </Fragment>
                }

            </div>
        );
    }
}

export default Popup;
