import React, { Component, Fragment } from 'react'
import {
    ButtonBack, ButtonNext,
    CarouselProvider, DotGroup, Slide, Slider,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import Modal from '../common/modal'
import { isMobile } from 'react-device-detect'

class Reviews extends Component {
    componentDidMount () {

    }

    constructor (props) {
        super(props)
        this.state = {
            showReview: false,
            review: {}
        }
    }

    showReview (review) {
        review.blank = 5 - review.stars
        this.setState({
            showReview: true,
            review: review
        })
    }

    render () {
        const reviews = [

            {
                document: '지급명령 신청서(매매대금 청구용)',
                stars: 4,
                review: '지급명령신청서 작성에 어려움이 있어서 로폼을 활용하게 되었습니다. 기존 변호사나 법무사에게 의뢰하면 상당한 비용을 요구했는데 로폼은 저렴한 가격에 간단하게 작성할 수 있어 좋았습니다.\n법원에 신청 전 상대방에게 ‘문서를 보낼 것이다’ 라고 미리 통보한 후 작성한 지급명령 신청서를 보여주니 지급의사를 보였고 협의 후 적정한 금액을 상대방에게 받을 수 있었습니다.',
                writer: 'tnw*******@naver.com',
                date: '2019/06/13'
            },

            {
                document: '내용증명(보증금 반환 청구용)',
                stars: 4,
                review: '쉽게 할 수 없는 법률문서를 기안이 다 잡힌 상태에서 누구나 쉽게 이용할 수 있어서 도움이 많이 되었습니다.\n임대차보증금 반환을 위해 내용증명 서류를 이용하였는데 내용증명 발송 후 집주인과도 원만히 해결되어서 전 만족하고 있습니다. 나눠서 입금하기로 하고 1차로 일부 변제해 주셨고 앞으로 조금식이라도 나눠 주시겠다고 했습니다. 감사합니다~~^^',
                writer: 'sha******@nate.com',
                date: '2019/06/13'
            },
            {
                document: '내용증명(보증금 반환 청구용)',
                stars: 5,
                review: '서류 한 장 작성하는데 프로그램의 친절한 법률자문에, 우체국에서 드는 내용증명 비용이나 이후의 절차까지 챙겨 주시는 세심함에 감동하고 있습니다.\n내용증명 선에서 끝나기를 바라지만 부득이하게 지급명령이나 이후 절차까지 밟게 된다면 서류양식은 다시 로폼을 이용할게요. 여러가지로 감사합니다. 사업 번창하시기를 바랄게요^^',
                writer: 'nr****@hanmail.net',
                date: '2019/05/08'
            },
            {
                document: '내용증명(보증금 반환  청구용)',
                stars: 5,
                review: '로폼의 내용증명 양식을 이용해서 주인에게 내용증명을 보냈습니다. 내용증명 양식 작성하는게 힘드신 분들은 쉽고 편하고 친절한 로폼을 이용하시면 좋을 것 같아요!\n작성 후에 수정부분 체크해주시고 보내는 방법도 메일로 보내주셔서 너무너무 감사했습니다',
                writer: 'yis****@naver.com',
                date: '2019/07/01'
            },
            {
                document: '내용증명(매매대금 청구용)',
                stars: 4,
                review: '문서작성하기에 편리해서 좋았습니다! 업체측에서 부채를 조금씩 해결해 나가고 있어요',
                writer: 'hsb****@naver.com',
                date: '2019/06/17'
            },
            {
                document: '내용증명(계약해지 통지용)',
                stars: 5,
                review: '정말 쉽게 하고 갑니다. 덕분에 쉽고 빠르게 작성하여 활용할 수 있었습니다.\n감사합니다.',
                writer: 'sh***@naver.com',
                date: '2019/06/21'
            },
            {
                document: '내용증명(보증금 반환  청구용)',
                stars: 5,
                review: '내용증명을 처음 작성해보는 것이기에, 어떻게 해야 할지 몰라 막막하였는데, 순서대로 따라 입력하니 논리정연하고 편하고 좋습니다. 강추합니다.',
                writer: 'fun***@naver.com',
                date: '2019/07/02'
            },
            {
                document: '내용증명(대여금 청구용)',
                stars: 5,
                review: '당장 곤란한 상황에서 유용하게 이용할 수 있어서 좋습니다',
                writer: 'aci***@hanmail.net',
                date: '2019/07/11'
            },
            {
                document: '내용증명(대여금 청구용)',
                stars: 5,
                review: '처음 사용하는데  편리하고 좋네요~. 초보 분들도 편하게 사용 가능하실 수 있을 것 같습니다.',
                writer: 'hls******@naver.com',
                date: '2019/07/12'
            }
        ]

        let slideWidth = (!!isMobile) ? 200 : 1050
        let slideHeight = (!!isMobile) ? 180 : 740
        let slideStep = (!!isMobile) ? 1 : 2
        let slideVisible = (!!isMobile) ? 1 : 2
        let slideAutoplay = (!!isMobile)
        let slideDrag = (!!isMobile)

        return (
            <Fragment>

                <CarouselProvider
                    visibleSlides={slideVisible}
                    totalSlides={reviews.length}
                    step={slideStep}
                    naturalSlideWidth={slideWidth}
                    naturalSlideHeight={slideHeight}
                    className={'slider'}
                    dragEnabled={slideDrag}
                    interval={3000}
                    isPlaying={slideAutoplay}
                    infinite
                >
                    <Slider>
                        {reviews.map((item, key) =>
                            <Slide index={key} key={key}>
                                <div className="review-card" key={key}>
                                    <h5 className="document">{item.document}</h5>
                                    <div className="stars">
                                        {Array.from(Array(item.stars), (e, i) =>
                                            <img src="/main_img/star-full.png" alt="Full Star" key={i}/>
                                        )}
                                        {Array.from(Array((5 - item.stars)), (e, i) =>
                                            <img src="/main_img/star-blank.png" alt="Blank Star" key={i}/>
                                        )}
                                    </div>
                                    <div className="review">
                                        {item.review}
                                    </div>
                                    <div className="writer">{item.writer}</div>
                                </div>
                            </Slide>
                        )}
                    </Slider>

                    <div className={`slide-button slide-left`}>
                        <ButtonBack>Back</ButtonBack>
                    </div>

                    <div className={`slide-button slide-right`}>
                        <ButtonNext>Next</ButtonNext>
                    </div>

                    <DotGroup className={`slide-dot`}/>


                </CarouselProvider>

                <Modal
                    open={this.state.showReview}
                    onClose={(e) => this.setState({ showReview: false })}
                    width={550}
                    height={400}
                    className="show-review"
                    scroll="body"
                >
                    <div className="default-dialog-title">고객님의 솔직한 후기
                        <span className="close" onClick={(e) => this.setState({ showReview: false })}><img src="/common/close-white.svg"/></span>
                    </div>
                    <div className="review-content">
                        <h5 className="document">{this.state.review.document}</h5>
                        <div className="stars">
                            {Array.from(Array(this.state.review.stars), (e, i) =>
                                <img src="/main_img/star-full.png" alt="Full Star" key={i}/>
                            )}
                            {Array.from(Array(this.state.review.blank), (e, i) =>
                                <img src="/main_img/star-blank.png" alt="Blank Star" key={i}/>
                            )}
                        </div>
                        <div className="date">
                            {this.state.review.date}
                        </div>
                        <hr/>
                        <div className="review">
                            {this.state.review.review}
                        </div>
                        <div className="writer">{this.state.review.writer}</div>
                        <button onClick={(e) => this.setState({ showReview: false })}>확인</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export default Reviews
