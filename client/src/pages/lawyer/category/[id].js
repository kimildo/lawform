import React, {Component, Fragment} from 'react'
import dynamic from 'next/dynamic'
import { Helmet } from "react-helmet"
import {useRouter} from 'next/router'

const Header = dynamic(() => import('../../../components/common/header_new'),{ssr:false})
const Main = dynamic(() => import('../../../components/category/main'),{ssr:false})
const Footer = dynamic(() =>  import('../../../components/common/footer'),{ssr:false})

function Post( props ) {
   
    const router = useRouter();
    return (
        <div className="category magazine lawyer">
                <Header styles={{position:'absolute'}} theme={'dark'} peer_review={true}  />
                <Helmet meta={[{ "name": "viewport", "content": "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, shrink-to-fit=no" }]} />
                <Main category={Number( router.query.id )} />
                <Footer />
        </div>
    );
  }

  Post.getInitialProps = async () => {
      
    return { }
  }

  export default Post