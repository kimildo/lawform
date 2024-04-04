import React from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import Api from 'utils/apiutil'
import 'scss/startup/v2.scss';

const Header = dynamic(() => import('components/common/header_startup'), { ssr: false })
const Main = dynamic(() => import('components/magazine/main'), { ssr: false })
// const Footer = dynamic(() => import('components/common/footer'), { ssr: false })

const Page = props => {
    const router = useRouter()
    return (
        <div className="magazine education">
            <Helmet meta={[{ 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no' }]}/>
            <Header styles={{ position: 'absolute' }} active="magazine" theme="dark"/>
            <Main idx={router.query.idx}/>
            {/* <Footer styles={{ backgroundColor: '#404040' }}/> */}
        </div>
    )
}

Page.getInitialProps = async (ctx) => {
    const getMagazineData = await Api.sendPost('/board/magazine/view', { idx: ctx.query.idx })
    const preData = (getMagazineData.status === 'error') ? false : getMagazineData.data.data.rows[0]
    const host = (process.env.REACT_APP_HOST) ? process.env.REACT_APP_HOST : 'https://lawform.io'

    if (!!preData) {
        return {
            preMetaData: {
                title: preData.title,
                canonical: host + ctx.asPath,
                description: !!preData.description?preData.description:'로폼의 소식을 전해드립니다.',
                keywords: !!preData.keywords?preData.keywords:'법률, 법률상담, 법률서식, 법률문제, 서식, 내용증명, 변호사, 계약서, 등기, 가압류, 가처분, 소장, 고소장, 대여금, 교통사고, 탄원서, 차용증, 임대차, 임금, 퇴직금, 채권채무, 로펌, 법무법인, 내용증명작성방법, 내용증명양식, 대리인위임장, 대리인위임장양식, 정관, 내용증명보내는법, 내용증명서, 지급명령신청방법, 월세보증금, 전세금내용증명, 월세, 보증금반환, 계약해지, 용역계약서, 동업계약서, 주주간계약서, 근로계약서, 스톡옵션계약서, 용역계약서, 업무협약서, 임원계약서, NDA, 비밀유지계약서, 비밀유지서약서, 매매대금, 매매대금반환, 용역대금, 월세청구, 약정금, 부동산보증금, 보증금, 금전분쟁, 폭행, 명예훼손, 법률문서, 자동작성, 법률AI, AI법률문서, 계약서자동작성, 스타트업법률문서, 스타트업계약서, 영업권보호, 지적재산권, 지재권침해, 주주간계약서, 동업계약서, 상환전환우선주, 정관, 우발채무, 약관, M&A, 주주명부, MOU, 임금체불, 연봉, 가수금, 가지급금, 도급',
                siteName: '로폼(Lawform) 매거진',
                shareImage: preData.cover,
                robots: 'ALL',
            }
        }
    }

    return {}
}

export default Page

// export default Magazine;