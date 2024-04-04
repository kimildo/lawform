let express = require('express');
let router = express.Router();
let user = require('../models/user');
let customer = require('../models/customer');
let aligo = require('../models/aligo');
let jwt = require('jsonwebtoken');
let decode = require('jwt-decode');
let salt = 'sobongamicus123!'
const axios = require('axios')
var aligoApiKey = "9bvpd2qrcd38dhiwuspy7pjj4bqledqs";
var aligoApiId = "amicuslex";
var lawformSender = '01062500164';

router.get('/notice', (req, res) => {
    let params = req.body;
    try {
        customer.getNotice(params).then((result) => {
            res.json({ status:'ok', data:result })
        }).catch((err) => {
            res.json({ stauts: 'error', reason: "unknown" });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.get('/notice/:idx', (req, res) => {
    let params = req.body;
        params.idx = req.params.idx;
    try {
        customer.getNotice(params).then((result) => {
            res.json({ status:'ok', data:result[0] })
        }).catch((err) => {
            res.json({ stauts: 'error', reason: "unknown" });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.get('/faq/:category', (req, res) => {
    let params = req.body;
    if( req.params.category !=='all' )  params.category = req.params.category;
    try {
        customer.getFaq(params).then((result) => {
            res.json({ status:'ok', data:result })
        }).catch((err) => {
            res.json({ stauts: 'error', reason: "unknown" });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});


router.get('/counsel', (req, res) => {
    let params = req.body;
    try {
        customer.getCounsel(params).then((result) => {
            res.json({ status:'ok', data:result })
        }).catch((err) => {
            res.json({ stauts: 'error', reason: "unknown" });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/writeqna', (req, res) => {
    let idusers = null
    let host = req.body.host
    if(req.userinfo !== null) {
        idusers = req.userinfo.idusers;
    }
    if( !req.body.program_group ) {
        req.body.program_group = null
    }
    console.log(req)
    var public = 'N'
    if( !!req.body.public ) {
        public = req.body.public === true?'Y':'N'
    }
    try {
        customer.writingQuestion( req.body.question , req.body.email , req.body.phone, idusers,  req.body.program_group,  public ).then((result) => {
            // console.log( result )
            //res.json({ status: "ok" });

            if( result === 'ok' ) {
                let msg = `[${req.userinfo.username}]님께서 1:1 문의를 등록 하였습니다.`; 
                var params = new URLSearchParams();
                params.append('key', aligoApiKey);
                params.append('user_id', aligoApiId);
                params.append('sender', '0269250227');
                params.append('receiver', lawformSender);
                params.append('msg', msg);
                params.append('testmode_yn', 'N');
                if (host === 'dev.lawform.io' || host === 'localhost') {
                    user.sendAligoToAdmin( params );
                }
                res.json({ status: "ok" });
            } else {
                res.json({ status: "error" });
            }
                        
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});


router.post('/review', (req, res) => {
    let idusers = null
    if(req.userinfo !== null) {
        idusers = req.userinfo.idusers;
    }
    let params = req.body;
    params.idusers = idusers;
    if( !params.select ) params.select = " r.*,  r.registerdate as registerdate , CONCAT( SUBSTRING( SUBSTRING_INDEX( u.email, '@', 1),1,2) , REPEAT('*', CHAR_LENGTH( SUBSTRING_INDEX( u.email, '@', 1) )-2 ), '@', SUBSTRING_INDEX(u.email, '@', -1) )  AS email , d.title ";
    if( !params.per ) { 
        params.limit = " LIMIT 0 , 15"; 
    } else {
        params.limit = " LIMIT "+( ( params.page - 1) * params.per )+" , "+params.per
    }
    if( !!params.order ) {
        if( params.order === 'newer' ) params.orderBy = `ORDER BY ISNULL(sort),sort, r.registerdate DESC `;
        if( params.order === 'score' ) params.orderBy = `ORDER BY ISNULL(sort),sort, r.score DESC `;
    } else {
        params.orderBy = `ORDER BY ISNULL(sort),sort, r.score DESC `;
    }

    try {
        customer.listUserReviews( params ).then((result) => {
            if( !!result ) {
                customer.listUserReviews( {select:'count(*) as total',limit:' ', document:params.document} ).then((total) => {
                    res.json({ status: "ok" , data: result, total:total[0].total });
                });

            } else {
                res.json({ status: "error" });
            }
                        
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});


module.exports = router;