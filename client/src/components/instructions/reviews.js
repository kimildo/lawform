import React, { Component, Fragment } from 'react';
import API from '../../utils/apiutil';
import Link from 'next/link';
import moment from 'moment';
import Paging from '../common/paging';
import Stars from '../common/stars';
import Modal from '../common/modal';
import User from '../../utils/user';

// import '../../scss/instructions/reviews.scss';
class Reviews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviewsArray:[],
            reviewsTotal:0,
            per:10,
            page:1,
            selectedScoreText:'아주 좋아요',
            starSelectorShow:'none',
            selectedScore:100,
            reviewableDocs:[],
            activeReview:0,
            order:'newer'

        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {

    }
    componentWillMount() {
        this.setPage(1);
        // this.ownDocs();
    }
    handleClick = (e) => {
    
    }


    handleChange = (e,t) => {
        if( t === 'reviewWrite' ) {
            let value = e.target.value;
            this.setState({
                reviewWrite:value
            })
        }

        if( t === 'selectDocument' ) {
            let value = e.target.value.split('|');
            this.setState({
                selectedCategory:value[0],
                selectedDocument:value[1]
            },()=>{
                // console.log( value, this.state.selectedCategory, this.state.selectedDocument )
            }
                
            )
            
        }
    }



    setPage = (page) => {
        let url  = '/customer/review/';
        let params = {
            // document: this.props.document,
            per:this.state.per,
            page:page,
            order:this.state.order
        }
        API.sendPost( url , params  ).then((result) => {
            this.setState({
                reviewsArray:result.data.data,
                reviewsTotal:result.data.total,
                page:page,
                showWriteReview:false,
                activeReview:0
            })
        });
    }

    ownDocs() {
        var params = {
            sort:'desc'
        }
        API.sendPost('/user/reviewableDocs', params ).then((result) => {
            if (result.status === 'ok') {
                this.setState({ reviewableDocs:result.data.data });
            }
        });
    }


    showArticle(idx) {
        var activeReview = 0;
        if( idx !== this.state.activeReview) activeReview = idx;
        this.setState({
            activeReview:activeReview
        })
    }


    writeReview( ) {
    
        let userInfo = User.getInfo();
        if( !userInfo ) {
            alert("로그인 후에 이용해 주세요.");
            return false;
        }
        if( !this.state.reviewWrite ) {
            alert("후기 내용을 입력해주세요.");
            this.textArea.focus();
            return false;
        }
        if( this.state.reviewWrite.length < 0 ) {
            alert("30자 이상 작성해주세요.");
            this.textArea.focus();
            return false;
        }
        if( !this.state.selectedDocument ) {
            alert("문서를 선택해주세요.");
            this.inputSelect.focus();
            return false;
        } 
        if( !this.state.selectedCategory ) {
            alert("문서를 선택해주세요.");
            this.inputSelect.focus();
            return false;
        } 

        let params = {
            content:this.state.reviewWrite,
            score:this.state.selectedScore,
            document:this.state.selectedDocument,
            category:this.state.selectedCategory
        }
        
        API.sendPost('/user/reviewWrite',params).then((result)=>{
            alert( "등록되었습니다." )
            this.setState({
                reviewWrite:""
            },  this.setPage(1)
            );
            // this.props.closeReview();
        })
    }

    shwoWrite = () => {
        let userInfo = User.getInfo();
        if(!userInfo) {
            alert("로그인 후에 이용해 주세요.");
            window.location.href="#signin";
        } else {
            this.ownDocs();
            this.setState({showWriteReview:true});
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

    setOrder = (set) => {
        this.setState({
            order:set
        },function(){
            setTimeout( this.setPage( 1 ), 500)
        })
        

    }

    render() {
        const starSelector = []
        const starSelectorDesc = ['아주 좋아요','좋아요','보통이에요','그저 그래요','별로에요'];
        for(var i=20;i<=100;i+=20) {
            starSelector.push(i)
        }
        var category = {1:'내용증명',2:'위임장',3:'지급명령',4:'합의서',99:'기업문서'}
        return (
            <div className="reviews">
                <div className="title">
                    <h2>이용후기</h2>
                    <div className="order">
                        <button onClick={()=> this.setOrder('newer')} className={!!(this.state.order==='newer')?'active':''}>최신순</button>
                        <button onClick={()=> this.setOrder('score')} className={!!(this.state.order==='score')?'active':''}>추천순</button>
                    </div>
                </div>
                <div className="article">
                        <ul className="lists">
                        {
                            this.state.reviewsArray.length > 0 && this.state.reviewsArray.map((item,key)=>
                            <li key={key} onClick={(e)=>this.showArticle(item.idx) } className={!!(this.state.activeReview === item.idx )?'active':'' }>
                                <div className='num'>{ this.state.reviewsTotal - ( (this.state.per * this.state.page) - this.state.per ) - key }</div>
                                <div className='stars'><Stars score={item.score} showText={false}></Stars></div>
                                <div className='content'>
                                    <div className="review">
                                    {
                                        item.content.split(/\n/g).map((r,k) =>
                                        <Fragment key={k} >
                                            {r}{(this.state.activeReview=== item.idx)&&<br />}
                                        </Fragment>
                                    )}
                                    </div>
                                    <div className='title'>{item.title}</div>
                                    <div className="date">{ moment(item.registerdate).format('Y.MM.DD')}</div>
                                </div>
                                <div className='email'>
                                    { item.email }
                                </div>
                            </li>
                            )
                        }
                        </ul>
                        <div className="comment">※ 본 이용후기는 실제 구매자들이 작성하였습니다.</div>
                        {
                            ( this.state.reviewsTotal > this.state.per )&&
                            <Paging  total={this.state.reviewsTotal} page={this.state.page} per={this.state.per} setPage={this.setPage} />
                        }
                </div>
                <Modal
                    open={this.state.showWriteReview}
                    onClose={(e)=> this.setState({showWriteReview:false})}
                    width={700}
                    height={630}
                    className="show-write-review"
                    scroll="body"
                    >
                    <div className="default-dialog-title" style={{textAlign:'left'}}>이용 후기
                        <span className="close" onClick={(e)=> this.setState({showWriteReview:false})} ><img src="/common/close-white.svg" /></span>
                    </div>
                    <div className="content">
                        <h4>로폼의 문서를 구매 후 이용 후기를 작성해주시면, 커피쿠폰을 보내드립니다 !</h4>
                        <div className="write" >
                            <select className="selectDocument" onChange={(e) => this.handleChange(e,'selectDocument')} ref={(input) => { this.inputSelect = input; }}  >
                                <option value="">문서 선택</option>
                                {
                                    this.state.reviewableDocs.map((item,key)=>
                                        <option value={item.idcategory_1+"|"+item.iddocuments}>{item.title}</option>
                                    )
                                }
                            </select>
                            <div className="selectScore" onClick={(e)=>this.starSelectorShow(e)} ref={this.setWrapperRef} >
                                <Stars score={this.state.selectedScore} text={this.state.selectedScoreText}  />
                                <ul className="starSelector" style={{display:this.state.starSelectorShow}}>
                                    {
                                        // !!userInfo &&
                                        starSelector.reverse().map( (item,key) => 
                                            <li onClick={(e)=>this.selectStar(e,item,starSelectorDesc[key]) } key={key}><Stars score={item} text={starSelectorDesc[key]} /> </li>
                                        )
                                    }
                                </ul>
                            </div>
                            <textarea onChange={(e) => this.handleChange(e,'reviewWrite')} value={this.state.reviewWrite} id="reviewWrite" placeholder="최소 100자 이상 작성시 이벤트 경품 대상자로 참여 됩니다." ref={(input) => { this.textArea = input; }}  />
                            <button type="button" onClick={()=>this.writeReview()}>후기 작성</button>
                        </div>
                        <div className="cautions">
                            <h3>기타사항</h3>
                            <ol>
                                <li>중복 참여가 불가능합니다.</li>
                                <li>개인 정보 수집 및 이용은 회원 가입 시 동의하신 내용을 바탕으로 하며, 자세한 사항은 개인정보 처리방침을 참고해주세요.</li>
                                <li>이벤트 경품 발송을 위해 회원님의 이름과 전화번호를 이용합니다. 문의사항은 고객센터로 연락 주시기 바랍니다.</li>
                                <li>관련없는 내용 및 고의적인 비방글은 삭제될 수 있습니다.</li>
                                <li>위임장 등의 무료문서 작성 및 문서 작성이벤트 참여 고객은 경품에서 제외됩니다.</li>
                            </ol>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Reviews;