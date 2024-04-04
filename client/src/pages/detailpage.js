import React from 'react';
// import { Redirect } from 'react-router-dom';
import { useRouter } from 'next/router'
// import Header from '../components/common/header';
// import Detail from '../components/detail/detaildocument';
// import Footer from '../components/common/footer';

const Detailpage = ({match}) => {
    if( process.browser ) 
    {
        const router = useRouter()
        console.log( router )
        if( !!router.query.doc ) Router.push('/instructions/' + router.query.doc )
    }
    return (
        <div>
            {/* <Redirect to = {"/instructions/" + router.query.doc}  /> */}
            {/*<Header></Header>*/}
            {/*<Detail doc={match.params.doc}></Detail>*/}
            {/*<Footer></Footer>*/}
        </div>
    );
};

export default Detailpage;