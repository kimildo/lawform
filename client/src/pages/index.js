import React from 'react'
// import Head from 'next/head';
import dynamic from 'next/dynamic'
import Popup from '../components/main/popup'
// import { Helmet } from "react-helmet"

const Header = dynamic(() => import('../components/common/header_new'),{ssr:false})
const Main = dynamic(() => import('../components/main/main'),{ssr:false})

const index = () => {

    return (
        <div className="home">
            {/* <Head>
                <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script> 
                <script dangerouslySetInnerHTML={{ __html: `
                    var _nasa={};
                    _nasa["cnv"] = wcs.cnv("1","10"); // Acecounter
                `}} />
            </Head> */}
            {/* <Helmet meta={[
                { "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }
                ]} /> */}
            <Header />
            <Popup />
            <Main />
        </div>
    );
};

export default index
// /* 변호사 개인 화면 */
// export { default as LawyerProfile } from './lawyer_profile'
// export { default as LawyerSale } from './lawyer_sale'
// export { default as LawyerContractReview } from './lawyer_contract_review'
// export { default as LawyerContractRequest } from './lawyer_contract_request'
// export { default as LawyerMydocument } from './lawyer_mydocument'
// export { default as LawyerPurchasehistory } from './lawyer_purchasehistory'
// export { default as LawyerMyquestion } from './lawyer_myquestion'
// export { default as LawyerQna } from './lawyer_qna'

// /* 일반 회원 개인 화면 */
// export { default as MemberDocument } from './member_document'
// export { default as MemberDocumentRequest } from './member_document_request'
// export { default as MemberPurchaseHistory } from './member_purchasehistory'

// /* 변호사 첨삭 관련 문건 뷰어 */
// export { default as DocPreview } from './doc_preview'
// export { default as DocLawyerEdit } from './doc_lawyer_edit'
// export { default as DocLawyerReviewRequest } from './doc_lawyer_review_request'
// export { default as DocLawyerSealRequest } from './doc_lawyer_seal_request'
// export { default as DocLawyerRequestComplete } from './doc_lawyer_request_complete'
// export { default as DocLawyerRevision } from './doc_lawyer_revision'
