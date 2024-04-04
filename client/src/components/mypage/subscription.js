import React, { Component , Fragment } from 'react'
import API from '../../utils/apiutil'
import moment from 'moment'
import User from '../../utils/user'
import {Dialog,DialogTitle,DialogContent,DialogActions,Button } from '@material-ui/core'
import Plan from '../payment/plan'

class Subscription extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userSubscription:{},
            categoryDocument:{},
            inputPackageCode:false,
            packageCode:"",
            paymentMethod:'card'
        }
    }

    componentDidMount () {
       this.getSubscription();
    }

    handleChange( e ){
        if( !!e.target.value ) {
            if(e.target.name === 'category'){
                API.sendGet('/documents/categorys/' + e.target.value ).then(result => {
                    if( !!result ) this.setState({ categoryDocumants:result.data });
                })
            }

            if( e.target.name === 'document' ){
                this.setState({ selectedDoc: e.target.value });
            }
        }
        if( e.target.name === 'packagecode' ){
            this.setState({ packageCode: e.target.value.toUpperCase() });
        }
    }

    getSubscription() {
        User.getSubscription().then(result=>{
            if( !!result ) {
                this.setState({
                    userSubscription:result
                })
                var subscriptionEnddate = moment( result.regdatetime ).add( result.period , 'days').format('YYYY년 MM월 DD일');
                this.props.setSubscriptionEnddate( subscriptionEnddate );
            }
        });
    }

    addDocument() {
        var iddocuments = this.state.selectedDoc;
        var sub_idx = this.state.userSubscription.idx;
        if( !iddocuments ){
            alert( " 선택된 문서가 없습니다. 문서를 선택해주세요." );
            return false;
        } else {
            let params = { iddocuments:iddocuments , sub_idx:sub_idx }
            API.sendPost('/user/subscription/addDoc', params ).then( result => {
                if( result.status === 'ok' ){
                    alert('해당문서가 리스트에 추가되었습니다.');
                    this.getSubscription();
                    this.props.setDocsPage(1);
                } else {
                    alert('문서지급에 실패했습니다.');
                    this.getSubscription();
                }
            });
        }
    }


    setSubscription() {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert( "로그인 후 이용해주세요." );
            return false;
        }
        var packageCode = this.state.packageCode;
        var params = {
            code:packageCode
        }
        API.sendPost('/user/subscription/register',params).then(result=>{
            if( result.status === 'ok' ) {
                alert("코드등록이 완료되었습니다.");
                this.getSubscription();
            } else {
                if( result.status === 'error' && result.reason==='code_used' )
                    alert("이미 사용된 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
                else if( result.status === 'error' && result.reason==='code_not_found' )
                    alert("유효하지 않은 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
            }
        })
        this.setState({inputPackageCode:false});
    }

    paymentComplete = () => {
        this.getSubscription()
    }


    setPackage() {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert( "로그인 후 이용해주세요." );
            return false;
        }
        var packageCode = this.state.packageCode;
        var params = {
            code:packageCode
        }
        API.sendPost('/user/package/register',params).then(result=>{
            if( result.status === 'ok' ) {
                alert("코드등록이 완료되었습니다.");
                this.getSubscription();
            } else {
                if( result.status === 'error' && result.reason==='code_used' )
                    alert("이미 사용된 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
                else if( result.status === 'error' && result.reason==='code_not_found' )
                    alert("유효하지 않은 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
            }
        })
        this.setState({inputPackageCode:false});
    }

    render() {
        var category = {1:'내용증명',2:'위임장',3:'지급명령',4:'합의서',5:'계약서', 6:'스타트업필수문서'}
        return (
            <div className="subscription-guide">
                <div className="cautions half">
                    <div className="title">정기권 문서{ /*!!this.state.userPackage.packagename&&this.state.userPackage.packagename*/ }</div>
                    <ul>
                        <li>정기권 종류에 따라 선택가능한 문서를 작성기간 내에 작성횟수 만큼 작성할 수 있습니다.</li>
                        <li>작성 횟수와 작성 기간은 판매된 정기권의 유형에 따라 상이할 수 있습니다.</li>
                        <li>구매나 이용관련 문의 사항은 1:1 이용문의를 통해 고객센터로 문의바랍니다.</li>
                    </ul>
                </div>
                <div className="half usable">
                    <div className="usable-categorys half">
                        <div className="title">현재 이용중인 정기권</div>
                        { !!this.state.userSubscription.plan?
                        <ul>
                            {/* { !!this.state.userSubscription.categorys&&this.state.userSubscription.categorys.split(',').map( (value,key)=>
                                <li key={key}>{category[value]}</li>
                            )} */}
                            <li>
                                {this.state.userSubscription.plan===1?"기업문서 정기권":"스타트업 필수문서"}
                            </li>
                        </ul>
                        :
                        <div> - </div>
                        }
                    </div>
                    <div className="usable-period half">
                        <div className="title">문서 작성 가능 기간</div>
                        { !!this.state.userSubscription.plan?
                        <div>
                            <div className="month">{ !!this.state.userSubscription.period&&this.state.userSubscription.period+"일" }</div>
                            <div className="period">{ !!this.state.userSubscription.regdatetime&&moment( this.state.userSubscription.regdatetime ).format('YYYY.MM.DD')+" ~ "+ moment( this.state.userSubscription.regdatetime ).add( this.state.userSubscription.period , 'days').format('YYYY.MM.DD') }</div>
                            <div className="days-left"> ( D-{ !!this.state.userSubscription.dayleft&&this.state.userSubscription.dayleft } )</div>
                        </div>
                        :
                        <div> - </div>
                        }
                    </div>
                    {/* <div className="usable-count half">
                        <div className="title">이용가능 문서 건수</div>
                        { !!this.state.userSubscription.plan?
                        <div>
                            <span> { !!this.state.userSubscription.used ? ( this.state.userSubscription.count - this.state.userSubscription.used ):this.state.userSubscription.count } </span>건 /
                            총 
                            <span> { !!this.state.userSubscription.count&&this.state.userSubscription.count } </span> 건
                        </div>:
                        <div>
                            <span> 0 </span>건
                        </div>
                        }
                    </div>
                    <div className="usable-write half">
                        <div className="title">작성 횟수</div>
                        { !!this.state.userSubscription.plan?
                        <div><span>무제한</span></div>
                        :
                        <div>
                            <span> 0 </span>회
                        </div>
                        }
                    </div> */}
                </div>
                {
                !!this.state.userSubscription.plan ?
                <div className="subscription-actions add-document full">
                    <div className="title">문서 추가하기</div>
                    <div className="document-selector">
                        <label >카테고리</label>
                        <select name="category" onChange={(e)=>{ this.handleChange( e )}}>
                            <option value="">카테고리 선택</option>
                            { !!this.state.userSubscription.categorys&&this.state.userSubscription.categorys.split(',').map( (value,key)=>
                                <option value={value} key={key}>{category[value]}</option>
                            )}
                        </select>
                        <label >문서명</label>
                        <select name="document" onChange={(e)=>{ this.handleChange( e )}}>
                            <option>문서 선택</option>
                            { !!this.state.categoryDocumants&&this.state.categoryDocumants.map((item, key) => 
                                <option value={item.iddocuments} key={key} >{item.title}</option>
                            )}
                        </select>
                    </div>
                    <Button onClick={()=>this.addDocument()}>추가</Button>
                </div>:
                <Fragment>
                <div className="package-actions add-package full mobile">
                    <label>제휴코드입력</label>
                    <input name="packagecode" type="text" placeholder="정기권 코드를 입력하세요." value={this.state.packageCode} onChange={(e)=>this.handleChange(e)} />
                    <Button 
                        onClick={(e) => {
                            this.setPackage();
                        }}
                        color="primary"
                        className="ok">
                        확인
                    </Button>
                </div>
                <div className="package-actions add-package full mobile_hide">
                    정기권 코드를 가지고 계신 경우, 코드 등록 후 문서를 이용할 수 있습니다.
                    <button onClick={()=>this.setState({inputPackageCode:true})}>정기권 코드 입력하기 ></button>
                    <Dialog
                        open={this.state.inputPackageCode}
                        onClose={(e)=> this.setState({inputPackageCode:false})}
                        aria-labelledby="dialog-packagecode-title"
                        aria-describedby="dialog-packagecode-description"
                        className="dialog-packagecode"
                        scroll="body"
                    >
                        <DialogTitle className="title">정기권 코드</DialogTitle>
                        <DialogContent className="content">
                            <div>가지고 계신 정기권 코드를 입력해주세요.</div>
                            <input name="packagecode" type="text" placeholder="정기권 코드를 입력하세요." value={this.state.packageCode} onChange={(e)=>this.handleChange(e)} />
                        </DialogContent>
                        <DialogActions className="buttons" >
                            <Button 
                                onClick={(e)=> this.setState({inputPackageCode:false})}
                                color="primary"
                                className="cancel">
                                취소
                            </Button>
                            <Button 
                                onClick={(e) => {
                                    this.setPackage();
                                }}
                                color="primary"
                                className="ok">
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                </Fragment>
                }

            </div>
        );
    }
}

export default Subscription;
