import React, { Component } from 'react'
import '../../scss/page/lawyer/contract.scss'
import Modal from '../common/modal'

export default class ServiceSample extends Component {
    constructor (props) {
        super(props)
        this.state = {
            service_modal: {
                show: this.props.show,
                curStep: 1,
                maxStep: 3
            }
        }
    }

    componentWillUpdate (nextProp) {
        let state = this.state
        if (nextProp.show !== state.service_modal.show) {
            state.service_modal.show = nextProp.show
            this.setState(state)
        }
    }

    serviceStepNext = () => {
        let state = this.state
        let maxStep = state.service_modal.maxStep
        let curStep = state.service_modal.curStep

        if (curStep < maxStep) {
            state.service_modal.curStep++
        }
        this.setState(state)
    }

    serviceStepPrev = () => {
        let state = this.state
        let curStep = state.service_modal.curStep
        if (1 < curStep) {
            state.service_modal.curStep--
        }
        this.setState(state)
    }
    
    render () {
        return (
            <Modal id={'service-modal'} open={this.state.service_modal.show} onClose={this.props.toggleModal} width={960} className="service-modal" scroll="body">
                <div className="dialog-title-wrap" style={{textAlign:'left'}}>
                    <div className="dialog-title">
                        <h2>STEP {this.state.service_modal.curStep}.</h2>
                        <h4>
                            {(this.state.service_modal.curStep === 1) && '문서 편집 툴에서 발신 위임인을 추가 작성해주세요.'}
                            {(this.state.service_modal.curStep === 2) && '의뢰인이 작성한 문서를 검토 후 수정사항이 있다면, 내용을 수정해주세요.'}
                            {(this.state.service_modal.curStep === 3) && '문서 하단 발신인을 담당변호사로 변경해주세요.'}
                        </h4>
                    </div>
                    <span className="close" onClick={this.props.toggleModal} ><img src="/common/close-white.svg" alt="" /></span>
                </div>
                <div className="content">
                    <div>
                        <img src={`/lawyer_img/guide/doc_step${this.state.service_modal.curStep}.png`} alt={'doc_step_1'} width={960} height={934}/>
                    </div>

                    {(this.state.service_modal.curStep < this.state.service_modal.maxStep) &&
                    <div className="arrow right">
                        <img src={`/lawyer_img/guide/arr_r${(this.state.service_modal.curStep === 2) ? '_bold' : ''}.png`} alt={'arrow'} width={78} height={78} onClick={this.serviceStepNext}/>
                    </div>
                    }

                    {(this.state.service_modal.curStep > 1) &&
                    <div className="arrow left">
                        <img src="/lawyer_img/guide/arr_l.png" alt={'arrow'} width={78} height={78} onClick={this.serviceStepPrev}/>
                    </div>
                    }
                </div>
            </Modal>
        )
    }
}

