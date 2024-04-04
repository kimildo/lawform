import React, { Component } from 'react';
// import ContractsCategory from './contractsCategory';
// import SubContractsCategory from './subContractsCategory';
// import '../../scss/main/newdocs.scss';
import Api from '../../utils/apiutil';

let docuPreviewUrl = 'https://s3.ap-northeast-2.amazonaws.com/lawform/document_preview/'
class Newdocs extends Component {
    componentDidMount() {
        // var params = new URLSearchParams();
        // params.append("max", 8);
        // params.append("order", "registerdate");
        // params.append("sort", "asc");
        Api.sendGet( '/documents/info?max=8&order=priority&sort=desc' )
        .then(res => {
           const category = res.data;

           this.setState(category);
        })
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    userLikeDocument(e,iddocuments, itemIndex) {
        var params = {
            iddocuments: iddocuments
        };

        Api.sendPost( '/documents/like', params )
        .then(res => {
            // var likeStatus =res.data.like;
            // var category = this.state.category;
            // this.state.category[0].subcategory[0].documents[itemIndex].like = likeStatus;
            // this.setState({ category:category });
        })
    }
    categoryLink(linkData,category){
        if( category === 1 )
        window.location.href = "/preview/"+linkData;
        else
        window.location.href = "/detail/"+ linkData;
    }

    subTitle( data , type='') {

        if( ( data.indexOf('(') != -1 ) && ( data.indexOf(')') != -1 )  ) {
            let title = data.split('(')[0];
            let desc = data.split('(')[1];
            desc = desc.split(')')[0];
            if( type === 'subject' )  return desc;
            else 
            return (
                <div className="title">
                    <div>{title}</div>
                    <div>({desc})</div>
                </div>
            );
        } else {
            return (
                <div className="title">
                    <div>{data}</div>
                </div>
            );
        }
    }

    render() {
        const wrap = {
            textAlign: 'center'
        };

        if (this.state.category != null) {
            return (
                <div style={wrap} className="newdocs">
                    <div className="container_wrap" style={{ backgroundColor: '#f9f9f9', paddingTop: 58 }}>
                        <div style={{ color: '#292a2b' }}>
                            <div style={{ fontSize: 40, fontWeight: 500 }}>신규 업데이트 문서</div>
                            <div style={{ fontSize: 22, marginTop: 26 }}>자동작성이 가능한 신규문서 업데이트</div>
                        </div>
                        <div>
                            <div className="item">
                                <div className="item_row">
                                    {
                                        this.state.category.map((Items) =>
                                            Items.subcategory.map((SubItems) =>
                                                SubItems.documents.map((Data, itemIndex) =>
                                                    <div className="item_image" key={itemIndex}>
                                                        <div className="item_hover" onClick={() => this.categoryLink(Data.iddocuments,Data.category)}>
                                                            <div className="icons">
                                                                { this.state.category.likeShow === true && (
                                                                <svg  width="24" height="24" viewBox="0 0 24 24" className="svg-like" onClick={(e) => { this.userLikeDocument(e,Data.iddocuments, itemIndex) }} >
                                                                    <g fill={  Data.like ? '#ee1f1e' : '#FFF'  } fill-rule="evenodd">
                                                                        <path fill-opacity=".01" d="M0 0h24v24H0z" opacity=".5"/>
                                                                        <path fill-rule="nonzero" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28z"/>
                                                                    </g>
                                                                </svg> 
                                                                ) }
                                                            </div>
                                                            <div className="contents">
                                                                <div className="subject">{ this.subTitle( Data.title , 'subject')}
                                                                </div>
                                                                <hr />
                                                                <div className="desc" style={{ WebkitBoxOrient: "vertical" }}>
                                                                    {Data.description[0].context}
                                                                </div>
                                                                <a className="more" href={"/detail/" + Data.iddocuments} ><img src="/main_img/more-btn-tr.png" alt="더보기" /></a>
                                                            </div>
                                                            {
                                                                (Data.category === 1)?
                                                                <a className="item_write_btn" href={"/preview/" + Data.iddocuments}>법률문서 작성하기</a>
                                                                :
                                                                <a className="item_write_btn" href={"/detail/" + Data.iddocuments}>법률문서 작성하기</a>
                                                            }
                                                        </div>
                                                        <img src={docuPreviewUrl + Data.category + '.svg'} alt="document_image" width="270" height="345"  className="document_image"/>
                                                        { this.subTitle( Data.title) }
                                                    </div>
                                                )
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else return (<div></div>);
    }
}

export default Newdocs;
