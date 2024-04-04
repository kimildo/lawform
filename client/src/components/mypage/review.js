import React, { Component } from 'react';
import User from '../../utils/user';
import API from '../../utils/apiutil';
import Stars from '../common/stars';
import moment from 'moment';
// import '../../scss/mypage/review.scss';

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews:[],
            reviewWrite:'',
            reviewableDocs:[],
            reviewDocument:0,
            selectedScore:100,
            selectedScoreText:'아주 좋아요',
            starSelectorShow:'none',
            selectedDocument:0,
            selectedCategory:0,
            reviewsPage:1,
            reviewTotal:0,
            categoryDocuments:[],
            showWrite:false,
            heightWrite:457,
            showWriteBtn:'display'
        };
        this.setPage = this.setPage.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

    }

    componentWillMount() {
        this.getReviews(1);
        this.ownDocs();
        this.getCategoryDocuments( this.props.category );
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                starSelectorShow:'none'
            });
        }
    }

    setDocumentsReviews( e ) {
        let document = e.target.value;
        this.getReviews( this.state.page , document )
    }

    getCategoryDocuments = (category) => {
        API.sendGet('/documents/category' ).then((result)=>{
            if( result.statusText === 'OK' ) {
                this.setState({
                    categoryDocuments:result.data
                })
            }
        })
    }

    getReviews( page , document = null ) {
        // let category = this.props.category;
        
        let limit = 5;
        let offset = ( limit * page ) - limit;
        API.sendPost('/user/reviews', {page:page,limit:5,offset:offset,document:document}).then((result)=>{
            if( result.status === 'ok' ) {
                this.setState({
                    reviews: result.data.data,
                    reviewTotal: result.data.total
                })
            } else {
                this.setState({
                    reviews: [],
                    reviewTotal: 0
                })
            }
        })
    }

    setPage(page) {
        this.setState({reviewsPage:page});
        this.getReviews(page)
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

    showWrite() {
        this.setState({
            showWrite:true,
            heightWrite:768,
            showWriteBtn:'none'
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
        if( this.state.reviewWrite.length < 1 ) {
            alert("후기 내용을 입력해주세요.");
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
            },this.getReviews( 1 , this.state.selectedDocument ));
            this.props.closeReview();
        })
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
    emailFormat( email ) {
        let mailid = email.split('@')
        let r = mailid[0].substr(0,1);
        for( let i=1; i<mailid[0].length;i++ ) r += '*';
        return r+"@"+mailid[1];
    }

    starSelectorShow = (e) => {
        if( this.state.starSelectorShow === 'none'  ) {
            this.setState({starSelectorShow:'inline-block'})
        } else {
            this.setState({starSelectorShow:'none'})
        }
    }

    render() {
        const starSelector = []
        const starSelectorDesc = ['아주 좋아요','좋아요','보통이에요','그저 그래요','별로에요'];
        for(var i=20;i<=100;i+=20) {
            starSelector.push(i)
        }
        let userInfo = User.getInfo();
        return (
            <div className="category_review"  style={{height:this.state.heightWrite}}>
                <div className="close" onClick={this.props.closeReview}><img src="/mypage_img/close.png" /></div>
                <div className="event_header">
                    <button type="button" onClick={(e)=>{ this.showWrite()}} style={{display:this.state.showWriteBtn}}>후기 작성</button>
                </div>
                {
                    this.state.showWrite === true &&
                <div style={{width:700}}>
                    <div className="write"  onClick={ (!userInfo)?(e)=>{alert("로그인 후에 이용해 주세요."); window.location.href="#signin"}:"" } >
                        <select onChange={(e) => this.handleChange(e,'selectDocument')} ref={(input) => { this.inputSelect = input; }}  >
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
                                    !!userInfo &&
                                    starSelector.reverse().map( (item,key) => 
                                        <li onClick={(e)=>this.selectStar(e,item,starSelectorDesc[key]) }><Stars score={item} text={starSelectorDesc[key]} /> </li>
                                    )
                                }
                            </ul>
                        </div>
                        <textarea onChange={(e) => this.handleChange(e,'reviewWrite')} value={this.state.reviewWrite} id="reviewWrite" ref={(input) => { this.textArea = input; }}  />
                        <button type="button" onClick={()=>this.writeReview()}>이벤트 참여</button>
                    </div>
                    <div className="cautions">
                        <h3>참여시 주의사항</h3>
                        <ol>
                            <li>문서 하나당 한번의 참여만 가능합니다.</li>
                            <li>이벤트 경품 전달을 위해 회원정보가 조회될 수 있습니다.</li>
                            <li>이벤트 참여와 동시에 개인정보 수집 및 취급에 동의하신 것으로 간주되며 <br />
                                기타 문의사항은 고객센터로 연락 주시기 바랍니다.</li>
                            <li>적합하지 않은 후기라고 판단되는 경우 경품 지급이 불가할 수 있습니다. (비방, 욕설, 관련없는 내용 등)</li>
                        </ol>
                    </div>
                </div>
                }
            </div>
        )
    }                        
}

export default Review;