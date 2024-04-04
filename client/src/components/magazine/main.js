import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import User from '../../utils/user'
import Api from '../../utils/apiutil'
import Newsitem from '../newsitem/content'
import Notice from '../customer/notice'
import Paging from '../common/paging'
import Router from 'next/router'
import Bottom from './bottom'
import { contains } from 'jquery'

const defaultState = {
    listTotal: 0,
    listData: [],
    tab: 2,
    tag: null,
    tags: [],
    viewIdx: null,
    viewContent: {},
    viewPage: 'magazine',
    newsPage: null,
    page: 1,
    per: 12,
    access:false
}


class Main extends Component {

    constructor (props) {
        super(props)
        this.state = defaultState
        this.userInfo = User.getInfo()
        this.paths = window.location.pathname.split("/")

    }

    setLink (idx) {
        let url = '/magazine/'
        if( this.paths[1] === 'startup' ) url = '/startup/education/'
        console.log( this.paths, url+idx )
        Router.push(url+'[idx]',url+idx)
    }

    componentDidMount () {
        if (!!this.props.idx) {
            this.viewContent(this.props.idx)
        } else {
            this.getList(this.state.tab, null, null)
        }
        this.getTags()
    }

    componentDidUpdate () {
        const hash = window.location.hash
        if (hash === '#newsitem' && this.state.newsPage !== 'newsitem')
            this.setState({
                tab: 4,
                viewPage: 'press',
                newsPage: 'newsitem'
            })
        if (hash === '#notice' && this.state.newsPage !== 'notice')
            this.setState({
                tab: 4,
                viewPage: 'press',
                newsPage: 'notice'
            })
        if (hash === '#articles' && this.state.viewPage === 'press')
            this.setTabs(2)
    }

    getTags () {
        Api.sendPost('/board/magazine/tags').then(res => {
            if (res.status === 'ok') {
                this.setState({
                    tags: res.data.data
                })
            }
        })
    }

    getList (category = null, tag = null, page = null, idx) {
        let params = {
            // category:category,
            page: page,
            per: this.state.per,
            tag: tag,
        }
        Api.sendPost('/board/magazine', params).then(result => {
            // console.log( result.data.data.rows )
            if (result.status === 'ok') {
                this.setState({
                    listData: result.data.data.rows,
                    listTotal: result.data.data.total,
                    viewIdx: null
                })
            } else {
                this.setState({
                    listData: [],
                    listTotal: 0,
                    viewIdx: null
                })
            }
        })
        let url = '/magazine'
        console.log( this.paths )
        if( this.paths[1] === 'startup' ) url = '/startup/education'
        window.history.pushState({ data: url }, '', url)
    }

    setTabs = async(tab) => {
        if (tab === 4) {
            this.setState({
                tab: tab,
                viewPage: 'press'
            })
            window.history.pushState({ data: '/magazine#newsitem' }, '', '/magazine#newsitem')
        } else {
            this.setState({
                tab: tab,
                viewPage: 'magazine',
                tag: null,
                page: 1
            })
            this.getList(tab)
            let url = '/magazine'
            console.log(this.paths)
            if( this.paths[1] === 'startup' ) url = '/startup/education'
            window.history.pushState({ data: url+'#articles' }, '', url+'#articles')
        }
    }

    setTags = (tag) => {
        this.setState({
            tag: tag
        })
        this.getList(this.state.tab, tag)

    }

    setPage = (page) => {
        this.setState({
            page: page
        })
        this.getList(this.state.tab, this.state.tag, page)
    }

    permissionAlert = async (permissions) =>{
        const userInfo = User.getInfo();
        const userSubscription = User.getSubscription();
        const paid = Api.sendGet('/payments/history',{page:1,per:1})
        const userSolution = User.getAvailableSoutionUser()

        var msg = `회원 전용 서비스 입니다. 로그인 또는 회원 가입을 해주세요.`
        var access = false
        var location = '/auth/signin?referer=' + encodeURIComponent('/magazine/'+this.props.idx)
        if( permissions.indexOf('A') > -1 ) {
            access = true
            console.log( 'A:',true )
        } else if( permissions.indexOf('M') > -1 ) {
            if( !!userInfo ) {
                access = true
                console.log( 'M:',true )
            }
        } else {
            if( permissions.indexOf('P') > -1 ) {
                if( !!userInfo ) {
                msg = `문서 구매 회원 전용 서비스입니다. 어떤 문서가 필요하세요?`
                location = `/`
                await paid.then(res=>{
                    if( !!res.data.data && res.data.data.length > -1 ){
                        access = true
                        console.log( 'P:',true )
                    }
                })
                }
            } 
            if( permissions.indexOf('D') > -1 ) {
                if( !!userInfo ) {
                msg = `스타트업필수문서 이용자 전용서비스입니다.`
                location = `/startup/document`
                await userSubscription.then(res=>{
                    if(!!res) {
                        access = true
                        console.log( 'D:',true )
                    }
                })
                }
            } 
            if( permissions.indexOf('S') > -1 ) {
                if( !!userInfo ) {
                msg = `스타트업(모의)실사 이용자 전용서비스입니다.` 
                location = `/startup/solution`
                await userSolution.then(res=>{
                    if(!!res) {
                        access = true
                        console.log( 'S:',true )
                    }
                })
                }
            }
        }

        console.log( 1 )
        console.log( msg, access , location)
        if( access === true ) {
            this.setState({access: true})
        }
        return {msg:msg, access:access, location:location}
    }

    viewContent = (idx, position = [0, 0]) => {
        console.log(idx)
        let params = {
            page: this.state.page,
            per: this.state.per,
            tag: this.state.tag,
            idx: idx
        }

        Api.sendPost('/board/magazine', params).then(result => {
            let list = result.data.data.rows
            let newList = []
            let i = 0
            list.forEach((item) => {
                item.prevIdx = i > 0 ? list[i - 1].idx : null
                item.nextIdx = i < list.length - 1 ? list[i + 1].idx : null
                newList[item.idx] = item
                i++
            })
            let viewContent = newList[idx]
            if (!viewContent) {
                this.getList(this.state.tab)
            } else {
                this.setState({
                    viewIdx: idx,
                    viewContent: viewContent,
                    listData: list,
                    tab: 2,
                    viewPage: 'magazine',
                    access:false
                })
                let alertMsg = this.permissionAlert(viewContent.permission)
                // console.log( "alertMsg",alertMsg )
                alertMsg.then(res=>{
                    console.log(res)
                    if( res.access !== true ) {
                        alert( res.msg )
                        if( !!res.location) {
                            window.location.href = res.location
                        }
                    } else {
                        this.setState({access: true})
                    }
                })
                
                let url = '/magazine/'
                
                if( this.paths[1] === 'startup' ) url = '/startup/education/'
                // console.log( this.paths, this.paths[2] )
                window.history.pushState({ data: url + idx }, '', url + idx)
                window.scrollTo(position[0], position[1])
            }
        })

    }

    render () {

        return (
            <div className="main">
                {this.paths[1] === 'startup'?
                <div className="visual" >
                    <h1>교육실</h1>
                </div>
                :
                <div className="visual">
                    <h2>교육실</h2>
                    <h3 className="mobile_hide">기업 운영에 필요한 생생직무실전을 만나보세요.</h3>
                </div>
                }
                <div className="contents">
                    {/* <ul className="tabs">
                        <li className='active'><Link href="/magazine" as="/magazine"><a>법률실전</a></Link></li>
                        <li><Link href='/press' as='/press'><a>로폼 소식</a></Link></li>
                    </ul> */}
                    <section style={this.paths[1]==='startup'?{marginBottom:0}:{}}>
                        {
                            (this.state.viewIdx != null && this.state.viewContent) ?
                                <div className={"view"}  onContextMenu={(e) => {e.preventDefault(); return false;}} >
                                    <div className="nav mobile_hide">
                                        {!!this.state.viewContent.prevIdx ?
                                            <div className="prev" onClick={e => this.viewContent(this.state.viewContent.prevIdx)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48.202" height="30.121" viewBox="0 0 48.202 30.121">
                                                    <defs>
                                                        <filter id="패스_1152" x="0" y="0" width="21.811" height="30.121" filterUnits="userSpaceOnUse">
                                                            <feOffset dx="1" dy="1" input="SourceAlpha"/>
                                                            <feGaussianBlur stdDeviation="2" result="blur"/>
                                                            <feFlood floodOpacity="0.161"/>
                                                            <feComposite operator="in" in2="blur"/>
                                                            <feComposite in="SourceGraphic"/>
                                                        </filter>
                                                    </defs>
                                                    <g id="그룹_2111" data-name="그룹 2111" transform="translate(-451.75 -600.439)">
                                                        <path id="패스_2172" data-name="패스 2172"
                                                              d="M11.28-13.168V1.216h1.312V-13.168Zm-6.256,1.1c-2.128,0-3.648,1.952-3.648,5.008S2.9-2.048,5.024-2.048,8.672-4,8.672-7.056,7.152-12.064,5.024-12.064Zm0,1.184c1.392,0,2.384,1.5,2.384,3.824,0,2.336-.992,3.84-2.384,3.84-1.408,0-2.4-1.5-2.4-3.84C2.624-9.376,3.616-10.88,5.024-10.88ZM23.344-9.2v1.072h2.88V-2.64h1.328V-13.152H26.224V-9.2Zm.848,3.376a4.927,4.927,0,0,1-3.488-4.4v-.7h3.152V-12H16.192v1.072h3.2v.72a5.23,5.23,0,0,1-3.616,4.7l.688,1.024A6.125,6.125,0,0,0,20.08-8.048,5.921,5.921,0,0,0,23.536-4.8ZM19.7-.208v-3.36H18.368V.864h9.584V-.208Z"
                                                              transform="translate(472 621)" fill="#575247"/>
                                                        <g transform="matrix(1, 0, 0, 1, 451.75, 600.44)" filter="url(#패스_1152)">
                                                            <path id="패스_1152-2" data-name="패스 1152" d="M7234-1057l-8,8,8,8" transform="translate(-7220.25 1063.06)" fill="none"
                                                                  stroke="#575247" strokeLinecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            : null
                                        }
                                        {
                                            !!this.state.viewContent.nextIdx ?
                                                <div className="next" onClick={e => this.viewContent(this.state.viewContent.nextIdx)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="51.75" height="30.121" viewBox="0 0 51.75 30.121">
                                                        <defs>
                                                            <filter id="패스_301" x="29.939" y="0" width="21.81" height="30.121" filterUnits="userSpaceOnUse">
                                                                <feOffset dx="1" dy="1" input="SourceAlpha"/>
                                                                <feGaussianBlur stdDeviation="2" result="blur"/>
                                                                <feFlood flood-opacity="0.161"/>
                                                                <feComposite operator="in" in2="blur"/>
                                                                <feComposite in="SourceGraphic"/>
                                                            </filter>
                                                        </defs>
                                                        <g id="그룹_2112" data-name="그룹 2112" transform="translate(-1418 -600.439)">
                                                            <text id="다음" transform="translate(1448 621)" fill="#575247" font-size="16"
                                                                  font-family="NotoSansCJKkr-Regular, Noto Sans CJK KR" letter-spacing="0.01em">
                                                                <tspan x="-29.6" y="0">다음</tspan>
                                                            </text>
                                                            <g transform="matrix(1, 0, 0, 1, 1418, 600.44)" filter="url(#패스_301)">
                                                                <path id="패스_301-2" data-name="패스 301" d="M7226-1057l8,8-8,8" transform="translate(-7190 1063.06)" fill="none"
                                                                      stroke="#575247" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className="content">
                                        <div dangerouslySetInnerHTML={{ __html: this.state.viewContent.content }} className={this.state.access===true?null:"blur"}></div>
                                        <Bottom></Bottom>
                                    </div>
                                    <div className="nav-bottom mobile_hide">
                                        {this.state.viewContent.prevIdx ?
                                            <div onClick={e => this.viewContent(this.state.viewContent.prevIdx)}><img src="/images/magazine/icon-squre-left.svg"/></div>
                                            : null}
                                        {!!this.state.viewContent.nextIdx ?
                                            <div onClick={e => this.viewContent(this.state.viewContent.nextIdx)}><img src="/images/magazine/icon-squre-right.svg"/></div>
                                            : null}
                                    </div>
                                    <div className="nav-mobile mobile">
                                        {this.state.viewContent.prevIdx ?
                                            <Link href={'/magazine/'+this.state.viewContent.prevIdx} as={'/magazine/'+this.state.viewContent.prevIdx}>
                                                <a className="nav-prev">
                                                    <img src="/common/paging-prev.svg" class="paging_btn" alt="leftpaging_left"></img>
                                                    이전글
                                                </a>
                                            </Link>
                                            : null}
                                        {!!this.state.viewContent.nextIdx ?
                                            <Link href={'/magazine/'+this.state.viewContent.nextIdx}>
                                                <a className="nav-next">
                                                    다음글
                                                    <img src="/common/paging-next.svg" class="paging_btn" alt="leftpaging_right"></img>
                                                </a>
                                            </Link>
                                            : null}
                                            <Link href='/magazine'><a className="nav-list">목록보기</a></Link>
                                    </div>
                                    <div className="go-list mobile_hide"><span onClick={() => this.getList(this.state.tab)}>전체글 보기</span></div>
                                    <ul className="list-bottom mobile_hide">
                                        {
                                            this.state.listData.slice(0, 6).map((item, key) =>
                                                <li key={key} onClick={() => this.viewContent(item.idx, [0, 380])}>
                                                    <div className="cover"
                                                         style={{
                                                             backgroundImage: `url('${item.cover}')`,
                                                             backgroundRepeat: 'no-repeat',
                                                             backgroundPosition: '-71px 0',
                                                             backgroundSize: 'cover'
                                                         }}
                                                    >
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                                :
                                <Fragment>
                                    <ul className="tags">
                                        {this.state.tab === 2 ?
                                            <Fragment>
                                                <li className={this.state.tag === null ? 'active' : null} onClick={() => this.setTags(null)}>전체</li>
                                                <li className={this.state.tag === '분쟁&리스크' ? 'active' : null} onClick={() => this.setTags('분쟁&리스크')}>분쟁&리스크</li>
                                                <li className={this.state.tag === '내부통제' ? 'active' : null} onClick={() => this.setTags('내부통제')}>내부통제</li>
                                                <li className={this.state.tag === '계약업무' ? 'active' : null} onClick={() => this.setTags('계약업무')}>계약업무</li>
                                                <li className={this.state.tag === '인사노무' ? 'active' : null} onClick={() => this.setTags('인사노무')}>인사노무</li>
                                                <li className={this.state.tag === '자산관리' ? 'active' : null} onClick={() => this.setTags('자산관리')}>자산관리</li>
                                            </Fragment>
                                            : null
                                        }
                                        {/* {this.state.tab===2?
                                    <Fragment>
                                    <li className={this.state.tag===null?'active':null} onClick={()=>this.setTags(null)} >변호사가 알려주는 스타트업 계약서</li>
                                    </Fragment>
                                    :null
                                }
                                {this.state.tab===3?
                                    <Fragment>
                                    <li className={this.state.tag===null?'active':null} onClick={()=>this.setTags(null)} >제법아는언니</li>
                                    </Fragment>
                                    :null
                                } */}
                                    </ul>

                                    <div className="total">총 {this.state.listTotal}개의 교육자료</div>
                                    <ul className="list">
                                        {
                                            this.state.listData.map((item, key) => {
                                                return (
                                                    <li key={key} onClick={() => this.viewContent(item.idx)}>
                                                        <div className="cover"
                                                             style={{
                                                                 backgroundImage: `url('${item.cover}')`,
                                                                 backgroundRepeat: 'no-repeat',
                                                                 //backgroundPosition: '-99px 0',
                                                                 backgroundSize: 'cover'
                                                             }}
                                                        >
                                                        </div>
                                                        <div className="title">
                                                            {item.title}
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <Paging total={this.state.listTotal} page={this.state.page} per={this.state.per} setPage={this.setPage}/>
                                </Fragment>
                        }


                    </section>
                </div>
            </div>
        )
    }
}

export default Main
