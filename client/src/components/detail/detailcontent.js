import React, { Component } from 'react';

class Detailcontent extends Component {

    constructor(props) {
        super(props);
        this.state = { blogUrl: "https://blog.naver.com/amicuslex/221506348669"};
    }

    componentDidMount() {
        if( [24,9,10].indexOf( this.props.iddocuments )!== -1  ){
            this.setState({
                blogUrl:"https://blog.naver.com/amicuslex/221521683972"
            })
        }
    }

    render() {
        let s3Path = "https://s3.ap-northeast-2.amazonaws.com/lawform/";

        return (
            <div >
                <img src={s3Path+"detail_page/"+this.props.iddocuments+"/1.jpg"} alt="문서설명" />
                <img src={s3Path+"detail_page/"+this.props.iddocuments+"/2-1.jpg"} alt="문서설명" />
                <img src={s3Path+"detail_page/"+this.props.iddocuments+"/2-2.jpg"} alt="문서설명" />
                <div className="video_wrap" >
                    <img src={s3Path+"detail_page/"+this.props.iddocuments+"/2-3.jpg"} alt="문서설명" />
                    <iframe title="detail_video" style={{top:97, left:716, position:"absolute", border:0 }} width="430" height="267" src="https://www.youtube.com/embed/0djEPHz1S7E?rel=0&amp;autoplay=1&amp;loop=1&amp;playlist=0djEPHz1S7E" allow="autoplay; encrypted-media"></iframe>
                </div>
                <img src={s3Path+"detail_page/"+this.props.iddocuments+"/3.jpg"} alt="문서설명" />
                <div style={{
                    height:215,
                    width:1440,
                    backgroundImage:"url('"+s3Path+"detail_page/"+this.props.iddocuments+"/4.jpg')",
                    backgroundRepeat:'no-repeat',
                    position:'relative'
                }}
                >
                    <a href={this.state.blogUrl} style={{  position:"absolute", top:148, left: 227}} >
                        <img src={s3Path+"detail_page/"+this.props.iddocuments+"/detail_button_001.png"} alt="콘텐츠 보러가기" />
                    </a>
                }
                </div>
                

            </div>
        );
    }

}

export default Detailcontent;
