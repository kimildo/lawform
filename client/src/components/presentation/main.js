import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import ReactFullpage from '@fullpage/react-fullpage';
import User from '../../utils/user';
import Signin from '../common/signin';
import Finduser from '../common/finduser';
import Findpw from '../common/findpw';

const Kakao = window.Kakao;
Kakao.init('b8894f1cf748dca42f8d4c020772743e');

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = { 
        };

        this.shareUrl = window.location.origin + "/startup#inspection";
        this.userInfo = User.getInfo();
    }
    componentDidMount() {
      if( !this.userInfo ) {
        window.location.href = "#signin";
      }
    }


    sendLink() {

        Kakao.Link.sendDefault({
          objectType: 'feed',
          content: {
            title: '스타트업 실사',
            description: '#로폼 #법률 #실사 #스타트업',
            imageUrl: 'https://lawform.io/common/share.jpg',
            link: {
              mobileWebUrl: this.shareUrl,
              webUrl: this.shareUrl
            }
          },
          social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: this.shareUrl,
                webUrl: this.shareUrl
              }
            }
          ]
        });
      }
    
    
    render() {
        var pts = ['02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'];
        return (
            <div className="main">
                <div className="shareKakao" onClick={ () => this.sendLink() }><img src="/common/icon-kakao.svg" alt="kakao link" /></div>
	                <section>
						<div className="mobile_hide"><img src={`/images/presentation/1/01.svg`} /></div>
						<div className="mobile"><img src ={`/images/presentation/1/m/01.svg`} /></div>
    	            </section>  
                {
					!!this.userInfo?
                    pts.map((item, key) =>
                    <section>
                        <div className="mobile_hide"><img src={`/images/presentation/1/${item}.svg`} /></div>
                        <div className="mobile"><img src ={`/images/presentation/1/m/${item}.svg`} /></div>
                    </section>                    
                    ):null
                }
            </div>
        );
    }
}

export default Main;
