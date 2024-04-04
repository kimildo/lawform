import React, { Component, Fragment } from 'react';
// import '../../scss/autoform/autoformmain.scss';
import CommonUtil from '../../utils/commonutil';
import API from '../../utils/apiutil';

const Print = (props) => {

    async function getBlob( html ) {
        console.log( 'getBlob', html )
    }
    


    const blob = getBlob( props.html );
    return blob;
}

export default Print;