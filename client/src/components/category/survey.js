import React, { Component, Fragment } from 'react';
import User from '../../utils/user';
import API from '../../utils/apiutil';
import Modal from '../common/modal';
import Button from '@material-ui/core/Button';
import { func } from 'prop-types';
import { resolve } from 'url';

class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen:false,
            survey:{
                type:"startup",
                company:"",
                name:"",
                phonenumber:"",
                agree: "N"
            },
            event:1
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        API.sendGet( '/user/info' ).then( result => {
            if( result.data.status === 'ok' ){
                var userData = result.data.userData;
                var survey = this.state.survey; 
                survey.name = userData.name;
                survey.phonenumber = userData.phonenumber;
                if( !! userData.company_name ) survey.company = userData.company_name;
                this.setState({
                    survey:survey
                })
            }
        });
        if( !!this.props.event ) {
            this.setState({
                event:this.props.event
            })
        }
    }

    handleChange = (e) => {
        var survey = this.state.survey;
        var name = e.target.name;
        var value = e.target.value;

        if( name === "type" ) {
            survey.type = value;
        }
        if( name === "company" ){
            survey.company = value;
        }
        if( name === "name" ){
            survey.name = value;
        }
        if( name === "phonenumber" ){
            survey.phonenumber = value;
        }
        if( name === 'agree' ) {
            if(e.target.checked === true ) {survey.agree = 'Y';}
            else {survey.agree = 'N'}
        }
        this.setState({ survey:survey });
    }

    handleClick( v ) {
        var survey = this.state.survey;
        survey.type = v
        this.setState({ survey:survey})
    }

    handleModal( v ){
        if (v === true ) this.setState({ modalOpen:true})
        else this.setState({modalOpen:false})
    }

    handleSubmit = () =>{
        var survey = this.state.survey;
        console.log( survey );
        if( survey.company === '' ) {
            alert('회사명을 입력해주세요.')
            return false;
        }
        if( survey.name === '' ) {
            alert('이름을 입력해주세요.')
            return false;
        }
        if( survey.phonenumber === '' ) {
            alert('전화번호를 입력해주세요.')
            return false;
        }
        if( survey.agree != 'Y' ) {
            alert('개인정보수집 및 활용에 동의해주세요. ')
            return false;
        }
        for( var i in  survey ){
            survey[i] = survey[i].trim();
        }
        var params = {
            event:this.state.event,
            data:survey
        }

        var surveyReset = {
            type:"startup",
                company:"",
                name:"",
                phonenumber:"",
                agree: "N"
        }
        API.sendPost('/event/setdata', params ).then(result => {
            if( result.status === 'ok' ) {
                alert('등록되었습니다. ');
                this.setState({modalOpen:false, survey:surveyReset });
            } else {
                alert("등록에 실패했습니다. 잠시 후 이용해주십시오");
            }
        });
    }

    handleClose() {
        var survey = this.state.survey;
        survey.agree = 'N';
        this.setState({
            modalOpen:false,
            survey:survey
        })
    }

    render() {
        var surveyReset = {
            agree: "N"
        }
        return (
            <div className="survey">
                <div>{this.props.children}</div>
                {
                    this.props.banner !== false &&
                    <div onClick={ e => window.location.href='/plans' } className="banner">
                        <img src="/images/plans/view.svg" alt={''} />
                    </div>    
                }
                <Modal
                    open={this.state.modalOpen}
                    onClose={(e) => {this.handleClose()}}
                    width={450}
                    height={(this.props.event === 2) ? 700 : 600}
                    className='survey_popup'
                >
                    <div className="title default-dialog-title">
                    {(!!this.props.title) ? this.props.title : `스타트업 필수문서 패키지 구매 문의`}
                    {/* <span className="close" onClick={(e)=> this.setState({showMemberIntro:false})} ><img src="/common/close-white.svg" /></span> */}
                    </div>
                    {/* <div className="close-x" onClick={(e) => {this.setState({modalOpen:false})}}><img src="/common/close-x-light-black.svg" /></div> */}
                    <div className="dialog_content content">
                        <div className="description">
                            {
                                (!!this.props.description)?
                                    this.props.description
                                :
                                <Fragment>
                                  구매를 원하시면 아래 내용을 작성해주세요.<br />
                                  1일 이내에 담당자가 다시 연락 드리겠습니다.
                                </Fragment>
                            }
                        </div>
                        <div className="radios">
                            <label htmlFor="startup" ><input type="radio" name="type" id="startup" value="startup" checked={( this.state.survey.type==='startup'?"checked":null ) } onChange={(e) => this.handleChange( e )} />스타트업</label>
                            <label htmlFor="ac"><input type="radio" name="type" id="ac" value="ac"  checked={( this.state.survey.type==='ac'?"checked":null ) } onChange={(e) => this.handleChange( e )} />엑셀러레이터</label>
                            <label htmlFor="etc"><input type="radio" name="type" id="etc" value="etc"  checked={( this.state.survey.type==='etc'?"checked":null ) } onChange={(e) => this.handleChange( e )} />기타</label>
                        </div>
                        <div className="fields">
                            <label htmlFor="company">회사명<input type="text" name="company" value={this.state.survey.company} placeholder="회사명을 입력해주세요." onChange={(e) => this.handleChange( e )}  /></label>
                            <label htmlFor="name" >이름<input type="text" name="name" value={this.state.survey.name} placeholder="이름을 입력해주세요." onChange={(e) => this.handleChange( e )}  /></label>
                            <label htmlFor="phonenumber">전화번호<input type="text" name="phonenumber" value={this.state.survey.phonenumber} placeholder="전화번호를 입력해주세요." onChange={(e) => this.handleChange( e )}  /></label>
                        </div>

                        <div className="agree">
                            <div>개인정보수집 및 활용동의<span><a href="#privacy" >자세히보기</a></span></div>
                            <span>수집된 개인정보는 로폼 서비스 이용을 위하여 목적 기간 내에 활용 됩니다.</span>
                            <label><input type="checkbox" name="agree" checked={(this.state.survey.agree === 'Y')?"checked":null} onChange={(e) => this.handleChange( e )}  />동의합니다</label>
                        </div>
                    </div>
                    <div className="buttons" >
                        <button onClick={(e) => { this.handleClose() }}>취소</button>
                        <button onClick={(e)=>{ this.handleSubmit() }}>확인</button>
                    </div>

                    {(this.props.event === 2) &&
                    <div className="legalsolution">
                        <div className="solution-title">솔루션 진행 중인 기업은 아래 버튼을 클릭해주세요.</div>
                        <div className="solution-button">
                            <button onClick={()=>{ window.location.href = '/legalsolution' }}>솔루션 시작하기 ></button>
                        </div>
                    </div>
                    }

                </Modal>
            </div>
        )
    }                        
}

export default Survey;