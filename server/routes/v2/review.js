let express = require('express');
let router = express.Router();

let review_m = require('../../models/review_m');
let writing_peer_m = require('../../models/writing_peer_review_m');

let helper_security = require('../../helper/helper_security');

router.post('/get', (req, res) => {
    let payload = req.body;

    // set default values
    payload.peer_idx   = payload.peer_idx;
    payload.idusers     = req.userinfo.idusers;

    // check login
    if(!payload.idusers) res.json({ status:"error" });

    // get document list
    review_m.get(payload).then((result) => {
        if( !!result && result.length == 1 ) {
            res.json({ "result" : "ok", "data" : result[0] })
        } else{
            res.json({ "status" : "error" });
        }
    });
});

router.post('/get_review_list', (req, res) => {
    let payload = req.body;

    // set default values
    payload.user_idx = req.userinfo.idusers;

    // check login
    if(!payload.user_idx) res.json({ status:"error" });

    // return list
    var return_list = [];

    // get document list
    review_m.get_review_list(payload).then((result) => {
        if( !!result ) {
            // encode idx
            return_list = result.map(function(item) {
                item.idx = helper_security.encode(item.idx);
                return item;
            });

            // set count to true
            payload.count = true;
            review_m.get_review_list(payload).then((result2) => {
                if( !!result2 ) {                    
                    res.json({ "result" : "ok", "data" : return_list, "cnt" : result2[0].cnt })
                }else{
                    res.json({ "status" : "error" });
                }
            });
        }else{
            res.json({ "status" : "error" });
        }
    });
});

router.post('/create_review', (req, res) => {
    let payload = req.body;
    // set default values
    payload.idusers            = req.userinfo.idusers;

    // check login
    if(!payload.idusers) res.json({"status" : "error"})

    // insert to database
    writing_peer_m.get(payload).then((result1) => {
        if( !!result1 ) {

            payload.document = result1[0].document_idx
            payload.category = result1[0].category_idx

            review_m.create(payload).then((result2) => {
                if( !!result2 ) {
                    res.json({ "result" : "ok", "data" : helper_security.encode(result2) });
                }
                else{
                    res.json({ "status" : "review create error" });
                }
            });
        } else{
            res.json({ "status" : "no matching data error" });
        }
    })
});


module.exports = router;
