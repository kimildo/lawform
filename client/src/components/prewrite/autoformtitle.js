import React, { Component } from 'react';
// import '../../scss/autoform/autoformtitle.scss';
import API from '../../utils/apiutil';
import User from '../../utils/user';
import { withAutoformContext } from '../../contexts/autoform';
import jQuery from "jquery";
import { Helmet } from "react-helmet";
window.$ = window.jQuery = jQuery;
class AutoformTitle extends Component {

    updateServer(document) {
        if( !(  ( window.location.hostname === 'localhost' || window.location.hostname === 'dev.lawform.io') && document === 'dropfile') ) {
            API.sendGet('/writing/loadinfo/' + document)
                .then(res => {
                    const documentData = res.data;
                    if(documentData[0] == null){
                        alert('비정상적인 접근입니다. /');
                        window.location.href = "/" ;
                    }
                    if(documentData[0].sysdate > documentData[0].expiredate){
                        alert('만료기간이 지났습니다.');
                        window.location.href = "/mydocument" ;
                    }
                    

                    this.setState({
                        docuData: documentData
                    });
                })
        }
    }

    componentDidMount() {
        let document = this.props.document;
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert('비정상적인 접근입니다.');
            window.location.href = "/" ;        
        }
        this.updateServer(document);
    }

    saveData = () => {
        let checklist = [];

        if(!!this.props.necessaryData){
            let check_target = []; 
            for (let i = 0; i < this.props.necessaryData.length; i++) {
                if(!this.props.bindData[this.props.necessaryData[i]]){
                    checklist.push(this.props.necessaryData[i]);
                }
                else{
                check_target = document.getElementsByName(this.props.necessaryData[i]);
                    if(check_target[0].type === 'text'){
                        check_target[0].parentElement.parentElement.style.border="solid #878d91 1px";
                        check_target[0].style.border="solid #878d91 0px";
                    }
                }
            }
            let target = document.getElementsByName(checklist[0]);
            if ( target && target.length > 0 )  
            {
                if(target[0].type === 'text'){
                    target[0].parentElement.parentElement.style.border="solid red 1px";
                }
                else{
                    target[0].style.border="solid red 1px";
                }
                target[0].focus();
            alert('필수항목을 입력해주세요!');
            }
        }
       
        if(!checklist[0]){
            let document = this.props.document;
            var params = {
                bindData: this.props.bindData,
                document: document
            } 
            var a4_html = window.$("#output_a4").html();
            
            var html = {
                html:a4_html,
                idwriting:document,
                iddocuments:this.state.docuData[0].iddocuments,
                idcategory_1 : this.state.docuData[0].idcategory_1,
                bindData: this.props.bindData
            }
            API.sendPost( "/print/createpdf", html )
            .then(res => {
                var pdf = res.data.data;
                return pdf
            }).then((pdf)=>{
                params.file = pdf
                // console.log('pdf',params)
                API.sendPost('/writing/writingdata/' , params).then((res)=> {
                
                    let r = window.confirm('저장이 완료 되었습니다. 내 문서 보관함으로 이동 하시겠습니까?');
                    if (r === true) {
                        window.location.href = "/mydocument" ;
                    }
                }).catch((err)=> {
                    window.alert("저장에 실패 하였습니다.");
                });
            });        
        }
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.props.setBindData();
    }



    render() {
        if (!!this.state.docuData) {
            let meta_title;              
            let title;
            let description;
            let keyword;
            switch (this.state.docuData[0].idcategory_1) {
                case 1:
                    meta_title = '전문변호사가 만든 저렴한 내용증명 자동작성';
                    title = '로폼 - ' + meta_title;
                    description = '전문 변호사가 작성한 각종 법률문서, 계약서 양식. 온라인상에서 저렴한 자동작성 가능!';
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                break;
                
                case 2:
                    meta_title = '전문변호사가 만든 저렴한 위임장 자동작성';
                    title = '로폼 - ' + meta_title;
                    description = '전문 변호사가 작성한 각종 위임장 양식, 온라인상에서 전문적인 자동작성, 무료 작성';
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                break;
                
                case 3:
                    meta_title = '전문변호사가 만든 저렴한 지급명령 자동작성';
                    title = '로폼 - ' + meta_title;
                    description = '전문 변호사가 작성한 각종 지급명령 양식! 온라인에서 쉽고 저렴한 자동작성! 50%할인 ';
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                break;
                
                case 4:
                    meta_title = '전문변호사가 만든 저렴한 합의서 자동작성';
                    title = '로폼 - ' + meta_title;
                    description = '전문 변호사가 작성한 각종 합의서 양식, 온라인에서 전문적이고 저렴한 자동작성, 50%할인';
                    keyword = '로폼,계약서,법률문서,내용증명,위임장,합의서,소송,지급명령,빌려준돈';
                break;
                default:
            }

            return (
                <div className="wrap_autoform_title">
                        {/*<Helmet
                            title = {title}
                            meta={[
                                { "name": "title", "content": meta_title },
                                { "name": "description", "content": description },
                                { "name": "keyword", "content": keyword },
                                //   {property: "og:type", content: "article"},
                                //   {property: "og:title", content: "Example title"},
                                //   {property: "og:image", content: "http://example.com/article.jpg"},
                                //   {property: "og:url", content: "http://lawform.io"}
                            ]}
                        />*/}
                    <div className="autoform_title">
                        <div className="wrap_autoform_title_main">
                            <h1>{this.state.docuData[0].title}</h1>
                            <span className="subheading">{this.state.docuData[0].description[0].context}</span>
                        </div>
                    </div>
                </div>
            ); 
        }
        else {
            return(<div></div>);
        }
    }
}

export default withAutoformContext(AutoformTitle);