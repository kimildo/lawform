import React from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import { AutoformProvider } from '../../contexts/autoform'
const Header = dynamic(() => import('../../components/common/header'),{ssr:false})
const AutoformMain = dynamic(() => import('../../components/autoform/autoformmain'),{ssr:false})
const AutoformTitle = dynamic(() => import('../../components/autoform/autoformtitle'),{ssr:false})

const Autoform = ({ match }) => {
    const router = useRouter();
    const document = router.query.document
    return (
        <div>
            <Header/>
            <AutoformProvider>
                <AutoformTitle document={document}/>
                <AutoformMain document={document}/>
            </AutoformProvider>
        </div>
    )
}

export default Autoform