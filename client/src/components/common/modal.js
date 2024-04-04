import React, { Component } from 'react';
// import '../../scss/common/modal.scss';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            style : {
                wrapOverflowY:`scroll`,
            },
            show:'none',
            width: 0,
            height: 0
        }
        this.modal = React.createRef();
    }

    componentDidMount() {
        this.setBody( this.props.open );
    }

    componentWillReceiveProps(nextProps) {
        if( this.props.open !== nextProps.open )
        this.showModal( nextProps )
        this.setBody( nextProps.open )
    }

    showModal( props ){

        let show = ( props.open === true ) ? 'block' : 'none'
        let left = 'calc( 50% - '+( props.width / 2)+'px )';
        // var top = (!!props.height)?'calc( 50% - '+( props.height / 2)+'px )':'auto';
        let height = (!!props.height)?props.height:null;
        let style = {
            left:left,
            // top:top,
            width:props.width,
            height:props.height,
            marginTop: !!props.marginTop?props.marginTop:50,
            marginBottom: !!props.marginBottom?props.marginBottom:50,
            zIndex:1
        }
        this.setState({
            show:show,
            style:style
        })
    
    }

    componentWillMount(){
        // document.body.style.backgroundColor = "green";
            //Access the node here and get the width
         
    }



    setBody(open) {
        if( open === true ){
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = null;
        }
    }

    render() {
        return (
            <div className="modal_wrap" style={{display:this.state.show, overflowY: 'auto'}}>
                <div className={"modal "+this.props.className}  style={this.state.style} ref={this.modal}  >
                    {
                        (this.props.open)&&this.props.children
                    }

                </div>
                <div className="background" onClick={this.props.onClose} style={{position:'fixed'}}></div>
            </div>
        );
    }
}
export default Modal;
