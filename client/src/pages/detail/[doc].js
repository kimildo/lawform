import React from 'react';
// import { Redirect } from 'react-router-dom';
import Router,{ useRouter } from 'next/router'

const Detail = () => {
    
    if( process.browser ) 
    {
        const router = useRouter()
        console.log( router )
        if( !!router.query.doc ) Router.push('/instructions/' + router.query.doc )
    }

    return (
        <div>
            {/* <Redirect to = {"/instructions/" + router.query.doc}  /> */}
        </div>
    );
};

Detail.getInitialProps = async () => {
    return { }
}

export default Detail;