import React, { Component } from 'react';
// import '../../scss/mypage/userfavorite.scss';
import ContractsCategory from '../main/contractsCategory'
import SubContractsCategory from '../main/subContractsCategory';
import Api from '../../utils/apiutil';

class Userfavorite extends Component {
    constructor(props) {
        super(props);
        this.state = { number: 0 }
    }

    scrollToRight = () => {
        const { number } = this.state;

        if (this.state.number < 200) {
            this.setState({
                number: number + 100
            }, () => {
                const data = this.state.number;
                document.getElementById("scrollmenu").scrollTo(data, 0);
            });
        }

    }
    scrollToLeft = () => {
        if (this.state.number > 0) {

            this.setState(
                ({ number }) => ({
                    number: number - 100
                }), () => {
                    document.getElementById("scrollmenu").scrollTo(this.state.number, 0);
                }
            );
        }
    }

    componentDidMount() {
        Api.sendGet('/documents/allinfo')
            .then(res => {
                const category = res.data;
                this.setState(category);
            })
    }

    render() {

        if (this.state.Category != null) {
            return (
                <div className="wrap_userfavorite">
                    <div>
                        <div className="favorite_title">
                            <span>즐겨 찾는 문서</span>
                        </div>
                        <div className="favorite_top">
                            <div className="favorite_allnum">
                                <p>총 40 개의 문서가 있습니다.</p>
                            </div>
                            <div className="wrap_favorite_allbtn">
                                <img src="category_img/category_all.png" className="favorite_allbtn" alt="category_all" />
                            </div>
                        </div>
                    </div>
                    <div className="favorite_category">
                        <div className="scrollmenu" id="scrollmenu">
                            {
                                this.state.Category.map((Items, index) =>
                                    <ContractsCategory key={index} title={Items.Title} length={Items.SubCategory.length} />
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <div className="tab_right" onClick={this.scrollToRight}></div>
                        <div className="tab_left" onClick={this.scrollToLeft}></div>
                    </div>
                    <div>
                        <div className="favorite_subcategory">
                            <div className="">
                                {
                                    this.state.Category.map((Items) =>
                                        Items.SubCategory.map((SubItems, subIndex) =>
                                            <SubContractsCategory key={subIndex} title={SubItems.Title} />

                                            // <div>{subIndex}</div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="wrap_favorite_item">
                        {
                            this.state.Category.map((Items) =>
                                Items.SubCategory.map((SubItems) =>
                                    SubItems.Documents.map((Data, itemIndex) =>
                                        <div className="favorite_item" key={itemIndex}>
                                            <img src={Data.Image} width="230" height="334" alt="document_image" />
                                        </div>
                                    )
                                )
                            )
                        }
                    </div>
                </div>
            );
        } else return (<div></div>);
    }
}

export default Userfavorite;
