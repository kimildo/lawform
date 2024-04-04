module.exports = {
    number_with_comma: (number) => {
        if(!!number)
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            return '0'
    }
};
