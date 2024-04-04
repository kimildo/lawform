import React from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'

const Parser = dynamic(() => import('../../components/autoform/parser'),{ssr:false})
const AutoformProvider = dynamic(() => import('../../contexts/autoform').then( mod => mod.AutoformProvider ),{ssr:false})
// import { AutoformProvider } from '../contexts/autoform'
const Preparser = (props) => {
    const router = useRouter();
    return (
        <div>
            <AutoformProvider>
                <Parser token={router.query.token}/>
                {/* <Parser token={match.params.token} peer={match.params.peer}/> */}
            </AutoformProvider>
        </div>
    )
}
export default Preparser