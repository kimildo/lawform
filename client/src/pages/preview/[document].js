import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
// import Seo from '../../components/common/seo'
// import { metaDataPreview } from '../../components/common/metas'
const Header = dynamic(() => import('../../components/common/header'),{ssr:false})
const PrewriteMain = dynamic(() => import('../../components/prewrite/prewritemain'),{ssr:false})
const AutoformProvider = dynamic(() => import('../../contexts/autoform').then(mod => mod.AutoformProvider),{ssr:false})

const Autoform = ({match}) => {
    const router = useRouter();
    let iddocument = router.query.document
    // const stArray = [20, 26, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
    // if (iddocument === undefined && process.browser ) {
    //     //window.location.href = '/'
    // }
    return (
        !!iddocument?
        <Fragment>
            {/* <Seo metaData={metaDataPreview}/> */}
            <div className="main_wrap">
                <Header/>
                <AutoformProvider>
                    <PrewriteMain iddocument={iddocument}/>
                </AutoformProvider>
            </div>
        </Fragment>
        :null
    )
}

Autoform.getInitialProps = async () => {
    return { }
}

export default Autoform