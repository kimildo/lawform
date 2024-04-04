const circleOrder = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮'];
const letterOrder = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'];

class Counter {
    constructor() {
        this.reset();
    }

    reset = () => {
        this.provision = this.natural = this.circle = this.parentheses = this.letter = this.title = 0;
    }

    snapshot = () => {
        this.snapshot.provision = this.provision;
        this.snapshot.natural = this.natural;
        this.snapshot.circle = this.circle;
        this.snapshot.parentheses = this.parentheses;
        this.snapshot.letter = this.letter;
        this.snapshot.title = this.title;
    }

    rollback = () => {
        this.provision = this.snapshot.provision;
        this.natural = this.snapshot.natural;
        this.circle = this.snapshot.circle;
        this.parentheses = this.snapshot.parentheses;
        this.letter = this.snapshot.letter;
        this.title = this.snapshot.title;
    }


    countindex = (type) => {
        switch (type) {
            case 'provision': return this.provisionreturn;
            case 'circle': return this.circle;
            case 'parentheses': return this.parentheses;
            case 'letter': return this.letter;
            case 'title': return this.titlereturn;
            default: return '';
        }

    }

    lastindex = (type, index) => {
        switch (type) {
            case 'provision': this.provisionreturn = index;
            case 'circle': this.circle = index;
            case 'parentheses': this.parentheses = index;
            case 'letter': this.letter = index;
            case 'title': this.titlereturn = index;
        }
    }

    increase = (type) => {
        switch (type) {
            case 'provision': ++this.provision; this.natural = this.circle = this.parentheses = this.letter = 0; return `제${this.provision}조`;
            // case 'natural': ++this.natural; this.circle = this.parentheses = this.letter = 0; return `${this.natural}.`;
            case 'natural': ++this.natural;  this.parentheses = this.letter = 0; return `${this.natural}.`;
            case 'circle': this.parentheses = this.letter = 0; return `${circleOrder[this.circle++]}`;
            case 'parentheses': this.letter = 0; return `(${++this.parentheses})`;
            case 'letter': return `${letterOrder[this.letter++]}.`;
            case 'title': ++this.title; this.natural = this.circle = this.parentheses = this.letter = 0; return `제${this.title}장`;
            default: return '';
        }
    }

    resetUnderProvision = () => {
        this.natural = this.circle = this.parentheses = this.letter = 0;
    }
    
    isOrdering = (str) => {
        str = str.trim();
        let type = undefined;
        if (str.match(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]/)) { // ①②
            type = 'circle';
            str = str.substr(1, str.length - 1);
        }
        else if (str.match(/^\d\./)) { // 1. 2.
            type = 'natural';
            str = str.substr(2, str.length - 2);
        }
        else if (str.match(/^[가나다라마바사아자차카타파하]\./)) { // 가. 나. 
            type = 'letter';
            str = str.substr(2, str.length - 2);
        }
        else if (str.match(/^\(\d\)/)) {
            type = 'parentheses';
            str = str.substr(3, str.length - 3);
        }
        return { type: type, str: str }
    }
}

export default Counter;