import React, {Component} from 'react';
// import '../../scss/autoform/autoformsave.scss';
import API from '../../utils/apiutil';
import {withAutoformContext} from '../../contexts/autoform';
import jQuery from "jquery";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
                <div className="wrap_autoform_save mobile_hide">
                    <Dialog
                        open={this.state.alertEdit}
                        onClose={(e)=> this.setState({alertEdit:false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_edit"
                        scroll="body"
                    >
                        <DialogTitle id="confirmation-dialog-title">문서 편집</DialogTitle>
                        <label>꼭 읽어 주세요!</label>
                        <ul>
                            <li>문서 편집은 좌측 질문지 전체를 <br />입력하신 경우에 이용하시기를 권장 합니다.</li>
                            <li>문서편집 기능을 통해 편집을 완료한 경우<br />좌측 질문지 내용 입력/수정이 불가능 합니다.</li>
                            <li>이후 수정은 문서편집 기능을 통해서만 가능합니다.</li>
                        </ul>
                        <DialogActions className="buttons" >
                            <Button 
                                onClick={(e)=> this.setState({alertEdit:false})}
                                color="primary"
                                className="cancel">
                                취소
                            </Button>
                            <Button 
                                onClick={(e) => {
                                    this.props.setEditable();
                                    this.setState({alertEdit:false})
                                }}
                                color="primary"
                                className="ok">
                                편집하기
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.alertSave}
                        onClose={(e)=> this.setState({alertSave:false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_save"
                        scroll="body"
                    >
                        <div>변경된 내용으로 저장하시겠습니까?</div>
                        <DialogActions className="buttons" >
                            <Button 
                                onClick={(e)=> this.setState({alertSave:false})}
                                color="primary"
                                className="cancel">
                                아니오
                            </Button>
                            <Button 
                                onClick={(e) => {
                                    this.props.setEditable();
                                    this.setState({alertSave:false});
                                }}
                                color="primary"
                                className="ok">
                                네
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.alertNew}
                        onClose={(e)=> this.setState({alertNew:false})}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="alert_new"
                        scroll="body"
                    >
                        <div>문서를 새로 작성하시겠습니까?<br />새로 작성 하시는 경우 기존 문서는 저장되지 않습니다</div>
                        <DialogActions className="buttons" >
                            <Button 
                                onClick={(e)=> this.setState({alertNew:false})}
                                color="primary"
                                className="cancel">
                                아니오
                            </Button>
                            <Button 
                                onClick={(e) => {
                                    this.setClearDoc();
                                    this.setState({alertNew:false});
                                }}
                                color="primary"
                                className="ok">
                                네
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <h3>문서 작성하기</h3>
                    <div className="buttons">
                        <Button className={'disabled'} >
                            새로작성
                            <img src="/autoform_img/icon-new.svg" alt="새로작성 아이콘" />
                        </Button>
                        {/* 
                        <Button className={'disabled'}>
                            편집하기
                            <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘" />
                        </Button>
                        <Button className={'disabled'}>
                            저장하기
                            <img src="/autoform_img/icon-save.svg" alt="저장하기 아이콘" />
                        </Button> */}
                        <Button className={'disabled'}>
                            수정요청
                            <img src="/autoform_img/icon-edit-s.svg" alt="문서수정 아이콘" />
                        </Button>
                        <Button className={'disabled'}>
                            인쇄하기
                            <img src="/autoform_img/icon-print.svg" alt="인쇄하기 아이콘" />
                        </Button>
                        <Button className={'disabled'}>
                            다운로드
                            <img src="/autoform_img/icon-download.svg" alt="다운로드 아이콘" />
                        </Button>
                        {([1, 3, 99].indexOf(this.props.category) > -1 && [2, 4, 6, 8, 11, 12, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 70].indexOf(parseInt(this.props.document)) === -1) &&
                        <a href={'/instructions/' + this.props.document} className="instructions">
                            <img src="/autoform_img/doc-int.png" alt="문서 상세설명 "/>
                            <div className="balloon">
                                <img src="/autoform_img/doc-int-pop.png" alt="문서 상세설명 "/>
                            </div>
                        </a>
                        }

                    </div>
                    {/* <div className={"autoform_editable_btn "+( (this.props.btnEditable  === 'true' )?"editabled":"")} style={{opacity:0.4,cursor:'default'}} >
                        <img src={(this.props.btnEditable  === 'true' )?"/autoform_img/icon-doc-save.svg":"/autoform_img/icon-doc-edit.svg"} alt={(this.props.btnEditable  === 'true' )?'편집완료':'문서편집'} />
                    </div> */}
                </div>
            ); 
    }
}

export default withAutoformContext(AutoformTitle);