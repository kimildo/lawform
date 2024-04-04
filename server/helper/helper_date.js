var helperDate = {
    get_holidays: (date) => {
        let holis = {
            '2020': ['0101', '0124', '0125', '0126', '0127', '0430', '0501', '0505', '0930', '1001', '1002', '1009', '1225'],
            '2021': ['0101', '0212', '0301', '0501', '0505', '0519', '0606', '0920', '0921', '0922', '1003', '1009', '1225',],
            '2022': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
            '2023': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
            '2024': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
        }

        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = (month < 10 ? '0' : '') + month

        let day = date.getDate()
        day = (day < 10 ? '0' : '') + day

        let holiDayArr = holis[year]
        return (holiDayArr.indexOf((month + day)) !== -1)

    },
    get_date: () => {
        return helperDate.get_date_string()
    },
    get_date_string : (date, fixed_time = null) => {

        let dateTime = date || new Date()

        let year = dateTime.getFullYear()

        let month = dateTime.getMonth() + 1
        month = (month < 10 ? '0' : '') + month

        let day = dateTime.getDate()
        day = (day < 10 ? '0' : '') + day

        let timestamp = fixed_time
        if (fixed_time === null) {
            let hour = dateTime.getHours()
            hour = (hour < 10 ? '0' : '') + hour

            let min = dateTime.getMinutes()
            min = (min < 10 ? '0' : '') + min

            let sec = dateTime.getSeconds()
            sec = (sec < 10 ? '0' : '') + sec

            timestamp = hour + ':' + min + ':' + sec
        }

        return year + '-' + month + '-' + day + ' ' + timestamp


    },
    get_date_added: (days_to_add, fixed_time = null) => {

        let valid = false
        let date = new Date(new Date().getTime() + (days_to_add * 24 * 60 * 60 * 1000))
        let chkHoliDay = helperDate.get_holidays(date)

        if (!!chkHoliDay) { // 공휴일
            days_to_add += 1
        } else if (date.getDay() === 0 || date.getDay() === 6) { // 토/일요일
            days_to_add += 2
        } else {
            valid = true
        }

        if (!!valid) return helperDate.get_date_string(date, fixed_time) // 평일이면 날짜반환
        return helperDate.get_date_added(days_to_add, fixed_time) // 빨간날은 재귀호출
    },
    get_apply_deadline : () => {

        let date = new Date()
        let dateAdd = 1, curHour, curMin
        let fixed_time = '18:00:00'

        curHour = date.getHours()
        curMin = date.getMinutes()
        if (curHour <= 12) {
            if (curHour === 12 && curMin > 0) dateAdd = 1
            else dateAdd = 0
        }

        return helperDate.get_date_added(dateAdd, fixed_time)

    }
}

module.exports = helperDate