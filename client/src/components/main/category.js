import React, { Component, Fragment } from 'react';
import Card from './card';
import Data from './data';
// import '../../scss/main/category.scss';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category:99
        };
    }

    componentDidMount() {
        
    }

    setCategory = (e,category) => {
        console.log( 'value', )
        this.setState({
            category:category
        })

    }

    render() {

        return (
            <Fragment>
                <h3>법률문서 카테고리</h3>
                <ul className="categorys">
                    <li onClick={(e)=>this.setCategory(e,99)} category="99" className={!!(this.state.category === 99)?"active":''} >기업문서</li>
                    <li onClick={(e)=>this.setCategory(e,1)} category="1" className={!!(this.state.category === 1)?"active":''} >내용증명</li>
                    <li onClick={(e)=>this.setCategory(e,3)} category="3" className={!!(this.state.category === 3)?"active":''} >지급명령</li>
                    <li onClick={(e)=>this.setCategory(e,4)} category="4" className={!!(this.state.category === 4)?"active":''} >합의서</li>
                </ul>
                <div>
                    <ul className="cards">
                        {
                            (!!Data[this.state.category].data)&&
                           Data[this.state.category].data.map((item,key)=>
                            (key < 8)&&
                            <Card key={key}
                                title={item.title}
                                description={item.description}
                                doc={item.doc}
                                icon={item.icon}
                                category = {this.state.category}
                            ></Card>
                           )
                        }
                        {
                            ( (!!Data[this.state.category].data && Object.keys( Data[this.state.category].data ).length >= 8) ||  this.state.category === 3 ) &&
                            <li className="more">
                                <h4>{ Data[this.state.category].name } 더보기</h4>
                                <div className="description">
                                로폼의 더 많은 법률문서를 만나보세요
                                </div>
                                <a href={"/category/"+this.state.category}><button >더보기</button></a>
                                <div className="icon">
                                    <img src={"/common/category_icons/more.svg"} alt={ Data[this.state.category].name+" 더보기" } />
                                </div>
                            </li>
                        }

                    </ul>
                </div>
            </Fragment>      
        );
    }
}
export default Category;
