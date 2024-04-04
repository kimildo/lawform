import React, { Component, Fragment } from 'react'
import User from '../../../utils/user'
import Product from './product'
import Note from './note'

const data = require('json/startup.json')
const categorys = Object.getOwnPropertyNames(data)
class Category extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            activeTabsIndex:'all',
            activeTagsIndex:0,
            showTabsFirst: 1,
            showTabsMarginLeft: 0,
            navTabPrevClass:"",
            navTabNextClass:"possible",
            showTagList:data[categorys[0]],
            showDocumentList:data[categorys[0]][0],
            documentList:null
        };
        this.tabsList = categorys
    }
    componentDidMount() {
        // this.setTab(0)
        this.setTabAll()
    }
    
    navTab(act) {
        const t = this.tabs.childNodes.length
        const v = 6
        var n = this.state.showTabsFirst
        const w = 155
        var prev,next = ""
        var showTabsFirst = n
        const move = async () => {
            if( act === 'prev' ) {
                if( (n - 1) > 0  ){
                    showTabsFirst = n -1
                    this.setState({
                        showTabsMarginLeft: "-"+w*(n-2)+"px",
                        showTabsFirst:showTabsFirst
                    })
                }
            } else if( act === 'next' ) {
                if( (n + ( v - 1)) < t  ){
                    showTabsFirst = n + 1
                    this.setState({
                        showTabsMarginLeft: "-"+w*(n)+"px",
                        showTabsFirst:showTabsFirst
                    })
                }
            }
            return showTabsFirst
        }
        move().then(r=>{
            if( (r-1) > 0 && (r-1) < t-v  ) {
                prev = next = "possible"
            } else if( (r-1) > 0 ) {
                prev = "possible"
            } else if( (r-1) < t-v ) {
                next = "possible"
            }
            this.setState({
                navTabPrevClass:prev,
                navTabNextClass:next
            })
        })
    }

    setTab(index) {
        var set = async() => {
            await this.setState({
                activeTabsIndex:index,
                activeTagsIndex:0,
                showTagList:data[categorys[index]]
            })
            await this.setTag(0)
        }
        set()
    }

    setTabAll() {
        var documentList = {}
        var all = async() => {
            Object.keys(data).forEach(function(k){
                Object.keys(data[k]).forEach(function(key){
                    Object.keys(data[k][key]).forEach(function(n){
                        if( !!n ) documentList[n]=data[k][key][n]
                    })
                });
            })
            await this.setState({
                activeTabsIndex:'all',
                activeTagsIndex:0,
                documentList
            })
        }
        all()
    }

    setTag(index) {
        if( index === 0 ) {
            var tagList = this.state.showTagList
            var documentList = {}
            var loop = async() => {
                await Object.keys(tagList).forEach(function(k){
                    if( Object.getOwnPropertyNames(tagList[k]).length > 0 ) {
                        Object.keys(tagList[k]).forEach(function(key){
                            if( !!key ) documentList[key]=tagList[k][key]
                        });
                    }
                });
                await this.setState({
                    activeTagsIndex:index,
                    documentList
                })
            }
            loop()

        } else {
            this.setState({
                activeTagsIndex:index,
                documentList:this.state.showTagList[Object.getOwnPropertyNames(this.state.showTagList)[index-1]]
            })
        }
    }

    render() {
        return (
            <div className="category">
                <div className="tabs-wrap">
                    <ul className="tabs" ref={e=>this.tabs = e} style={{marginLeft:this.state.showTabsMarginLeft}} >
                        <li className={(this.state.activeTabsIndex==='all')?"active":"" } onClick={(e)=>this.setTabAll()}>전체</li>
                        {  
                        this.tabsList.map((item,index) =>
                            <li key={index} className={(index === this.state.activeTabsIndex)?"active":"" } onClick={(e)=>this.setTab(index)}>{item}</li>
                        )}
                    </ul>
                </div>
                <div className="pn">
                    <button onClick={()=>this.navTab('prev')} className={this.state.navTabPrevClass} >이전</button>
                    <button onClick={()=>this.navTab('next')} className={this.state.navTabNextClass} >다음</button>
                </div>
                { this.state.activeTabsIndex!=='all'&&
                <ul className="tags">
                    <li onClick={()=>this.setTag(0)} className={this.state.activeTagsIndex===0?"active":""}>전체</li>
                    { Object.getOwnPropertyNames(this.state.showTagList).map((item,index)=>
                        <li key={index} onClick={()=>this.setTag(index+1)} className={this.state.activeTagsIndex===index+1?"active":""}>{item}</li>
                    )}
                </ul>
                }
                <Product list={this.state.documentList} />
                <Note 
                    category={categorys[this.state.activeTabsIndex]} 
                    subcategory={Object.getOwnPropertyNames(this.state.showTagList)[this.state.activeTagsIndex-1]} 
                    userInfo={this.props.userInfo} 
                    userSubscription={this.props.userSubscription}
                    issueCategory={'ST'}
                />
            </div>
        );
    }
}

export default Category;
