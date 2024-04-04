import React, { Component } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import metas from '../../json/metas.json'

const Seo = (props) => {
    const router = useRouter()
    const asPath = router.asPath
    let metaData = metas[asPath] || metas['default']
    //console.log('asPath', asPath)
    //console.log('seo props', props)

    if (!!props.preMetaData) {
        metaData = props.preMetaData
    }

    if (!metaData.siteName) metaData.siteName = '[로폼,LawForm]'
    if (!metaData.canonical) metaData.canonical = asPath
    if (!metaData.shareImage) metaData.shareImage = 'https://lawform.io/images/common/share.jpg'
    metaData.shareImage = metaData.shareImage.replace('lawform.s3.ap-northeast-2.amazonaws.com' , 's3.ap-northeast-2.amazonaws.com/lawform')

    const ogImage = metaData.shareImage.replace('https://', 'http://')
    const ogImageSecure = metaData.shareImage.replace('http://', 'https://')

    return (
        <Head>
            <title>{metaData.title}</title>
            <meta name="description" content={metaData.description}/>
            <meta name="keywords"
                  content={metaData.keywords || '법률, 법률상담, 법률서식, 법률문제, 서식, 내용증명, 변호사, 계약서, 등기, 가압류, 가처분, 소장, 고소장, 대여금, 교통사고, 탄원서, 차용증, 임대차, 임금, 퇴직금, 채권채무, 로펌, 법무법인, 내용증명작성방법, 내용증명양식, 대리인위임장, 대리인위임장양식, 정관, 내용증명보내는법, 내용증명서, 지급명령신청방법, 월세보증금, 전세금내용증명, 월세, 보증금반환, 계약해지, 용역계약서, 동업계약서, 주주간계약서, 근로계약서, 스톡옵션계약서, 용역계약서, 업무협약서, 임원계약서, NDA, 비밀유지계약서, 비밀유지서약서, 매매대금, 매매대금반환, 용역대금, 월세청구, 약정금, 부동산보증금, 보증금, 금전분쟁, 폭행, 명예훼손, 법률문서, 자동작성, 법률AI, AI법률문서, 계약서자동작성, 스타트업법률문서, 스타트업계약서, 영업권보호, 지적재산권, 지재권침해, 주주간계약서, 동업계약서, 상환전환우선주, 정관, 우발채무, 약관, M&A, 주주명부, MOU, 임금체불, 연봉, 가수금, 가지급금, 도급'}/>
            <meta name="ROBOTS" content={metaData.robots || 'all'}/>
            <meta property="og:type" content="website"/>
            <meta property="og:locale" content="ko_KR"/>
            <meta property="og:site_name" content={metaData.siteName || 'lawform'}/>
            <meta property="og:url" content={metaData.canonical}/>
            <meta property="og:title" content={metaData.title + '-' + metaData.siteName}/>
            <meta property="og:description" content={metaData.description}/>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:image:secure_url" content={ogImageSecure}/>
            <meta property="og:image:width" content={800}/>
            <meta property="og:image:height" content={420}/>
            <meta property="twitter:card" content={'summary'}/>
            <meta property="twitter:title" content={metaData.title + ' - ' + metaData.siteName}/>
            <meta property="twitter:description" content={metaData.description}/>
            <meta property="twitter:image" content={metaData.shareImage}/>
            <meta property="twitter:url" content={metaData.canonical}/>
            <meta property="twitter:creator" content="@LAWFOM"/>
            <meta property="twitter:domain" content="https://twitter.com/lawfom"/>
        </Head>
    )
}

// Seo.defaultProps = {
//     metaData: getMeatas()
// };

Seo.getInitialProps = async () => {
    return {}
}

export default Seo