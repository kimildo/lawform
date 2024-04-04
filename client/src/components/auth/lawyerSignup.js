import React, { Component } from 'react'
// import '../../scss/common/signup.scss'
// import '../../scss/autoform/signup.scss'
// import '../../scss/style.scss'
import ReactDOM from 'react-dom'
import Api from '../../utils/apiutil'
import Cookies from 'js-cookie'
import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

class LawyerSignup extends Component {

    constructor (props) {
        super(props)
        this.state = {
            tag_full_list: ['민사', '채권,채무', '손해배상', '가족법', '형사법', '금융,증권', '회사', '조세,관세,행정소송', '부동산 및 건설', '공정거래', '해상,운송', '노동', '식품,보건,의료,환경', '스포츠,엔터테인먼트,방송,미디어', '국제거래', 'IT,인터넷,지적재산권', '기타'],
            tag_pop: { style: 'popup-tags hide', selected: [] },
            email: { val: '', clear: false, msg: { format: 'bad hide-element', can_use: 'good hide-element', already_use: 'bad hide-element' } },
            password: { val: '', clear: false, msg: { format: 'bad', can_use: 'good hide-element' } },
            passwordCheck: { val: '', clear: false, msg: { format: 'bad hide-element', can_use: 'good hide-element' } },
            name: { val: '', clear: false },
            mobnum: { val: '', clear: false },
            office: { val: '', clear: false },
            officenum: { val: '', clear: false },
            educationlevel: { val: '', clear: false },
            collegeInformation: { val: '', visible: 'hide-element' },
            schoolInformation: { visible: 'hide-element' },
            schoolname: { val: '', clear: false },
            graduationdate: { val: '', clear: false },
            schoolstatus: { val: '', clear: false },
            attorneyExam: { val: '', clear: false, msg: { unit: '' } },
            examNum: { val: '', clear: false, visible: 'hide-element' },
            work_tag: { clear: false, tags: [] },
            legalExperience: { slides: [{ type: 1, sdate: '', edate: '', description: '' }] },
            workExperience: { slides: [{ type: 2, sdate: '', edate: '', description: '' }] },
            researchExperience: { slides: [{ type: 3, sdate: '', edate: '', description: '' }] },
            introduction: { val: '', clear: false },
            signuppath: { val: '', clear: false },
            signupPathExtra: { val: '', visible: 'input-box input-box-small-break input-box-row hide-element' },
            legal_all: { clear: false },
            service_legal: { clear: false },
            personal_legal: { clear: false },
            ads_legal: { clear: false }
        }
    }

    /* ************************************************
     * 기본 정보 */
    // 이메일 입력
    handleEmailChange = evt => {
        let state = this.state
        state.email.val = evt.target.value
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(evt.target.value)) {  // Regex으로 이메일 형식 맞는지 확인
            state.email.clear = true
            state.email.msg.format = 'bad hide-element'
            state.email.msg.can_use = 'good hide-element'
        } else {
            state.email.clear = false
            state.email.msg.format = 'bad'
            state.email.msg.can_use = 'good hide-element'
        }
        this.setState(state)
    }

    // 이메일 중복 확인
    handleEmailCheck = evt => {
        let that = this
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(evt.target.value)) {  // Regex으로 이메일 형식 맞는지 확인
            Api.sendPost('/user/checkemail', { 'email': evt.target.value }).then((result) => {
                let state = that.state
                if (result.status === 'ok') {
                    state.email.clear = true
                    state.email.msg.already_use = 'bad hide-element'
                    state.email.msg.can_use = 'good'
                } else {
                    state.email.clear = false
                    state.email.msg.can_use = 'good hide-element'
                    state.email.msg.already_use = 'bad'
                }
                that.setState(state)
            })
        }
    }

    // 비밀번호 입력
    handlePasswordChange = evt => {
        let state = this.state
        state.password.val = evt.target.value
        if (/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/.test(evt.target.value)) {    // Regex으로 소,대,특,8~16자 확인
            state.password.clear = true
            state.password.msg.can_use = 'good'
            state.password.msg.format = 'bad hide-element'
        } else {
            state.password.clear = false
            state.password.msg.can_use = 'good hide-element'
            state.password.msg.format = 'bad'
        }
        this.setState(state)
    }

    // 비밀번호 확인 입력
    handlePasswordCheckChange = evt => {
        let state = this.state
        state.passwordCheck.val = evt.target.value
        state.passwordCheck.clear = false
        state.passwordCheck.msg.can_use = 'good hide-element'
        state.passwordCheck.msg.format = 'bad'

        if (state.password.val === state.passwordCheck.val) {
            state.passwordCheck.clear = true
            state.passwordCheck.msg.can_use = 'good'
            state.passwordCheck.msg.format = 'bad hide-element'
        }

        this.setState(state)
    }

    /* ************************************************
     * 휴대폰 인증 */
    // 이름 입력
    handleNameChange = evt => {
        let state = this.state
        state.name.val = evt.target.value
        state.name.clear = true
        this.setState(state)
    }

    // 전화 번호 입력
    handleMobnumChange = evt => {
        let state = this.state
        state.mobnum.val = evt.target.value
        state.mobnum.clear = true
        this.setState(state)
    }

    /* ************************************************
     * 사무실 정보 */
    // 소속 입력
    handleOfficeChange = evt => {
        let state = this.state
        state.office.val = evt.target.value
        state.office.clear = true
        this.setState(state)
    }

    // 소속 전화번호 입력
    handleOfficenumChange = evt => {
        let state = this.state
        state.officenum.val = evt.target.value
        state.officenum.clear = true
        this.setState(state)
    }

    /* ************************************************
     * 학력정보 */
    // 최종학력
    handleEducationLevel = evt => {
        let state = this.state
        state.collegeInformation.val = ''
        state.collegeInformation.visible = ''

        if (evt.target.value === '고등학교 졸업') {      // 선택한 학교에 따라 대학 표시 할지 말지 선택
            state.collegeInformation.val = ''
            state.collegeInformation.visible = 'hide-element'  // 대학 숨기기
        }

        state.schoolInformation.visible = ''          // 선택 박스를 변경할때 학교 이름 초기화
        state.educationlevel.val = evt.target.value   // 선택 박스 정보 저장
        state.educationlevel.clear = true            // 선택 했으니깐 자동 승인
        this.setState(state)
    }

    // 대학 selectbox 처리
    handleCollegeInformation = evt => {
        let state = this.state
        state.collegeInformation.val = evt.target.value
        this.setState(state)
    }

    // 학교명 입력
    handleSchoolnameChange = evt => {
        let state = this.state
        state.schoolname.val = evt.target.value
        state.schoolname.clear = (evt.target.value !== '')
        this.setState(state)
    }

    // 졸업일 입력
    handleGraduationdateChange = evt => {
        let state = this.state
        state.graduationdate.val = evt.target.value
        state.graduationdate.clear = (evt.target.value !== '')
        this.setState(state)
    }

    // 상태
    handleschoolstatusChange = evt => {
        let state = this.state
        state.schoolstatus.val = evt.target.value
        state.schoolstatus.clear = true
        this.setState(state)
    }

    // 출신 시험
    handleAttorneyExam = evt => {
        let state = this.state
        state.attorneyExam.clear = true
        state.attorneyExam.msg.unit = (evt.target.value === '사법연수원') ? '기' : '회'
        state.attorneyExam.val = evt.target.value
        state.examNum.visible = ''
        this.setState(state)
    }

    // 시험 기 / 회 입력
    handleExamnum = evt => {
        let state = this.state
        state.examNum.clear = true
        state.examNum.val = evt.target.value
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

        state.work_tag.clear = (state.tag_pop.selected.length >= 1)
        this.state.work_tag.tags = name_list
        this.handlesTagPopupClose(evt)
    }

    handlesTagClick = evt => {
        evt.preventDefault()
        let state = this.state
        let index = parseInt(evt.target.id)
        let skip = false
        let new_list = []
        if (!Number.isNaN) {
            Number.isNaN = function isNaN (value) { return value !== value }
        }
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
        state.legalExperience.slides.push({ type: 1, sdate: '', edate: '', description: '' })
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
        state.workExperience.slides.push({ type: 2, sdate: '', edate: '', description: '' })
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
        state.researchExperience.slides.push({ type: 3, sdate: '', edate: '', description: '' })
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
        this.state.introduction.clear = (evt.target.value !== '')
        this.setState(state)
    }

    /* ************************************************
     * 가입경로 */
    // 가입경로 select box
    handleSignupPath = evt => {
        let state = this.state
        state.signuppath.val = evt.target.value
        state.signuppath.clear = true               // 하나라도 선택하면 승인
        if (evt.target.value === '기타 직접입력') {
            state.signupPathExtra.visible = 'input-box input-box-small-break input-box-row'
        } else {
            this.state.signupPathExtra.val = ''
            state.signupPathExtra.visible = 'input-box input-box-small-break input-box-row hide-element'
        }
        this.setState(state)
    }

    // 가입 경로 기타 입력창
    handlesSignupPathExtra = evt => {
        let state = this.state
        state.signupPathExtra.val = evt.target.value
        this.setState(state)
    }

    /* ************************************************
     * Legal */
    // 전체 선택
    handlesLegalAll = evt => {
        let state = this.state
        let status = (!state.legal_all.clear)
        state.legal_all.clear = status
        state.service_legal.clear = status
        state.personal_legal.clear = status
        state.ads_legal.clear = status
        this.setState(state)
    }

    // 서비스
    handlesLegalRemainder = evt => {
        let state = this.state
        let tid = Number(evt.target.id)
        switch (tid) {
            case 1:
                state.service_legal.clear = (!state.service_legal.clear)
                break
            case 2:
                state.personal_legal.clear = (!state.personal_legal.clear)
                break
            case 3:
                state.ads_legal.clear = (!state.ads_legal.clear)
                break
        }

        state.legal_all.clear = (state.service_legal.clear && state.personal_legal.clear && state.ads_legal.clear)
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
        // clear 변수는 각 입력 하는 함수에서 처리함
        if (!state.email.clear) {
            alert('이메일 확인 부탁드립니다.')
            return
        }
        if (!state.password.clear) {
            alert('비밀번호를 소,대,특문자로 구성하고 8~16자로 만들어주세요')
            return
        }
        if (!state.passwordCheck.clear) {
            alert('비밀번호가 일치하지 않아요. 확인해주세요.')
            return
        }
        if (!state.name.clear) {
            alert('이름을 입력해주세요')
            return
        }
        if (!state.mobnum.clear) {
            alert('휴대폰번호를 입력해주세요')
            return
        }
        if (!state.office.clear) {
            alert('사무실 소속 입력해주세요')
            return
        }
        if (!state.officenum.clear) {
            alert('사무실 대표 전화번호 입력해주세요')
            return
        }
        if (!state.educationlevel.clear) {
            alert('최종학력 선택해주세요')
            return
        }
        if (!state.schoolname.clear) {
            alert('학교명 입력해주세요')
            return
        }
        if (!state.graduationdate.clear) {
            alert('졸업일 입력해주세요')
            return
        }
        if (!state.schoolstatus.clear) {
            alert('학교 상태 선택해주세요')
            return
        }
        if (!state.attorneyExam.clear) {
            alert('변호사 자격 선택해주세요')
            return
        }
        if (!state.examNum.clear) {
            alert('회/기 입력해주세요')
            return
        }
        if (!state.work_tag.clear) {
            alert('주요 업무 분야 1개 이상 선택해주세요')
            return
        }
        // if (!state.introduction.clear) { alert("자기소개 입력해주세요"); return; }
        // if (!state.signuppath.clear) { alert("가입경로 선택해주세요"); return; }
        if (!state.service_legal.clear) {
            alert('서비스 약관 동의해주세요')
            return
        }
        if (!state.personal_legal.clear) {
            alert('개인정보 약관 동의해주세요')
            return
        }

        /*
         payload.base.{이부분} 이름이 변수과 다른 이유는 실때 데이터베이스 테이블과 이름 동일
         이렇게 함으로써 깔끔~
        */
        // 기본 정보
        payload.base.email = state.email.val
        payload.base.password = state.password.val

        // 휴대폰인증
        payload.base.name = state.name.val                          // 이름
        payload.base.mobile_number = state.mobnum.val               // 휴대폰 번호

        // 사무실 정보
        payload.base.office_name = state.office.val                 // 소속명
        payload.base.office_number = state.officenum.val            // 대표 전화번호

        // 학력 정보
        payload.base.education_level = state.educationlevel.val     // 최종학력
        payload.base.school_level = state.collegeInformation.val    // 대학 구분 (2년,4년,석,박)
        payload.base.school_name = state.schoolname.val             // 학교명
        payload.base.school_grad_date = state.graduationdate.val    // 학교 날짜
        payload.base.school_status = state.schoolstatus.val         // 학교 상태 (졸, 중, 퇴)
        payload.base.attorney_exam = state.attorneyExam.val         // 출신 시험
        payload.base.attorney_exam_number = state.examNum.val       // 출신 시험의 기/회 입력

        // 주요 업무 분야
        payload.base.work_field = ''
        for (let i = 0; i < state.work_tag.tags.length; i++) {
            if (i) payload.base.work_field += '.'
            payload.base.work_field += state.work_tag.tags[i]
        }

        // 자기소개
        payload.base.self_introduction = state.introduction.val     // 자기소개

        // 가입 경로
        payload.base.signup_path = state.signuppath.val             // 가입 경로 (네이버, 구글, 기타 등)
        payload.base.signup_path_extra = state.signupPathExtra.val  // 가입 경로 기타 일때 추가 입력창

        //가입 경로 기타 일때 가입경로 값에 덮어씌움
        if (!!state.signupPathExtra.val && state.signupPathExtra.val.trim() !== '') {
            payload.base.signup_path = state.signupPathExtra.val.trim()
            payload.base.signup_path_extra = ''
        }

        // 약관들
        payload.base.agree_service = 'Y'
        payload.base.agree_info = 'Y'
        payload.base.agree_msg = (state.ads_legal.clear) ? 'Y' : 'N'

        // 기타 미리 설정할것들
        payload.base.type = 'A'

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

        // check for empty items
        let remove_idx = []
        for (let i = 0; i < payload.experience.length; i++) {
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

        for (let i = 0; i < remove_idx.length; i++)
            delete payload.experience[remove_idx[i]]

        // 회원가입 요청하기!!!
        Api.sendPost('/user/joinnew', payload).then((result) => {

            // 회원 가입 겨로가 확인
            if (result.status === 'ok') {

                // 회원가입 축가 메시지
                alert('회원가입 완료되었습니다.\n계정 승인 되면 문자 보내 드릴 예정입니다.\n감사합니다.')

                // 홈으로 이동!
                window.location = '/'
            } else {
                alert('회원가입 중 문제가 생겼습니다. 처음 부터 다시 회원가입해주세요!')
            }
        })
    }

    render () {
        let that = this
        return (
            <div>
                <div className="signup-container">
                    <div className="signup-tabs-footnote">*필수입력정보 입니다.</div>

                    <div className={this.state.tag_pop.style}>
                        <div className="popup-background" onClick={this.handlesTagPopupClose}/>
                        <div className="popup-block">
                            <div className="popup-block-head">
                                <div className="popup-block-title">주요 업무 분야 (3개 선택 가능)</div>
                            </div>
                            <div className="popup-block-body">
                                {this.state.tag_full_list.map(function (item, i) {
                                    return (<div className="legal">
                                        <label id={i} onClick={that.handlesTagClick}>
                                            {that.state.tag_pop.selected.indexOf(i) > -1
                                                ? <input type="checkbox" id={i} value="1" disabled checked/>
                                                : <input type="checkbox" id={i} value="1" disabled/>
                                            }
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

                    <div className="signup-group">
                        <div className="group-title">기본정보<span>*</span></div>

                        <div className="input-title input-box-first-break">
                            아이디(이메일)<span>*</span>
                            <div className="title-msg">
                                <div className={this.state.email.msg.can_use}>사용가능합니다.</div>
                                <div className={this.state.email.msg.already_use}>이미 사용중인 이메일입니다.</div>
                                <div className={this.state.email.msg.format}>이메일 형식 아닙니다.</div>
                            </div>
                        </div>
                        <div className="input-box input-box-row"><input type="email" placeholder="abcd@naver.com" value={this.state.email.val} onChange={this.handleEmailChange}
                                                                        onBlur={this.handleEmailCheck}/></div>

                        <div className="input-title input-box-break">
                            비밀번호 입력<span>*</span>
                            <div className="title-msg">
                                <div className={this.state.password.msg.can_use}>사용가능합니다.</div>
                                <div className={this.state.password.msg.format}>영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</div>
                            </div>
                        </div>
                        <div className="input-box input-box-row"><input type="password" value={this.state.password.val} onChange={this.handlePasswordChange}/></div>

                        <div className="input-title input-box-break">
                            비밀번호 재입력<span>*</span>
                            <div className="title-msg">
                                <div className={this.state.passwordCheck.msg.can_use}>일치합니다.</div>
                                <div className={this.state.passwordCheck.msg.format}>일치하지 않습니다.</div>
                            </div>
                        </div>
                        <div className="input-box input-box-row"><input type="password" value={this.state.passwordCheck.val} onChange={this.handlePasswordCheckChange}/></div>

                        <div className="input-title input-box-break">이름<span>*</span></div>
                        <div className="input-box input-box-row"><input type="text" value={this.state.name.val} onChange={this.handleNameChange}/></div>

                        <div className="input-title input-box-break">휴대폰 번호<span>*</span></div>
                        <div className="input-box input-box-row"><input type="text" value={this.state.mobnum.val} onChange={this.handleMobnumChange}/></div>
                    </div>

                    <div className="signup-group hide">
                        <div className="group-title">휴대폰 인증<span>*</span></div>

                        <div className="who-are-you hide">
                            <div className="blue-btn">휴대폰 본인인증</div>
                        </div>


                    </div>

                    <div className="signup-group">
                        <div className="group-title">사무실 정보<span>*</span></div>

                        <div className="input-title input-box-first-break">소속<span>*</span></div>
                        <div className="input-box input-box-row"><input type="text" value={this.state.office.val} onChange={this.handleOfficeChange}/></div>

                        <div className="input-title input-box-break">대표 전화번호<span>*</span></div>
                        <div className="input-box input-box-row"><input type="number" placeholder="예) 0212345678" value={this.state.officenum.val}
                                                                        onChange={this.handleOfficenumChange}/></div>
                    </div>

                    <div className="signup-group">
                        <div className="group-title">학력정보<span>*</span></div>

                        <div className="input-title input-box-first-break">최종학력<span>*</span></div>
                        <div className="input-box input-box-row">
                            <select onChange={this.handleEducationLevel}>
                                <option value="" disabled selected>최종학력을 선택해 주세요</option>
                                <option>고등학교 졸업</option>
                                <option>대학&bull;대학원 졸업</option>
                            </select>
                        </div>

                        <div className={this.state.collegeInformation.visible}>
                            <div className="input-title input-box-break">대학<span>*</span></div>
                            <div className="input-box input-box-row">
                                <select value={this.state.collegeInformation.val} onChange={this.handleCollegeInformation}>
                                    <option value="" disabled selected>선택해 주세요</option>
                                    <option>대학 (2,3년)</option>
                                    <option>대학교(4년)</option>
                                    <option>대학교(석사)</option>
                                    <option>대학교(박사)</option>
                                </select>
                            </div>
                        </div>

                        <div className={this.state.schoolInformation.visible}>
                            <div className="input-title input-box-break">학교명<span>*</span></div>
                            <div className="input-box input-box-row"><input type="text" value={this.state.schoolname.val} onChange={this.handleSchoolnameChange}
                                                                            placeholder="학교명 입력"/></div>
                            <table className="input-box-small-break">
                                <tbody>
                                <tr>
                                    <td>
                                        <div className="input-box input-box-row">
                                            <input type="text" placeholder="YYYYMM (ex. 201202)" maxlength="6" size="6" value={this.state.graduationdate.val}
                                                   onChange={this.handleGraduationdateChange}/>
                                        </div>
                                    </td>
                                    <td className="space-10"></td>
                                    <td>
                                        <div className="input-box input-box-row">
                                            <select onChange={this.handleschoolstatusChange}>
                                                <option value="" disabled selected>선택</option>
                                                <option>졸업</option>
                                                <option>중퇴</option>
                                                <option>재학</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="input-title input-box-break">변호사 자격<span>*</span></div>
                        <table>
                            <tbody>
                            <tr>
                                <td className="space-200">
                                    <div className="input-box input-box-row">
                                        <select onChange={this.handleAttorneyExam}>
                                            <option value="" disabled selected>선택 해주세요</option>
                                            <option>변호사 시험</option>
                                            <option>사법연수원</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="space-10"></td>
                                <td>
                                    <div className={this.state.examNum.visible}>
                                        <div className="input-box">
                                            <input type="input" value={this.state.examNum.val} onChange={this.handleExamnum} className="input-width-70 text-align"/>
                                            <span>{this.state.attorneyExam.msg.unit}</span>
                                        </div>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="signup-group">

                        <div className="group-title">경력정보</div>

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
                                        return (<div className="tag">{name}</div>)
                                    })}
                                </div>
                            </div>
                        </div>

                        {this.state.legalExperience.slides.map(function (item, i) {
                            return (<div className="personal-info">
                                {i == 0 ? (<div className="personal-info-line"></div>) : (<div className="personal-info-dash"></div>)}
                                <div className="personal-info-header">
                                    <div className="personal-info-title">법조 업무 경력</div>
                                    <div className="personal-info-option">
                                        {i == 0 ? (
                                            <div className="personal-info-option-button" id={i} onClick={that.handleLawExperienceAdd}>추가+</div>
                                        ) : (
                                            <div className="personal-info-option-button" id={i} onClick={that.handleLawExperienceRemove}>삭제x</div>
                                        )}
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
                                                <img src="/autoform_img/icon-calender.svg" className="icon"/>
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
                            return (<div className="personal-info">
                                {i == 0 ? (<div className="personal-info-line"></div>) : (<div className="personal-info-dash"></div>)}
                                <div className="personal-info-header">
                                    <div className="personal-info-title">주요 업무 사례</div>
                                    <div className="personal-info-option">
                                        {i == 0 ? (
                                            <div className="personal-info-option-button" id={i} onClick={that.handleWorkExperienceAdd}>추가+</div>
                                        ) : (
                                            <div className="personal-info-option-button" id={i} onClick={that.handleWorkExperienceRemove}>삭제x</div>
                                        )}
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
                                                <img src="/autoform_img/icon-calender.svg" className="icon"/>
                                            </div>
                                        </div>
                                        <div className="personal-info-break"></div>
                                        <div className="personal-info-data"></div>
                                    </div>
                                    <div className="input-box input-box-row input-box-small-break">
                                        <textarea placeholder="예시)&#10;2015. 4. 다국적 은행인 OO은행 상대, 파생상품불완전 판매로 인한 손해배상청구 소송에서 승소" id={i}
                                                  className="textrea-personal-info input-placehoder-14" onChange={that.handleWorkExperienceContent} value={item.description}/>
                                    </div>
                                </div>
                            </div>)
                        })}

                        {this.state.researchExperience.slides.map(function (item, i) {
                            return (<div className="personal-info">
                                {i == 0 ? (<div className="personal-info-line"></div>) : (<div className="personal-info-dash"></div>)}
                                <div className="personal-info-header">
                                    <div className="personal-info-title">논문, 컬럼, 저서</div>
                                    <div className="personal-info-option">
                                        {i == 0 ? (
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
                                        <textarea placeholder="예시)&#10;2018. 7. 한국경제신문, '블록체인기술의 주식거래에서의 응용 방안'" id={i} className="textrea-personal-info input-placehoder-14"
                                                  onChange={that.handleResearchExperienceContent} value={item.description}/>
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>

                    <div className="signup-group">
                        <div className="group-title">자기소개</div>

                        <div className="input-title input-box-first-break">자기소개 입력</div>
                        <div className="input-box input-box-row">
                            <textarea placeholder="내용을 입력해주세요. (최대 500자)" value={this.state.introduction.val} className="textrea-self-introduction"
                                      onChange={this.handlesIntroductionChange}/>
                        </div>
                    </div>

                    <div className="signup-group">
                        <div className="group-title">가입경로</div>

                        <div className="input-box input-box-first-break input-box-row">
                            <select onChange={this.handleSignupPath}>
                                <option value="" disabled selected>선택해주세요</option>
                                <option>인터넷 검색</option>
                                <option>블로그 등 SNS</option>
                                <option>지인 추천</option>
                                <option>기타 직접입력</option>
                            </select>
                        </div>
                        <div className={this.state.signupPathExtra.visible}><input type="text" value={this.state.signupPathExtra.val} onChange={this.handlesSignupPathExtra}
                                                                                   placeholder='예 : 브로셔, 강의, 행사, 제휴사'/></div>
                    </div>

                    <div className="signup-group">
                        <div className="group-title">약관 동의<span>*</span></div>

                        <div className="secret-line-break"></div>

                        <div className="legal">
                            <label onClick={this.handlesLegalAll}>
                                {this.state.legal_all.clear ? (<input type="checkbox" value="1" checked disabled/>) : (<input type="checkbox" value="1" disabled/>)}
                                <span className="checkmark"></span>
                                전체동의
                            </label>
                        </div>

                        <div className="line-break"></div>

                        <div className="legal">
                            <label id="1" onClick={this.handlesLegalRemainder}>
                                {this.state.service_legal.clear ? (<input type="checkbox" id="1" value="1" checked disabled/>) : (
                                    <input type="checkbox" id="1" value="1" disabled/>)}
                                <span id="1" className="checkmark"></span>
                                서비스 이용약관 동의
                            </label>
                            <a className="pull-right" href="#terms">자세히 보기</a>
                        </div>

                        <div className="legal">
                            <label id="2" onClick={this.handlesLegalRemainder}>
                                {this.state.personal_legal.clear ? (<input type="checkbox" id="2" value="1" checked disabled/>) : (
                                    <input type="checkbox" id="2" value="1" disabled/>)}
                                <span id="2" className="checkmark"></span>
                                개인정보 수집 및 제 3자 제공동의
                            </label>
                            <a className="pull-right" href="#privacy">자세히 보기</a>
                        </div>

                        <div className="legal">
                            <label id="3" onClick={this.handlesLegalRemainder}>
                                {this.state.ads_legal.clear ? (<input type="checkbox" id="3" value="1" checked disabled/>) : (<input type="checkbox" id="3" value="1" disabled/>)}
                                <span id="3" className="checkmark"></span>
                                로폼 정보수신 동의 (선택)
                            </label>
                        </div>
                    </div>

                    <div className="signup-btn-wrapper">
                        <button className="blue-btn" onClick={this.handlesSubmit}>회원가입 완료</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default LawyerSignup
