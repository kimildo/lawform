export const siteUrl = 'https://lawform.io'

/** 기본 SET */
export const getMeatas = (data = {}) => {
    return {
        title: data.title || '저렴하고 전문적인 법률문서 자동작성',
        canonical: data.canonical || siteUrl,
        description: data.description || '로폼의 법률문서 자동작성은 20년 법조경력의 전문변호사가 만든 자동화 시스템입니다. 각종 내용증명, 회사 계약서, 지급명령 등 실생활과 업무에 필요한 모든 문서가 변호사가 작성한 것 처럼 전문적으로 완성됩니다.',
        keywords: data.keywords || '법률, 법률상담, 법률서식, 법률문제, 서식, 내용증명, 변호사, 계약서, 등기, 가압류, 가처분, 소장, 고소장, 대여금, 교통사고, 탄원서, 차용증, 임대차, 임금, 퇴직금, 채권채무, 로펌, 법무법인, 내용증명작성방법, 내용증명양식, 대리인위임장, 대리인위임장양식, 정관, 내용증명보내는법, 내용증명서, 지급명령신청방법, 월세보증금, 전세금내용증명, 월세, 보증금반환, 계약해지, 용역계약서, 동업계약서, 주주간계약서, 근로계약서, 스톡옵션계약서, 용역계약서, 업무협약서, 임원계약서, NDA, 비밀유지계약서, 비밀유지서약서, 매매대금, 매매대금반환, 용역대금, 월세청구, 약정금, 부동산보증금, 보증금, 금전분쟁, 폭행, 명예훼손, 법률문서, 자동작성, 법률AI, AI법률문서, 계약서자동작성, 스타트업법률문서, 스타트업계약서, 영업권보호, 지적재산권, 지재권침해, 주주간계약서, 동업계약서, 상환전환우선주, 정관, 우발채무, 약관, M&A, 주주명부, MOU, 임금체불, 연봉, 가수금, 가지급금, 도급',
        siteName: '로폼(Lawform)',
        shareImage: data.shareImage || siteUrl + '/common/share.jpg',
        robots: data.robots || 'ALL'
    }
}

/** 내용증명 */
export const metaDataProof = getMeatas({
    title: '전문 변호사가 만든 내용증명',
    description: '로폼의 내용증명은 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다. 혼자 작성하기 어려운 내용증명도 손쉽게 작성하실 수 있습니다.',
    canonical: siteUrl + '/category/1'
})

/** 지급명령 */
export const metaDataPayment = getMeatas({
    title: '전문 변호사가 만든 지급명령',
    description: '로폼의 지급명령 신청서는 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다. 혼자 작성하기 어려운 지급명령 신청서도 손쉽게 작성하실 수 있습니다.',
    canonical: siteUrl + '/category/3'
})

/** 합의서 */
export const metaDataAgreement = getMeatas({
    title: '전문 변호사가 만든 합의서',
    description: '로폼의 합의서는 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다. 혼자 작성하기 어려운 합의서도 손쉽게 작성하실 수 있습니다.',
    canonical: siteUrl + '/category/4'
})

/** 위임장 */
export const metaDataAuthority = getMeatas({
    title: '전문 변호사가 만든 위임장',
    description: '로폼의 위임장는 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다. 로폼의 위임장은 무료 입니다.',
    canonical: siteUrl + '/category/2'
})

/** 기업문서, 스타트업 */
export const metaDataStartup = getMeatas({
    title: '변호사가 검토한 스타트업 계약서',
    description: '로폼의 스타트업필수문서는 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다.' +
        '스타트업 운영 시 어렵고 복잡한 계약서, 부담스러운 비용을 로폼의 스타트업 계약서를 통해 해결하세요.',
    canonical: siteUrl + '/category/99'
})

/** 서비스소개 */
export const metaDataService = getMeatas({
    title: '변호사가 작성한 것처럼 법률문서를 자동으로 완성해 드립니다',
    description: '로폼은 법률문서 자동작성 프로그램을 제공합니다. 계약서, 내용증명, 지급명령, 위임장, 합의서 등 필요한 법률문서를 작성해보세요.',
    canonical: siteUrl + '/service'
})

/** 고객센터 (faq) */
export const metaDataFaq = getMeatas({
    title: '자주하는 질문',
    description: '원하는 답변을 찾지 못하셨으면, 1:1 이용문의를 이용해주세요. - 자주하는 질문',
    canonical: siteUrl + '/customer/faq'
})

/** 고객센터 (1:1) */
export const metaDataQna = getMeatas({
    title: '1:1 이용문의',
    description: '원하는 답변을 찾지 못하셨으면, 1:1 이용문의를 이용해주세요. - 1:1 이용문의',
    canonical: siteUrl + '/customer/qna'
})

/** 고객센터 (공지) */
export const metaDataNotice = getMeatas({
    title: '공지사항',
    description: '로폼의 소식과 공지사항을 전달드립니다.',
    canonical: siteUrl + '/customer/notice'
})

/** 회사소개 */
export const metaDataCompany = getMeatas({
    title: '평등한 법의 가치 실현',
    description: '로폼은 법률문서 자동작성 프로그램을 제공합니다. 계약서, 내용증명, 지급명령, 위임장, 합의서 등 필요한 법률문서를 작성해보세요.',
    canonical: siteUrl + '/company'
})

/** 보도자료 */
export const metaDataPress = getMeatas({
    title: '보도자료',
    description: '로폼의 소식을 전해드립니다.',
    canonical: siteUrl + '/press'
})

/** 문서 미리보기 */
export const metaDataPreview = getMeatas({
    title: '법률문서 자동 작성 미리보기',
    description: '법률문서 자동 작성 미리보기',
    canonical: siteUrl + '/preview'
})

/** 스타트업 프로그램 */
export const metaDataStartupProgram = getMeatas({
    title: '스타트업 프로그램',
    description: '로폼의 스타트업필수문서는 변호사가 만든 프로그램으로 변호사 설명과 작성가이드가 포함되어 있습니다.' +
        '스타트업 운영 시 어렵고 복잡한 계약서, 부담스러운 비용을 로폼의 스타트업 계약서를 통해 해결하세요.',
    canonical: siteUrl + '/startup'
})

/** 매거진 */
export const metaMagazine = getMeatas({
    title: '매거진',
    description: '로폼의 소식을 전해드립니다.',
    canonical: siteUrl + '/magazine'
})