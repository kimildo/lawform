import React, { Component }  from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage, router }) {
    const {html, head} = renderPage();
    return { html, head };
  }

  render () {
    return (
     <Html>
       <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <link rel="icon" type="image/png" href="/favicon.png" />
            {/* <link rel="canonical" href="https://lawform.io" /> */}
            {/* <meta name="description" content="로폼의 법률문서 자동작성은 20년 법조경력의 전문변호사가 만든 자동화 시스템입니다. 각종 내용증명, 회사 계약서, 지급명령 등 실생활과 업무에 필요한 모든 문서가 변호사가 작성한 것 처럼 전문적으로 완성됩니다." />
            <meta name="keywords" content="법률, 법률상담, 법률서식, 법률문제, 서식, 내용증명, 변호사, 계약서, 등기, 가압류, 가처분, 소장, 고소장, 대여금, 교통사고, 탄원서, 차용증, 임대차, 임금, 퇴직금, 채권채무, 로펌, 법무법인, 내용증명작성방법, 내용증명양식, 대리인위임장, 대리인위임장양식, 정관, 내용증명보내는법, 내용증명서, 지급명령신청방법, 월세보증금, 전세금내용증명, 월세, 보증금반환, 계약해지, 용역계약서, 동업계약서, 주주간계약서, 근로계약서, 스톡옵션계약서, 용역계약서, 업무협약서, 임원계약서, NDA, 비밀유지계약서, 비밀유지서약서, 매매대금, 매매대금반환, 용역대금, 월세청구, 약정금, 부동산보증금, 보증금, 금전분쟁, 폭행, 명예훼손, 법률문서, 자동작성, 법률AI, AI법률문서, 계약서자동작성, 스타트업법률문서, 스타트업계약서, 영업권보호, 지적재산권, 지재권침해, 주주간계약서, 동업계약서, 상환전환우선주, 정관, 우발채무, 약관, M&A, 주주명부, MOU, 임금체불, 연봉, 가수금, 가지급금, 도급" />
            <meta property="og:image" content="https://lawform.io/images/common/share.jpg" />
            <meta property="og:title" content="분쟁승소의 핵심, 내용증명, 지급명령, 계약서 등 법률문서를 전문 변호사의 시스템으로 완성하세요 - 로폼(Lawform)"/>
            <meta property="og:description" content="로폼의 법률문서 자동작성은 20년 법조경력의 전문변호사가 만든 자동화 시스템입니다. 각종 내용증명, 회사 계약서, 지급명령 등 실생활과 업무에 필요한 모든 문서가 변호사가 작성한 것 처럼 전문적으로 완성됩니다."/> */}
            <link rel="manifest" href="/manifest.json" />
            <script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
            <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"></script>
            <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
            <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script> 
            {/*<!-- Google Tag Manager -->*/}
            <script  dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NT9FLHR');`}}/>
            {/*<!-- End Google Tag Manager -->*/}
            {/*<!-- Facebook Pixel Code -->*/}
            <script dangerouslySetInnerHTML={{ __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '210332646690997'); 
              fbq('track', 'PageView');
            `}} />
              <noscript>
              <img height="1" width="1" src="https://www.facebook.com/tr?id=210332646690997&ev=PageView&noscript=1"/>
              </noscript>
            {/*<!-- End Facebook Pixel Code -->*/}
            {/*<!-- KakaoPixel Code -->*/}
            <script type="text/javascript" charSet="UTF-8" src="//t1.daumcdn.net/adfit/static/kp.js"></script>
            <script type="text/javascript"   dangerouslySetInnerHTML={{ __html: `
              kakaoPixel('4308069873502305339').pageView();
            `}} />
            {/*<!-- End KakaoPixel Code -->*/}
       </Head>
       <body>
         <Main />
         <NextScript />
         <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
        if (!wcs_add) var wcs_add={};
        wcs_add["wa"] = "s_55a2d8777dcd";
        if (!_nasa) var _nasa={};
        wcs.inflow();
        wcs_do(_nasa);
        `}} /> 
       </body>
        
     </Html>
    );
  }
}