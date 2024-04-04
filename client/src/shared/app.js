import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Home, Signup, Mypage, Myinfo, Purchasehistory, Mydocument, Myfavorite, Myquestion, Autoform, Document, Categorydetail, Company, Service, Payment, Legalnotice /*, Detail*/ } from '../pages';
import { Preview, Category, Customer, Paged, Prewrite, Newsitem, Instructions, Event, Startup, Preparser, ErrorNotFound , Presentation, Legalsolution , Magazine} from '../pages'

import { LawyerProfile, LawyerSale, LawyerContractReview, LawyerContractRequest, LawyerContractEdit, LawyerMydocument, LawyerPurchasehistory, LawyerMyquestion, LawyerQna } from '../pages';
import { MemberDocument, MemberDocumentRequest, MemberPurchaseHistory, DocPreview } from '../pages';
import { DocLawyerReviewRequest, DocLawyerSealRequest, DocLawyerRequestComplete, DocLawyerEdit, DocLawyerRevision } from '../pages';
import { Plans } from '../pages';

class App extends Component {

    componentDidUpdate = () => {
        window.scrollTo(0, 0)
    }

    render () {
        return (
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/mypage" component={Mypage}/>
                <Route path="/myinfo" component={Myinfo}/>
                <Route path="/purchasehistory" component={Purchasehistory}/>
                <Route path="/mydocument" component={Mydocument}/>
                <Route path="/myfavorite" component={Myfavorite}/>
                <Route path="/myquestion" component={Myquestion}/>
                <Route path="/autoform/:document" component={Autoform}/>
                <Route path="/document" component={Document}/>
                <Route path="/categorydetail/:category" component={Categorydetail}/>
                <Route path="/company" component={Company}/>
                <Route path="/service" component={Service}/>
                <Route path="/payment" component={Payment}/>
                <Route path="/preview/:document" component={Preview}/>
                <Route path="/category/:category" component={Category}/>
                <Route path="/customer/:service" component={Customer}/>
                <Route path="/customer/:service/(:idx)" component={Customer}/>
                <Route path="/customer" render={(e) => ((e.location.pathname === '/customer' || e.location.pathname === '/customer/') && <Redirect to="/customer/faq"/>)}/>
                <Route path="/paged" component={Paged}/>
                <Route path="/prewrite/:document" component={Prewrite}/>
                <Route path="/press" component={Newsitem}/>
                <Route path="/instructions/:document" component={Instructions}/>
                {/*<Route path="/detail/:doc" component={Detail} />*/}
                <Redirect from="/detail/:document" to="/instructions/:document"/>
                <Route path="/event/:event" component={Event}/>
                <Route path="/preparser/:token" component={Preparser} />
                <Route path="/preparser/:token/:peer" component={Preparser} />

                <Route path="/lawyer/profile" component={LawyerProfile} />
                <Route path="/lawyer/sale" component={LawyerSale} />
                <Route path="/lawyer/contract/review/" component={LawyerContractReview} />
                <Route path="/lawyer/contract/request" component={LawyerContractRequest} />
                <Route path="/lawyer/mydocument" component={LawyerMydocument} />
                <Route path="/lawyer/purchasehistory" component={LawyerPurchasehistory} />
                <Route path="/lawyer/myquestion" component={LawyerMyquestion} />
                <Route path="/lawyer/qna" component={LawyerQna} />
                <Route path="/lawyer/category/:category" component={Category}/>

                {/*<Route path="/lawyer/contract/request/:request_type" component={LawyerContractRequest} />*/}

                <Route exact path="/member/purchasehistory/" component={MemberPurchaseHistory} />
                <Route exact path="/member/document_request/" component={MemberDocumentRequest} />
                <Route exact path="/member/document/" component={MemberDocument} />

                <Route path="/doc/preview/:writing_idx/:writing_peer_review_idx" component={DocPreview} />
                <Route path="/doc/lawyer/edit/:writing_idx/:writing_peer_review_idx" component={DocLawyerEdit} />
                <Route path="/doc/lawyer/review/request/:writing_idx" component={DocLawyerReviewRequest} />
                <Route path="/doc/lawyer/seal/request/:writing_idx" component={DocLawyerSealRequest} />
                <Route path="/doc/lawyer/request/complete/:writing_idx/:writing_peer_review_idx" component={DocLawyerRequestComplete} />
                <Route path="/doc/lawyer/revision/:writing_idx/:writing_peer_review_idx" component={DocLawyerRevision} />

                <Route path="/startup" component={Startup}/>
                <Route path="/presentation/:pt" component={Presentation}/>
                <Route path="/legalsolution" component={Legalsolution}/>
                <Route path="/magazine/:idx" component={Magazine}/>
                <Route path="/magazine" component={Magazine}/>
                <Route path="/legalnotice" component={Legalnotice}/>
                <Route path="/plans" component={Plans}/>

                <Route component={ErrorNotFound}/>
            </Switch>
        )
    }
}

export default App;
