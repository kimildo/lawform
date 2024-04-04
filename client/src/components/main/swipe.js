import React, { Component } from 'react';
import Link from 'next/link';
// import '../../scss/main/swipe.scss';
import Modal from '../common/modal';



class Swipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // card1:{left:0},
            // card2:{left:0},
            // card3:{left:0}
            card2Open:false,
            card3Open:false
        }
    }

    componentDidMount() {
        // let offPopup =Cookies.get('offPopup');
        // if( offPopup !== 'true' ) {
        //     this.setState({
        //         onPopup:true
        //     })
        // }
        setTimeout(() => {
            this.setState({
                card1:{left:180},
                card2:{left:470},
                card3:{left:760}
            })  
        }, 800);
        
    }

    handleClose = () => {
        this.setState({
            card2Open:false,
            card3Open:false
        })
    }

    handleChange(e) {
        // if( e.target.name === 'offPopup' ){
        //     this.setState({
        //         offPopup: e.target.checked
        //     })
        // }
      }



    goto() {
        // window.open("/notice.html", "약관 변경사항", "width=800, height=500, left=80, top=50");
    }

    render() {
        var agent = navigator.userAgent.toLowerCase(); 
        return (
            <div className="mainSwipe_wrap">
                <div className="mainSwipe">
                  <div className="title"><img src="/main_img/swipe/title.png"  srcSet="/main_img/swipe/title.png 2x" width="418" /></div>
                    <ul>
                        <li style={this.state.card1} >
                            {
                            ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1))?
                                <a href="/category/99"><img src="/main_img/swipe/card1.png" /></a>
                                :
                                <Link href="/category/99"><img src="/main_img/swipe/card1.png" /></Link>
                            }
                        </li>
                        <li style={this.state.card2} onClick={(e)=>this.setState({card2Open:true})} >
                            <img src="/main_img/swipe/card2.png"  />
                        </li>
                        <li style={this.state.card3} onClick={(e)=>this.setState({card3Open:true})} >
                            <img src="/main_img/swipe/card3.png" />
                        </li>
                    </ul>
                </div>
                <Modal
                    open={this.state.card2Open}
                    onClose={this.handleClose}
                    width={700}
                    height={460}
                    className='swipe_popup'
                >
                    <div className="close-x" onClick={()=>this.handleClose()}><img src="/common/close-x-light-white.svg" /></div>
                    <img src="/main_img/swipe/card2_pop.png"/>                    
                </Modal>
                <Modal
                    open={this.state.card3Open}
                    onClose={this.handleClose}
                    width={700}
                    height={460}
                    className='swipe_popup'
                >
                    <div className="close-x" onClick={()=>this.handleClose()}><img src="/common/close-x-light-white.svg" /></div>
                    <img src="/main_img/swipe/card3_pop.png"/>                
                </Modal>
                {/* <Dialog
                open={this.state.card3Open}
                onClose={this.handleClose}
                className="swipe_card_pop"
                maxWidth="700"
                >
                    <div className="close-x" onClick={()=>this.handleClose()}><img src="/common/close-x-light-white.svg" /></div>
                    <img src="/main_img/swipe/card3_pop.png"/>
                </Dialog> */}
            </div>
        );
    }
}

export default Swipe;
