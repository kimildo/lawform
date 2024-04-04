import React, { Fragment } from 'react'
import { Helmet } from "react-helmet"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
const Main = dynamic(() => import('../../components/presentation/main'),{ssr:false})
const Contract = dynamic(() => import('../../components/presentation/contract'),{ssr:false})
// import '../scss/presentation.scss';

const Presentation = ({match}) => {
    const router = useRouter()
    return (
        <Fragment>
            <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
            <div className="presentation">
                {
                    ( !!router.query.pt && Number( router.query.pt ) === 1 )?
                    <Main></Main>:null
                }
                {
                    ( !!router.query.pt && Number( router.query.pt ) === 2 )?
                    <Contract></Contract>:null
                }
            </div>
        </Fragment>
    );
};

export default Presentation;