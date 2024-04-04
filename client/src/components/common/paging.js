import React, { Component } from 'react'

// import '../../scss/common/paging.scss';

class Paging extends Component {

    constructor (props) {
        super(props)
        this.state = {
            pages: [1],
            page: 1,
            per: 10,
            total: 1,
            totalPages: 1
        }
    }

    handleClick = (e, page) => {
        this.setState({
            page: page
        })
        this.props.setPage(page, this.props.per)
    }

    componentWillMount = () => {
        this.paging(this.props.page, this.props.total, this.props.per)
    }

    componentDidUpdate = () => {

    }

    componentWillReceiveProps (newProps) {

        this.paging(newProps.page, newProps.total, newProps.per)

    }

    paging = (page = 1, total = 1, per = 10) => {
        // let page = this.props.page;
        // let total = this.props.total;
        // let per = this.props.per;
        let totalPages = Math.ceil(total / per)
        let listPages = []
        if (totalPages > 5) {
            if (page > 3) {
                let min = 2
                if ((totalPages - page) < 2) {
                    min = min + (2 - (totalPages - page))
                }

                for (var i = (page - min); i <= (page + 2); i++) {
                    if (i <= totalPages) listPages.push(i)
                }
            } else {
                let min = 2
                if ((totalPages - page) < 2) {
                    min = min + (2 - (totalPages - page))
                }

                for (var i = 1; i <= 5; i++) {
                    if (i <= totalPages) listPages.push(i)
                }
            }

        } else {
            for (var i = 1; i <= totalPages; i++) {
                listPages.push(i)
            }
        }
        let pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
        this.setState({
            pages: listPages,
            page: page,
            total: total,
            totalPages: totalPages,
            per: per
        })
    }

    prevPage = (e) => {
        let prevPage = this.state.page - 1
        if (prevPage > 0) {
            this.setState({
                page: prevPage
            })
            this.props.setPage(prevPage, this.props.per)
            this.paging(prevPage)
        }
    }

    nextPage = (e) => {
        let nextPage = this.state.page + 1
        this.setState({
            page: nextPage
        })
        this.props.setPage(nextPage, this.props.per)
        this.paging(nextPage)
    }

    render () {
        return (
            <div className="paging_wrap">
                {
                    (this.state.page > 1) ?
                        <div className="inline_box" style={{ cursor: 'pointer' }} onClick={(e) => this.prevPage(e)}>
                            <img src="/common/paging-prev.svg" className="paging_btn" alt="leftpaging_left"/>
                        </div>
                        :
                        <div className="inline_box">
                            <img src="/common/paging-prev.svg" className="paging_btn" alt="leftpaging_left"/>
                        </div>
                }
                <div className="inline_box">
                    {
                        this.state.pages.map((page, key) =>
                            <span key={key} className={(this.state.page === page) ? 'active paging_num' : 'paging_num'} onClick={(e) => this.handleClick(e, page)}>{page}</span>
                        )
                    }

                </div>
                {(this.state.totalPages > this.state.page) ?
                    <div className="inline_box" style={{ cursor: 'pointer' }} onClick={(e) => this.nextPage(e)}>
                        <img src="/common/paging-next.svg" className="paging_btn" alt="paging_right"/>
                    </div>
                    :
                    <div className="inline_box">
                        <img src="/common/paging-next.svg" className="paging_btn" alt="paging_right"/>
                    </div>
                }
            </div>
        )
    }
}

export default Paging
