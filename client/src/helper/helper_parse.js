module.exports = {
    get_param: (name) => {
        let url_string = window.location.href
        let url = new URL(url_string)
        let c = url.searchParams.get(name)
        if (c == null) {
            return undefined
        }
        return c
    },
    url_encode: (key, val) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(val)
    }
}
