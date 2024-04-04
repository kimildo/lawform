import React, { Component, Fragment } from 'react';
import Modal from '../common/modal';
import Stars from '../common/stars';
// import '../../scss/event/attoneysvc.scss';
import API from '../../utils/apiutil';
import { FormGroup, Radio ,  RadioGroup, FormLabel, FormControl, FormControlLabel, Checkbox, TextField  } from '@material-ui/core';
import Router from 'next/router';

class Attoneysvc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            userPhone:'',
            userEmail:'',
            userOffice:'',
            userAgree:'N',
            formOpen:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    goBack(){
        this.props.history.goBack();
    }

    componentDidMount() {
        this.setState({
            // showModal: true
        })
    }

    componentWillReceiveProps( nextProps ) {
        if( this.state.showModal != nextProps.open ) {
            this.setState({
                showModal:nextProps.open
            })
        }
    }

    starSelectorShow = (e) => {
        if( this.state.starSelectorShow === 'none'  ) {
            this.setState({starSelectorShow:'inline-block'})
        } else {
            this.setState({starSelectorShow:'none'})
        }
    }

    
    selectStar(e,score,text) {
        this.setState({
            selectedScore:score,
            selectedScoreText:text
        },()=>{
            this.setState({
                starSelectorShow:'none'
            })
        })
        
    }

    handleChange = (e) => {
        if( e.target.name === 'user-name' ) {
            this.setState({ userName:e.target.value})
        } 
        else if( e.target.name === 'user-phone' ) {
            this.setState({ userPhone:e.target.value})
        }
        else if( e.target.name === 'user-email' ) {
            this.setState({ userEmail:e.target.value})
        }
        else if( e.target.name === 'user-office' ) {
            this.setState({ userOffice:e.target.value})
        }
        else if( e.target.name === 'user-agree' ) {
            this.setState({ userAgree:e.target.value})
        }
    }

    handleSubmit = (e) => {
        console.log('handleSubmit state', this.state )
        if( this.state.userName === '' ) {
            alert( "이름을 입력해주세요." );
            e.preventDefault();
            return false;
        }
        if( this.state.userPhone === '' ) {
            alert( "전화번호를 입력해주세요." );
            e.preventDefault();
            return false;
        }
        if( this.state.userEmail === '' ) {
            alert( "이메일 주소를 입력해주세요." );
            e.preventDefault();
            return false;
        }
        if( this.state.userOffice === '' ) {
            alert( "사무실명을 입력해주세요." );
            e.preventDefault();
            return false;
        }
        if( this.state.userAgree !== 'Y' ) {
            alert( "개인정보수집 및 활용동의에 체크해주세요." );
            e.preventDefault();
            return false;
        }


     var params = {
            event:7,
            data:{
                name:this.state.userName,
                phone:this.state.userPhone,
                email:this.state.userEmail,
                office:this.state.userOffice,
                agree:this.state.userAgree
            }
        }

        API.sendPost('/event/setdata', params ).then(result => {
            if( result.status === 'ok' ) {
                alert('신청이 완료 되었습니다.\n담당자가 직접 연락 드리겠습니다. ');
                this.setState({showModal:false});
                if(!!this.props.mobile) {
                    window.location="/"
                } else {
                    this.props.onComplete();
                }
            } else {
                alert("등록에 실패했습니다. 잠시 후 이용해주십시오");
            }
        });

    }

    handleShowForm = () => {
        if( this.state.formOpen === true ) {
            this.setState({formOpen:false})
        } else {
            this.setState({formOpen:true})
        }
    }

    render() {
        var triangle = this.state.formOpen===true?<img src="/images/event/attoneyservice/triup.svg" />:<img src="/images/event/attoneyservice/tridown.svg" />
        var agreeCheck = this.state.userAgree==='Y'?<input type="checkbox" id="user-agree" name="user-agree" value='N' onChange={e=>this.handleChange(e)} checked/>:<input type="checkbox" id="user-agree" name="user-agree" value='Y' onChange={e=>this.handleChange(e)}/>
        return(
            <Fragment>
                { !!this.props.mobile?
                <div
                className="attoney-service"

            >
                    <div className="closes">
                        {
                            !!this.props.mobile?
                            <div><a href="/"><img src="/images/event/attoneyservice/close.svg" /></a></div>
                            :
                            <div onClick={()=>this.props.close()}><img src="/images/event/attoneyservice/close.svg" /></div>
                        }
                        
                    </div>
                    <div className="box">
                        <img src="/images/event/attoneyservice/img1.jpg" />
                    </div>
                    <div className="content">
                        <h4>변호사회원으로 가입하시면 담당자가 서비스 이용에 관한 상세한 안내를 드립니다.</h4>
                        <button className="form-open" type="button" onClick={()=>Router.push('/auth/signup/lawyer')}>변호사 회원 가입하기{triangle}</button>
                        {
                            !!this.state.formOpen?
                            <form>
                                <div>
                                    <label htmlFor="user-name">이름</label>
                                    <input type="text" id="user-name" name="user-name" onChange={e=>this.handleChange(e)} value={this.state.userName}/>
                                </div>
                                <div>
                                    <label htmlFor="user-phone">전화번호</label>
                                    <input type="text" id="user-phone" name="user-phone" onChange={e=>this.handleChange(e)} value={this.state.userPhone}/>

                                </div>
                                <div>
                                    <label htmlFor="user-email">이메일 주소</label>
                                    <input type="text" id="user-email" name="user-email" onChange={e=>this.handleChange(e)} value={this.state.userEmail}/>
                                </div>
                                <div>
                                    <label htmlFor="user-office">사무실명</label>
                                    <input type="text" id="user-office" name="user-office" onChange={e=>this.handleChange(e)} value={this.state.userOffice}/>
                                </div>
                                <div className="agree">
                                    <label htmlFor="user-agree">개인정보수집 및 활용동의</label><br className="mobile" />
                                    <input type="checkbox" id="user-agree" name="user-agree" value={this.state.userAgree==='Y'?'N':'Y'} onChange={e=>this.handleChange(e)} />
                                    <label htmlFor="user-agree">동의합니다.</label>
                                    <a href="/legalnotice#privacy" target="_blank">자세히보기</a>
                                    <div>수집된 개인정보는 로폼 서비스 이용을 위하여 목적 기간 내에 활용 됩니다.</div>
                                </div>
                                <div className="buttons" onClick={this.handleSubmit}>
                                    <button type="button" className="submit" >신청하기</button>
                                </div>
                            </form>
                            :null
                        }
                    </div>
                    <div className="box">
                        <img src="/images/event/attoneyservice/img2.jpg" />
                    </div>
            </div>
                    :
                    <Modal
                    open={this.props.open }
                    onClose={ this.props.close }
                    // width={650}
                    className="attoney-service"
                    scroll="paper"
                >
                        <div className="closes">
                            <div onClick={()=>this.props.close()}><img src="/images/event/attoneyservice/close.svg" /></div>
                        </div>
                        <div className="box">
                            <img src="/images/event/attoneyservice/img1.jpg" />
                        </div>
                        <div className="content">
                            <h4>변호사회원으로 가입하시면 담당자가 서비스 이용에 관한 상세한 안내를 드립니다.</h4>
                            <button className="form-open" type="button" onClick={()=>Router.push('/auth/signup/lawyer')}>변호사 회원 가입하기{triangle}</button>
                            {
                                !!this.state.formOpen?
                                <form>
                                    <div>
                                        <label htmlFor="user-name">이름</label>
                                        <input type="text" id="user-name" name="user-name" onChange={e=>this.handleChange(e)} value={this.state.userName}/>
                                    </div>
                                    <div>
                                        <label htmlFor="user-phone">전화번호</label>
                                        <input type="text" id="user-phone" name="user-phone" onChange={e=>this.handleChange(e)} value={this.state.userPhone}/>

                                    </div>
                                    <div>
                                        <label htmlFor="user-email">이메일 주소</label>
                                        <input type="text" id="user-email" name="user-email" onChange={e=>this.handleChange(e)} value={this.state.userEmail}/>
                                    </div>
                                    <div>
                                        <label htmlFor="user-office">사무실명</label>
                                        <input type="text" id="user-office" name="user-office" onChange={e=>this.handleChange(e)} value={this.state.userOffice}/>
                                    </div>
                                    <div className="agree">
                                        <label htmlFor="user-agree">개인정보수집 및 활용동의</label><br className="mobile" />
                                        <input type="checkbox" id="user-agree" name="user-agree" value={this.state.userAgree==='Y'?'N':'Y'} onChange={e=>this.handleChange(e)} />
                                        <label htmlFor="user-agree">동의합니다.</label>
                                        <a href="/legalnotice#privacy" target="_blank">자세히보기</a>
                                        <div>수집된 개인정보는 로폼 서비스 이용을 위하여 목적 기간 내에 활용 됩니다.</div>
                                    </div>
                                    <div className="buttons" onClick={this.handleSubmit}>
                                        <button type="button" className="submit" >신청하기</button>
                                    </div>
                                </form>
                                :null
                            }
                        </div>
                        <div className="box">
                            <img src="/images/event/attoneyservice/img2.jpg" />
                        </div>
                </Modal>
                }
                
            </Fragment>
        )
    }




}

export default Attoneysvc;
