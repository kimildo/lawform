import React, {Component, Fragment} from 'react';
import { Helmet } from "react-helmet"
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router'

const Header = dynamic(() => import('../../components/common/header_new'),{ssr:false})
const Labor = dynamic(() => import('../../components/event/labor'),{ssr:false})
const HappyLaw = dynamic(() => import('../../components/event/happylaw'),{ssr:false})
const Saramin = dynamic(() => import('../../components/event/saramin'),{ssr:false})
const Thankyou = dynamic(() => import('../../components/event/thankyou'),{ssr:false})
const Attoney = dynamic(() => import('../../components/event/attoneysvc'),{ssr:false})
const Footer = dynamic(() => import('../../components/common/footer'),{ssr:false})
// import '../scss/event.scss';

class Event extends Component {
    static async getInitialProps({router}) {
        return { }
    }
    constructor(props) {
        console.log( 'props' , props , props.router.query.event)
        super(props);
        this.state = {
            event:props.router.query.event
        };
    }

    componentWillMount() {
        // console.log( 'event', this.props.match.params.event );
    }

    render() {

        return (
            <div className="event">
                    {
                        ( !!this.state.event &&  this.state.event === 'labor')&&
                        <Fragment>
                            <Header></Header>
                                <Labor></Labor>
                            <Footer></Footer>
                        </Fragment>
                    }
                    {
                        ( !!this.state.event &&  this.state.event === 'happylaw')&&
                        <Fragment>
                            <Header></Header>
                                <HappyLaw></HappyLaw>
                            <Footer></Footer>
                        </Fragment>
                    }
                    {
                        ( !!this.state.event &&  this.state.event === 'company')&&
                        <Fragment>
                            <Header></Header>
                            <Saramin></Saramin>
                        </Fragment>
                    }
                    {
                        ( !!this.state.event &&  this.state.event === 'thankyou')&&
                        <Fragment>
                            <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                            <Header theme='dark' styles={{position:'absolute'}}/>
                            <Thankyou></Thankyou>
                        </Fragment>
                    }
                    {
                        ( !!this.state.event &&  this.state.event === 'attoney')&&
                        <Fragment>
                            <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                            {/* <Header theme='dark' styles={{position:'absolute'}}/> */}
                            <Attoney  mobile={true} ></Attoney>
                        </Fragment>
                    }

            </div>
        );
    }
};

export default withRouter( Event );