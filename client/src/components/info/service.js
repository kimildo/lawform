import React, { Component } from 'react'
import { Helmet } from "react-helmet"
import Carousel from 'nuka-carousel'
import Modal from '../common/modal'
// import '../../scss/info/service.scss'

class Serviceinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMemberIntro:false
        }
    }

    render() {
        return (
            <div className="service_info">
                <div className="visual">
                    <h1>서비스 소개</h1>
                    <div>변호사가 작성한 것처럼 법률문서를 자동으로 완성해 드립니다</div>
                </div>
                <div className="section">
                    <img src="/info_img/service-section-1.jpg"></img>
                    <ul className="categorys">
                        <li>
                            <img src="/info_img/category-thumb-1.jpg" className="thumb" />
                            <div className="category">내용증명</div>
                            <a href="/category/1" className="more" ></a>
                        </li>
                        <li>
                            <img src="/info_img/category-thumb-3.jpg" className="thumb" />
                            <div className="category">지급명령</div>
                            <a href="/category/3" className="more" ></a>
                        </li>
                        <li>
                            <img src="/info_img/category-thumb-4.jpg" className="thumb" />
                            <div className="category">합의서</div>
                            <a href="/category/4" className="more" ></a>
                        </li>
                        <li>
                            <img src="/info_img/category-thumb-99.jpg" className="thumb" />
                            <div className="category">기업문서</div>
                            <a href="/category/99" className="more" ></a>
                        </li>
                    </ul>
                </div>
                <div className="section carousel">
                    <Carousel
                        autoplay={true}
                        wrapAround={true}
                        withoutControls={false}
                    >
                        <div className="swipe"></div>
                        <div className="swipe"></div>
                        <div className="swipe"></div>
                        <div className="swipe"></div>
                    </Carousel>
                </div>
                <div className="section">
                    <img src="/info_img/service-section-2.jpg" useMap='#section-2'></img>
                    <map name="section-2" >
                        <area shape="rect" coords="1113,951,975,914" href="/mydocument" ></area>
                    </map>
                </div>
                <div className="section bottom banner">
                    <div className="member-intro" onClick={()=>this.setState({showMemberIntro:true})}>
                        <img src="/info_img/btn-member-intro.svg" />
                    </div>
                    <Modal
                        open={this.state.showMemberIntro}
                        onClose={(e)=> this.setState({showMemberIntro:false})}
                        width={780}
                        height={535}
                        className="show-member-intro"
                        scroll="body"
                        >
                            <div className="default-dialog-title" style={{textAlign:'left'}}>대표 변호사 소개
                                    <span className="close" onClick={(e)=> this.setState({showMemberIntro:false})} ><img src="/common/close-white.svg" /></span>
                            </div>
                            <div className="content">
                                <img src="/info_img/member-intro-pop.jpg" />
                            </div>
                            <div style={{width:'100%',height:15,backgroundColor:'#15376C'}}>

                            </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Serviceinfo;
