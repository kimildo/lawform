import React, { Component } from 'react'
import Link from 'next/link'

// import '../../scss/page/doc/sidebar.scss'

class AlertPopPricing extends Component {

    constructor (props) {
        super(props)
        this.state = { 'parent': '', 'type': '' }
    }

    render () {
        const { type, parent } = this.props
        const priceImageName = (type === '1') ? 'lawyer_price' : 'lawyer_price_review_1'
        return (
            <div className="alert-pop">
                <div className="pop-head">
                    <div className="title">변호사 {type === '1' ? '직인' : '검토'} 서비스 요금 안내</div>
                    <div className="close" onClick={(e) => parent.handleClickTogglePopupPricing()}>X</div>
                </div>
                <div className="pop-body">
                    <div className="pop-body-price">
                        <img src={`/lawyer_img/${priceImageName}.svg`} alt={'서비스 요금 안내'}/>
                    </div>

                    <div className="pop-body-desc">
                        <ul>
                            <li>
                                기본 서비스는 변호사와 매칭된 날로부터 2일 후 오후 12시 이전 완료
                                (ex. 2020. 1. 2. 수락 시 2020. 1. 4 09:00 까지 완료)
                            </li>
                            <li>
                                긴급 서비스는 변호사와 매칭된 날로부터 다음날 13시 이전 완료.
                                (ex. 2020. 1. 2. 수락 시 2020. 1. 3 13:00 까지 완료)
                            </li>
                            <li>완료일이 휴일/주말인 경우에는 그 다음날을 기준으로 합니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default AlertPopPricing
