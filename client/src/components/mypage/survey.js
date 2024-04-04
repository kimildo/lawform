import React, { Component, Fragment } from 'react';
import Modal from '../common/modal';
import Stars from '../common/stars';
// import '../../scss/mypage/firstsurvey.scss';
import API from '../../utils/apiutil';
import { FormGroup, Radio ,  RadioGroup, FormLabel, FormControl, FormControlLabel, Checkbox, TextField  } from '@material-ui/core';

class Survey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectedScore: 100,
            selectedScoreText: '아주 좋아요',
            starSelectorShow:'none',
            after_service:[],
            referer:"",
            price_attorney_service_etc:"",
            after_service_etc:"",
            after_review:""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            // showModal: true
        })
    }

    // componentDidUpdate(nextProps) {
        
    // }

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
        // use_attorney_service
        console.log( this.state );
        var s = this.state;

        if( e.target.name === 'after_service' ) {
            // if( this.state.af )
            var after_service = this.state.after_service;
            var idx = after_service.indexOf( e.target.value )
            if( idx > -1 ) {
                after_service.splice( idx, 1 );
            } else {
                after_service.push( e.target.value );
            }
            s[e.target.name] = after_service;
        } else {
            s[e.target.name] = e.target.value;
        }
        this.setState(s)
    }

    handleSubmit = (e) => {
        console.log('handleSubmit state', this.state )
        //use_attorney_service
        if( !this.state.use_attorney_service ) {
            alert( "모든 항목은 필수 답변 사항입니다. -1" );
            e.preventDefault();
            return false;
        }
        //price_attorney_service
        if( !this.state.price_attorney_service ) {
            alert( "모든 항목은 필수 답변 사항입니다. -2" );
            e.preventDefault();
            return false;
        }
        //price_attorney_service_etc
        if( this.state.price_attorney_service === 'etc' && !this.state.price_attorney_service_etc.trim === "" ) {
            alert( "모든 항목은 필수 답변 사항입니다. -2e" );
            e.preventDefault();
            return false;
        }
        //after_service
        if( this.state.after_service.length < 1 ) {
            alert( "모든 항목은 필수 답변 사항입니다. -3" );
            e.preventDefault();
            return false;
        }
        //after_service_etc
        if( this.state.after_service.indexOf('etc') > -1 && this.state.after_service_etc.trim() === "" ) {
            alert( "모든 항목은 필수 답변 사항입니다. -3e" );
            e.preventDefault();
            return false;
        }

        //referer
        if( this.state.referer === "" ) {
            alert( "모든 항목은 필수 답변 사항입니다. -4" );
            e.preventDefault();
            return false;
        }
        //selectedScore
        //after_review
        if( this.state.after_review.length < 30 ) {
            alert( "이용후기는 30자 이상 작성해주세요.. -5" );
            e.preventDefault();
            return false;
        }
        var params = {
            event:3,
            data:{
                use_attorney_service:this.state.use_attorney_service,
                price_attorney_service:this.state.price_attorney_service,
                price_attorney_service_etc:this.state.price_attorney_service_etc,
                after_service:this.state.after_service,
                after_service_etc:this.state.after_service_etc,
                referer:this.state.referer,
                selectedScore:this.state.selectedScore,
                after_review:this.state.after_review
            }
        }

        API.sendPost('/event/setdata', params ).then(result => {
            if( result.status === 'ok' ) {
                alert('등록되었습니다. ');
                this.setState({showModal:false});
                this.props.onComplete();
            } else {
                alert("등록에 실패했습니다. 잠시 후 이용해주십시오");
            }
        });

    }

    render() {
        const starSelector = []
        for(var i=20;i<=100;i+=20) {
            starSelector.push(i)
        }
        const starSelectorDesc = ['아주 좋아요','좋아요','보통이에요','그저 그래요','별로에요'];
        return(
            <Fragment>
                <Modal
                    open={this.state.showModal}
                    onClose={ this.props.close }
                    width={700}
                    marginTop={80}
                    className="first-survey"
                    scroll="paper"
                >
                        <div className="default-dialog-title" style={{textAlign:'left'}}>설문 및 후기
                                <span className="close" onClick={ this.props.close } ><img src="/common/close-white.svg" /></span>
                        </div>
                        <div className="box">
                            <p>첫구매 고객으로 할인 적용받은 고객분들을 대상으로 하는 설문입니다.<br />
                            소중한 의견과 요청을 반영하여 더 나은 서비스를 제공하겠습니다.</p>
                            <p>다시한번 구매와 설문 참여에 감사드립니다.</p>
                            <div className="require-alert">* 모든 항목은 필수 답변 사항입니다.</div>
                        </div>
                        <div className="content">

                            <form>
                                <ol>
                                    <li>
                                        로폼을 통해 작성한 법률문서 또는 기존에 작성한 법률문서를 변호사가 직접 검토해준다면 신청하실 의향이 있으신가요?
                                        <div className="hint">
                                            <h4>*<u>변호사 검토</u>란?</h4>
                                            - 변호사가 직접 법률적 관점에서 작성된 문서 전체를 검토 후 수정/보완 합니다.< br />
                                            - 변호사의 명의로 문서를 작성합니다.
                                        </div>
                                        <RadioGroup aria-label="gender" name="use_attorney_service" className="input-group" onChange={this.handleChange}  >
                                            <FormControlLabel value="Y" control={<Radio color="default" className="radio" />} label="있다" />
                                            <FormControlLabel value="N" control={<Radio color="default" className="radio" />} label="없다" />
                                        </RadioGroup>
                                    </li>
                                    <li>
                                        변호사가 검토해준다면 어느정도 비용을 지불할 의향이 있으신가요?
                                        <RadioGroup aria-label="gender" name="price_attorney_service" className="input-group" onChange={this.handleChange} >
                                            <FormControlLabel value="20" control={<Radio color="default" className="radio" />} label="20만원" />
                                            <FormControlLabel value="25" control={<Radio color="default" className="radio" />} label="25만원" />
                                            <FormControlLabel value="30" control={<Radio color="default" className="radio" />} label="30만원" />
                                            <FormControlLabel value="etc" control={<Radio color="default" className="radio" />} label="직접입력" />
                                        </RadioGroup>
                                        <TextField
                                            placeholder="내용을 입력해주세요."
                                            fullWidth
                                            className="text-field"
                                            name="price_attorney_service_etc"
                                            value={this.state.price_attorney_service_etc}
                                            onChange={this.handleChange}
                                        />
                                    </li>
                                    <li>
                                        구매한 문서의 어떤 후속서비스를 원하시나요? (중복선택가능)
                                        <FormGroup onChange={this.handleChange}>
                                            <FormControlLabel
                                                control={<Checkbox value="변호사 대리 명의" name="after_service" className="checkbox" color="default" 
                                                checked={(this.state.after_service.indexOf('변호사 대리 명의')>-1)?"checked":"" }  />}
                                                label="변호사 대리 명의"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox value="변호사 검토"  name="after_service"  className="checkbox" color="default"
                                                checked={(this.state.after_service.indexOf('변호사 검토')>-1)?"checked":"" }  />}
                                                label="변호사 검토"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox value="발송대행"  name="after_service"  className="checkbox" color="default"
                                                checked={(this.state.after_service.indexOf('발송대행')>-1)?"checked":"" }  />}
                                                label="발송대행"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox value="전자계약"  name="after_service"  className="checkbox" color="default"
                                                checked={(this.state.after_service.indexOf('전자계약')>-1)?"checked":"" }  />}
                                                label="전자계약"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox value="etc"  name="after_service"  className="checkbox" color="default"
                                                checked={(this.state.after_service.indexOf('etc')>-1)?"checked":"" }  />}
                                                label="기타직접입력"
                                            />
                                            <TextField
                                                placeholder="내용을 입력해주세요."
                                                fullWidth
                                                className="text-field"
                                                name="after_service_etc"
                                                value={this.state.after_service_etc}
                                                onChange={this.handleChange}
                                            />
                                        </FormGroup>

                                    </li>
                                    <li>
                                        어떤 경로로 로폼을 알게 되셨나요?
                                        <TextField
                                            placeholder="내용을 입력해주세요."
                                            fullWidth
                                            className="text-field"
                                            name="referer"
                                            value={this.state.referer}
                                            onChange={this.handleChange}
                                        />
                                    </li>
                                    <li>
                                        구매하신 문서의 이용후기를 작성해주세요.
                                        <div className="light">(만족했던 점, 개선점, 가격의 적정성 등 30자 이상)</div>
                                        <div className="selectScore" onClick={(e)=>this.setState({starSelectorShow:'inline-block'})}>
                                            <Stars score={this.state.selectedScore}  text={this.state.selectedScoreText}  ></Stars>
                                            <ul className="starSelector" style={{display:this.state.starSelectorShow}}>
                                                {
                                                    starSelector.reverse().map( (item,key) => 
                                                        <li onClick={(e)=>this.selectStar(e,item,starSelectorDesc[key]) }><Stars score={item} key={key} /> {starSelectorDesc[key]}</li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                        <textarea rows='8' className="textarea" name="after_review" onChange={this.handleChange} value={this.state.after_review} />
                                    </li>
                                </ol>
                                <div className="buttons" onClick={this.handleSubmit}>
                                    <button type="button" className="submit" >제출하기</button>
                                </div>
                            </form>
                        </div>
                </Modal>
            </Fragment>
        )
    }




}

export default Survey;
