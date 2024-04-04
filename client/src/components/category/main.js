import React, {Component, Fragment} from 'react'
// import '../../scss/category.scss'
import Link from 'next/link'
import Survey from '../../components/category/survey'
import CommonUtil from '../../utils/commonutil'
import User from '../../utils/user'

// import CategoryArray from './categorys.js'
const ignoreInstruction = [2, 4, 6, 8, 11, 12, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 70] // 소개페이지 없는 문서

const CategoryArray = {
    1: {
        /**내용증명 */
        cards:
            [
                [
                    {'title': '대여금', 'description': '빌려준 돈을\n받지 못했어요', 'image': 'doc_9.svg', 'iddocuments': 1},
                    {'title': '매매대금', 'description': '물건을 팔고\n돈을 받지 못했어요', 'image': 'doc_4.svg', 'iddocuments': 3},
                    {'title': '월세청구', 'description': '밀린 월세를\n받고 싶어요', 'image': 'doc_23.svg', 'iddocuments': 23},
                    {'title': '보증금반환', 'description': '보증금을\n받지 못했어요 (전세/월세보증금 등)', 'image': 'doc_25.svg', 'iddocuments': 49},
                    {'title': '부동산 계약해지(세입자용)', 'description': '계약해지를 미리 통지하고\n보증금을 받고 싶어요', 'image': 'doc_21_1.svg', 'iddocuments': 21},
                    {'title': '일반 계약해지', 'description': '계약을\n해지하고 싶어요', 'image': 'doc_6.svg', 'iddocuments': 5},
                    {'title': '부동산 계약해지(임대인용)', 'description': '부동산 계약을\n해지하고 싶어요', 'image': 'doc_22.svg', 'iddocuments': 22},
                    {'title': '명예훼손', 'description': '명예훼손을 중단하라고\n경고하고 싶어요', 'image': 'doc_8.svg', 'iddocuments': 7},
                    {'title': '용역대금', 'description': '일을 하고 \n돈을 못 받았어요', 'image': 'doc_28.svg', 'iddocuments': 28},
                    {'title': '용역대금 반환', 'description': '용역대금을\n돌려받고 싶어요', 'image': 'doc_29.svg', 'iddocuments': 29},
                    {'title': '손해배상(물건,권리침해)', 'description': '동산, 부동산, 권리에 대한 불법행위 중단 및\n 손해배상을 받고 싶어요', 'image': 'doc_40.svg', 'iddocuments': 40},
                    {'title': '매매대금반환', 'description': '물건 값을\n돌려받고 싶어요', 'image': 'doc_41.svg', 'iddocuments': 41},
                    {'title': '계약이행', 'description': '계약이행을\n청구하고 싶어요', 'image': 'doc_42.svg', 'iddocuments': 42},
                    {'title': '손해배상(신체침해)','description':'누가 내 몸을 다치게했어요,\n 손해배상 등 조치를 하고 싶어요.','image':'card_15.svg','iddocuments':44},
                    {'title': '부당이득금 반환','description':'부당이득을 반환하라고 \n청구하고 싶어요','image':'card_52.svg','iddocuments':52},
                    {'title': '채무부존재(차용, 임대차 관련)', 'description': '돈을 달라고 하지만, 줄 이유가 없어요.', 'image': 'doc_9.svg', 'iddocuments': 60 },
                    {'title': '법원 재판 불이행에 대한 조치 통보', 'description': '상대방이 법원의 결정을 위반해요.', 'image': 'doc_42.svg', 'iddocuments': 61 }
                ],
                [
                    {'title': '대여금', 'description': '돈을 갚으라는 \n내용증명을 받았어요', 'image': 'doc_9.svg', 'iddocuments': 2},
                    {'title': '매매대금', 'description': '물건값을 지급하라는\n내용증명을 받았어요', 'image': 'doc_4.svg', 'iddocuments': 4},
                    {'title': '계약해지', 'description': '계약을 해지하겠다는 \n내용증명을 받았어요', 'image': 'doc_6.svg', 'iddocuments': 6},
                    {'title': '명예훼손', 'description': '명예훼손을 했다는\n내용증명을 받았어요', 'image': 'doc_8.svg', 'iddocuments': 8}
                ]
            ],
        tags:
            [
                [
                    {'title': '전체', 'card': [0, 1, 11, 8, 9, 3, 2, 6, 4, 5, 10, 13, 12, 7, 14, 15, 16] },
                    {'title': '못받은 돈 받기', 'card': [0, 1, 11, 8, 9, 3, 2]},
                    {'title': '빌려준 돈 받기', 'card': [0]},
                    {'title': '부동산 관련 내용증명', 'card': [3,2,4,6,12]},
                    {'title': '밀린 월세 받기', 'card': [2]},
                    {'title': '보증금 반환', 'card': [3, 4]},
                    {'title': '임대차계약해지', 'card': [2, 3, 4, 6, 12]},
                    {'title': '계약해지', 'card': [5, 4, 6]},
                    {'title': '명예훼손', 'card': [7]},
                    {'title': '용역대금 받기', 'card': [8,9]},
                    {'title': '매매대금 받기', 'card': [1,11]},
                    {'title': '지급한 돈 받기', 'card': [9, 11,3,12]},
                    {'title': '대금 반환받기', 'card': [11,9]},
                    {'title': '손해배상', 'card': [12,10,13]},
                    {'title': '불법행위', 'card': [10,13]},
                    {'title': '무단점유', 'card': [10]},
                    {'title': '소유권침해', 'card': [10]},
                    {'title': '계약불이행', 'card': [12]},
                    {'title': '계약금반환', 'card': [12]},
                    {'title': '하자누수', 'card': [12]},
                    {'title': '채무부존재', 'card': [15]},
                    {'title': '법원 결정 불이행', 'card': [16] },

                ],
                [
                    {'title': '전체', 'card': [0, 1, 2, 3]}
                ]
            ],
        cardsList: [0, 1, 11, 8, 9, 3, 2, 6, 4, 5, 10, 13, 12, 7, 14, 15],
        tabs: ['내용증명', '내용증명답변서'],
        topBg: '/category_img/category_top1.jpg',
        blogBtn: '/category_img/btn_category1.png',
        tagsShow: [0],
        qnaCard: [
            {
                title: '어떤 내용증명을 작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            },
            {
                title: '어떤 내용증명 답변서를 \n작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            }
        ],
        topImageText: [<span>어떤 <span style={{color: '#ffa400', fontSize: '33px'}}>내용증명</span>을 찾으시나요?</span>, '변호사의 내용증명을 로폼에서 완성해 보세요']
    },
    2: {
        /**위임장 */
        cards:
            [
                [
                    // {'title':'주주총회 의결권','description':'주주총회 의결권을 위임합니다.','image':'card_0.svg','iddocuments':1},
                    {'title': '부동산 계약', 'description': '부동산 계약에 관련된\n업무를 위임합니다 (매매, 임대차 등)', 'image': 'doc_17.svg', 'iddocuments': 17},
                    // {'title':'행정서류 신청','description':'인감 발급 등의 행정서류 신청 업무를 위임합니다.','image':'card_3.svg','iddocuments':23},
                    // {'title':'질권설정 통지','description':'질권설정 통지를 위임합니다.','image':'card_4.svg','iddocuments':21},
                    // {'title':'협상에 관한 포괄 위임','description':'협상에 관한 권한 및 내용 전체를 위임합니다.','image':'card_2.svg','iddocuments':21},
                    {'title': '금융기관', 'description': '금융기관 관련 \n업무를 위임합니다(계좌, 신탁 등)', 'image': 'doc_16.svg', 'iddocuments': 16},
                    {'title': '부동산 등기', 'description': '부동산 등기 관련\n업무를 위임합니다', 'image': 'doc_18.svg', 'iddocuments': 18},
                    {'title': '법인 등기', 'description': '법인 등기와 관련된\n업무를 위임합니다', 'image': 'doc_19.svg', 'iddocuments': 19}
                ]
            ],
        tags:
            [
                [
                    {'title': '전체', 'card': [0, 1, 2, 3]},
                    {'title': '부동산', 'card': [0, 2]},
                    {'title': '부동산 계약', 'card': [0]},
                    {'title': '금융업무', 'card': [1]},
                    {'title': '부동산 업무', 'card': [2]},
                    {'title': '법인 등기', 'card': [3]},
                    {'title': '등기', 'card': [3]}
                ]

            ],
        cardsList: [0, 1, 2, 3],
        tabs: ['위임장'],
        topBg: '/category_img/category_top2.jpg',
        tagsShow: [0],
        qnaCard: [
            {
                title: '어떤 위임장을 작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            },
            {
                title: '어떤 위임장을 작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            }
        ],
        topImageText: [<span>어떤 <span style={{color: '#ffa400', fontSize: '33px'}}>위임장</span>을 찾으시나요?</span>, '변호사가 작성한 것처럼 로폼에서 자동으로 완성해 드립니다']
    },
    3: {
        /**지급명령 */
        cards:
            [
                [
                    {'title': '대여금', 'description': '빌려준 돈을\n받지 못했어요', 'image': 'doc_9.svg', 'iddocuments': 9},
                    {'title': '매매대금', 'description': '물건을 팔고\n돈을 받지 못했어요', 'image': 'doc_4.svg', 'iddocuments': 10},
                    {'title': '보증금 반환', 'description': '계약이 끝나서\n보증금을 돌려받고 싶어요 ', 'image': 'doc_25.svg', 'iddocuments': 25},
                    {'title': '용역대금', 'description': '일을 하고\n돈을 못 받았어요', 'image': 'doc_28.svg', 'iddocuments': 24},
                    {'title': '약정금', 'description': '상대방과 약속한 돈을\n받고 싶어요\n(투자금, 합의금 계약금 등)', 'image': 'doc_43.svg', 'iddocuments': 43},
                    {'title': '매매대금 반환', 'description': '물건 값을\n돌려받고 싶어요', 'image': 'doc_41.svg', 'iddocuments': 47},
                    {'title': '임금청구', 'description': '임금 또는 퇴직금을 \n받지 못했어요', 'image': 'doc_51.svg', 'iddocuments': 51},
                    {'title': '용역대금 반환', 'description': '용역대금을\n돌려받고 싶어요', 'image': 'doc_29.svg', 'iddocuments': 48},
                    {'title': '임대료(월세)청구 ', 'description': '밀린 임대료(월세)를\n받고 싶어요 ', 'image': 'doc_25.svg', 'iddocuments': 65},
                    {'title': '임대료, 손해배상 청구', 'description': '건물 임대후, 연체된 임대료와\n건물 손해배상금을 받고 싶어요', 'image': 'doc_23.svg', 'iddocuments': 66}
                ],
                [
                    {'title': '대여금', 'description': '돈을 갚으라는\n지급명령 신청서를 받았어요', 'image': 'doc_9.svg', 'iddocuments': 11},
                    {'title': '매매대금', 'description': '물건값을 내라는\n지급명령 신청서를 받았어요', 'image': 'doc_4.svg', 'iddocuments': 12}
                ]
            ],
        tags:
            [
                [
                    {'title': '전체', 'card': [0, 1, 5, 2, 3, 7, 4, 6, 8, 9]},
                    {'title': '못받은 돈 받기', 'card': [0, 1, 5, 2, 3, 7, 4, 6, 8]},
                    {'title': '빌려준 돈 받기', 'card': [0]},
                    {'title': '보증금 반환', 'card': [2]},
                    {'title': '계약금 반환', 'card': [4]},
                    {'title': '투자금 지급', 'card': [4]},
                    {'title': '합의금 지급', 'card': [4]},
                    {'title': '대금 반환받기', 'card': [5, 7]},
                    {'title': '임대료 청구', 'card': [8, 9]},
                ],
                [
                    {'title': '전체', 'card': [0, 1]},
                    {'title': '못받은 돈 받기', 'card': [0]},
                    {'title': '빌려준 돈 받기', 'card': [1]}
                ]
            ],
        cardsList: [0, 1, 5, 2, 3, 7, 4, 6],
        tabs: ['지급명령 신청서', '지급명령이의 신청서'],
        topBg: '/category_img/category_top3.jpg',
        blogBtn: '/category_img/btn_category3.png',
        tagsShow: [0, 1],
        qnaCard: [
            {
                title: '어떤 지급명령 신청서를 \n작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            },
            {
                title: '어떤 지급명령 이의신청서를 \n작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            },
        ],
        topImageText: [<span>어떤 <span style={{color: '#ffa400', fontSize: '33px'}}>지급명령 신청서</span>를 찾으시나요?</span>, '변호사가 작성한 것처럼 로폼에서 자동으로 완성해 드립니다']

    },
    4: {
        /**합의서 */
        cards:
            [
                [
                    {'title': '폭행', 'description': '폭행사건을\n합의하려고 해요', 'image': 'doc_13.svg', 'iddocuments': 13},
                    // {'title':'쌍방 폭행 합의','description':'폭행사건 합의를 하고 싶습니다.','image':'card_1.svg','iddocuments':13},
                    // {'title':'교통사고 합의','description':'교통사고 합의를 하고 싶습니다.','image':'card_3.svg','iddocuments':13},
                    {'title': '명예훼손', 'description': '명예훼손 사건을\n합의하려고 해요', 'image': 'doc_8.svg', 'iddocuments': 14},
                    {'title': '금전분쟁', 'description': '돈과 관련된 사건을\n합의하려고 해요', 'image': 'doc_15.svg', 'iddocuments': 15},
                    {'title': '기타', 'description': '합의금을 지급할 건이\n생겼어요', 'image': 'doc_extra.svg', 'iddocuments': 27},
                ]
            ],
        tags:
            [
                [
                    {'title': '전체', 'card': [0, 1, 2, 3]},
                    {'title': '폭행 합의(일방)', 'card': [0]},
                    // {'title':'폭행 합의(쌍방)','card':[1] },
                    // {'title':'교통사고 합의','card':[2]},
                    {'title': '명예훼손 합의', 'card': [1]},
                    {'title': '돈', 'card': [2]},
                    {'title': '빌린돈 합의', 'card': [2]},
                    {'title': '못받은 돈 합의', 'card': [2]},
                    {'title': '불법행위', 'card': [3]},
                    {'title': '손해배상', 'card': [3]},
                    {'title': '합의서 일반', 'card': [3]}
                ]
            ],
        cardsList: [0, 1, 2, 3],
        tabs: ['합의서'],
        topBg: '/category_img/category_top4.jpg',
        tagsShow: [0],
        qnaCard: [
            {
                title: '어떤 합의서를 작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            },
            {
                title: '어떤 합의서를 작성해야 하나요?',
                text: '어떤 문서를 써야하는지 모르겠어요'
            }
        ],
        topImageText: [<span>어떤 <span style={{color: '#ffa400', fontSize: '33px'}}>합의서</span>를 찾으시나요?</span>, '변호사가 작성한 것처럼 로폼에서 자동으로 완성해 드립니다']
    },
    99: {
        /**스타트업 필수문서 */
        cards:
            [
                [
                    {/** 0 */
                        'title': '동업계약서',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'}
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 32
                    },
                    {/** 1 */
                        'title': '동업계약서(법인 미설립)',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 31
                    },
                    {/** 2 */
                        'title': '정관',
                        'description': {
                            0: {'content': '회사의 근본규칙을\n정할 수 있어요'},
                        },
                        'image': 'doc_20.svg',
                        'iddocuments': 20
                    },
                    {/** 3 */
                        'title': '주주명부 ',
                        'description': {
                            0: {'content': '회사의 주주와 주식수, 그 종류 등을 작성해놓은 명부'},
                            1: {'content': '회사의 주식상황에 대하여는 그 명부대로 인정될 가능성이 높으므로, \n제대로된 명부 관리는 필수'},
                        },
                        'image': 'card_19.svg',
                        'iddocuments': 1
                    },
                    {/** 4 */
                        'title': '주주간계약서',
                        'description': {
                            0: {'content': '주주간 분쟁을 방지하기 위해\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_39.svg',
                        'iddocuments': 39
                    },
                    {/** 5 */
                        'title': '임원계약서',
                        'description': {
                            0: {'content': '임원 리스크 예방을 위해\n꼭 작성하세요'},
                        },
                        'image': 'doc_38.svg',
                        'iddocuments': 38
                    },
                    {/** 6 */
                        'title': '근로계약서(정규직, 기간제)',
                        'description': {
                            0: {'content': '인사노무 관리를 위한 \n핵심 문서입니다'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 30
                    },
                    {/** 7 */
                        'title': '입사자서약서',
                        'description': {
                            0: {'content': '모든 입사자에게 \n받아야 하는 필수 문서입니다'},
                        },
                        'image': 'doc_34.svg',
                        'iddocuments': 34
                    },
                    {/** 8 */
                        'title': '스톡옵션계약서',
                        'description': {
                            0: {'content': '장기 인센티브 수단으로\n활용해 보세요'},
                        },
                        'image': 'doc_43.svg',
                        'iddocuments': 35
                    },
                    {/** 9 */
                        'title': 'NDA(비밀유지계약서)',
                        'description': {
                            0: {'content': '계약 상대방과 작성하여\n회사의 자산가치를 보호하세요'},
                        },
                        'image': 'doc_33.svg',
                        'iddocuments': 33
                    },
                    {/** 10 */
                        'title': '업무협약서',
                        'description': {
                            0: {'content': '제휴, 공동사업시\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_36.svg',
                        'iddocuments': 36
                    },
                    {/** 11 */
                        'title': '용역계약서(일반)',
                        'description': {
                            0: {'content': '용역으로 인한 향후 분쟁을 \n방지해 보세요'},
                        },
                        'image': 'doc_37.svg',
                        'iddocuments': 37
                    },
                    { /** 12 */
                        'title': '공동사업약정서',
                        'description': {
                            0: {'content': '공동의 사업을 위해 당사자간의 출자나\n향후 공동 사업의 운영에 관한 내용을\n 약속한 계약서입니다'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 54
                    },
                    {/** 13 */
                        'title': '근로계약서(단시간 근로자)',
                        'description': {
                            0: {'content': '인사노무 관리를 위한 \n핵심 문서입니다'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 56
                    },
                    
                ],
                [/** 투자 지분출자 */
                    { /** 0 */
                        'title': '동업계약서',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'}
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 32
                    },
                    { /** 1 */
                        'title': '동업계약서(법인 미설립)',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 31
                    },
                    { /** 2 */
                        'title': '주주간계약서',
                        'description': {
                            0: {'content': '주주간 분쟁을 방지하기 위해\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_39.svg',
                        'iddocuments': 39
                    },
                    { /** 3 */
                        'title': '스톡옵션계약서',
                        'description': {
                            0: {'content': '장기 인센티브 수단으로\n활용해 보세요'},
                        },
                        'image': 'doc_43.svg',
                        'iddocuments': 35
                    },
                    { /** 4 */
                        'title': '투자계약서',
                        'description': {
                            0: {'content': '투자자간 분쟁을 방지하기 위해\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_43.svg',
                        'iddocuments': 53
                    },
                    { /** 5 */
                        'title': '주식양수도 계약서',
                        'description': {
                            0: {'content': '회사 주식 매매 등을 할 때 안전한 거래,\n 권리 확보를 위한 필수 문서입니다.'},
                        },
                        'image': 'doc_37.svg',
                        'iddocuments': 57
                    }

                ],
                [ /** 인사노무 */
                    { /** 0 */
                        'title': '근로계약서(정규직, 기간제)',
                        'description': {
                            0: {'content': '인사노무 관리를 위한 \n핵심 문서입니다'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 30
                    },
                    { /** 1 */
                        'title': '근로계약서(단시간 근로자)',
                        'description': {
                            0: {'content': '인사노무 관리를 위한 \n핵심 문서입니다'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 56
                    },

                    { /** 2 */
                        'title': '입사자서약서',
                        'description': {
                            0: {'content': '모든 입사자에게 \n받아야 하는 필수 문서입니다'},
                        },
                        'image': 'doc_34.svg',
                        'iddocuments': 34
                    },
                    { /** 3 */
                        'title': '동업계약서',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'}
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 32
                    },
                    { /** 4 */
                        'title': '동업계약서(법인 미설립)',
                        'description': {
                            0: {'content': '2인 이상이 동업을 할 때\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 31
                    },
                    { /** 5 */
                        'title': '주주간계약서',
                        'description': {
                            0: {'content': '주주간 분쟁을 방지하기 위해\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_39.svg',
                        'iddocuments': 39
                    },
                    { /** 6 */
                        'title': '스톡옵션계약서',
                        'description': {
                            0: {'content': '장기 인센티브 수단으로\n활용해 보세요'},
                        },
                        'image': 'doc_43.svg',
                        'iddocuments': 35
                    },
                    { /** 7 */
                        'title': '임원계약서',
                        'description': {
                            0: {'content': '임원 리스크 예방을 위해\n꼭 작성하세요'},
                        },
                        'image': 'doc_38.svg',
                        'iddocuments': 38
                    },
                ],
                [ /** 공동사업 */
                    {
                        'title': '업무협약서',
                        'description': {
                            0: {'content': '제휴, 공동사업시\n작성하는 필수 문서입니다'},
                        },
                        'image': 'doc_36.svg',
                        'iddocuments': 36
                    },
                    {
                        'title': 'NDA(비밀유지계약서)',
                        'description': {
                            0: {'content': '계약 상대방과 작성하여\n회사의 자산가치를 보호하세요'},
                        },
                        'image': 'doc_33.svg',
                        'iddocuments': 33
                    },
                    {
                        'title': '공동사업약정서',
                        'description': {
                            0: {'content': '공동의 사업을 위해 당사자간의 출자나\n향후 공동 사업의 운영에 관한 내용을\n 약속한 계약서입니다'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 54,
                        'link':'preview'
                    },
                    {
                        'title': '크리에이터 전속 계약서(MCN)',
                        'description': {
                            0: { 'content': '크리에이터에 대한 배타적독점권 및\n 지원을 통해 상호 발전하기 위해\n 체결하는 계약서입니다. ' },
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 59,
                        'link': 'preview'
                    },
                ],
                [ /** 매매(양수도) */
                    {
                        'title': '매매계약서(동산, 지식재산권)',
                        'description': {
                            0: {'content': '그림이나 디자인을 함께 매매시, best 계약서'},
                        },
                        'image': 'doc_36.svg',
                        'iddocuments': 62
                    },
                    {
                        'title': '매매계약서(동산)',
                        'description': {
                            0: {'content': '그림, 기계장치 등 매매시, 깔끔한 매매계약서'},
                        },
                        'image': 'doc_33.svg',
                        'iddocuments': 63
                    },
                    {
                        'title': '양수도계약서(지식재산권)',
                        'description': {
                            0: {'content': '디자인 등 매매시, 명료한 양수도 계약서'},
                        },
                        'image': 'doc_31.svg',
                        'iddocuments': 64,
                        'link':'preview'
                    }
                ],
                [ /** 용역 */
                    {
                        'title': '용역계약서(일반)',
                        'description': {
                            0: {'content': '용역으로 인한 향후 분쟁을 \n방지해 보세요'},
                        },
                        'image': 'doc_37.svg',
                        'iddocuments': 37
                    },
                    {
                        'title': '용역계약서(광고모델)',
                        'description': {
                            0: {'content': '광고 촬영 전 \n모델과 꼭 작성하세요.'},
                        },
                        'image': 'doc_37.svg',
                        'iddocuments': 67
                    },
                    {
                        'title': 'NDA(비밀유지계약서)',
                        'description': {
                            0: {'content': '계약 상대방과 작성하여\n회사의 자산가치를 보호하세요'},
                        },
                        'image': 'doc_33.svg',
                        'iddocuments': 33
                    },
                    {
                        'title': '위수탁판매계약서(독점, 비독점)',
                        'description': {
                            0: {'content': '물품 위탁 판매 시, 깔끔한 판매와\n 정산이 진행되도록 작성하세요.'},
                        },
                        'image': 'doc_33.svg',
                        'iddocuments': 70
                    },
                ],
                [ /** 웹사이트운영 */
                    {
                        'title': '개인정보처리방침',
                        'description': {
                            0: {'content': '웹사이트에서 개인정보를 수집해요.'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 55
                    },
                ],
                [ /** 재무 */
                    {
                        'title': '가지급금 약정서',
                        'description': {
                            0: {'content': '회사 자금의 가지급시 횡령 등\n 위법을 방지하기 위한 필수 문서입니다.'},
                        },
                        'image': 'doc_30.svg',
                        'iddocuments': 58
                    },
                ]
            ],
        tags:
            [
                [
                    {
                        'title': '전체',
                        'init_card': [0, 1, 2, 3],
                        'card': {
                            0: {'title': <span><span className='oval'>예비창업자</span></span>, 'cardIdx': [6, 13, 11, 0]},
                            1: {'title': <span><span className='oval'>법인설립</span></span>, 'cardIdx': [2, 4, 5]},
                            2: {'title': <span><span className='oval'>초기</span> <span className='oval'>성장</span></span>, 'cardIdx': [10,9,7,8,12]},
                            3: {'title': '어떤 계약서를 작성해야 하나요?', 'cardIdx': 'qnaCard'}
                        }
                    },
                    {'title': '예비창업', 'card': [6,11,0]},
                    {'title': '법인설립', 'card': [2,4,5]},
                    {'title': '초기성장', 'card': [10,9,7,8,12]},
                    {'title': '지분출자', 'card': [0,4,8]},
                    {'title': '근로계약', 'card': [5,6,7]},
                    {'title': '공동사업', 'card': [10,9,12]},
                    {'title': '지식재산권 보호', 'card': [9,7]},
                ],
                [
                    {'title': '전체', 'card': [0, 2, 3, 4, 5]},
                ],
                [
                    {'title': '전체', 'card': [0, 1, 2, 4, 5, 6, 7]},
                    {'title': '근로계약', 'card': [0, 1, 5]},
                    {'title': '주주', 'card': [6, 4]},
                ],
                [
                    {'title': '전체', 'card': [0, 1, 2,3]},
                ],
                [
                    {'title': '전체', 'card': [0, 1, 2]},
                ],
                [
                    {'title': '전체', 'card': [0, 1, 2, 3]},
                ],
                [
                    {'title': '전체', 'card': [0]},
                ],
                [
                    {'title': '전체', 'card': [0]},
                ]


            ],
        // cardsList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        cardsList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        tabs: ['인기문서','투자, 지분출자', '인사노무', '공동사업', '매매(양수도)', '용역', '웹사이트운영','재무'],
        topBg: '/category_img/category_top99.jpg',
        tagsShow: [0, 2],
        qnaCard: [
            {
                title: '어떤 계약서를 작성해야 하나요?',
                text: ''
            },
            {
                title: '어떤 계약서를 작성해야 하나요?',
                text: ''
            }
        ],
        topImageText: [<span>어떤 <span style={{color: '#ffa400', fontSize: '33px'}}>기업문서</span>를 찾으시나요?</span>, '변호사가 작성한 것처럼 로폼에서 자동으로 완성해 드립니다']
    }
}
var agent
if( process.browser )  agent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)


class Main extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category,
            categoryTab: 0,
            categoryTag: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
            categoryArray: [],
            cards: [],
            cardsList: [],
            tags: [],
            tagsShow: true,
            tabs: [],
            isMobile : agent
        };
    }

    componentWillMount() {
        this.setCategory( this.props.category )
    }

    componentWillUpdate(nextProp) {
        if( nextProp.category !== this.state.category ) {
            this.setState({ category:nextProp.category, categoryTab:0 })
            this.setCategory( nextProp.category )
            // this.setTag(0)
            // window.location.hash = ''
        }
    }

    setCategory( categoryId ) {
        let category = categoryId
        let categoryArray = CategoryArray
        var tagShow = (categoryArray[category].tagsShow.indexOf(0) > -1) ? true : false;

        this.setState({
            cards: categoryArray[category].cards,
            tags: categoryArray[category].tags,
            cardsList: categoryArray[category].cardsList,
            tabs: categoryArray[category].tabs,
            categoryArray: categoryArray,
            tagsShow: tagShow
        }, () => {
            if (!!window.location.hash) {
                let ignoreHashs = ['#close', '#qna', '#terms', '#privacy', '#disclaimer', '#signin', '#finduser', '#finduser'];
                if (ignoreHashs.indexOf(window.location.hash) < 0) {
                    let hashTag = decodeURIComponent(window.location.hash).replace('#', "").split('_');
                    if (!!hashTag[0]) this.setTab(Number(hashTag[0]));
                    if (categoryArray[category].tagsShow.indexOf(Number(hashTag[0])) >= 0) {
                        if (!!hashTag[1]) this.setTag(Number(hashTag[1]), Number(hashTag[0]));
                    }
                }
            }
            this.setTag(0)
        });
    }


    setTab(n) {
        let category = this.state.category;
        let categoryArray = this.state.categoryArray;
        this.setState({
            categoryTab: n
        })
        if (categoryArray[category].tagsShow.indexOf(n) > -1) {
            this.setState({
                cardsList: this.state.tags[n][this.state.categoryTag[n]].card,
                tagsShow: true,
                categoryTab: n
            })
        } else {
            this.setState({
                cardsList: this.state.tags[n][0].card,
                tagsShow: false,
                categoryTab: n
            })
        }
        // this.props.history.push('#' + n + "_" + this.state.categoryTag[n]);
        // window.location.hash = '#' + n + "_" + this.state.categoryTag[n];
    }

    setTag(n, t=0) {
        if(!t) t=this.state.categoryTab
        let categoryTag = this.state.categoryTag;
        categoryTag[t] = n;
        this.setState({
            categoryTag: categoryTag
        })
        this.setCard(this.state.tags[t][n].card);       
        // this.props.history.push('#' + t + "_" + n);
        // window.location.hash = '#' + t + "_" + n;

    }

    setCard(cards) {
        this.setState({
            cardsList: cards
        })
    }

    goPreview(iddocuments) {
        if(this.state.isMobile){
            window.location.href = "/preview/" + iddocuments;
            return;
        }
        if ([2, 4].indexOf(parseInt(this.state.category)) === -1 && ignoreInstruction.indexOf(parseInt(iddocuments)) === -1) {
            window.location.href = "/instructions/" + iddocuments;
        } else {
            window.location.href = "/preview/" + iddocuments;
        }
    }


    subTitle(data, type = '') {
        if (data === 'NDA(비밀유지계약서)') {
            return (
                <div className="title">
                    <div>{data}</div>
                </div>
            );
        }

        if ((data.indexOf('(') != -1) && (data.indexOf(')') != -1)) {
            let title = data.split('(')[0];
            let desc = data.split('(')[1];
            desc = desc.split(')')[0];
            if (type === 'subject') return desc;
            else
                return (
                    <div className="title">
                        <div>{title}</div>
                        <div>({desc})</div>
                    </div>
                );
        } else {
            return (
                <div className="title">
                    <div>{data}</div>
                </div>
            );
        }
    }

    render() {
        // debugger
        let isDetail = this.props.detail|false;
        const categoryArrayElement = this.state.categoryArray[this.state.category];
        let userInfo = User.getInfo()

        const cardList = (array) => {
            if (array.length < 1) return '';
            return array.map((cardIdx) =>
                <li onClick={(e) => this.goPreview(this.state.cards[this.state.categoryTab][cardIdx].iddocuments)}
                    key={cardIdx}>
                    {this.subTitle(this.state.cards[this.state.categoryTab][cardIdx].title)}
                    <div className="text">
                        {
                            Object.keys(this.state.cards[this.state.categoryTab][cardIdx].description).map((key, i) =>
                                <div key={i} className={(!!this.state.cards[this.state.categoryTab][cardIdx].description[key].type) && this.state.cards[this.state.categoryTab][cardIdx].description[key].type}>
                                    {
                                        this.state.cards[this.state.categoryTab][cardIdx].description[key].content.split(/[\r\n]/).map((desc, i) =>
                                            <Fragment key={i}>{desc}
                                                {(this.state.cards[this.state.categoryTab][cardIdx].description[key].content.split(/[\r\n]/).length - 1 !== i) ?
                                                    <br/> : ''}
                                            </Fragment>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className="check">
                        <img src="/category_img/list_check.svg"/></div>
                    <div className="image">
                        <img src={"/category_img/icons/" + this.state.cards[this.state.categoryTab][cardIdx].image}/>
                    </div>
                </li>
            );
        };

        const categorys = 
        {
            1:{
                name:"내용증명"
            },
            2:{
                name:"위임장"
            },
            3:{
                name:"지급명령"
            },
            4:{
                name:"합의서"
            },
            99:{
                name:"계약서"
            }
        }
        return (
                <div className="main">
                    <div className="visual">
                        <h1>어떤 <span>{categorys[this.props.category].name}</span>{CommonUtil.josa( categorys[this.props.category].name )?'을':'를'} 찾으시나요</h1>
                        <div>변호사의 {categorys[this.props.category].name}{CommonUtil.josa( categorys[this.props.category].name )?'을':'를'} 로폼에서 완성해 보세요.</div>
                    </div>
                    { [1,3].indexOf( Number( this.state.category ) ) > -1 &&
                    <div className='mobile top_nav'>
                        <div className="mobile category_tab_nav_wrap">
                            <nav className="tab_nav_contents">
                                <Link href='/category/[id]/detail' as={'/category/' + this.state.category + '/detail'} ><a className={isDetail?'tab_nav_active':''}>{categorys[this.state.category].name}이란?</a></Link>
                                <Link href='/category/[id]' as={'/category/' + this.state.category}><a className={!isDetail?'tab_nav_active':''}>{categorys[this.state.category].name}자동작성</a></Link>
                            </nav>
                        </div>
                    </div>
                    }
                    {
                    isDetail?
                        <div className='mobile m_category'>
                            <Link href={'/category/'+this.state.category}><img src={'/category_img/mobile/'+this.state.category+'/01.jpg'} /></Link>
                            <img src={'/category_img/mobile/'+this.state.category+'/02.jpg'} alt={''} />
                            <img src={'/category_img/mobile/'+this.state.category+'/03.jpg'} alt={''} />
                            <img src={'/category_img/mobile/'+this.state.category+'/04.jpg'} alt={''} />
                            <img src={'/category_img/mobile/'+this.state.category+'/05.jpg'} alt={''} />
                        </div>
                        :null
                    }
                    <div className={`${(!!userInfo && userInfo.account_type === 'A') ? 'container-blog lawyer-contract-review contents' : 'category_wrap'}`} style={isDetail ? { display: 'none' } : { display: 'block' }}>
                        <ul className={`category_tabs ${(!!userInfo && userInfo.account_type === 'A') && 'tabs'}`}>
                            {
                                Object.keys(this.state.tabs).map((tag, key) =>
                                    <li className={`tab ${(this.state.category === 99) ? 'cate99' : ''} ${(this.state.categoryTab === key) ? 'active' : ''}`} onClick={(e) => this.setTab(key)}
                                        key={key}>{this.state.tabs[key]}</li>
                                )
                            }
                        </ul>
                        {(this.state.category === 99) && <Survey/>}
                        <div className="doc_list_wrap">
                            <ul className="tag_list">
                                {
                                    ((this.state.tags[this.state.categoryTab].length > 0) && (this.state.tagsShow === true)) ?
                                        Object.keys(this.state.tags[this.state.categoryTab]).map((tag, key) =>
                                            <li key={key} className={(this.state.categoryTag[this.state.categoryTab] === key) ? 'active' : undefined} onClick={(e) => this.setTag(key)}>{(this.state.categoryTag[this.state.categoryTab] === key) && '#'}{this.state.tags[this.state.categoryTab][key].title}</li>
                                        ) : ""
                                }
                            </ul>
                            {
                                (this.state.category !== 99) ?
                                    <ul className="doc_list">
                                        {
                                            (this.state.cardsList.length > 0) ?
                                                this.state.cardsList.map((key) =>
                                                    <li onClick={(e) => this.goPreview(this.state.cards[this.state.categoryTab][key].iddocuments)}
                                                        key={key}>
                                                        <div className="title">{this.state.cards[this.state.categoryTab][key].title}</div>
                                                        <div className="text">
                                                            {
                                                                (typeof this.state.cards[this.state.categoryTab][key].description === "object") ?
                                                                    Object.keys(this.state.cards[this.state.categoryTab][key].description).map((descriptionKey, i) =>
                                                                        <div key={i}>
                                                                            {
                                                                                this.state.cards[this.state.categoryTab][key].description[descriptionKey].content.split(/[\r\n]/).map((desc, i) =>
                                                                                    <Fragment key={i}>{desc}
                                                                                        {(this.state.cards[this.state.categoryTab][key].description[descriptionKey].content.split(/[\r\n]/).length - 1 !== i) ?
                                                                                            <br/> : ''}
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    )
                                                                    :
                                                                    this.state.cards[this.state.categoryTab][key].description.split(/[\r\n]/).map((desc, i) =>
                                                                        <Fragment key={i}>{desc}
                                                                            {(this.state.cards[this.state.categoryTab][key].description.split(/[\r\n]/).length - 1 !== i) ?
                                                                                <br/> : ''}
                                                                        </Fragment>
                                                                    )
                                                            }
                                                        </div>
                                                        <div className="check"><img src="/category_img/list_check.svg" alt={''} /></div>
                                                        <div className="image"><img src={"/category_img/icons/" + this.state.cards[this.state.categoryTab][key].image} alt={''} /></div>
                                                        <img className='mobile arrow_icon' src='/category_img/mobile/icon_1.svg' alt={''} />
                                                    </li>
                                                ) : ""
                                        }
                                        <li>
                                            <div className="title">
                                                {
                                                    (this.state.categoryTab === 0) ?
                                                        this.state.categoryArray[this.state.category].qnaCard[0].title
                                                        :
                                                        this.state.categoryArray[this.state.category].qnaCard[1].title
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    (this.state.categoryTab === 0) ?
                                                        this.state.categoryArray[this.state.category].qnaCard[0].text
                                                        :
                                                        this.state.categoryArray[this.state.category].qnaCard[1].text
                                                }
                                            </div>
                                            <a href="/customer/qna" className="button"><img src="/category_img/icons/1대1버튼.svg"/></a>
                                            <img className="bottom_img" src="/category_img/icons/1대1문의.svg"/>
                                        </li>
                                    </ul>
                                    :
                                    (this.state.categoryTab === 0) ?
                                        (this.state.categoryTag[0] === 0) ?
                                            Object.keys(this.state.tags[0][0].init_card).map((key, i) =>
                                                <div key={i}>
                                                    <h5>
                                                        <div className='box_1'/>
                                                        <span className='h_span'>{this.state.tags[0][0].card[key].title}
                                                            <hr className='hr'/></span>
                                                    </h5>
                                                    <ul className="startup">
                                                        {
                                                            (this.state.tags[0][0].card[key].cardIdx === 'qnaCard') ?
                                                                <li className='qnaCard'>
                                                                    <div className="title">
                                                                        {
                                                                            (this.state.categoryTab === 0) ?
                                                                                this.state.categoryArray[this.state.category].qnaCard[0].title
                                                                                :
                                                                                this.state.categoryArray[this.state.category].qnaCard[1].title
                                                                        }
                                                                    </div>
                                                                    <div className="text">
                                                                        {
                                                                            (this.state.categoryTab === 0) ?
                                                                                this.state.categoryArray[this.state.category].qnaCard[0].text
                                                                                :
                                                                                this.state.categoryArray[this.state.category].qnaCard[1].text
                                                                        }
                                                                    </div>
                                                                    <a href="/customer/qna" className="button"><img src="/category_img/icons/1대1버튼.svg"/></a>
                                                                    <img className="bottom_img" src="/category_img/icons/1대1문의.svg"/>
                                                                </li>
                                                                :
                                                                cardList(this.state.tags[0][0].card[key].cardIdx)
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                            :
                                            <ul className="startup">
                                                {
                                                    cardList(this.state.cardsList)
                                                }
                                            </ul>
                                        :
                                        <ul className="doc_list">
                                            {
                                                (this.state.cardsList.length > 0) ?
                                                    this.state.cardsList.map((key) =>
                                                        <li onClick={(e) => this.goPreview(this.state.cards[this.state.categoryTab][key].iddocuments)}
                                                            key={key}>
                                                            <div className="title">{this.state.cards[this.state.categoryTab][key].title}</div>
                                                            <div className="text">
                                                                {
                                                                    (typeof this.state.cards[this.state.categoryTab][key].description === "object") ?
                                                                        Object.keys(this.state.cards[this.state.categoryTab][key].description).map((descriptionKey, i) =>
                                                                            <div key={i}>
                                                                                {
                                                                                    this.state.cards[this.state.categoryTab][key].description[descriptionKey].content.split(/[\r\n]/).map((desc, i) =>
                                                                                        <Fragment key={i}>{desc}
                                                                                            {(this.state.cards[this.state.categoryTab][key].description[descriptionKey].content.split(/[\r\n]/).length - 1 !== i) ?
                                                                                                <br/> : ''}
                                                                                        </Fragment>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                        :
                                                                        this.state.cards[this.state.categoryTab][key].description.split(/[\r\n]/).map((desc, i) =>
                                                                            <Fragment key={i}>{desc}
                                                                                {(this.state.cards[this.state.categoryTab][key].description.split(/[\r\n]/).length - 1 !== i) ?
                                                                                    <br/> : ''}
                                                                            </Fragment>
                                                                        )
                                                                }
                                                            </div>
                                                            <div className="check"><img src="/category_img/list_check.svg"/>
                                                            </div>
                                                            <div className="image"><img
                                                                src={"/category_img/icons/" + this.state.cards[this.state.categoryTab][key].image}/>
                                                            </div>
                                                        </li>
                                                    ) : ""
                                            }
                                            <li>
                                                <div className="title">
                                                    {
                                                        (this.state.categoryTab === 0) ?
                                                            this.state.categoryArray[this.state.category].qnaCard[0].title
                                                            :
                                                            this.state.categoryArray[this.state.category].qnaCard[1].title
                                                    }
                                                </div>
                                                <div className="text">
                                                    {
                                                        (this.state.categoryTab === 0) ?
                                                            this.state.categoryArray[this.state.category].qnaCard[0].text
                                                            :
                                                            this.state.categoryArray[this.state.category].qnaCard[1].text
                                                    }
                                                </div>
                                                <Link href="/customer/qna" as="/customer/qna" ><a className="button"><img src="/category_img/icons/1대1버튼.svg"/></a></Link>
                                                <img className="bottom_img" src="/category_img/icons/1대1문의.svg"/>
                                            </li>
                                        </ul>
                            }
                        </div>
                        {/* <Review category={this.state.category} /> */}
                    </div>
                </div>
        );
    }
}

export default Main;