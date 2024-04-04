import React, { Component } from 'react'
import Link from 'next/link'

import helper_parse from '../helper/helper_parse'

let helper_pagination = {
    html: (base_url, current_page, limit_per_page, total_count, extra_params, hash = null) => {
        if (typeof current_page === 'undefined') current_page = 1
        if (total_count === 0) return ''

        let urlencode = function (obj) {
            let str = []
            for (let p in obj)
                str.push(helper_parse.url_encode(p, obj[p]))
            return str.join('&')
        }

        const refresh = () => {
            setTimeout(() => {
                window.location.reload()
            }, 100)
        }

        let fb_cnt = 5   // <------ 이게 전체 길이 말하는 거임~!!!!!!!!!!
        let limit = Math.ceil(total_count / limit_per_page)
        let start = (current_page < fb_cnt) ? 1 : current_page - fb_cnt + 1
        let end = (current_page < fb_cnt) ? current_page + (fb_cnt * 2 - 1) : current_page + fb_cnt
        end = (end > limit) ? limit : end
        let pages = []
        let double_front_arrow = true
        let double_front_arrow_value = 0
        let front_arrow = true
        let front_arrow_value = 0
        let back_arrow = true
        let back_arrow_value = 0
        let double_back_arrow = true
        let double_back_arrow_value = 0

        for (let i = start; i <= end; i++) {
            let item = { 'num': i, 'cls': '' }
            if (current_page === i)
                item.cls = 'active'
            pages.push(item)
        }

        double_front_arrow_value = (current_page - fb_cnt > 0) ? current_page - fb_cnt : 1
        front_arrow_value = ((current_page - 1) <= 0) ? 1 : (current_page - 1)
        back_arrow_value = ((current_page + 1) <= limit) ? (current_page + 1) : limit
        double_back_arrow_value = (current_page + fb_cnt <= limit) ? current_page + fb_cnt : limit

        let params = urlencode(extra_params)

        if (!!hash) {
            params += '#' + hash
        }

        return (
            <div className="pagination">
                <ul>
                    {double_front_arrow ? (
                        <li>
                            <a href={base_url + '?' + helper_parse.url_encode('page', double_front_arrow_value) + '&' + params} onClick={refresh}>
                                &#171;
                            </a>
                        </li>
                    ) : null}
                    {front_arrow ? (
                        <li>
                            <a href={base_url + '?' + helper_parse.url_encode('page', front_arrow_value) + '&' + params} onClick={refresh}>
                                &#8249;
                            </a>
                        </li>
                    ) : null}
                    {pages.map(function (item, i) {
                        return (
                            <li className={item.cls} key={i}>
                                <a href={base_url + '?' + helper_parse.url_encode('page', item.num) + '&' + params} onClick={refresh}>{item.num}</a>
                            </li>
                        )
                    })}
                    {back_arrow ? (
                        <li>
                            <a href={base_url + '?' + helper_parse.url_encode('page', back_arrow_value) + '&' + params} onClick={() => window.location.replace()}>
                                &#8250;
                            </a>
                        </li>
                    ) : null}
                    {double_back_arrow ? (
                        <li>
                            <a href={base_url + '?' + helper_parse.url_encode('page', double_back_arrow_value) + '&' + params} onClick={() => window.location.reload()}>
                                &#187;
                            </a>
                        </li>
                    ) : null}
                </ul>
            </div>
        )
    }
}

export default helper_pagination
