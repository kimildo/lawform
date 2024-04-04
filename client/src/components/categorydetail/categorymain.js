import React, { Component } from 'react';
// import Carousel from 'nuka-carousel';
import Link from 'next/link';
// import '../../scss/autoform/autoformtitle.scss';
import API from '../../utils/apiutil';
import { Helmet } from "react-helmet"

let docuPreviewUrl = 'https://s3.ap-northeast-2.amazonaws.com/lawform/document_preview/'
let catePageUrl = 'https://s3.ap-northeast-2.amazonaws.com/lawform/category_page/'

class Categorymain extends Component {

    updateServer(category) {

        API.sendGet('/documents/category/' + category)
            .then(res => {
                if (!!res.data[0]) {
                    const documentData = res.data;
                    const categoryData = res.data[0];
                    console.log(categoryData);
                    if (categoryData.description) {
                        for (var i = 0; i < categoryData.description.length; i++) {
                            categoryData.description[i].descOpen = false;
                        }
                        categoryData.description[0].descOpen = true;
                    }
                    this.setState({
                        cateData: categoryData,
                        docuData: documentData
                    });
                }
                else {
                    window.location.href = '/';
                }
            })
    }

    componentDidMount() {
        let category = this.props.category;
        this.updateServer(category);
    }

    shouldComponentUpdate(nextProps) {
        let category = nextProps.category;
        if (nextProps.category !== this.props.category) {
            this.updateServer(category);
            return true;
        }
        else {
            return true;
        }
    }

    josa() {
        let txt = this.state.cateData.name;
        let code = txt.charCodeAt(txt.length - 1) - 44032;

        // 원본 문구가 없을때는 빈 문자열 반환
        if (txt.length === 0) return '';

        // 한글이 아닐때
        if (code < 0 || code > 11171) return txt;

        if (code % 28 === 0) {
            return '는';
        }
        else {
            return '은';
        }

    }

    categoryLink(linkData){
        if( linkData === 25 ) window.location.href = "/preview/"+ linkData;
        else window.location.href = "/detail/"+ linkData;
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

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!!this.state.cateData) {
            if (!!this.state.docuData) {                
                let meta_title;              
                let title;
                let description;
                let keyword;
                switch (this.props.category) {
                    case '1':
                        meta_title = '전문변호사가 만든 저렴한 내용증명 자동작성';
                        title = '로폼 - ' + meta_title;
                        description = '전문 변호사가 작성한 각종 내용증명 양식! 온라인에서 쉽고 저렴한 자동작성! 50%할인';
                        keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                    break;
                    
                    case '2':
                        meta_title = '전문변호사가 만든 저렴한 위임장 자동작성';
                        title = '로폼 - ' + meta_title;
                        description = '전문 변호사가 작성한 각종 위임장 양식, 온라인상에서 전문적인 자동작성, 무료 작성';
                        keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                    break;

                    case '3':
                        meta_title = '전문변호사가 만든 저렴한 지급명령 자동작성';
                        title = '로폼 - ' + meta_title;
                        description = '전문 변호사가 작성한 각종 지급명령 양식! 온라인에서 쉽고 저렴한 자동작성! 50%할인 ';
                        keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                    break;

                    case '4':
                        meta_title = '전문변호사가 만든 저렴한 합의서 자동작성';
                        title = '로폼 - ' + meta_title;
                        description = '전문 변호사가 작성한 각종 합의서 양식, 온라인에서 전문적이고 저렴한 자동작성, 50%할인';
                        keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                    break;
                }
                return (
                    <div>
                        <div className="detailmiddle">
                            <div className="category_header">
                            <img src={catePageUrl + 'banner' + this.props.category + '_1.jpg'} alt="document_image"/>
                            <img src={catePageUrl + 'banner' + this.props.category + '_2.jpg'} alt="document_image" style={{marginTop:'-4px', padding:0}}/>
                        </div>
                            {/* <Carousel autoplay={true} wrapAround={true}>
                                <div className="category_description" >
                                    <div className="description_title">
                                        {this.state.cateData.name}{this.josa()} <br></br>왜 필요 한가요?
                                    </div>
                                    <div className="description_index">1  <span className="description_length">/ {this.state.cateData.description.length}</span></div>
                                    <div className="description_context">
                                        {this.state.cateData.description.map((description, descriptionKey) =>
                                            <div className="description_wrap">
                                                <span className="description_num">{descriptionKey + 1}</span> <div className="description_text">{description.context}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="category_description" >
                                    <div className="description_title">
                                        왜 로폼의 <br></br>{this.state.cateData.name}인가요?
                                    </div>
                                    <div className="description_index">2<span className="description_length">/ {this.state.cateData.description.length}</span></div>
                                    <div className="description_context">
                                        <div className="description_text_1" dangerouslySetInnerHTML={{ __html: this.state.cateData.description_1 }}>
                                        </div>
                                    </div>
                                </div>
                            </Carousel> */}
                        </div>
                        <div className="detailmiddle">
                            <div>
                                <div className="category_wrap">
                                    <div className="category_number">
                                        <p>총 <span className="number">{this.state.docuData.length}</span> 개의 문서가 있습니다.</p>
                                    </div>
                                    <a className="category_whole" href="#category">
                                        {/* <img src="/category_img/category_all.png" alt="category_all" /> */}
                                    </a>
                                </div>
                                {/* <div className="category_borderbottom">
                                </div> */}
                            </div>
                            <div className="item">
                                <div className="item_row">
                                    {this.state.docuData.map((documentData, docuKey) =>
                                        <div className="item_image" key={docuKey} >
                                            <div className="item_hover" onClick={() => this.categoryLink(documentData.iddocuments)}>
                                                <div className="contents">
                                                    <div className="subject">
                                                        { this.subTitle( documentData.title , 'subject' )}
                                                    </div>
                                                    <hr></hr>
                                                    <div className="desc">
                                                    <span dangerouslySetInnerHTML={{ __html: documentData.des[0].context}} />
                                                    </div>
                                                    <Link href={( (documentData.iddocuments === 25 )?"/preview/":"/detail/" )+ documentData.iddocuments} className="more" ><img src="/main_img/more-btn-tr.png" alt="더보기" /></Link>
                                                </div>
                                                <Link href={( (documentData.iddocuments === 25 )?"/preview/":"/detail/" ) + documentData.iddocuments}><button className="item_write_btn" >법률문서 작성하기</button>
                                                </Link>
                                            </div>
                                            <img src={docuPreviewUrl + documentData.idcategory_1 + '.svg'} alt="document_image" width="270" height="345" className="document_image"/>
                                            {  this.subTitle(documentData.title) }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div id="category" className="white_content">
                            {/* <div className="x_btn">
                                <a href="#close">
                                    <img src="/autoform_img/x_btn.png" width="48" height="48" alt="x_btn"></img>
                                </a>
                            </div> */}
                            
                            <div className="category_modal">
                                <div className="title">전체카테고리</div>
                                <a className="x_over" href="javascript:history.back();">
                                    <img src="/autoform_img/over.png" srcSet="/autoform_img/over@2x.png 2x,/autoform_img/over@3x.png 3x" alt="x_btn"></img>
                                </a>
                                <table className="wrap_list">
                                    <tbody>
                                        <tr>
                                            {this.state.cateData.cateList.map((list, listKey) =>
                                                <td href={"/categorydetail/" + list.idcategory_1} className="list" key={listKey}>
                                                    {/* <a href={"/categorydetail/" + list.idcategory_1} className="list" key={listKey}> */}
                                                        {list.name}
                                                    {/* </a> */}
                                                </td>
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        {/* <Signin></Signin> */}
                            
                        </div>
                    </div>
                );
            } else return (<div></div>);
        } else return (<div></div>);
    }
}

export default Categorymain;