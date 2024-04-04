let axios = require('axios')
let Cookies = require('js-cookie')
const apiHost = (!!process.env.REACT_APP_APIHOST) ? process.env.REACT_APP_APIHOST : 'https://lawform.io/api'
//let apiHost = 'https://lawform.io:8000/api'
//if (process.env.REACT_APP_APIHOST) apiHost = process.env.REACT_APP_APIHOST

module.exports = {
    sendPost (url, params, token=null) {
        let headers = { 'Content-Type': 'application/json' }
        token = !!token?token:Cookies.get('token')
        if (!!token) headers['x-access-token'] = token
        url = apiHost + url
        let status, data, reason
        return axios.post(url, JSON.stringify(params), { headers: headers })
            .then(res => {
                status = res.data.status
                data = res.data
                reason = (!!res.data.reason) ? res.data.reason : ''
                return (status === 'error') ? { status: 'error', data: '', reason: reason } : { status: 'ok', data: data, reason: reason }
            })
    },

    sendGet (url, params = {}) {
        let headers = {'Pragma': 'no-cache'}
        let token = Cookies.get('token')
        if (!!token) {
            headers['x-access-token'] = token
        }
        url = apiHost + url

        return axios.get(url, { params: params, headers: headers }).then(res => {
            return res
        })
    },

    sendPut (url, params = {}) {
        let headers = {
            'Content-Type': 'application/json',
        }

        let token = Cookies.get('token')
        if (!!token) {
            headers['x-access-token'] = token
        }

        url = apiHost + url
        let status, data, reason
        return axios.post(url, params, { headers: headers })
            .then(res => {
                status = res.data.status
                data = res.data
                reason = (!!res.data.reason) ? res.data.reason : ''
                return (status === 'ok') ? { status: status, data: data, reason: reason } : { status: 'error', data: '', reason: reason }
            })
    },

    sendDelete (url, params = {}) {

        let headers = {
            'Content-Type': 'application/json',
        }

        url = apiHost + url

        let token = Cookies.get('token')
        if (!!token) {
            headers['x-access-token'] = token
        }

        return axios.delete(url, { params: params, headers: headers })
            .then(res => {
                let status = res.data.status
                let data = res.data
                let reason = ''
                if (status === 'ok') {
                    return { status: 'ok', data: data, reason: reason }
                } else {
                    if (!!res.data.reason) reason = res.data.reason
                    return { status: 'error', data: '', reason: reason }
                }
            })
    },

    postBlob ( url, params = {}) {
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
        let token = Cookies.get('token')
        if (!!token) headers['x-access-token'] = token
        return axios({
            url: apiHost+url,
            method: 'post',
            responseType: 'blob',
            data:params,
            headers: headers
        })
        .then((response, err) => {
            return { status: 'ok', data: response.data }
        });
    }

}
