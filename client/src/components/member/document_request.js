import React, { Component } from 'react';
import Link from 'next/link';
import Common from '../mypage/common';

// import '../../scss/component/layout.scss';
// import '../../scss/component/table.scss';
// import '../../scss/component/button.scss';
// import '../../scss/component/banner.scss';
// import '../../scss/component/input.scss';
// import '../../scss/component/align.scss';
// import '../../scss/component/text.scss';
// import '../../scss/component/navigation.scss';
// import '../../scss/component/tmp.scss';

// import '../../scss/page/member/document_request.scss';

import Api from '../../utils/apiutil';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import helper_date from '../../helper/helper_date';
import helper_url from '../../helper/helper_url';
import helper_pagination from '../../helper/helper_pagination';

class DocumentRequest extends Component {
    constructor(props) {
        super(props);
        console.log("DocumentRequest")

        this.state = {
            "ui" : {
                "per_page"      : 10,
                "current_page"  : props.currentPage,
                "status"        : "loading"   // loading, complete, error
            },
            "data" : {
                "document_list" : [],
                "select_list" : {}
            },
            "msg" : {
                "no_download_document_selected_error" : "다운로드할 문서를 선택해주세요.",
                "no_delete_document_selected_error" : "삭제할 문서를 선택해주세요.",
                "document_delete_error" : "삭제에 실패하였습니다.",
                "document_delete_confirm" : "삭제하시겠습니까?",
            }
        };
    }

    componentDidMount() {
        var that = this;
        var state = this.state;
        Api.sendPost(helper_url.api.writing_peer.get_request_list, {"sort" : "desc"}).then((result) => {
            if (result.status === 'ok') {
                state.ui.status             = "complete";
                state.data.document_list    = result.data.data
            } else state.ui.status = "error";
            that.setState(state);
        });
    }

    handleSelectAll = evt => {
        var state = this.state;
        var selectList = this.state.data.select_list;
        var documentList = this.state.data.document_list;

        if(documentList.length == Object.keys(selectList).length){
            console.log('if')
            selectList = {}
        } else{
            console.log('else')
            documentList.map(x => {
                selectList[x['idx']] = {
                    "file":x.file
                }
            })
        }
        console.log(selectList)

        state.data.select_list = selectList
        this.setState(state);
    }

    handleSelect = evt => {
        var state = this.state
        var documentList = this.state.data.document_list
        var selectList = this.state.data.select_list;
        var value = parseInt(evt.target.value)
        var idx = documentList[value]["idx"]

        if(evt.target.checked === true){
            selectList[idx] = {
                "file":documentList[value].file
            }

        } else {
            delete selectList[idx]
        }

        console.log(selectList)

        state.data.select_list = selectList
        this.setState(state);
    }

    handleGetWord = evt => {
        if( Object.keys(this.state.data.select_list).length <= 0 ) {
            alert(this.state.msg.no_download_document_selected_error);
            return false;
        }
    }

    handleGetPdf = evt => {
        if( Object.keys(this.state.data.select_list).length <= 0 ) {
            alert(this.state.msg.no_download_document_selected_error);
            return false;
        }

        var docs = this.state.data.select_list
        var zip = new JSZip();


        var savefile = "lawform.zip";
        var files = []

        for (const [index, value] of Object.entries(docs)) {
            if( !!value && !!value.file && value.file !== 'saving' && value.file !== 'nofile' ) files.push( value.file )
        }

        var count = 0;

        files.map((file)=> {
            // var file = url.file.substr(url.file.lastIndexOf("/")+1);
            axios({
            //url: "/print/"+file,
            url: "/documents/usage_1.pdf", // temp
            method: 'GET',
            responseType: 'blob',}).then((response, err) => {
                if(err) {
                    throw err;
                } else {
                    zip.file(file, response.data, {binary:true});
                    count++;
                    if ( count === files.length ) {
                        zip.generateAsync({type:'blob'}).then(function(content) {
                            saveAs(content, savefile);
                        });
                    }

                }
            });
        });
    }

    handleDelete = () => {
        var state = this.state
        if( Object.keys(this.state.data.select_list).length <= 0 ) {
            alert(state.msg.no_delete_document_selected_error);
            return false;
        }

        if(window.confirm(state.msg.document_delete_confirm)){
            var selects = state.data.select_list
            var docs = state.data.document_list
            var rest = [];
            var ids = "";

            for(var key in selects){
                ids = ids + key + ","
            }

            ids = ids.substring(0, ids.length-1)

            Api.sendPost(helper_url.api.writing_peer.delete, {"ids":ids}).then((res)=>{
                if(res.status === 'ok'){
                    for(var key in selects){
                        docs = docs.filter(function(elem){
                            return parseInt(elem["idx"]) !== parseInt(key)
                        })
                    }

                    state.data.document_list = docs
                    this.setState(state);
                } else{
                    alert(this.state.msg.document_delete_error);
                    return false
                }
            });
        }
    }

    render() {
        var that = this;
        var pagination_html = helper_pagination.html(helper_url.service.member.request_list, this.state.ui.current_page, this.state.ui.per_page, this.state.data.document_list.length);
        return (
            <div>
                <Common></Common>
                <div className="container-blog">

                    <ul className="mypage_tabs mypage_tabs-addon">
                        <li className="active"><Link href="">내 문서 보관함</Link></li>
                        <li><Link href="">구매내역</Link></li>
                    </ul>

                    <div className="tab-submenu">
                        <div className="menu-item"><Link href="/member/document/">전체 문서</Link></div>
                        <div className="menu-item menu-item-active">변호사 서비스 신청 문서</div>
                        {/*<div className="menu-item">보관기간 만료 문서</div>*/}
                    </div>

                    <div className="table-banner">
                        <ul>
                            <li>문서는 구매 후 7일 동안 작성 가능하며, 6개월 동안 자동으로 보관됩니다.</li>
                            <li>작성기한까지는 문서를 언제든지 작성하고 자유로운 편집을 할 수 있습니다.</li>
                            <li>보관기한까지는 문서를 언제든지 다운로드 또는 인쇄하실 수 있습니다.</li>
                            <li>작성기한이나 보관기한이 만료 시에는 기한 연장을 통해 편집 또는 보관하실 수 있습니다.</li>
                        </ul>
                    </div>

                    <div className="table">
                        <div className="table-options">
                            <div className="title">
                                전체 {this.state.data.document_list.length}건
                            </div>
                            <div className="option-wrapper">
                                <div className="option-item">
                                    <div className="btn btn-default" onClick={this.handleGetWord}>
                                        MS Word
                                        <img className="left-margin-10" src="/common/down-white.svg"/>
                                    </div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={this.handleGetPdf}>
                                        PDF
                                        <img className="left-margin-10" src="/common/down-darkblue.svg"/>
                                    </div>
                                </div>
                                <div className="option-item">
                                    <div className="btn btn-default btn-outline-default" onClick={this.handleDelete}><img src="/common/trash.svg"/></div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" checked={(Object.keys(this.state.data.select_list).length == this.state.data.document_list.length) ? true : false } onClick={this.handleSelectAll}/></th>
                                    <th>문서명</th>
                                    <th>제목</th>
                                    <th>마감 기한 (영업일 기준)</th>
                                    <th>진행상황</th>
                                    <th>담당 변호사</th>
                                </tr>
                            </thead>
                            <tbody className="member-document-request-list">
                                {this.state.data.document_list.map((item, i) => {
                                    var state = this.state
                                    return (
                                        <tr>
                                            <td>
                                                <input type="checkbox" checked={(!!this.state.data.select_list[item["idx"]])} onClick={this.handleSelect} value={i}/>
                                            </td>

                                            <td className="text-center">
                                                <div className="document-name">{item.category_name}</div>
                                            </td>

                                            <td>
                                                <div className="big-title">{item.category_name}</div>
                                                <div className="blue-small-title">
                                                    요청일시 : {helper_date.get_full_date_with_text(item.request_date_time)}
                                                </div>
                                            </td>

                                            <td className="text-center text-gray">
                                                <div className="big-title">
                                                    {helper_date.diff_two_dates(item.apply_end_date_time, item.request_date_time, true)}일 이내
                                                </div>
                                                <div className="blue-small-title">
                                                    요청일시 : {helper_date.get_full_date_with_text(item.request_date_time)}
                                                </div>
                                            </td>

                                            <td className="text-center text-gray">
                                                {
                                                    (item.processing_status === 1) ?
                                                    <div className="process">
                                                        <span className="text-blue">요청 ▸</span>
                                                        진행 ▸ 완료
                                                    </div> :
                                                    (item.processing_status === 2) ?
                                                    <div className="process">
                                                        <span className="text-black">요청 ▸</span>
                                                        <span className="text-blue">진행 ▸</span>
                                                        완료
                                                    </div> :
                                                    <div className="process">
                                                        <span className="text-black">요청 ▸</span>
                                                        <span className="text-black">진행 ▸</span>
                                                        <span className="text-blue">완료</span>
                                                    </div>
                                                }
                                                <div className="row">
                                                    <div className="btn btn-dark" disabled>
                                                        문서 확인
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-center">
                                                <div className="lawyer-link">
                                                    {item.lawyer} 변호사
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {this.state.data.document_list <= 0 ? (
                                    <tr>
                                        <td className="empty-row" colSpan="6">
                                            <div className="empty-msg">
                                                <div className="small-msg">
                                                    변호사 서비스를 신청한 문서가 없습니다.
                                                </div>
                                                <div className="large-msg">
                                                    변호사 서비스 신청은 내 문서 관리 &gt; 전체 문서 혹은 작성/수정하기 &gt; 변호사 직인/검토 서비스 버튼을 통해서 하실 수 있습니다.
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    ) : null}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="6">{pagination_html}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default DocumentRequest;
