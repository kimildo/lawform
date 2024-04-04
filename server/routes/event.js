let express = require('express');
let router = express.Router();
let event = require('../models/event');

router.post('/setdata', (req, res) => {
    var params = {
            event:req.body.event,
            data:req.body.data
        }
        if( !!req.userinfo ) params.idusers = req.userinfo.idusers;

        setData = async() => {
            event.setData( params ).then((result) => {
                if( !!result ){
                    res.json({status: 'ok'});
                } else {
                    res.json({status: 'error', reason: "DB_ERROR"});
                }
            }).catch(() => {
                res.json({status: 'error'});
            })
        }

        if( req.body.type === 'onetime' ) {
            event.checkOne( params ).then((result)=>{
                if( result === true ) {
                    setData();
                } else {
                    res.json({status: 'error', reason: "EXIST"});
                }
            });
        } else {
            setData()
        }



        // if( !!req.body.dupe ) {
        //     var dupe = req.body.dupe.split(',');
        //     console.log( dupe );
        //     event.checkDupe( params, dupe ).then( ( dupe_result) => {
        //         if( !dupe_result ) {
        //             event.setData( params ).then((result) => {
        //                 if( !!result ){
        //                     res.json({status: 'ok'});
        //                 } else {
        //                     res.json({status: 'error', reason: "DB_ERROR"});
        //                 }
        //             }).catch(() => {
        //                 res.json({status: 'error'});
        //             })
        //         } else {
        //             console.log( 'dupe_DATA', dupe_result[0].data );
        //             dupe_data = dupe_result[0].data;
        //             check_data = JSON.parse( params.data );
                    
        //             res.json({status: 'error', reason: "DUPE_DATA"});
        //         }
        //     });
        // }

        

});


router.post('/checkSurvey', (req, res) => {
    var params = {}
        if( !!req.userinfo ) params.idusers = req.userinfo.idusers;

        event.checkFirstPaymentSurvey( params ).then((result) => {
            if( !!result ){
                res.json({status: 'ok', data: result});
            } else {
                res.json({status: 'error', reason: "DB_ERROR"});
            }
        }).catch(() => {
            res.json({status: 'error'});
        })


        

});

module.exports = router;