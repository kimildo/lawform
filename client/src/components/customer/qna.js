import React, { Component } from 'react'
import API from 'utils/apiutil'
import User from 'utils/user'
import { isIE } from 'react-device-detect'
const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

class Qna extends Component {

    constructor (props) {
        super(props)
        this.state = {
            qnaEmail: '',
            qnaPhone: '',
            qnaQuestion: '',
            qnaAgree: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        if (!!isIE && host === 'https://lawform.io') {
            if (process.browser) {
                alert('로폼의 문서 작성 및 수정은 크롬 혹은 Edge 브라우저에 최적화 되어 있습니다.\n크롬 및 Edge 브라우저 이용을 권장드립니다.')
            }
        }
    }

    componentDidMount () {

    }

    componentWillUnmount () {

    }

    handleClick (e) {

    }

    handleChange = (e, input) => {
        let userInfo = User.getInfo()

        if (input === 'email') this.setState({ qnaEmail: e.target.value })
        if (input === 'phone') this.setState({ qnaPhone: e.target.value })
        if (input === 'question') {
            if (!userInfo) {
                alert('로그인 후에 이용해 주세요.')
                window.location.href = '/auth/signin?referer=' + encodeURIComponent('/customer/qna')
            } else {
                this.setState({ qnaQuestion: e.target.value })
            }
        }
        if (input === 'agree') this.setState({ qnaAgree: e.target.checked })

    }

    writeQuestion = () => {
        let userInfo = User.getInfo()
        let { qnaQuestion, qnaPhone, qnaEmail } = this.state
        // if( this.state.qnaEmail === '' ) {
        //     alert('이메일을 입력해주세요.')
        //     return false;
        // } else if( this.state.qnaPhone === '' ) {
        //     alert('전화번호를 입력해주세요.')
        //     return false;
        // } else 
        if (!userInfo) {
            alert('로그인 후에 이용해 주세요.')
            window.location.href = '/auth/signin?referer=' + encodeURIComponent('/customer/qna')
            return false
        } else if (qnaQuestion === '') {
            alert('문의내용을 입력해주세요.')
            return false
        }
        //  else if( this.state.qnaAgree === false ) {
        //     alert('개인정보 수집에 동의해주세요.')
        //     return false;
        // } 
        else {

            let params = {
                question: qnaQuestion,
                phone: qnaPhone,
                email: qnaEmail
            }

            API.sendPost('/customer/writeqna', params).then((result) => {
                if (result.status === 'ok') {
                    this.setState({
                        qnaQuestion: '',
                        qnaPhone: '',
                        qnaEmail: '',
                        qnaAgree: false
                    }, () => {
                        alert('회원님 감사합니다.\n문의가 등록 되었습니다.\n답변은 문의 등록 후 24시간 이내 회신을 원칙으로 하고 있습니다.\n답변 등록시 문자로 안내 드립니다.')

                    })
                }
            })

        }
    }

    render () {
        return (
            <div>
                <div className="cs-title">
                    {(!this.props.lawyer_view) && <h2>1 : 1 이용문의</h2>}
                    <h3>서비스 이용과 관련된 문의에 답변 드리고 있습니다.</h3>
                    {/* <div className="required">*모든 항목은 필수입력 사항입니다.</div> */}
                </div>
                <div>
                    <ul className="cs-qna-form">
                        {/* <li>
                            <label >이메일 주소<span className='required'>*</span></label>
                            <input type="text" value={this.state.qnaEmail}  placeholder="example@amicuslex.net" onChange={(e)=>{this.handleChange(e,'email')}}/>
                        </li>
                        <li>
                            <label >휴대폰 번호<span className='required'>*</span></label>
                            <input type="text" value={this.state.qnaPhone} placeholder="01012345678" onChange={(e)=>{this.handleChange(e,'phone')}}/>
                        </li> */}
                        <li>
                            <label>문의 내용</label>
                            <textarea value={this.state.qnaQuestion} className="question" onChange={(e) => this.handleChange(e, 'question')}
                                      placeholder={'상담하고 싶은 내용 또는 사용하시면서 궁금하신 점을 입력하여 주세요.\n\r회원님이 문의하신 내역은 마이페이지에서 확인하실 수 있습니다.'}/>
                        </li>
                    </ul>
                    <div className="cs-qna-privacy">
                        {/* <h3>개인정보 수집 · 이용에 대한 안내</h3>
                        <h4>필수 수집 · 이용 항목 (문의 접수 및 처리, 회신을 위한 최소한의 개인정보를 수집합니다.)</h4>
                        <table>
                            <tr>
                                <th>수집 항목</th>
                                <th>수집 목적</th>
                                <th>보유기간</th>
                            </tr>
                            <tr>
                                <td>이메일 주소, 휴대폰 번호</td>
                                <td>고객문의에 대한 회신,<br/>문의 답변을 위한 서비스 이용기록 조회</td>
                                <td>관련 법령 또는 회사 내부 방침에 따라 <br/>보존 필요 시 까지 보관, 그 외 지체없이 파기</td>
                            </tr>
                        </table>
                        <div className="privacy">더 자세한 내용에 대해서는 <a href="#privacy">개인정보처리방침</a>을 참고하시기 바랍니다.</div>              
                        <input type="checkbox" className="agree" checked={this.state.qnaAgree===true?'checked':''}  onChange={(e)=>{this.handleChange(e,'agree')}}/> 위 내용에 동의합니다. */}
                        <button onClick={this.writeQuestion}>문의 접수</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Qna