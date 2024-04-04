import React ,{Fragment}from 'react'
import 'react-app-polyfill/ie11'
import User from '../utils/user'

import "flatpickr/dist/flatpickr.min.css"
import 'react-datepicker/dist/react-datepicker.css'

import '../scss/fonts.scss'
import '../scss/override.scss'
import '../scss/common/header.scss'
import '../scss/common/header_new.scss'
import '../scss/common/footer.scss'
import '../scss/mypage/common.scss'
import '../scss/main/main.scss'
import '../scss/detail/detaildocument.scss'
import '../scss/customer.scss'
import '../scss/startup.scss'
import '../scss/magazine.scss'
import '../scss/autoform/header.scss'
import '../scss/mypage/userdocument.scss'
import '../scss/mypage/purchasehistory.scss'
import '../scss/presentation.scss'
import '../scss/main/category.scss'
import '../scss/plans.scss'
import '../scss/component/tmp.scss'
import '../scss/common/modal.scss'
import '../scss/mypage/questionmodal.scss'
import '../scss/mypage/userquestion.scss'
import '../scss/category.scss'
import '../scss/common/paging.scss'
//import '../scss/common/signup.scss'
import '../scss/common/signupv2.scss'
import '../scss/autoform/signup.scss'
// import '../scss/correction/correction.scss'
// import '../scss/correction/request.scss'
import '../scss/page/doc/sidebar.scss'
import '../scss/payment.scss'
import '../scss/autoform/autoformmain.scss'
import '../scss/mypage/review.scss'
import '../scss/instructions/common.scss'
import '../scss/common/stars.scss'
import '../scss/info/service.scss'
import '../scss/mypage/userinfo.scss'
import '../scss/common/qna.scss'
import '../scss/autoform/autoformtitle.scss'
import '../scss/mypage/userfavorite.scss'
import '../scss/newsitem/newsitem.scss'
import '../scss/info/company.scss'
import '../scss/instructions/company.scss'
import '../scss/common/signin.scss'
import '../scss/mypage/firstsurvey.scss'
import '../scss/common/finduser.scss'
import '../scss/common/changepw.scss'
import '../scss/common/findpw.scss'
import '../scss/instructions/paymentorder.scss'
import '../scss/common/signupagreement.scss'
import '../scss/autoform/autoformguide.scss'
import '../scss/autoform/autoformheader.scss'
import '../scss/autoform/autoformsave.scss'
import '../scss/page/doc/toolbar.scss'
import '../scss/category/review.scss'
import '../scss/page/doc/sidebar.scss'
import '../scss/component/layout.scss'
import '../scss/component/table.scss'
import '../scss/component/button.scss'
import '../scss/component/input.scss'
import '../scss/component/align.scss'
import '../scss/component/text.scss'
import '../scss/component/list.scss'
import '../scss/page/doc/container.scss'
import '../scss/page/doc/page_view.scss'
import '../scss/event/attoneysvc.scss'
import '../scss/instructions/certifications.scss'
import '../scss/instructions/reviews.scss'
import '../scss/page/lawyer/contract.scss'
import '../scss/component/pagination.scss'
import '../scss/page/lawyer/sale.scss'
import '../scss/main/main.scss'
import '../scss/main/newdocs.scss'
import '../scss/main/popup.scss'
import '../scss/main/swipe.scss'
import '../scss/preview.scss'
import '../scss/autoform/autoformheader.scss'
import '../scss/autoform/autoformsave.scss'
import '../scss/categorydetail/categorydetail.scss'
import '../scss/legalsolution.scss'
import '../scss/page/member/document_request.scss'
import '../scss/event.scss'
import '../scss/common/legalnotice.scss'
import '../scss/member/profile.scss'
import '../scss/autoform/signup.scss'
import '../scss/common/payment/default.scss'
import '../scss/style.scss'
import '../scss/media.scss'
import App from 'next/app'
import Seo from '../components/common/seo'

class MyApp extends App {

  constructor( props) {
    super(props)
    this.state = {
		login: 'N',
		idusers: '',
		username: ''
  	}
	if( process.browser ) {
		let userInfo = User.getInfo();
        if (!!userInfo) {
            this.state.login = 'Y';
            this.state.idusers = userInfo.idusers;
            this.state.username = userInfo.username;
        } else {
            this.state.login = 'N';
        }
	}
  }
	render() {
		const { Component, pageProps } = this.props
		return (
			<Fragment>
				<Seo {...pageProps}/>
				<Component {...pageProps} />
			</Fragment>
		)
	}
}

export default MyApp