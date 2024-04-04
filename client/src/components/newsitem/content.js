import React, { Component, Fragment } from 'react';
// import '../../scss/newsitem/newsitem.scss';
import Api from "../../utils/apiutil";
import Moment from 'moment'
class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemShowDefault: 6,
            addItemsToShow: 3,
        };
    }

    componentDidMount() {
        // API.sendPost('/board/press', {}).then((res) => {
        //     if (res.status === 'ok') {
        //         this.setState({
        //             items: res.data.press
        //         })
        //     } else {
        //         window.location.href = '/ ';
        //     }
        // })
        this.getBoardList(1)
    }

    getBoardList = async(page=1) => {
        var params = {
            per:100,
            page:page,
            board:11
        }
        Api.sendPost('/board/list', params ).then(res => {
            console.log( res )
            if( res.data.result !== null ) {
                if( res.data.status === 'ok' & res.data.result.total > 0 ){
                    this.setState({items:res.data.result.rows})
                } 
            }
        })    
    }


    showMore = () => {
        this.setState((prev) => {
            return {itemShowDefault: prev.itemShowDefault + this.state.addItemsToShow};
        });
    };

    render() {
        return (
            <div className='news_item'>
                {
                    this.props.header !== false?
                    <div className="visual">
                        <h1>보도자료</h1>
                        <div>언론에 보도된 로폼의 소식을 전해 드립니다</div>
                    </div>
                    :null
                }
                <section className="wrap">
                    <ul className="card">
                        {
                            (this.state.items.length > 0) &&
                            this.state.items.slice(0, this.state.itemShowDefault).map((item, key) =>
                                <li key={key}>
                                    <div className="cover"><a href={item.media_link} target="_blank"><img src={item.cover} alt={item.title} /></a></div>
                                    <a className='card_content_wrap' href={item.media_link} target="_blank">
                                        <div className='card_title'>{
                                            item.title.split(/\n/g).map((r, key) =>
                                                <Fragment key={key}>
                                                    {r}<br/>
                                                </Fragment>
                                            )
                                            }</div>
                                        <div className='card_content' dangerouslySetInnerHTML={{__html:item.content}}></div>
                                    </a>
                                    <div className='card_bottom'>
                                        <div className='card_bottom_left'>
                                            <div className='link_title'>{item.media}</div>
                                            <div className='link_date'>{Moment(item.displaydatetime).format('YYYY. MM. DD')}</div>
                                        </div>
                                        <a href={item.link} target="_blank"><img src={'/newsitem/button.png'} alt='link button'/></a>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    {
                        (this.state.itemShowDefault < this.state.items.length) &&
                        <div className='view_more' onClick={this.showMore}>
                            <img src={'/newsitem/down_arrow.png'} alt='view more button'/>
                        </div>
                    }
                </section>
            </div>
        )
    }
}

export default Content;