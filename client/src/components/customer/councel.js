import React, { Component } from 'react';
import API from '../../utils/apiutil';
import moment from 'moment';

class Councel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            counselArray:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
       
    }
    componentWillMount() {
        API.sendGet('/customer/counsel/').then((result) => {
            this.setState({
                counselArray:result.data.data
            })
        });
    }
    handleClick(e) {

    }

    showArticle(e,idx) {
    }
    render() {
        return (
            <div>
                <div className="cs-title">
                    <h2>무료 법률상담</h2>
                    <h3>법률상담이 필요하신 분은 상담 신청 버튼을 눌러 신청하세요.<br />해당 서비스는 무료이며, 순차적으로 답변을 드립니다.</h3>
                    <button type="button" >상담신청</button>
                </div>
                <div>
                    <ul>
                    {
                        this.state.counselArray.length > 0 && this.state.counselArray.map((item,key)=>
                        <li>
                            <div onClick={(e)=>this.showArticle(e,item.idx)}>{item.answer}</div>
                            <div>{ moment(item.registerdate).format('Y.MM.DD')}</div>
                        </li>
                        )
                    }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Councel;