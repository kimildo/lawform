/**
 *
 * @param target
 * @param type 법원(court), 검찰청(prosecutor)
 */

 module.exports = {

    findCourt(sido, sigungu) {
        return this.findProsecutor(sido, sigungu).replace("검찰청", "법원").replace("지청", "지원");
    },
    
    findProsecutor(sido, sigungu) {
        var arrSigungu = sigungu.split(" ");
        switch (sido) {
            case "서울":
                return this.findProsecutor_Seoul(arrSigungu[0]);
            case "인천":
                return "인천지방검찰청";
            case "경기":
                return this.findProsecutor_Gyeonggi(arrSigungu[0]);
            case "강원":
                return this.findProsecutor_Gangwon(arrSigungu[0]);
            case "대전":
            case "세종특별자치시" :
                return "대전지방검찰청";
            case "충남":
                return this.findProsecutor_Choongnam(arrSigungu[0]);
            case "충북":
                return this.findProsecutor_Choongbuk(arrSigungu[0]);
            case "대구":
                return this.findProsecutor_Daegu(arrSigungu[0]);
            case "경북":
                return this.findProsecutor_Gyeongbuk(arrSigungu[0]);
            case "부산":
                return this.findProsecutor_Busan(arrSigungu[0]);
            case "울산":
                return "울산지방검찰청";
            case "경남":
                return this.findProsecutor_Gyeongnam(arrSigungu[0], arrSigungu[1]);
            case "광주":
                return "광주지방검찰청";
            case "전남":
                return this.findProsecutor_Jeonnam(arrSigungu[0]);
            case "전북":
                return this.findProsecutor_Jeonbuk(arrSigungu[0]);
            case "제주특별자치도":
                return "제주지방검찰청";
            default :
                return sido;
        }
    },
    
    findProsecutor_Seoul(sigungu) {
        switch (sigungu) {
            case "종로구":
            case "중구":
            case "강남구":
            case "서초구":
            case "관악구":
            case "동작구":
                return "서울중앙지방검찰청";
    
            case "성동구":
            case "광진구":
            case "강동구":
            case "송파구":
                return "서울동부지방검찰청";
    
            case "영등포구":
            case "강서구":
            case "양천구":
            case "구로구":
            case "금천구":
                return "서울남부지방검찰청";
    
            case "동대문구":
            case "중랑구":
            case "성북구":
            case "도봉구":
            case "강북구":
            case "노원구":
                return "서울북부지방검찰청";
    
            case "서대문구":
            case "마포구":
            case "은평구":
            case "용산구":
                return "서울서부지방검찰청";
    
            default :
                return "서울지방검찰청"; //error
        }
    },
    
    findProsecutor_Gyeonggi(sigungu) {
    
        switch (sigungu) {
            case "부천시":
            case "김포시":
                return "인천지방검찰청 부천지청";
    
            case "수원시":
            case "오산시":
            case "용인시":
            case "화성시":
                return "수원지방검찰청";
    
            case "성남시":
            case "하남시":
            case "광주시":
                return "수원지방검찰청 성남지청";
    
            case "이천시":
            case "여주시":
            case "양평군":
                return "수원지방검찰청 여주지청";
    
            case "평택시":
            case "안성시":
                return "수원지방검찰청 평택지청";
    
            case "안양시":
            case "과천시":
            case "의왕시":
            case "군포시":
                return "수원지방검찰청 안양지청";

            case "의정부시":
            case "양주시":
            case "남양주시":
            case "구리시":
            case "연천군":
            case "포천시":
            case "가평군":
            case "동두천시":
            case "철원군":
                return "의정부지방검찰청";
            
            case "고양시":
            case "파주시":
                return "의정부지방검찰청 고양지청";
    
            default :
                return "경기지방검찰청"; //error
        }
    },
    
    findProsecutor_Gangwon(sigungu) {
        switch (sigungu) {
            case "춘천시":
            case "화천군":
            case "양구군":
            case "인제군":
            case "홍천군":
                return "춘천지방검찰청";
    
            case "강릉시":
            case "동해시":
            case "삼척시":
                return "춘천지방검찰청 강릉지청";
    
            case "원주시":
            case "횡성군":
                return "춘천지방검찰청 원주지청";
    
            case "속초시":
            case "양양군":
            case "고성군":
                return "춘천지방검찰청 속초지청";
    
            case "태백시":
            case "영월군":
            case "정선군":
            case "평창군":
                return "춘천지방검찰청 영월지청";
    
            default :
                return "강원지방검찰청"; // error
        }
    },
    
    findProsecutor_Choongnam(sigungu) {
        switch (sigungu) {
            case "금산군":
                return "대전지방검찰청";
    
            case "보령시":
            case "홍성군":
            case "예산군":
            case "서천군":
                return "대전지방검찰청 홍성지청";
    
            case "공주시":
            case "청양군":
                return "대전지방검찰청 공주지청";
    
            case "논산시":
            case "계룡시":
            case "부여군":
                return "대전지방검찰청 논산지청";
    
            case "서산시":
            case "당진시":
            case "태안군":
                return "대전지방검찰청 서산지청";
    
            case "천안시":
            case "아산시":
                return "대전지방검찰청 천안지청";
    
            default:
                return "충남지방검찰청"; // error
        }
    },
    
    findProsecutor_Choongbuk(sigungu) {
        switch (sigungu) {
            case "청주시":
            case "진천군":
            case "보은군":
            case "괴산군":
            case "증평군":
                return "청주지방검찰청";
    
            case "충주시":
            case "음성군":
                return "청주지방검찰청 충주지청";
    
            case "제천시":
            case "단양군":
                return "청주지방검찰청 제천지청";
    
            case "영동군":
            case "옥천군":
                return "청주지방검찰청 영동지청";
    
            default :
                return "충북지방검찰청"; // error
        }
    },
    
    findProsecutor_Daegu(sigungu) {
        switch (sigungu) {
            case "중구":
            case "동구":
            case "남구":
            case "북구":
            case "수성구":
                return "대구지방검찰청";
    
            case "서구":
            case "달서구":
            case "달성군":
            case "성주군":
            case "고령군":
                return "대구지방검찰청 서부지청";
    
            default:
                return "대구검찰청"; // error
        }
    },
    
    findProsecutor_Gyeongbuk(sigungu) {
        switch (sigungu) {
            case "영천시":
            case "경산시":
            case "칠곡군":
            case "청도군":
                return "대구지방검찰청";
    
            case "안동시":
            case "영주시":
            case "봉화군":
                return "대구지방검찰청 서부지청";
    
            case "경주시":
                return "대구지방검찰청 경주지청";
    
            case "포항시":
            case "울릉군":
                return "대구지방검찰청 포항지청";
    
            case "김천시":
            case "구미시":
                return "대구지방검찰청 김천지청";
    
            case "상주시":
            case "문경시":
            case "예천군":
                return "대구지방검찰청 상주지청";
    
            case "의성군":
            case "군위군":
            case "청송군":
                return "대구지방검찰청 의성지청";
    
            case "영덕군":
            case "영양군":
            case "울진군":
                return "대구지방검찰청 영덕지청";
    
            default :
                return "경북지방검찰청"; // error
        }
    },
    
    findProsecutor_Busan(sigungu) {
        switch (sigungu) {
            case "중구":
            case "서구":
            case "동구":
            case "영도구":
            case "부산진구":
            case "북구":
            case "사상구":
            case "강서구":
            case "사하구":
            case "동래구":
            case "연제구":
            case "금정구":
                return "부산지방검찰청";
    
            case "해운대구":
            case "남구":
            case "수영구":
            case "기장구":
                return "부산지방검찰청 동부지청";
    
            default :
                return "부산검찰청"; //error
        }
    },
    
    findProsecutor_Gyeongnam(sigungu1, sigungu2) {
        switch (sigungu1) {
            case "양산시":
                return "울산지방검찰청";
    
            case "창원시":
                switch (sigungu2) {
                    case "의창구":
                    case "성산구":
                    case "진해구":
                        return "창원지방검찰청";
    
                    case "마산합포구":
                    case "마산회원구":
                        return "창원지방검찰청 마산지청";
    
                    default:
                        return "창원검찰청"; // error
                }
    
            case "김해시":
                return "창원지방검찰청";
    
            case "함안군":
            case "의령군":
                return "창원지방검찰청 마산지청";
    
            case "통영시":
            case "거제시":
            case "고성군":
                return "창원지방검찰청 통영지청";
    
            case "밀양시":
            case "창녕군":
                return "창원지방검찰청 밀양지청";
    
            case "거창군":
            case "함양군":
            case "합천군":
                return "창원지방검찰청 거창지청";
    
            case "진주시":
            case "사천시":
            case "남해군":
            case "하동군":
            case "산청군":
                return "창원지방검찰청 진주지청";
    
            default :
                return "경남지방검찰청"; // error
        }
    },
    
    findProsecutor_Jeonnam(sigungu) {
        switch (sigungu) {
            case "나주시":
            case "화순군":
            case "장성군":
            case "담양군":
            case "곡성군":
            case "영광군":
                return "광주지방검찰청";
    
            case "목포시":
            case "무안군":
            case "신안군":
            case "함평군":
            case "영암군":
                return "광주지방검찰청 목포지청";
    
            case "장흥군":
            case "강진군":
                return "광주지방검찰청 장흥지청";
    
            case "순천시":
            case "여수시":
            case "광양시":
            case "구례군":
            case "고흥군":
            case "보성군":
                return "광주지방검찰청 순천지청";
    
            case "해남군":
            case "완도군":
            case "진도군":
                return "광주지방검찰청 해남지청";
    
            default :
                return "전남지방검찰청"; //error
        }
    },

    findProsecutor_Jeonbuk(sigungu) {
        switch (sigungu) {
            case "전주시":
            case "김제시":
            case "완주군":
            case "임실군":
            case "진안군":
            case "무주군":
                return "전주지방검찰청";
    
            case "군산시":
            case "익산시":
                return "전주지방검찰청 군산지청";
    
            case "정읍시":
            case "부안군":
            case "고창군":
                return "전주지방검찰청 정읍지청";
    
            case "남원시":
            case "장수군":
            case "순창군":
                return "전주지방검찰청 남원지청";
    
            default :
                return "전북지방검찰청";
        }
    }
 }
