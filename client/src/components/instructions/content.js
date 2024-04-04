import React, {Component, Fragment} from 'react';
import Link from 'next/link';
// import '../../scss/instructions/common.scss';
import Data from './data';
import API from "../../utils/apiutil";
import NumberFormat from "react-number-format";
import Payment from "../common/payment"
import Paylawyer from "../common/paylawyer"

import User from '../../utils/user';
import ReactGA from 'react-ga';
import Certifications from "./certifications";
import PaymentOrder from "./paymentOrder";
import Company from "./company";

import {
    metaDataAgreement,
    metaDataAuthority,
    metaDataPayment,
    metaDataProof,
    metaDataStartup,
} from '../common/metas';
import Router from 'next/router';

class Content extends Component {
    constructor(props) {
        super(props);
        if (Data[this.props.document] === undefined) {
            window.location.href = '/';
        }
        this.state = {
            document: this.props.document,
            data: Data[this.props.document],
            scrollPosition: 0,
            balloonClass: "balloon animated bounce",
            category: 0,
            docData: {
                idcategory_1: 1,
                dc_rate:50
            },
            firstPayment:false,
            firstPrice:0,
            paymentEvent:null
        };

        this.fixedIconRef = React.createRef();

    }


    getPayCount() {
        var params = {

        }
        API.sendPost('/payments/count', params).then((res) => {
            if( res.data.data.count < 1 ) {
                this.setState({
                    firstPayment:true,
                    firstPrice:14900,
                    paymentEvent:"firstPayment"
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.getPayCount();

        window.addEventListener('scroll', this.listenToScroll);
        setTimeout(() => {
            this.setState({balloonClass: "balloon"});
            setInterval(() => {
                    if (this.state.balloonClass === "balloon animated bounce") {
                        this.setState({balloonClass: "balloon"});
                    } else {
                        this.setState({balloonClass: "balloon animated bounce"});
                    }
                },
                2500
            );
        }, 1500);

        API.sendGet('/documents/document/' + this.props.document)
            .then(res => {
                this.setState({
                    docData: res.data[0],
                    category: res.data[0].idcategory_1
                });
                // console.log( res )
            })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll);
    }

    listenToScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = winScroll / height;
        this.setState({scrollPosition: scrolled,})
    };

    loginCheckBeforePayment = () => {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert("로그인 후 구매하여 주세요.");
            window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            this.setState({
                dialogOpen: true
            })
        } else {
            window.location.href = '#payment';
            ReactGA.pageview(window.location.pathname + '#payment', null, '문서 결제');
        }
    };

    paymentReturn( result ) {
        console.log( "payment return" , result )
    }

    render() {
        let docData = this.state.docData;
        let data = this.state.data;
        let category = this.state.category;
        let cssFolder = {1: 'certifications', 3: 'paymentorder', 99 : 'company'};
        let MetaData = {};
        switch (Number(category)) {
            case 2: /** 위임장 */
            MetaData = metaDataAuthority;
                break;
            case 3: /** 지급명령 */
            MetaData = metaDataPayment;
                break;
            case 4: /** 합의서 */
            MetaData = metaDataAgreement;
                break;
            case 99: /** 기업문서 */
            MetaData = metaDataStartup;
                break;
            default:
                MetaData = metaDataProof;
        }

        return (
            <Fragment>
                <div className='instructions'>
                    <div className="top_img" style={{background: data.topImageUrl}}>
                        <div className="image_content">
                            <div className='left_content' style={{float: 'left', marginTop: '72px'}}>
                                <div className="top_bread_crumb">
                                    <a href='/' style={{color: '#4e4e4e'}}>HOME</a> &gt;
                                    <a href={'/category/' + category} style={{color: '#4e4e4e'}}>{docData.name}</a> &gt; {data.title}
                                </div>
                                <div className="img_text_1">{data.title}</div>
                                <div className="img_text_2">{data.description}</div>
                                <div className="subImage_content"><img src='/instructions/certifications/icon-1.svg'/>{data.topImageText[0]}</div>
                                {
                                    (data.topImageText[1] !== undefined) && <div className="subImage_content" style={{marginTop: '26px'}}><img src='/instructions/company/icon_2.svg'/>{data.topImageText[1]}</div>
                                }
                            </div>
                            <div className="right_content">
                                <div style={{margin: '30px 0 0 34px'}}>
                                    <div className='text_1'>지금 구매하면</div>
                                    <div className='text_2'>{this.state.docData.dc_rate}% <span>할인까지!</span></div>
                                    {/* <Link href="/event/happylaw" className="event-banner"><img src ="/images/event/happylaw/happylaw-pop.png" /> </Link> */}
                                    <div className='text_3'><NumberFormat value={docData.price} displayType={'text'} thousandSeparator={true}/> 원</div>
                                    <div className='text_4'><NumberFormat value={docData.dc_price} displayType={'text'} thousandSeparator={true}/> 원</div>
                                </div>
                                <div onClick={(e) => Router.push('/preview/'+data.docNum) }><img src='/instructions/certifications/icon-3.svg' style={{marginTop: '20px', cursor: 'pointer'}}/></div>
                                {/* <img className={this.state.balloonClass} src='/instructions/certifications/icon-2.svg' style={{marginTop: '19px', cursor: 'pointer'}}
                                     onClick={() => window.location.href = '/preview/' + data.docNum}/> */}
                                {/* {
                                    ( this.state.firstPayment === true || !User.getInfo() )?
                                    <div className="pop_firstPayment" ><img  src="/images/event/first-payment.png"  /></div>
                                    :null
                                } */}

                            </div>
                        </div>
                    </div>
                    {
                        (() => {
                            if (category === 1) return <Certifications data={data} docData={docData} scrollPosition={this.state.scrollPosition} fixedIconRef={this.fixedIconRef}/>;
                            if (category === 3) return <PaymentOrder data={data} docData={docData} scrollPosition={this.state.scrollPosition} fixedIconRef={this.fixedIconRef}/>;
                            if (category === 99) return <Company data={data} docData={docData} scrollPosition={this.state.scrollPosition} fixedIconRef={this.fixedIconRef}/>;
                        })()
                    }
                    <Payment iddocument={this.props.document} docData={docData} bindData={null} loginCheckBeforePayment={this.loginCheckBeforePayment}/>
                </div>
            </Fragment>
        )
    }
}

export default Content