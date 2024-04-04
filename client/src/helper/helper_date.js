const moment = require('moment')

const helperDate = {
    get_holidays: (date) => {
        let holis = {
            '2020': ['0101', '0124', '0125', '0126', '0127', '0430', '0501', '0505', '0930', '1001', '1002', '1009', '1225'],
            '2021': ['0101', '0212', '0301', '0501', '0505', '0519', '0606', '0920', '0921', '0922', '1003', '1009', '1225',],
            '2022': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
            '2023': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
            '2024': ['0101', '0301', '0501', '0505', '0606', '0815', '1003', '1009', '1225'],
        }

        if (!moment(date).isValid()) {
            return false
        }

        let year = moment(date).format('Y')
        let monthDate = moment(date).format('MMDD')
        let holiDayArr = holis[year]
        return (holiDayArr.indexOf((monthDate)) !== -1)

    },
    get_date: () => {
        return moment().format('Y-MM-DD HH:mm:ss')
    },
    get_full_date_with_text: (datetime) => {

        if (!moment(datetime).isValid()) {
            return '-'
        }

        if (!datetime || datetime === '0000-00-00 00:00:00' || datetime === '0000-00-00') {
            return '-'
        }

        return moment(datetime).format('Y 년 MM월 DD일')
    },
    get_full_date_hm_with_text: (datetime) => {
        if (!moment(datetime).isValid()) {
            return '-'
        }

        if (!datetime || datetime === '0000-00-00 00:00:00' || datetime === '0000-00-00') {
            return '-'
        }

        return moment().format('Y년 MM월 DD일 HH시 mm분 ss초')
    },
    diff_two_dates: (datetime_1, datetime_2, rtnDay = false) => {
        const date1 = new Date(datetime_1)
        const date2 = new Date(datetime_2)
        const diffTime = date2 - date1
        //console.log(diffTime)
        //const diffTime = Math.abs(date2 - date1)

        if (rtnDay === true) {
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        }

        return diffTime
    },
    compare_two_dates: (datetime_1, datetime_2) => {
        const date1 = new Date(datetime_1)
        const date2 = new Date(datetime_2)
        const diffTime = date1 - date2
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        return (diffDays >= 0)
    },
    date_available_from_today: (datetime) => {

        if (!moment(datetime).isValid()) {
            return false
        }

        let dateDiff = moment(datetime).fromNow().indexOf('ago')
        return (dateDiff === -1)
    },
    subtract_date: (date, type, count = 0) => {
        let typeStr
        switch (type) {
            case 'y':
                typeStr = 'years'
                break
            case 'm':
                typeStr = 'month'
                break
            default:
                typeStr = 'days'
        }

        return moment().subtract(count, typeStr).format('YYYY-MM-DD HH:mm:ss')
    },
    add_date: (date, type, count = 0) => {
        let typeStr
        switch (type) {
            case 'y':
                typeStr = 'years'
                break
            case 'm':
                typeStr = 'month'
                break
            default:
                typeStr = 'days'
        }

        return moment().add(count, typeStr).format('YYYY-MM-DD HH:mm:ss')
    },
    get_date_string : (date, fixed_time = null) => {

        let timeFormat = (!!date && fixed_time !== null) ? fixed_time : 'HH:mm:ss'
        if (!moment(date).isValid()) {
            return '-'
        }

        return moment(date).format('Y-MM-DD ' + timeFormat)
    },
    get_date_added: (days_to_add, fixed_time = null) => {

        let valid = false
        let date = new Date(new Date().getTime() + (days_to_add * 24 * 60 * 60 * 1000))
        let chkHoliDay = helperDate.get_holidays(date)

        if (!!chkHoliDay) { // 공휴일
            days_to_add += 1
        } else if (date.getDay() === 0) { // 일요일
            days_to_add += 1
        } else if (date.getDay() === 6) { // 토요일
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
