import React, { Component, Fragment } from 'react'
// import '../../scss/autoform/autoformmain.scss';
// import '../../scss/preview.scss';
import InputSection from './inputsection'
import AutoformGuide from '../autoform/autoformguide'
import AutoformSave from './autoformsave'
import API from '../../utils/apiutil'
import jQuery from 'jquery'
import User from '../../utils/user'
import ReactGA from 'react-ga'
import NumberFormat from 'react-number-format'
import Modal from '../common/modal'
import Cookies from 'js-cookie'
import Payment from './payment'

window.$ = window.jQuery = jQuery

class Main extends Component {

    constructor (props) {
        super(props)
        this.state = {
            fixedOutput: 'none',
            inputSections: [],
            foundDoc: false,
            docData: {
                iddocument: this.props.iddocument,
                dc_price: 0
            },
            tab: 2,
            discount: 0,
            dialogOpen: false,
            paymentTab1: true,
            paymentTab2: false,
            showPaymentPop: true

        }
        const IMP = window.IMP
        IMP.init('imp91690618')
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount () {
        API.sendGet('/documents/preview/' + this.props.iddocument).then((res) => {
            if (res.data.status === 'ok') {
                this.setState({
                    docTitle: res.data.data[0].title,
                    docOutputTitle: res.data.data[0].outputTitle,
                    docOutputTitleUnderline: res.data.data[0].outputTitle_underline,
                    inputSections: res.data.data[0].inputSections,
                    foundDoc: true,
                    docData:
                        {
                            title: res.data.data[0].title,
                            h1: res.data.data[0].h1,
                            iddocument: this.props.iddocument,
                            price: res.data.data[0].price,
                            dc_price: res.data.data[0].dc_price,
                            idcategory_1: res.data.data[0].idcategory_1,
                            description: res.data.data[0].description,
                            dc_rate: res.data.data[0].dc_rate,
                            name: '내용증명'
                        }
                })
            }
        })
        window.addEventListener('scroll', this.listenToScroll)
        document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount () {
        document.removeEventListener('click', this.handleClick)
    }

    handleClick (e) {
        if (this.node.contains(e.target)) {
            if (e.target.nodeName.toUpperCase() === 'INPUT' || e.target.nodeName.toUpperCase() === 'SELECT') {
                this.loginCheckBeforePayment()
            }
        }
    }

    updateScrollInfo () {
        let threshold = 592
        if (window.pageYOffset < threshold) {
            if (this.state.fixedOutput !== 'none') this.setState({ fixedOutput: 'none' })
        } else if (this.state.fixedOutput !== 'top') {
            if (this.state.fixedOutput !== 'top') this.setState({ fixedOutput: 'top' })
        }
    }

    listenToScroll = () => {
        this.updateScrollInfo()
    }

    loginCheckBeforePayment = () => {
        let userInfo = User.getInfo()
        if (!userInfo) {
            alert('회원 전용 서비스 입니다. 로그인 또는 회원 가입을 해주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent(window.location.pathname)
            // this.setState({
            //     dialogOpen: true
            // })
        } else {
            let param = {
                host: window.location.hostname
            }
            API.sendPost('/user/state', param).then((res) => {
                if (this.state.docData.dc_price === 0) { // 무료 문서
                    let param = {
                        isFree: true,
                        iddocuments: this.props.iddocument,
                        name: this.state.docData.title
                    }
                    API.sendPost('/payments', param).then((res) => {
                    })
                    let r = window.confirm('내 문서함 보관함에 추가 되었습니다. \r\n내 문서 보관함으로 이동하시겠습니까?') // 사실은 payments 이후에 호출 되어야 하나 중복 클릭 방지 하기 위해 여기 위치
                    if (r === true) {
                        window.location.href = '/mydocument'
                    }
                } else {
                    window.location.href = '#payment'
                    ReactGA.pageview(window.location.pathname + '#payment', null, '문서 결제')
                }
            })
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false })
    }

    goSignIn = () => {
        this.setState({
            dialogOpen: false
        })
        window.location.href = '/auth/signin?referer=' + encodeURIComponent('/preview/' + this.props.iddocument)
    }

    goSignUp = () => {
        this.setState({
            dialogOpen: false
        })
        window.location.href = '/auth/signup'
        Cookies.set('signInReferrer', '/preview/' + this.props.iddocument, { expires: 1 })
    }

    account = () => {
        this.setState({
            tab: 1,
        })
    }

    card = () => {
        this.setState({
            tab: 2,
        })
    }

    btnToggleDesc = (e) => {
        if (!this.state.docData.description !== null) {
            let docData = this.state.docData
            if (docData.description[e.target.id].descOpen === true) docData.description[e.target.id].descOpen = false
            else {
                for (let i = 0; i < docData.description.length; i++) {
                    docData.description[i].descOpen = false
                }
                docData.description[e.target.id].descOpen = true
            }

            this.setState({ docData: docData })
        }
    }

    showPaymentPop = () => {
        this.setState({
            showPaymentPop: true
        })
    }

    render () {

        let toggle_account
        let toggle_card
        let card_image
        let account_image

        if (!!this.state.foundDoc) {
            this.nextSave = new Date()
            this.nextSave.setSeconds(this.nextSave.getSeconds() + 3) // Big Date

            this.outputDomID = 0
            this.highlightedOutputDomIDs = []

            this.renderHtml = ''

            let style_Output = {}

            switch (this.state.fixedOutput) {
                case 'top':
                    style_Output = { position: 'fixed', top: '10px' }
                    break
                case 'bottom':
                    style_Output = { position: 'fixed', bottom: '502px' }
                    break
            }
            let style_a4 = { height: window.innerHeight - 133 }
            let userInfo = User.getInfo()
            let detail_description_a = ['detail_description_a']
            let startup
            if (!!this.state.docData) {
                startup = this.state.docData.idcategory_1
            }

            let preview_img = (this.state.docData.idcategory_1 === 99) ? '/preview_img/docs/' + this.props.iddocument + '.jpg' : null
            return (
                <Fragment>
                    <div className="wrap_autoform_main">
                        <div className="wrap_autoform_section">
                            <AutoformSave
                                document={this.props.iddocument}
                                setEditable={this.setEditable}
                                btnEditable={this.state.contentEditable}
                                inputStatus={this.state.inputStatus}
                            />
                            <div className="autoform_main" ref={node => this.node = node}>
                                <div className="autoform_main_input">
                                    {
                                        this.state.inputSections.map((inputsection, inputsection_key) =>
                                            <InputSection key={inputsection_key} index={inputsection_key} section={inputsection} sectionLength={this.state.inputSections.length}
                                                          showPaymentPop={this.showPaymentPop}/>
                                        )
                                    }
                                </div>
                                <div className="autoform_main_output">
                                    {
                                        (!!userInfo) &&
                                        <div className="doc_info_wrap">
                                            <div className="doc_info">
                                                <div className="detail_price">
                                                    <div className="doc_title">{this.state.docData.h1}</div>
                                                    <div className="doc_price">
                                                        <div className="discount"><img src="/detail_img/discount50.png"/></div>
                                                        <div className="price">
                                                            <div className="org"><NumberFormat value={this.state.docData.price} displayType={'text'} thousandSeparator={true}></NumberFormat> 원</div>
                                                            <div className="dc"><NumberFormat value={this.state.docData.dc_price} displayType={'text'} thousandSeparator={true}></NumberFormat> 원</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={(e) => this.loginCheckBeforePayment()}>결제하기</button>
                                            </div>
                                            <div className="videoTutor">
                                                <h2><strong>결제 전,</strong> 자동작성 서비스를 영상으로 확인해보세요.</h2>
                                                <div className="embed_video" style={{ boxSizing: 'border-box' }}>
                                                    <iframe style={{ marginTop: '12px' }}
                                                            src="https://www.youtube.com/embed/0djEPHz1S7E?modestbranding=0&amp;rel=0&amp;autoplay=1&amp;loop=1&amp;playlist=0djEPHz1S7E" width="360"
                                                            height="210" allow="autoplay; encrypted-media"></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="autoform_output_field" id="output" ref={this.setDOMElement}>
                                        {
                                            (this.state.docData.idcategory_1 === 99) ?
                                                <div className="autoform_output_a4 preview_a4" id="output_a4" style={style_a4}>
                                                    <div className="autoform_output_title">
                                                        <img src={preview_img} alt="문서미리보기"></img>
                                                    </div>
                                                </div>
                                                :
                                                <div className="autoform_output_a4" id="output_a4" style={style_a4}>
                                                    <div className="autoform_output_title">{this.state.docOutputTitle}
                                                        {this.state.docOutputTitleUnderline &&
                                                        <div>
                                                            <div className="textline"></div>
                                                            <div className="textline"></div>
                                                        </div>
                                                        }
                                                    </div>
                                                </div>
                                        }

                                    </div>

                                    <div className="autoform_output_preview">
                                        <span>로폼이 제공하는 UI/UX, 프로그램, 콘텐츠, 디자인 등은 특허법, 저작권법, 부정경쟁방지법 등에 의해 보호 받고 있습니다. 무단 복제, 유사한 변형, 사용 등에 대하여는 법적 책임이 있음을 알려드립니다.</span>
                                    </div>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '18px', cursor: 'pointer', paddingRight: '24px' }}>
                                        <a href="#learnmore">
                                            <img src="/autoform_img/learnmore_btn.svg" width="80" height="19" alt="learnmore_btn"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="open" className="white_content">
                            <div className="autoform_postcode">
                                {/* <a className="x_btn" href="javascript:history.back();"> */}
                                <a className="x_btn" href="#close">
                                    <img src="/autoform_img/x_btn_white.png" width="48" height="48" alt="x_btn"></img>
                                </a>
                            </div>
                        </div>
                        <div id="learnmore" className="white_content">
                            <div className='wrap_learmore'>
                                <div className="legalnotice_x_btn">
                                    <a href="#close">
                                        {/* <a href="javascript:history.back();"> */}
                                        <img src="/autoform_img/x_btn_white.png" width="32" height="32" alt="x_btn"></img>
                                    </a>
                                </div>
                                <div className='wrap_legalnotice_header'>
                                    <div className='legalnotice_header_name'>
                                        지식재산권 등 보호에 관한 내용
                                    </div>
                                </div>
                                <div className='wrap_learmore_content'>
                                    로폼의 법률문서 자동작성 프로그램에서 제공하는 아웃풋의 현출을 위한 인풋 창의 입력 방식과
                                    내용, 인풋의 특정 내용 선택에 따른 아웃풋 조항의 현출 방식과 내용, 이에 관한 UI/UX, 디자인 등 본 프로그램 구성과 내용은 모두
                                    아미쿠스렉스의 상당한 투자와 노력으로 만들어진 것으로<br></br>
                                    특허법, 저작권법, 부정경쟁방지법 등에 의해 보호받는 프로그램, 콘텐츠 및 저작물입니다.<br></br>
                                    따라서 인풋창과 아웃풋의 구동 방식과 내용, 인풋창의 UI, 디자인의 무단 복제는 물론,
                                    그 내용을 유사한 형식이나 내용으로의 변형, 사용하는 행위는 등 모두 위법하여 금지되는 행위임을 알려드리며,
                                    이에 반하는 일체의 행위는 민사상 책임은 물론 형사상 책임을 지게 되니 이에 유의하시기 바랍니다.
                                </div>
                            </div>
                        </div>
                        <Modal
                            open={this.state.dialogOpen}
                            onClose={this.handleClose}
                            width={380}
                            height={160}
                        >
                            <div className="dialog_content">
                                <div id="alert-dialog-description">
                                    회원 전용 서비스 입니다. <br/>
                                    로그인 또는 회원가입을 해주세요.
                                </div>
                            </div>
                            <div className='dialog_buttons'>
                                <button onClick={(e) => this.goSignIn()} color="primary" autoFocus>
                                    로그인
                                </button>
                                <button onClick={(e) => this.goSignUp()} color="primary">
                                    회원가입
                                </button>
                            </div>
                        </Modal>
                    </div>
                    <Payment iddocument={this.props.iddocument} docData={this.state.docData} loginCheckBeforePayment={this.loginCheckBeforePayment}/>
                    <div id="promotion" className="white_content">
                        <div className="payment_modal">
                            <div className="title">프로모션 코드 등록
                                <a className="xbtn" href="javascript:history.back();">
                                    <img src="/autoform_img/x_btn.png" width="24" height="24" alt="x_btn"></img>
                                </a>
                            </div>

                            <div className="info">
                                프로모션 코드를 입력하세요.
                            </div>
                            <div className="promotion_form">
                                <input className="code_input" placeholder="프로모션 코드를 입력해주세요."/>
                                <button type="button" className="promotion_submit_btn" onClick={() => this.onPromotion(this.props.iddocument)}>등록</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default Main