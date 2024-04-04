import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from '../common/header'
import Footer from '../common/footer'
import Common from '../mypage/common'

import '../../scss/mypage/userdocument.scss'
import '../../scss/member/profile.scss'
import '../../scss/autoform/signup.scss'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Api from '../../utils/apiutil'
import User from '../../utils/user'
import axios from 'axios'
import moment from 'moment'

import helper_url from '../../helper/helper_url'
import helper_date from '../../helper/helper_date'

class Profile extends Component {

    model = 'Heavy Duty' // public 필드 선언
    s3url = 'https://lawform.s3.ap-northeast-2.amazonaws.com/uploads/'
    #numberOfSeats = 5 // private 필드 선언
    #isCrewCab = true
    static #name = 'Truck' // static private 필드 선언

    constructor (props) {
        super(props)
        this.state = {
            data: {
                peer_review_total: 0,
                review_total: 0,
                review_list: [],
            },
            tag_full_list: ['민사', '채권,채무', '손해배상', '가족법', '형사법', '금웅,증권', '회사', '조세,관세,행정소송', '부동산 및 건설', '공정거래', '해상,운송', '노동', '식품,보건,의료,환경', '스포츠,엔터테인먼트,방송,미디어', '국제거래', 'IT,인터넷,지적재산권', '기타'],
            tag_pop: { style: 'popup-tags hide', selected: [] },
            name: { val: '' },
            mobnum: { val: '' },
            office: { val: '' },
            officenum: { val: '' },
            work_tag: { tags: [] },
            legalExperience: { slides: [{ idx: '', type: 1, sdate: '', edate: '', description: '' }] },
            workExperience: { slides: [{ idx: '', type: 2, sdate: '', edate: '', description: '' }] },
            researchExperience: { slides: [{ idx: '', type: 3, sdate: '', edate: '', description: '' }] },
            introduction: { val: '', clear: false },
            bank: {
                bank_name: '',
                bank_acc_no: '',
                bank_acc_owner: ''
            },
            profile_img: '',
            user: User.getInfo()
        }
    }

    componentDidMount () {

        let that = this, state
        Api.sendGet('/user/info').then((res) => {
            const userData = res.data.userData
            console.log('userData', userData)
            state = that.state
            state.name.val = userData.name
            state.mobnum.val = userData.mobile_number
            state.office.val = userData.office_name
            state.officenum.val = userData.office_number
            state.introduction.val = userData.self_introduction
            state.work_tag.clear = true
            state.work_tag.tags = userData.work_field.split('.')
            state.profile_img = !!userData.profile_img ? this.s3url + userData.profile_img : null

            state.bank.bank_name = userData.bank_name
            state.bank.bank_acc_no = userData.bank_acc_no
            state.bank.bank_acc_owner = userData.bank_acc_owner

            if (!!state.work_tag.tags.length) {
                state.work_tag.tags.map((tag) => {
                    let sele = state.tag_full_list.indexOf(tag)
                    if (sele > -1) {
                        state.tag_pop.selected.push(sele)
                    }
                })
            }

            state.legalExperience.slides = []
            state.workExperience.slides = []
            state.researchExperience.slides = []

            if (!!userData.experience.length) {
                userData.experience.map((item) => {
                    item.sdate = new Date(item.sdate.substr(0, 4) + '-' + item.sdate.substr(4, 6) + '-' + '01')
                    item.edate = new Date(item.edate.substr(0, 4) + '-' + item.edate.substr(4, 6) + '-' + '01')
                    switch (item.type) {
                        case 1: state.legalExperience.slides.push(item); break
                        case 2: state.workExperience.slides.push(item); break
                        case 3: state.researchExperience.slides.push(item); break
                    }
                })
            }

            if (state.legalExperience.slides.length <= 0) {
                state.legalExperience.slides = [{ idx: '', type: 1, sdate: '', edate: '', description: '' }]
            }

            if (state.workExperience.slides.length <= 0) {
                state.workExperience.slides = [{ idx: '', type: 2, sdate: '', edate: '', description: '' }]
            }

            if (state.researchExperience.slides.length <= 0) {
                state.researchExperience.slides = [{ idx: '', type: 3, sdate: '', edate: '', description: '' }]
            }

            that.setState(state)
        })

        let payload = {}
        Api.sendPost(helper_url.api.review.get_review_list, payload).then((res) => {
            let status = res.data.result
            let state = that.state

            if (status === 'ok') {
                state.data.review_list = res.data.data
                state.data.review_total = res.data.cnt
            }

            that.setState(state)
        })

        Api.sendPost(helper_url.api.writing_peer.get_count, payload).then((res) => {
            let status = res.data.result
            let state = that.state
            if (status === 'ok') {
                state.data.peer_review_total = res.data.data.cnt
            }

            that.setState(state)
        })

        that.setState(that.state)
    }

    handleNameChange = evt => {
        let state = this.state
        state.name.val = evt.target.value
        this.setState(state)
    }
    handleMobnumChange = evt => {
        let state = this.state
        state.mobnum.val = evt.target.value
        this.setState(state)
    }

    handleOfficeChange = evt => {
        let state = this.state
        state.office.val = evt.target.value
        this.setState(state)
    }
    handleOfficenumChange = evt => {
        let state = this.state
        state.officenum.val = evt.target.value
        this.setState(state)
    }

    handleBankChange = evt => {
        let state = this.state
        state.bank[evt.target.name] = evt.target.value
        this.setState(state)
    }

    /* ************************************************
     * 경력정보 */

    // 팝업 열기
    handlesTagPopupOpen = evt => {
        let state = this.state
        state.tag_pop.style = 'popup-tags'
        this.setState(state)
    }

    // 팝업 닫기
    handlesTagPopupClose = evt => {
        let state = this.state
        state.tag_pop.style = 'popup-tags hide'
        this.setState(state)
    }

    // 팝업 선택 완료
    handlesTagPopupComplete = evt => {
        let name_list = []
        let state = this.state
        for (let i = 0; i < state.tag_pop.selected.length; i++) {
            let item = state.tag_pop.selected[i]
            name_list.push(state.tag_full_list[item])
        }
        state.work_tag.clear = state.tag_pop.selected.length >= 1
        state.work_tag.tags = name_list
        this.handlesTagPopupClose(evt)
    }

    handlesTagClick = evt => {
        evt.preventDefault()
        let state = this.state
        let index = parseInt(evt.target.id), skip = false, new_list = []
        if (Number.isNaN(index)) {
            return
        }

        // 이미 선택 한 아이를 취소하는 것인지
        for (let i = 0; i < state.tag_pop.selected.length; i++) {
            let item = state.tag_pop.selected[i]
            if (item == index) {
                skip = true
                continue
            }
            new_list.push(item)
        }
        if (skip) {
            state.tag_pop.selected = new_list
            this.setState(state)
            return
        }

        // 이미 없는 아이면 선택
        // 근데 먼저 3개 이상인지 보장
        if (state.tag_pop.selected.length >= 3) {
            alert('최대 3개만 선택 가능합니다.')
            return
        }

        state.tag_pop.selected.push(index)
        this.setState(state)
    }

    /*  법조 업무 경력   */
    //  추가 버튼
    handleLawExperienceAdd = evt => {
        evt.preventDefault()
        let state = this.state
        state.legalExperience.slides.push({ idx: '', type: 1, sdate: '', edate: '', description: '' })
        this.setState(state)
    }

    // 삭제 버튼
    handleLawExperienceRemove = evt => {
        evt.preventDefault()
        let remove_idx = parseInt(evt.target.id)
        let state = this.state
        delete state.legalExperience.slides[remove_idx]
        this.setState(state)
    }

    // 시작 날짜 입력
    handleLawExperienceSdate = (idx, date) => {
        let state = this.state
        state.legalExperience.slides[parseInt(idx)].sdate = date
        this.setState(state)
    }

    // 끝 날짜 입력
    handleLawExperienceEdate = (idx, date) => {
        let state = this.state
        state.legalExperience.slides[parseInt(idx)].edate = date
        this.setState(state)
    }

    // 내용/설명 입력
    handleLawExperienceContent = evt => {
        let state = this.state
        state.legalExperience.slides[parseInt(evt.target.id)].description = evt.target.value
        this.setState(state)
    }

    /*  주요 업무 사례   */
    // 추가 버튼
    handleWorkExperienceAdd = evt => {
        evt.preventDefault()
        let state = this.state
        state.workExperience.slides.push({ idx: '', type: 2, sdate: '', edate: '', description: '' })
        this.setState(state)
    }

    // 삭제 버튼
    handleWorkExperienceRemove = evt => {
        evt.preventDefault()
        let remove_idx = parseInt(evt.target.id)
        let state = this.state
        delete state.workExperience.slides[remove_idx]
        this.setState(state)
    }

    // 시작 날짜 입력
    handleWorkExperienceSdate = (idx, date) => {
        let state = this.state
        state.workExperience.slides[parseInt(idx)].sdate = date
        this.setState(state)
    }

    // 내용/설명 입력
    handleWorkExperienceContent = evt => {
        let state = this.state
        state.workExperience.slides[parseInt(evt.target.id)].description = evt.target.value
        this.setState(state)
    }

    /*  논문, 컬럼, 저서   */
    // 추가 버튼
    handleResearchExperienceAdd = evt => {
        evt.preventDefault()
        let state = this.state
        state.researchExperience.slides.push({ idx: '', type: 3, sdate: '', edate: '', description: '' })
        this.setState(state)
    }

    // 삭제 버튼
    handleResearchExperienceRemove = evt => {
        evt.preventDefault()
        let remove_idx = parseInt(evt.target.id)
        let state = this.state
        delete state.researchExperience.slides[remove_idx]
        this.setState(state)
    }

    // 시작 날짜 입력
    handleResearchExperienceSdate = (idx, date) => {
        let state = this.state
        state.researchExperience.slides[parseInt(idx)].sdate = date
        this.setState(state)
    }

    // 내용/설명 입력
    handleResearchExperienceContent = evt => {
        let state = this.state
        state.researchExperience.slides[parseInt(evt.target.id)].description = evt.target.value
        this.setState(state)
    }

    /* ************************************************
     * 자기 소개 */
    // 자기 소개
    handlesIntroductionChange = evt => {
        let state = this.state
        this.state.introduction.val = evt.target.value
        this.setState(state)
    }

    /* ************************************************
     * 회원가입 */
    handlesSubmit = evt => {

        // 현재 상태
        let state = this.state

        // 서버에게 전송 할 데이터 값
        let payload = {
            base: {},      // 기본 회원 테이블에 들어 갈 것들, 이렇게 구분하는 이유는 서버에서 쉽게 처리 할 수 있기 위해서
            experience: [] // 경력 테이블에 들어 갈 것들
        }

        // 필수 입력 사항 중에서 승인 안 된 아이 찾기
        if (state.name === '') {
            alert('이름을 입력해주세요')
            return
        }
        if (state.mobnum === '') {
            alert('휴대폰번호를 입력해주세요')
            return
        }
        if (state.office === '') {
            alert('사무실 소속 입력해주세요')
            return
        }
        if (state.officenum === '') {
            alert('사무실 대표 전화번호 입력해주세요')
            return
        }
        if (!state.work_tag.clear) {
            alert('주요 업무 분야 1개 이상 선택해주세요')
            return
        }
        if (state.introduction === '') {
            alert('자기소개 입력해주세요')
            return
        }

        /*
         payload.base.{이부분} 이름이 변수과 다른 이유는 실때 데이터베이스 테이블과 이름 동일
         이렇게 함으로써 깔끔~
        */
        // 휴대폰인증
        payload.base.name = state.name.val                 // 이름
        payload.base.mobile_number = state.mobnum.val               // 휴대폰 번호

        // 사무실 정보
        payload.base.office_name = state.office.val               // 소속명
        payload.base.office_number = state.officenum.val            // 대표 전화번호

        // 주요 업무 분야
        payload.base.work_field = ''
        for (let i = 0; i < state.work_tag.tags.length; i++) {
            if (i) {
                payload.base.work_field += '.'
            }
            payload.base.work_field += state.work_tag.tags[i]
        }

        // 자기소개
        payload.base.self_introduction = state.introduction.val         // 자기소개


        // 계좌정보
        payload.base.bank_name = state.bank.bank_name
        payload.base.bank_acc_no = state.bank.bank_acc_no
        payload.base.bank_acc_owner = state.bank.bank_acc_owner


        /*
            payload.experience 안에 경력 모든 내용 합함. 왜냐면 다 같은 table 이니깐 ㅎㅎ
            데이터 구조 예)
                         payload.experience[
                            {type: 1, sdate: "201901", edate: "201902", description: "오지게 일했습니다."},
                            {type: 2, sdate: "201901", edate: "",       description: "오지게 일했습니다."},
                            {type: 3, sdate: "201901", edate: "",       description: "오지게 일했습니다."}
                        ]
            type 구분은 법조 경력, 주용업부, 논문 구분을 위한 것!
            type 2 & 3는 edate 입력 받지 않지만 DB에는 존재하면 그냥 "" 로 나둡니다.
        */
        // 법조 업무 경력 concatanation으로 통해서 합치장!
        payload.experience = payload.experience.concat(state.legalExperience.slides)

        // 주요 업무 경력 concatanation으로 통해서 합치장!
        payload.experience = payload.experience.concat(state.workExperience.slides)

        // 논문, 컬럼, 저서 경력 concatanation으로 통해서 합치장!
        payload.experience = payload.experience.concat(state.researchExperience.slides)

        payload.profile_img = state.profile_img

        // check for empty items
        let remove_idx = []
        for (let i = 0; i < payload.experience.length; i++) {
            if (typeof payload.experience[i] !== 'undefined') {
                if (payload.experience[i].sdate === '' || payload.experience[i].description === '') {
                    remove_idx.push(i)
                } else {
                    if (payload.experience[i].sdate !== '') {
                        let d = new Date(payload.experience[i].sdate)
                        payload.experience[i].sdate = d.getFullYear() + '' + ('0' + (d.getMonth() + 1)).slice(-2)
                    }
                    if (payload.experience[i].edate !== '') {
                        let d = new Date(payload.experience[i].edate)
                        payload.experience[i].edate = d.getFullYear() + '' + ('0' + (d.getMonth() + 1)).slice(-2)
                    }
                }
            }
        }
        for (let i = 0; i < remove_idx.length; i++)
            delete payload.experience[remove_idx[i]]

        Api.sendPost('/user/lawyer_update', payload).then((result) => {

            if (result.status === 'ok') {
                alert('업데이트 되었습니다.')
            } else {
                alert('업데이트 중 오류가 발생하였습니다.')
            }

            document.location.reload(true)
        }).catch(e => {
            console.log(e.message)
            alert('업데이트 중 오류가 발생하였습니다.')
        })
    }

    // 프로필 이미지 변경
    handleImageChange = evt => {

        let state = this.state
        let file = evt.target.files[0]
        let ext = file.name.split('.').pop()
        let timestamp = moment().format('YMMDDHHmmss')
        let path = state.user.idusers + '_' + timestamp + '.' + ext

        const profileData = new FormData()
        profileData.append('file', file, path)

        let apiHost = process.env.REACT_APP_APIHOST
        axios.post(apiHost + helper_url.api.user.upload_profile, (profileData)).then(res => {

            if (res.data.result !== 'ok') { // 이미지 업로드가 완료된 경우 이미지 경로 지정
                alert('업데이트 중 오류가 발생하였습니다.')
                return
            }

            let payload = { 'idx': this.state.user.idusers, 'path': path }
            Api.sendPost('/user/profile_update', payload).then((result) => {
                if (result.status === 'ok') {
                    alert('이미지가 변경되었습니다.')
                } else {
                    alert('업데이트 중 오류가 발생하였습니다.')
                }

                state.profile_img = this.s3url + path
                this.setState(state)
            })
        })
    }

    // 리뷰 평점을 토대로 별점 그리기
    drawReviewStar = (avg) => {
        let stars = []
        let i = 1

        // 색칠된 별
        for (; i <= avg; i++) {
            stars.push(<span className="star on"/>)
        }

        // 반쪽 별
        if (avg !== Number(avg)) {
            stars.push(<span className="star half"/>)
            i++
        }

        // 빈 별
        for (; i <= 5; i++) {
            stars.push(<span className="star off"/>)
        }

        return stars
    }

    render () {
        let that = this
        let sum, avg = 0

        if (this.state.data.review_total === 1) {
            avg = this.state.data.review_list[0].score / 20.0
        } else if (this.state.data.review_total > 1) {
            sum = this.state.data.review_list.reduce(function (a, b) {return a.score + b.score})
            avg = sum / this.state.data.review_list.length / 20.0
        } else {
            avg = 0
        }

        return (
            <div className="main">
                <div className="visual">
                    <h2>프로필 관리</h2>
                    <h3 className="mobile_hide">내 정보를 수정하고 관리하세요.</h3>
                </div>

                <div className="signup-container lawyer-contract-review container-blog contents">

                    <ul className="tabs">
                        <li className={'active'}>내 정보 수정</li>
                    </ul>

                    <div className={`${this.state.tag_pop.style}`}>
                        <div className="popup-background" onClick={this.handlesTagPopupClose}></div>
                        <div className="popup-block">
                            <div className="popup-block-head">
                                <div className="popup-block-title">주요 업무 분야 (3개 선택 가능)</div>
                            </div>
                            <div className="popup-block-body">
                                {this.state.tag_full_list.map(function (item, i) {

                                    return (
                                        <div key={i} className="legal">
                                            <label id={i} onClick={that.handlesTagClick}>
                                                <input type="checkbox" id={i} value="1" disabled={true} checked={!!that.state.tag_pop.selected.includes(i)} />
                                                <span id={i} className="checkmark"/>
                                                {item}
                                            </label>
                                        </div>)
                                })}
                            </div>
                            <div className="popup-block-footer">
                                <div className="btn btn-gray" onClick={this.handlesTagPopupClose}>취소</div>
                                <div className="btn btn-blue" onClick={this.handlesTagPopupComplete}>확인</div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-container lawyer-contract-wrap">

                        <div className="information-container">
                            <div className="information-block">
                                <div className="information-header">
                                    <div>기본정보</div>
                                </div>

                                <div className="profile-block">

                                    <div className="profile-img">
                                        <div className="img-wrapper">
                                            <img src={!!this.state.profile_img ? this.state.profile_img : '/mypage_img/noprofile.png'} alt="프로필 이미지"/>
                                            <div className="img-change-btn">
                                                <input type="file" id="profile-file" style={{ display: 'none' }} name="file" onChange={this.handleImageChange}/>
                                                <label htmlFor="profile-file">변경</label>
                                            </div>
                                        </div>
                                        <div className="name">
                                            {that.state.name.val} <span>변호사</span>
                                        </div>
                                    </div>

                                    {/*<div className="profile-rating">
                                        <div className="review">
                                            <div className="review-info">
                                                <div className="stars">
                                                    {this.drawReviewStar(avg)}
                                                </div>
                                                <span className="score">{avg}</span>

                                                <div className="count">{this.state.data.review_total}개의 평가</div>
                                            </div>
                                        </div>
                                        <div className="work-count">총 작업 개수 {this.state.data.peer_review_total}개</div>
                                    </div>*/}

                                </div>

                                <div className="information-body" style={{ display: 'inline-block', paddingLeft: 30, paddingBottom: 25 }}>
                                    <div className="input-row">
                                        <div className="title">이름</div>
                                        <div className="input-wrapper">
                                            <input type="text" value={this.state.name.val} onChange={this.handleNameChange}/>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="title">휴대폰 번호</div>
                                        <div className="input-wrapper">
                                            <input type="text" value={this.state.mobnum.val} onChange={this.handleMobnumChange}/>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="title">변호사 직인</div>
                                        <div className="input-wrapper">
                                            <div className="layer-seal-wrapper">
                                                <div className="layer-seal"><span>변호사{this.state.name.val}</span></div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="information-block">
                                <div className="information-header">계좌정보</div>
                                <div className="information-body">
                                    <div className="input-row">
                                        <div className="title">은행명</div>
                                        <div className="input-wrapper">
                                            <input type="text" name={'bank_name'} value={this.state.bank.bank_name} onChange={this.handleBankChange}/>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="title">계좌번호</div>
                                        <div className="input-wrapper">
                                            <input type="text" name={'bank_acc_no'} value={this.state.bank.bank_acc_no} onChange={this.handleBankChange}/>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="title">예금주</div>
                                        <div className="input-wrapper">
                                            <input type="text" name={'bank_acc_owner'} value={this.state.bank.bank_acc_owner} onChange={this.handleBankChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="information-block">
                                <div className="information-header">사무실 정보</div>
                                <div className="information-body">
                                    <div className="input-row">
                                        <div className="title">소속</div>
                                        <div className="input-wrapper">
                                            <input type="text" value={this.state.office.val} onChange={this.handleOfficeChange}/>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="title">대표 전화번호</div>
                                        <div className="input-wrapper">
                                            <input type="text" value={this.state.officenum.val} onChange={this.handleOfficenumChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="information-block">
                                <div className="information-header">경력정보</div>
                                <div className="information-body">

                                    <div className="signup-container clear-out">
                                        <div className="signup-group">
                                            <div className="personal-info">
                                                <div className="personal-info-line"></div>
                                                <div className="personal-info-header">
                                                    <div className="personal-info-title">주요 업무 분야<span>*</span></div>
                                                    <div className="personal-info-option">
                                                        <div className="personal-info-option-button" onClick={this.handlesTagPopupOpen}>선택</div>
                                                    </div>
                                                </div>
                                                <div className="personal-info-body">
                                                    <div className="tag-container">
                                                        {this.state.work_tag.tags.map(function (name, i) {
                                                            return (<div className="tag" key={i}>{name}</div>)
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.legalExperience.slides.map(function (item, i) {
                                                return (<div className="personal-info" key={i}>
                                                    {i === 0 ? (<div className="personal-info-line"/>) : (<div className="personal-info-dash"/>)}
                                                    <div className="personal-info-header">
                                                        <div className="personal-info-title">법조 업무 경력</div>
                                                        <div className="personal-info-option">
                                                            {i === 0 ? <div className="personal-info-option-button" id={i} onClick={that.handleLawExperienceAdd}>추가+</div>
                                                                : <div className="personal-info-option-button" id={i} onClick={that.handleLawExperienceRemove}>삭제x</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="personal-info-body">
                                                        <div className="personal-info-range">
                                                            <div className="personal-info-data">
                                                                <div className="input-box input-box-row pointer-link">
                                                                    <div className="datepicker-wrapper">
                                                                        <DatePicker showMonthYearPicker placeholderText="YYYYMM" dateFormat="yyyyMM" id={i} onChange={(date) => {
                                                                            that.handleLawExperienceSdate(i, date)
                                                                            return false
                                                                        }} selected={item.sdate}/>
                                                                    </div>
                                                                    <img src="/autoform_img/icon-calender.svg" className="icon" alt=""/>
                                                                </div>
                                                            </div>
                                                            <div className="personal-info-break">~</div>
                                                            <div className="personal-info-data">
                                                                <div className="input-box input-box-row pointer-link">
                                                                    <div className="datepicker-wrapper">
                                                                        <DatePicker showMonthYearPicker placeholderText="YYYYMM" dateFormat="yyyyMM" id={i} onChange={(date) => {
                                                                            that.handleLawExperienceEdate(i, date)
                                                                            return false
                                                                        }} selected={item.edate}/>
                                                                    </div>
                                                                    <img src="/autoform_img/icon-calender.svg" className="icon"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-box input-box-row input-box-small-break">
                                                        <textarea placeholder="예시)&#10;2011년 ~ 2019년 OO기업 사내 변호사" id={i} className="textrea-personal-info input-placehoder-14"
                                                                  onChange={that.handleLawExperienceContent} value={item.description}/>
                                                        </div>
                                                    </div>
                                                </div>)
                                            })}

                                            {this.state.workExperience.slides.map(function (item, i) {
                                                return (<div className="personal-info" key={i}>
                                                    {i === 0 ? (<div className="personal-info-line"/>) : (<div className="personal-info-dash"/>)}
                                                    <div className="personal-info-header">
                                                        <div className="personal-info-title">주요 업무 사례</div>
                                                        <div className="personal-info-option">
                                                            {i === 0 ? <div className="personal-info-option-button" id={i} onClick={that.handleWorkExperienceAdd}>추가+</div>
                                                                : <div className="personal-info-option-button" id={i} onClick={that.handleWorkExperienceRemove}>삭제x</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="personal-info-body">
                                                        <div className="personal-info-range">
                                                            <div className="personal-info-data">
                                                                <div className="input-box input-box-row pointer-link">
                                                                    <div className="datepicker-wrapper">
                                                                        <DatePicker showMonthYearPicker placeholderText="YYYYMM" dateFormat="yyyyMM" id={i} onChange={(date) => {
                                                                            that.handleWorkExperienceSdate(i, date)
                                                                            return false
                                                                        }} selected={item.sdate}/>
                                                                    </div>
                                                                    <img src="/autoform_img/icon-calender.svg" className="icon" alt=""/>
                                                                </div>
                                                            </div>
                                                            <div className="personal-info-break"></div>
                                                            <div className="personal-info-data"></div>
                                                        </div>
                                                        <div className="input-box input-box-row input-box-small-break">
                                                        <textarea placeholder="예시)&#10;2015. 4. 다국적 은행인 OO은행 상대, 파생상품불완전 판매로 인한 손해배상청구 소송에서 승소" id={i}
                                                                  className="textrea-personal-info input-placehoder-14" onChange={that.handleWorkExperienceContent}
                                                                  value={item.description}/>
                                                        </div>
                                                    </div>
                                                </div>)
                                            })}

                                            {this.state.researchExperience.slides.map(function (item, i) {
                                                return (<div className="personal-info" key={i}>
                                                    {i === 0 ? (<div className="personal-info-line"/>) : (<div className="personal-info-dash"/>)}
                                                    <div className="personal-info-header">
                                                        <div className="personal-info-title">논문, 컬럼, 저서</div>
                                                        <div className="personal-info-option">
                                                            {i === 0 ? (
                                                                <div className="personal-info-option-button" id={i} onClick={that.handleResearchExperienceAdd}>추가+</div>
                                                            ) : (
                                                                <div className="personal-info-option-button" id={i} onClick={that.handleResearchExperienceRemove}>삭제x</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="personal-info-body">
                                                        <div className="personal-info-range">
                                                            <div className="personal-info-data">
                                                                <div className="input-box input-box-row pointer-link">
                                                                    <div className="datepicker-wrapper">
                                                                        <DatePicker showMonthYearPicker placeholderText="YYYYMM" dateFormat="yyyyMM" id={i} onChange={(date) => {
                                                                            that.handleResearchExperienceSdate(i, date)
                                                                            return false
                                                                        }} selected={item.sdate}/>
                                                                    </div>
                                                                    <img src="/autoform_img/icon-calender.svg" className="icon"/>
                                                                </div>
                                                            </div>
                                                            <div className="personal-info-break"></div>
                                                            <div className="personal-info-data"></div>
                                                        </div>
                                                        <div className="input-box input-box-row input-box-small-break">
                                                        <textarea placeholder="예시)&#10;2018. 7. 한국경제신문, '블록체인기술의 주식거래에서의 응용 방안'" id={i}
                                                                  className="textrea-personal-info input-placehoder-14" onChange={that.handleResearchExperienceContent}
                                                                  value={item.description}/>
                                                        </div>
                                                    </div>
                                                </div>)
                                            })}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="information-block">
                                <div className="information-header">자기소개</div>
                                <div className="information-body">
                                    <div className="input-row">
                                        <div className="title mobile_hide">자기소개 입력</div>
                                        <div className="input-wrapper">
                                        <textarea placeholder="내용을 입력해주세요. (최대 500자)" value={this.state.introduction.val} className="textrea-self-introduction"
                                                  onChange={this.handlesIntroductionChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="form-option">
                            <button className="save-btn" onClick={this.handlesSubmit}>저장</button>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
}

export default Profile
