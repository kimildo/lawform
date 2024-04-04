import React, { Component } from 'react';
import '../../scss/autoform/autoformsave.scss';
import API from '../../utils/apiutil';
import User from '../../utils/user';
import { withAutoformContext } from '../../contexts/autoform';
import jQuery from "jquery";
import { Helmet } from "react-helmet";
window.$ = window.jQuery = jQuery;
class AutoformTitle extends Component {

    componentDidMount() {

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


            return (
                <div className="wrap_autoform_save">
                    <h3>문서 작성하기</h3>
                    <div className="buttons ie">
                        {/* <button className={'disabled'} >
                            새로작성
                            <img src="/autoform_img/icon-new.svg" alt="새로작성 아이콘" />
                        </button>
                        <button className={'disabled'}>
                            편집하기
                            <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘" />
                        </button>
                        <button className={'disabled'}>
                            저장하기
                            <img src="/autoform_img/icon-save.svg" alt="저장하기 아이콘" />
                        </button> */}
                        <button className={'disabled'} >
                            수정요청
                            <img src="/autoform_img/icon-new.svg" alt="새로작성 아이콘" />
                        </button>
                        <button className={'disabled'}>
                            인쇄하기
                            <img src="/autoform_img/icon-print.svg" alt="인쇄하기 아이콘" />
                        </button>
                        <button className={'disabled'}>
                            다운로드
                            <img src="/autoform_img/icon-download.svg" alt="다운로드 아이콘" />
                        </button>
                        <a href={"/instructions/"+this.props.document} className="instructions" >
                            <img src="/autoform_img/doc-int.png" alt="문서 상세설명 " />
                            <div className="balloon">
                                <img src="/autoform_img/doc-int-pop.png" alt="문서 상세설명 " />
                            </div>
                        </a>
                    </div>
                    {/* <div className={"autoform_editable_btn "+( (this.props.btnEditable  === 'true' )?"editabled":"")} style={{opacity:0.4,cursor:'default'}} >
                        <img src={(this.props.btnEditable  === 'true' )?"/autoform_img/icon-doc-save.svg":"/autoform_img/icon-doc-edit.svg"} alt={(this.props.btnEditable  === 'true' )?'편집완료':'문서편집'} />
                    </div> */}
                </div>
            ); 
    }
}

export default withAutoformContext(AutoformTitle);