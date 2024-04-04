import React from 'react';
import axios from 'axios';
const Pdfutil = (props) => {
    async function getBlob( data ) {
        var title = "savefile"
        if( !!data.title )  title = data.title
        const apiHost = (!!process.env.REACT_APP_APIHOST) ? process.env.REACT_APP_APIHOST : 'https://lawform.io:8000/api'
        axios({
            url: apiHost+"/print/getPdf",
            method: 'post',
            responseType: 'blob',
            data :{ html : data.html, idcategory_1:data.idcategory_1},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            }
            })
            .then((response, err) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', title+'.pdf');
                document.body.appendChild(link);
                link.click();
            });
    }

    const blob = getBlob( props );
    return blob;
}

export default Pdfutil;