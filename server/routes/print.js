let express = require('express');
let router = express.Router();
let print = require('../models/print');
// let cookie = require('cookie-parser');
// let jwt = require('jsonwebtoken')
// let salt = 'sobongamicus123!'

router.get('/createpdf', (req, res) => {
    let html = req.query.html;
    try {
        print.createPDF( html ).then( ( result ) => {
            console.log( result )
            res.json({status: 'ok', data: result});
        } );
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.post('/createpdf', (req, res) => {

    let html = req.body.html
    let idwriting = req.body.idwriting
    let iddocuments = req.body.iddocuments
    let idcategory_1 = req.body.idcategory_1
    let bindData = req.body.bindData
    let filePrefix = req.body.filePrefix || null

    try {
        res.json({ status: 'ok' })
        print.createPDF(html, idwriting, iddocuments, idcategory_1, bindData, filePrefix)
    } catch (err) {
        console.log(err)
        res.json({ status: 'error' })
    }
});


router.post('/getPdf', (req, res) => {
    let html = req.body.html;
    let idcategory_1 = req.body.idcategory_1;
    try {
        print.getPdf( html, idcategory_1, res ).then( result => {
        } );
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

module.exports = router;