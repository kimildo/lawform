import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from '../../../utils/user'
import Docs from './docs'
import Category from './category'
import Payment from './payment'
import Services from './services'
import Progress from './solution/progress'

// import Product from './product'

class Main extends Component {

    constructor (props) {
        super(props)

        this.state = {
            userSubscription: null
        }
        this.userInfo = User.getInfo()
    }

    componentDidMount () {
        User.getSubscription().then(result => {
            if (!!result) {
                this.setState({
                    userSubscription: result
                })
            }
        })
    }

    render () {
        return (
            <div className="main">
                <div className="visual">
                    <h1>스타트업 프로그램</h1>
                    <div></div>
                </div>
                {this.state.userSubscription !== null ?
                    <Docs userSubscription={this.state.userSubscription}/>
                    :
                    null
                }
                <Progress/>
                <Services/>
            </div>
        )
    }
}

export default Main
