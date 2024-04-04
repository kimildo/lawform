import React, {Component, Fragment} from 'react';

const data = {
    // 내용증명
    1: {
        docNum: 1,
        title: '내용증명(대여금 청구)',
        description: '돈을 빌려주고도 받지 못한 경우, 이를 갚으라는 청구를 공식적으로 하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>빌려준 돈을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span>빌려준 돈의 <span style={{color: '#15376c'}}>지급기한이 지난 후에도</span></span>,
                    <span><br/><span style={{color: '#15376c'}}>빌려준 돈</span> 또는 <span style={{color: '#15376c'}}>이자를 받지 못한 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/1_01.jpg', text: '돈을 빌린 지인이 \n연락이 안됨'},
                    {src: '/instructions/certifications/02/cards/1_03.jpg', text: '돈을 빌린 상대방이\n갚겠다는 말 뿐 회피함'},
                    {src: '/instructions/certifications/02/cards/1_02.jpg', text: '소송 전에 마지막으로\n채무이행을 \n통지하고 싶음'},
                ]
            }
        }
    },
    3: {
        docNum: 3,
        title: '내용증명(매매대금 청구)',
        description: '물건을 주고도 물건 값을 받지 못한 경우, 이를 지급하라고 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>물건값을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span>상대방에게 물건을 주고도</span>,
                    <span><br/><span className='color_15376c'>물건값을 전부 또는 일부를 받지 못한 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/3_01.jpg', text: '물건을 받은 상대방이 \n연락이 안됨'},
                    {src: '/instructions/certifications/02/cards/3_02.jpg', text: '물건을 받은 거래처가\n돈을 주겠다는 말 뿐 회피함'},
                    {src: '/instructions/certifications/02/cards/3_03.jpg', text: '매매계약서가 없어서,\n소송으로 가기 전에\n증거를 확보하고 싶음'},
                ]
            }
        }
    },
    41: {
        docNum: 41,
        title: '내용증명(매매대금 반환 청구)',
        description: '물건값을 지급했지만 문제가 있어, 물건값을 돌려달라고 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>매매대금을 돌려받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>물건값을 주었지만</span> 물건을 받지 못했거나,</span>,
                    <span><br/>물건에 하자가 있는 등 <span className='color_15376c'>문제가 있는 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/41_01.jpg', text: '물건값을 받은 거래처가\n물건의 전부 또는 \n일부를 보내지 않음'},
                    {src: '/instructions/certifications/02/cards/41_02.jpg', text: '물건에 하자가 있어서 \n물건값을 돌려받고 싶음'},
                    {src: '/instructions/certifications/02/cards/41_03.jpg', text: '매매계약서가 없어서,\n소송으로 가기 전에\n증거를 확보하고 싶음'},
                ]
            }
        }
    },
    28: {
        docNum: 28,
        title: '내용증명(용역대금 청구)',
        description: '용역의무를 이행했음에도 용역대금을 지급하지 않는 경우, 이를 지급하라고 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>용역대금을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span>용역의무를 이행했음에도,</span>,
                    <span><br/><span className='color_15376c'>용역대금을 전부 또는 일부를 받지 못한 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/28_01.jpg', text: '용역대금을 지급해야 하는\n거래처가 연락이 안됨'},
                    {src: '/instructions/certifications/02/cards/28_02.jpg', text: '용역대금을 지급해야 하는 \n상대방이 \n돈을 주겠다는 말 뿐 회피함'},
                    {src: '/instructions/certifications/02/cards/28_03.jpg', text: '용역계약서가 없어서, \n소송으로 가기 전에 \n증거를 확보하고 싶음'},
                ]
            }
        }
    },
    29: {
        docNum: 29,
        title: '내용증명(용역대금 반환 청구)',
        description: '용역대금을 지급했지만 문제가 있어, 용역대금을 돌려달라고 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>용역대금을 돌려받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span className='color_15376c'>용역대금을 지급했지만,</span>,
                    <span><br/>상대방이 일을 하지 않았거나 제대로 하지 않은 등</span>,
                    <span><br/><span className='color_15376c'>문제가 있는 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/29_01.jpg', text: '용역대금을 받은 거래처가 \n약속한 일을 하지 않음'},
                    {src: '/instructions/certifications/02/cards/29_02.jpg', text: '용역대금을 받은 상대방이 \n약속한 일의 일부만 함'},
                    {src: '/instructions/certifications/02/cards/29_03.jpg', text: '용역대금을 받은 거래처가\n약속한 일을 다르게 처리함'},
                ]
            }
        }
    },
    49: {
        docNum: 49,
        title: '내용증명(보증금 반환 청구)',
        description: '임대인이 전세/월세 보증금 등의 임대차보증금을 돌려주지 않아, 공식적으로 반환을 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>보증금을 반환받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span>주택, 상가 등의 <span className='color_15376c'>보증금을 돌려받지 못한 경우</span> 활용하세요</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/21_01.jpg', text: '부동산계약이 끝나기 전에 \n계약해지를 통지하고, \n계약완료 후 보증금 반환을 \n미리 요청하고 싶음'},
                    {src: '/instructions/certifications/02/cards/21_02.jpg', text: '주택 (아파트, 빌라 등)\n임대차 계약이 끝났음에도 \n집주인이 보증금을 \n주지 않음'},
                    {src: '/instructions/certifications/02/cards/21_03.jpg', text: '상가 임대차 계약이 \n끝났음에도 임대인이 \n보증금을 주지 않음'},
                    {src: '/instructions/certifications/02/cards/21_04.jpg', text: '소송 전에 마지막으로 \n채무이행을 통지하고 싶음'},
                ]
            }
        }
    },
    23: {
        docNum: 23,
        title: '내용증명(월세 청구)',
        description: '월세 등의 임대료를 지급하지 않는 경우, 공식적으로 지급청구를 하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>임대료를 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 월세 지급,<br/>계약 이행 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>세입자가 월세를 내지 않는 경우</span> 활용하세요.</span>,
                    <span><br/>밀린월세로 인한 계약해지와 명도까지 청구할 수 있습니다.</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/23_01.jpg', text: '세입자가 주택(아파트, 빌라 등)\n월세를 안내고 있음'},
                    {src: '/instructions/certifications/02/cards/23_02.jpg', text: '세입자가 상가 임대료를 \n지급하지 않고 있음'},
                    {src: '/instructions/certifications/02/cards/23_03.jpg', text: '월세 2회 이상 미납에 따라 \n계약해지와 명도를 \n하고 싶음'},
                    {src: '/instructions/certifications/02/cards/23_04.jpg', text: '소송 전에 마지막으로 \n채무이행을 통지하고 싶음'},
                ]
            }
        }
    },
    22: {
        docNum: 22,
        title: '내용증명(부동산 계약해지-임대인용)',
        description: <span style={{fontSize: '19px'}}>임차인이 임대차 계약에 대한 의무를 불이행한 경우, 공식적으로 계약해지 통보를 하기 위한 문서입니다</span>,
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>원활한 계약해지를 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 계약의 이행,<br/>손해배상 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>세입자가 계약 상의 문제가 있는 일들을 한 경우</span> 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/22_01.jpg', text: '세입자가 임대료를 연체함\n(주택은 2달치 이상, \n상가는 3달치 이상)'},
                    {src: '/instructions/certifications/02/cards/22_02.jpg', text: '세입자가 임대한 주택 \n또는 상가의 목적을 \n무단 변경하거나 양도함'},
                    {src: '/instructions/certifications/02/cards/22_03.jpg', text: '임대차 계약기간이 만료됨'},
                    {src: '/instructions/certifications/02/cards/22_04.jpg', text: '임대한 주택 또는 상가를 \n동의 없이 제 3자에게 \n임대함'},
                ]
            }
        }
    },
    21: {
        docNum: 21,
        title: '내용증명(부동산 계약해지-세입자용)',
        description: '부동산 계약기간이 만료되기 전에, 해지를 통보하고 만료 후 보증금반환을 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>임대인에게 계약해지를 통보하고<br/><span style={{backgroundColor: '#ffe872'}}>보증금을 받기 위한 가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-4.svg'/><span>채권의 소멸시효를 중단</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span className='color_15376c'>임대인에게 부동산 계약해지를 통지하고</span>,
                    <span><br/><span className='color_15376c'>보증금을 받기 위해</span> 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/48_01.jpg', text: '임대차 계약이 끝나기 전에\n미리 계약해지를\n통지하고 싶음'},
                    {src: '/instructions/certifications/02/cards/48_02.jpg', text: '계약에 완료시\n보증금 반환할 것을 \n요구하고 싶음'},
                    {src: '/instructions/certifications/02/cards/48_03.jpg', text: '소송 전에 마지막으로\n보증금 반환 이행을 \n통지하고 싶음'},
                ]
            }
        }
    },
    5: {
        docNum: 5,
        title: '내용증명(계약해지 통지)',
        description: '상대방에게 계약해지를 통지하고, 공식적으로 계약금 반환을 통지하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>원활한 계약해지를 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>계약에 문제가 있어 해지</span>하거나</span>,
                    <span><br/><span className='color_15376c'>계약금을 돌려받고 싶은 경우</span> 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/5_01.jpg', text: '계약내용이 문제가 있어서 \n계약을 해지하고 \n계약금을 반환받고 싶음'},
                    {src: '/instructions/certifications/02/cards/5_02.jpg', text: '계약 후 문제가 발생하여 \n손해배상을 청구하고 싶음'},
                    {src: '/instructions/certifications/02/cards/5_03.jpg', text: 'oo일 내로 청약철회가 \n가능하다고 하였는데, \n상대방이 계약해지를 \n거부하고 있음'},
                ],
                case: [
                    <span className='text_01'><span className='text_02'>부동산계약해지</span>의 경우</span>,
                    <div className='case_01_wrap'>
                        <div><a href=''>내용증명 (부동산계약해지_세입자용)</a> 또는</div>
                        <div><a href=''>내용증명 (부동산계약해지_임대인용)</a>을 활용해주세요</div>
                    </div>
                ]
            }
        }
    },
    42: {
        docNum: 42,
        title: '내용증명(계약이행 청구)',
        description: '상대방이 계약이행을 하지 않는 경우, 이행을 요구하거나 계약금 반환 및 손해배상 등을 청구하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>계약내용을 이행하도록 하는 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 채무의 이행,<br/>보증금 반환 등의 이행을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>계약사항을 상대방이 이행하지 않는 경우</span> 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/42_01.jpg', text: '상대방이 계약내용을 \n이행하지 않는 경우'},
                    {src: '/instructions/certifications/02/cards/42_02.jpg', text: '집주인이 누수, \n하자건에 대한 보수를\n해주지 않음'},
                    {src: '/instructions/certifications/02/cards/42_03.jpg', text: '계약내용을 이행하지 않은 \n상대방에게 계약금 반환 \n또는 손해배상을 \n청구하고 싶음'},
                ]
            }
        }
    },
    40: {
        docNum: 40,
        title: '내용증명(물건, 권리침해 손해배상 등)',
        description: '동산, 부동산, 권리에 대한  손해배상을 통지하거나, 이에 대한 불법행위 중단을 통지하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>손해배상을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 손해배상 청구,<br/>불법행위 중단 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span>물건/부동산 등에 대한 <span className='color_15376c'>손해배상을 받고 싶거나,</span></span>,
                    <span><br/>물건/부동산에 대한 <span className='color_15376c'>불법행위 중단을 요구하고 싶을 때</span> 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/40_01.jpg', text: '내 물건 또는 내가 적법하게 \n사용하고 있는 물건에 대한 \n침해가 있는 경우'},
                    {src: '/instructions/certifications/02/cards/40_02.jpg', text: '내 부동산 또는\n 내가 임대하여 사용하는 \n부동산에 대한 침해가 \n있는 경우'},
                    {src: '/instructions/certifications/02/cards/40_03.jpg', text: '물건을 파손, 분실, \n무단사용한 상대방에게 \n손해배상을 받고 싶음'},
                    {src: '/instructions/certifications/02/cards/40_04.jpg', text: '토지를 무단점유하여 \n중단 또는 손해배상을 \n받고 싶음'},
                    {src: '/instructions/certifications/02/cards/40_05.jpg', text: '내 차량을 파손시킨 \n사람에게 손해배생을 \n받고 싶음'},
                    {src: '/instructions/certifications/02/cards/40_06.jpg', text: '내 물건을 빌려가고 \n돌려주지 않는 사람에게\n배상을 청구하고 싶음'},
                ]
            }
        }
    },
    44: {
        docNum: 44,
        title: '내용증명(신체침해 손해배상 등)',
        description: '타인의 고의나 과실로 자기의 신체에 상해를 입은 경우, 손해배상 등의 조치 요구를 공식적으로 하는 문서입니다',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>손해배상을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 손해배상 청구,<br/>불법행위 중단 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>내 신체 침해</span>에 대한 손해배상을 청구하거나</span>,
                    <span><br/><span className='color_15376c'>물건에 대한 손해배상</span>을 함께 요구하고 싶을 때 활용하세요</span>,
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/44_01.jpg', text: '상대방과 사건, 사고로\n상해를 입은 경우'},
                    {src: '/instructions/certifications/02/cards/44_02.jpg', text: '내 부동산 또는\n내가 임대하여 사용하는 \n부동산에 대한 침해가 \n있는 경우'},
                    {src: '/instructions/certifications/02/cards/44_03.jpg', text: '물건을 파손, 분실,\n무단사용한 상대방에게 \n손해배상을 받고 싶음'},
                ]
            }
        }
    },
    7: {
        docNum: 7,
        title: '내용증명(명예훼손 금지)',
        description: '명예훼손 행위를 중지하거나, 그 사실을 공식적으로 확인하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>명예훼손 중단을 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 손해배상 청구,<br/>불법행위 중단 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span><span className='color_15376c'>명예훼손을 당한 경우</span> 활용하세요</span>,
                ],
                requireContent: ['명예훼손 성립요건', '/instructions/certifications/02/require_7.jpg'],
                card: [
                    {src: '/instructions/certifications/02/cards/7_01.jpg', text: '누군가가 고의적으로 \n명예훼손을 하는 언행을 함'},
                    {src: '/instructions/certifications/02/cards/7_02.jpg', text: 'SNS 등에 \n제가 바람을 폈다고\n허위사실을\n유포하였습니다'},
                    {src: '/instructions/certifications/02/cards/7_03.jpg', text: '저희 병원에서 수술받은 \n고객이 악성댓글을 \n지속적으로 달고 있습니다'},
                ]
            }
        }
    },
    52: {
        docNum: 52,
        title: '내용증명(부당이득금 반환)',
        description: '착오 등 부당하게 지급한 금전 또는 물건에 대해 그 반환을 공식적으로 청구하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/certifications/top-image-1.jpg") no-repeat center center',
        topImageText: [<span>부당이득을 반환받기 위한 <span style={{backgroundColor: '#ffe872'}}>신속한 방법</span></span>],
        section: {
            1: {
                titleText: ['가장 신속하고 강력한 의사전달 표현!', '분쟁에 대한 사실을 증명하기 위한 효과적인 통지 문서입니다'],
                subText: [
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-1.svg'/><span>소송 등 법적 증거자료로 활용</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-2.svg'/><span>상대방에게 손해배상 청구,<br/>불법행위 중단 등을 요구</span></div>,
                    <div className='sub_text'><img src='/instructions/certifications/01/icon-3.svg'/><span>상대방에게 심리적 부담</span></div>,
                ]
            },
            2: {
                titleText: [
                    <span className='color_15376c'>착오 등 부당하게 지급한 금전 또는 물건에 대해 그 반환을 공식적으로 청구하는 문서입니다.</span>
                ],
                card: [
                    {src: '/instructions/certifications/02/cards/52_01.jpg', text: '계약내용보다 금전 또는 물건 \n등을 과다 지급한 경우'},
                    {src: '/instructions/certifications/02/cards/52_02.jpg', text: '계약이 해지되어 돌려받아야 \n하는 금전, 물건 등이 있는 경우'},
                    {src: '/instructions/certifications/02/cards/52_03.jpg', text: '착오로 금전 또는 물건을 \n잘못 지급한 경우'},
                    {src: '/instructions/certifications/02/cards/52_04.jpg', text: '기타 상대방이 법적인 이유 없이 \n금전 등을 보유하고 있어\n 반환하고자 하는 경우'},

                ]
            }
        }
    },
    // 지급명령
    9: {
        docNum: 9,
        title: '지급명령 신청서(대여금 청구)',
        description: '상대방이 빌린 돈을 갚지 않는 경우, 법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['95만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>빌려준 돈을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>가장 신속한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header">빌려준 돈의 지급기한이 지난 후에도<br/><span className='color_15376c'>빌려준 돈 또는 이자를 받지 못한 경우 </span>활용하세요</div>]
            }
        }
    },
    10: {
        docNum: 10,
        title: '지급명령 신청서(매매대금 청구)',
        description: '물건 값을 받지 못한 경우, 법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['95만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>물건값을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header">물건을 팔기로 하여, 상대방에게 물건을 주고도<br/><span className='color_15376c'>물건값을 전부 또는 일부를 받지 못한 경우</span> 활용하세요</div>]
            }
        }
    },
    24: {
        docNum: 24,
        title: '지급명령 신청서(용역대금 청구)',
        description: '상대방이 용역대금을 지급하지 않는 경우,\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['95만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>용역대금을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header">용역의무를 이행했음에도,<br/><span className='color_15376c'>용역대금을 전부 또는 일부를 받지 못한 경우</span> 활용하세요</div>]
            }
        }
    },
    25: {
        docNum: 25,
        title: '지급명령 신청서(보증금 반환 청구)',
        description: '임대인이  전세/월세 보증금 등의 임대차보증금을 돌려주지 않는 경우,\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['95만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>보증금을 반환 받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [
                    <div className="right_header">계약이 만료되었음에도<br/>주택, 상가 등의 <span className='color_15376c'>보증금을 돌려받지 못한 경우</span> 활용하세요</div>,
                    <div className="sub_text">
                        <img src='/instructions/star.png' style={{margin: '-30px -12px 0 0', width: '40px'}}/>
                        <div>아직 임대목적물(주택, 상가)을 인도하지 않았다면<span style={{fontWeight: '600'}}> 임차권등기명령을 신청하여 받은 후,</span><br/>임대 목적물을 인도하고 지급명령을 신청하세요 !</div>
                    </div>
                ],
            }
        }
    },
    43: {
        docNum: 43,
        title: '지급명령 신청서(약정금 청구)',
        description: '투자금, 계약금, 합의금 등 상대방과 약속한 돈을 주지 않는 경우,\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>약속한 돈을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [
                    <div className="right_header">상대방과 계약금, 합의금 등 돈을 받기로 약속했음에도,<br/><span className='color_15376c'>돈을 전부 또는 일부를 받지 못한 경우</span> 활용하세요</div>,
                    <div className="sub_text"><img src='/instructions/star.png' style={{marginRight: '-7px'}}/>약정금은 계약서를 작성하지 않았어도 구두로 약속한 부분도 계약성립이 가능합니다</div>
                ],
            }
        }
    },
    47: {
        docNum: 47,
        title: '지급명령 신청서(매매대금 반환 청구)',
        description: '상대방에게 지급한 매매대금을 돌려받기 위해,\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>매매대금을 돌려받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header">물건값을 지급했지만<br/><span className='color_15376c'>물건의 전부 또는 일부를 받지 못했거나 물건에 하자가 있는 등,</span><br/>문제가 발생하여 지급한 돈을 돌려받기 위해 활용하세요</div>]
            }
        }
    },
    48: {
        docNum: 48,
        title: '지급명령 신청서(용역대금 반환 청구)',
        description: '상대방에게 지급한 용역대금을 돌려받기 위해,\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>용역대금을 돌려받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header">용역의무를 이행했음에도,<br/><span className='color_15376c'>용역대금을 전부 또는 일부를 받지 못한 경우 </span>활용하세요</div>],
            }
        }
    },
    51: {
        docNum: 51,
        title: '지급명령 신청서(임금청구)',
        description: '일을 하고 임금, 퇴직금 등을 못 받은 경우\n법원으로부터 지급명령을 받기 위해 신청하는 문서입니다',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/paymentorder/top_img.jpg") no-repeat center center',
        topImageText: [<span>체불된 임금 또는 퇴직금을 받기 위한 <span style={{backgroundColor: '#ffe872'}}>확실한 방법</span></span>],
        section: {
            5: {
                titleText: [<div className="right_header"><span className='color_15376c'>일을 하고 임금 또는 퇴직금을 못받은 경우</span> 활용하세요</div>],
            }
        }
    },
    // 기업문서
    31: {
        docNum: 31,
        title: '동업계약서(법인 미설립)',
        reducedPrice: ['95만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">동업계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">동업계약서</span>란?</Fragment>,
                    '2인 이상의 동업자가 금전, 노무, 자산 등을 출자하여 공동사업을 할 것을 \n약정하는 문서입니다'
                ],
                subText: [
                    <div className='sub_text'><img src='/instructions/company/01/icon_02.svg'/><span>동업자의 역할 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_01.svg'/><span>동업자간의 의사결정 방식 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_04.svg'/><span>동업자간의 수익배분사항 결정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_05.svg'/><span>향후 사업확장이나 청산 등을 사전 규정</span></div>,
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '동업체의 지속적이고 안정적인 성장을 위해\n꼭 작성해야 하는 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">동업계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    36: {
        docNum: 36,
        title: '업무협약서',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">업무협약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">업무협약서</span>란?</Fragment>,
                    '공동사업이나, 제휴 등 양자간 업무협력을 위해 체결하는 문서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '사업의 안정적인 성장을 위해\n필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">업무협약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    33: {
        docNum: 33,
        title: 'NDA(비밀유지계약서)',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">NDA계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">NDA(비밀유지계약서)</span>란?</Fragment>,
                    '계약 상대방에게 제공하는 정보에 대한 비밀유지의 의무를 정하는 계약서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '사업의 안정성 확보를 위해\n꼭 작성해야 하는 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">NDA계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    35: {
        docNum: 35,
        title: '스톡옵션계약서(주식매수선택권부여계약서)',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">스톡옵션계약서<br/></span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">스톡옵션계약서</span>란?</Fragment>,
                    '회사의 설립, 경영 및 기술혁신 등에 기여할 수 있는 사람에게 \n일정한 기간동안 미리 정한 가액으로 회사의 주식을 살 수 있는 권리를 부여하는 문서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '좋은 인력관리와 영입을 위해 \n필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">스톡옵션계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    32: {
        docNum: 32,
        title: '동업계약서(주식회사 설립 예정)',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">동업계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">동업계약서</span>란?</Fragment>,
                    '2인 이상의 동업자가 금전, 노무, 자산 등을 출자하여 공동사업을 할 것을 \n약정하는 문서입니다'
                ],
                subText: [
                    <div className='sub_text'><img src='/instructions/company/01/icon_02.svg'/><span>동업자의 역할 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_01.svg'/><span>동업자간의 의사결정 방식 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_04.svg'/><span>동업자간의 수익배분사항 결정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_05.svg'/><span>향후 사업확장이나 청산 등을 사전 규정</span></div>,
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '동업체의 지속적이고 안정적인 성장을 위해 \n꼭 작성해야 하는 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">동업계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    38: {
        docNum: 38,
        title: '임원계약서',
        reducedPrice: ['96만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">임원계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">임원계약서</span>란?</Fragment>,
                    '회사와 임원(대표이사 등)과의 관계를 정하는 계약서입니다'
                ],
                subText: [
                    <div className='sub_text'><img src='/instructions/company/01/icon_02.svg'/><span>임원진의 역할 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_01.svg'/><span>충실의무, 경업금지, 비밀준수 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_03.svg'/><span>기업의 맨파워 대외적으로 보증</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_05.svg'/><span>향후 사업확장이나 청산 등을 사전 규정</span></div>,
                ],
                botImg: ['url("/instructions/company/01/img_01.jpg") no-repeat', '임원리스크를 예방하고\n효율적인 임원관리를 위해\n필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">임원계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    20: {
        docNum: 20,
        title: '정관',
        reducedPrice: ['92만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">정관 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">정관</span>이란?</Fragment>,
                    <Fragment>회사의 조직 및 운영에 관한 근본규칙입니다.<br/><span className="color_15376c">지속적인 성장을 위하여는 회사의 지배 및 의사결정 구조, 투자 관련 사항들을 규정</span>해두어야 합니다.</Fragment>
                ],
                botImg: ['url("/instructions/company/01/img_02.jpg") no-repeat', '기업의 안정적인 성장과\n스케일업을 위해 필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">정관</span>을<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    37: {
        docNum: 37,
        title: '용역계약서(일반용)',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">용역계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">용역계약서</span>란?</Fragment>,
                    '일정한 업무 수행을 요청하고, 상대방은 이를 수행하는 대가로 금전을 받기로 약속할 때 \n작성하는 계약서입니다'
                ],
                subText: [
                    <div className='sub_text'><img src='/instructions/company/01/icon_02.svg'/><span>용역 결과물 보장</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_06.svg'/><span>용역 기한 규정</span></div>,
                    <div className='sub_text'><img src='/instructions/company/01/icon_03.svg'/><span>지식재산권 규정 </span></div>,
                ],
                botImg: ['url("/instructions/company/01/img_03.jpg") no-repeat', '용역으로 파생되는 법적분쟁을 방지하기 위해 \n꼭 작성해야 하는 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">용역계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    30: {
        docNum: 30,
        title: '근로계약서',
        reducedPrice: ['99만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">근로계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">근로계약서</span>란?</Fragment>,
                    '근로자는 근로를 제공하고, 사용자는 이에 대하여 임금의 지급을 약속하는 문서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_03.jpg") no-repeat', '근로기준법 규정사항 외 다양한 인사노무 규정을\n명확히 하기 위해 \n꼭 작성해야 하는 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">근로계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    34: {
        docNum: 34,
        title: '입사자 서약서',
        reducedPrice: ['99만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">입사자 서약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">입사자 서약서</span>란?</Fragment>,
                    '회사의 영업비밀, 지식재산권의 보호 등을 위하여 입사하는 임직원으로부터 \n비밀유지 서약, 경업금지 등의 서약을 받는 문서입니다 '
                ],
                botImg: ['url("/instructions/company/01/img_03.jpg") no-repeat', '기업의 지식재산권 보호를 위해\n근로계약서와 함께 꼭 작성해야하는\n기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">입사자 서약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    39: {
        docNum: 39,
        title: '주주간계약서',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">주주간계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">주주간계약서</span>란?</Fragment>,
                    '주식회사의 주주들간에 회사의 설립과 운영 과정에서 지켜야할 사항을 약정한 문서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_04.jpg") no-repeat', '주주간 분쟁을 예방하고\n효율적인 기업운영을 위해\n필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">주주간계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
    53: {
        docNum: 53,
        title: '투자계약서',
        reducedPrice: ['97만원'],
        topImageUrl: 'url("/instructions/company/top_img.jpg") no-repeat center center',
        topImageText: [<span>변호사가 만들어 <span style={{backgroundColor: '#ffe872'}}>전문성 UP</span></span>, <span>작성방법 고민없이 <span style={{backgroundColor: '#ffe872'}}>자동으로 완성</span></span>],
        section: {
            1: {
                leftText: <Fragment><span className="color_15376c">투자계약서 </span>작성<br/>왜 중요한가요?</Fragment>,
                rightTopText: [
                    <Fragment><span className="color_15376c">투자계약서</span>란?</Fragment>,
                    '투자 과정에서 지켜야할 사항을 약정한 문서입니다'
                ],
                botImg: ['url("/instructions/company/01/img_04.jpg") no-repeat', '투자자간 분쟁을 예방하고\n효율적인 기업운영을 위해\n필요한 기업문서입니다']
            },
            2: {
                leftText: <Fragment><span className="color_15376c">투자계약서</span>를<br/>제대로<br/>작성하고<br/>계신가요?</Fragment>,
            }
        }
    },
};

export default data;