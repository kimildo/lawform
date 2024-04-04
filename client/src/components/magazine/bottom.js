import Link from 'next/link'
import Router from 'next/router'
import ReactGA from 'react-ga'

async function gaEvent(event,url,value=null){
    await console.log( 'cate',event,url,value )
    await ReactGA.event({
        category: 'magazine',
        action: event,
        value: value
      })
    await Router.replace(url).then(() => window.scrollTo(0, 0))
}

const Bottom = () => {
    return (
        <div className="bottom">
            <div className="plan">
                <a onClick={()=>gaEvent('startup', '/startup/document')}><img src="/images/magazine/bottom01.jpg"/></a>
            </div>
            <div className="category">
                <a onClick={()=>gaEvent('category_1','/category/1',1)}><img src="/images/magazine/bottom021.png"/></a>
                <a onClick={()=>gaEvent('category_3','/category/3',3)}><img src="/images/magazine/bottom022.png"/></a>
                <a onClick={()=>gaEvent('category_99','/category/99',99)}><img src="/images/magazine/bottom023.png"/></a>
            </div>
            <div className="qna">
                <a onClick={()=>gaEvent('customer_qna','/customer/qna')}><img src="/images/magazine/bottom03.jpg"/></a>
            </div>
            <div className="copyright">
                <img src="/images/magazine/bottom04.jpg"/>
            </div>
        </div>
    )
}

export default Bottom