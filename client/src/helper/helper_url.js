module.exports = {
    api: {
        writing: {
            renew: '/v2/writing/renew/',
            get_document_elemement_list: '/v2/writing/get_document_element_list/',
            get_members_list: '/v2/writing/get_list/',
            get: '/v2/writing/get/',
            delete: '/v2/writing/delete/',
            update: '/writing/updatetitle',
            download: '/writing/download',
        },
        writing_peer: {
            create: '/v2/writing_peer_review/create_peer_review/',
            cancel: '/v2/writing_peer_review/cancel_peer_review/',
            accept: '/v2/writing_peer_review/accept/',
            delete: '/v2/writing_peer_review/delete/',
            renew: '/v2/writing_peer_review/renew/',
            retouch: '/v2/writing_peer_review/retouch/',
            get: '/v2/writing_peer_review/get/',
            get_list: '/v2/writing_peer_review/get_list/',
            get_count: '/v2/writing_peer_review/get_count/',
            save: '/v2/writing_peer_review/save/',
            tempsave: '/v2/writing_peer_review/tempsave/',
            complete: '/v2/writing_peer_review/complete/',
            lawyer_content: '/v2/writing_peer_review/lawyer_content/',
            documents_waiting_lawyer: '/v2/writing_peer_review/get_waiting_lawyer_list/',
            documents_requested_service: '/v2/writing_peer_review/documents_requested_service/',
            lawyer_processing_documents: '/v2/writing_peer_review/get_processing_document_list/',
            user_check_complete: '/v2/writing_peer_review/user_check_complete',
            get_user_check_complete: '/v2/writing_peer_review/get_user_check_complete'
        },
        user: {
            upload_profile: '/user/upload_profile',
            get_new_completed: '/user/get_new_completed',
            update_new_completed: '/user/update_new_completed', // 이건 쓰면 안됨
        },
        review: {
            create_review: '/v2/review/create_review',
            get_review_list: '/v2/review/get_review_list',
        }
    },
    service: {
        autoform: '/autoform/',
        purchasehistory: '/purchasehistory',
        member: {
            mydocument_list: '/mydocument',
            //document_list: '/member/document/',
            document_list: '/lawyer/mydocument',
            request_list: '/member/document_request/',
            purchasehistory: '/lawyer/purchasehistory',
            myquestion: '/lawyer/myquestion',
            qna: '/lawyer/qna',
        },
        doc: {
            request_complete: '/doc/lawyer/request/complete/',
            review_seal: '/doc/lawyer/seal/request/',
            review_request: '/doc/lawyer/review/request/',
            lawyer_edit: '/doc/lawyer/edit/',
            preview: '/doc/preview/',
            revision: '/doc/lawyer/revision/'
        },
        lawyer: {
            contract_request: '/lawyer/contract/request',
            contract_request_seal: '/lawyer/contract/request/seal/',
            contract_request_review: '/lawyer/contract/request/review/',
            contract_review: '/lawyer/contract/review',
            sale: '/lawyer/sale',
            profile: '/lawyer/profile',
            document_list: '/lawyer/mydocument',
        },
        assets: {
            profile: '/profiles/',
        }
    }
}
