import React, { Component, Fragment } from 'react';
import User from '../../utils/user';
import API from '../../utils/apiutil';
import Stars from '../common/stars';
import Paging from '../common/paging';
import moment from 'moment';
// import '../../scss/category/review.scss';

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews:[],
            reviewWrite:'',
            reviewableDocs:[],
            reviewDocument:0,
            selectedScore:100,
            starSelectorShow:'none',
            selectedDocument:0,
            selectedCategory:0,
            reviewsPage:1,
            reviewTotal:0,
            categoryDocuments:[]
        };
        this.setPage = this.setPage.bind(this)
    }

    componentWillMount() {
        this.getReviews(1);
        this.ownDocs();
        this.getCategoryDocuments( this.props.category );
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
            page:1,
            per:10,
            order:'w.registerdate',
            sort:'desc'
        }
        API.sendPost('/user/reviewableDocs', params ).then((result) => {
            if (result.status === 'ok') {
                this.setState({ reviewableDocs:result.data.data });
            }
        });
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
            },this.getReviews( 1 , this.state.selectedDocument ))
        })
    }

    selectStar(e,score) {
        this.setState({
            selectedScore:score
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
    render() {
        const starSelector = []
        const starSelectorDesc = ['아주 좋아요','좋아요','보통이에요','그저 그래요','별로에요'];
        for(var i=20;i<=100;i+=20) {
            starSelector.push(i)
        }

        let userInfo = User.getInfo();
        return (
            <div className="category_review">
                <div className="title">
                    <h3>이용후기</h3>
                    <div className="description">여러분의 소중한 의견을 바탕으로 더 나은 서비스를 만들겠습니다.</div>
                </div>
                <div className="contents">
                    <select onChange={(e) => {this.setDocumentsReviews(e)}}>
                        <option value=''>전체</option>
                        {
                            this.state.categoryDocuments.map( (item,key) => 
                            <option value={item.iddocuments}>{item.title}</option>
                            )
                        }
                    </select>
                    <div className="reviews">
                        {
                            ( this.state.reviews.length > 0 )?
                            this.state.reviews.map(( item, key ) => 
                            <div className="review" key={key}>
                                <div className="info">
                                    <h5>{item.title}</h5>
                                    <Stars score={item.score} />
                                    <span className="regdate">{moment( item.registerdate).format('Y/MM/DD H:mm:ss')}</span>
                                </div>
                                <div className="content">
                                    {item.content}
                                    <div className="write">
                                        <span className="email">{this.emailFormat( item.email )}</span>
                                        {/* {
                                            item.reply !== '' && <span className="btn_fold" onClick={(e)=>{ item.reply='';}} >접기 <img src="/common/up-arrow-a.svg"></img></span>
                                        } */}
                                    </div>
                                </div>
                                { item.reply !== '' && 
                                    <div className="reply">
                                        <div className="replier"><img src='/common/logo.svg' width="30" alt="로폼"/> 로폼</div>
                                        <div className="content">
                                            {
                                            item.reply.split(/\n/g).map((r, key) =>
                                                <Fragment>
                                                    {r}<br/>
                                                </Fragment>
                                            )}
                                        </div>
                                    </div>                            
                                }

                            </div>
                            ):
                            <div>
                                등록된 후기가 없습니다.
                            </div>
                        }
                        {
                            this.state.reviewTotal > 0 && <Paging page={this.state.reviewsPage} per={5} total={this.state.reviewTotal} setPage={this.setPage} />
                        }
                        
                    </div>
                </div>
                <div className="write"  onClick={ (!userInfo)?(e)=>{alert("로그인 후에 이용해 주세요."); window.location.href="#signin"}:"" } >
                    <h3>이용 후기 <span>| 문의글이나 비방글은 예고 없이 삭제 됩니다.</span></h3>
                    <select onChange={(e) => this.handleChange(e,'selectDocument')} ref={(input) => { this.inputSelect = input; }}  >
                        <option value="">선택하세요.</option>
                        {
                            this.state.reviewableDocs.map((item,key)=>
                                <option value={item.idcategory_1+"|"+item.iddocuments}>{item.title}</option>
                            )
                        }
                    </select>
                    <div className="selectScore" onClick={(e)=>this.setState({starSelectorShow:'inline-block'})}>
                        <Stars score={this.state.selectedScore}  />
                        <ul className="starSelector" style={{display:this.state.starSelectorShow}}>
                            {
                                !!userInfo &&
                                starSelector.reverse().map( (item,key) => 
                                    <li onClick={(e)=>this.selectStar(e,item) }><Stars score={item} /> {starSelectorDesc[key]}</li>
                                )
                            }
                        </ul>
                    </div>
                    <textarea onChange={(e) => this.handleChange(e,'reviewWrite')} value={this.state.reviewWrite} id="reviewWrite" placeholder="후기 내용을 작성해주세요. (최대 500자)" ref={(input) => { this.textArea = input; }}  />
                    <button type="button" onClick={()=>this.writeReview()}>등록</button>
                </div>
            </div>
        )
    }                        
}

export default Review;