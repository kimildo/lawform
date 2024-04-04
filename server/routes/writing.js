let express = require('express');
let router = express.Router();
let writing = require('../models/writing');
let aligo = require('../models/aligo');
var lawformSender = '01062500164';
var JSZip = require("jszip");
var jwt = require('jsonwebtoken');
let salt = 'sobongamicus123!'

router.get('/list', (req, res) => {
    try {
        let idusers = req.userinfo.idusers;
        if (!idusers) { return res.json({ status: 'error' }); }

        let total_params = {
            select : " count(*) as total "
        }
        if( !!req.query.listType && req.query.listType === 'package' ) total_params.where = " w.pcp_idx IS NOT NULL "
        if( !!req.query.listType && req.query.listType === 'subscription' ) total_params.where = " w.sub_idx IS NOT NULL "
        if(!!req.query.category) total_params.where = " d.idcategory_1 = " + req.query.category

        let total  = 0;
        writing.getByIdusers(idusers, total_params ).then((result) => {
            total = result[0].total
            // console.log('total : ',result[0].total);
            if( !total  ) {
                return res.json({ status: "error" , reason: "question_notfound" });
            }  else {
                let params = req.query;
                if( !params.page ) params.page = 1;
                if( !params.per ) params.per = 15;
                let start = 0
                start = ( (params.page-1) * params.per)
                if(!params.offset) params.offset = start+","+params.per;
                if(!!params.listType && params.listType === 'package') params.where = " w.pcp_idx IS NOT NULL "
                if(!!params.listType && params.listType === 'subscription') params.where = " w.sub_idx IS NOT NULL "
                if(!!params.category) params.where = " d.idcategory_1 = " + params.category
                params.select = `
                        w.idwriting, 
                        d.title as title, 
                        w.title as name, 
                        d.idcategory_1 as category,
                        c.name AS category_name,
                        w.expiredate as expiredate, 
                        IF(w.expiredate < now(), true, false) AS expired,
                        w.editabledate as editabledate, 
                        w.modifieddate as modifieddate,
                        ISNULL(w.binddata) AS emptybindata, 
                        w.view, 
                        if((SELECT COUNT(*) FROM writing_review WHERE idwriting = w.idwriting) > 0, 'Y', 'N' ) AS review, 
                        w.file,
                        wpr.idx AS writing_peer_idx, 
                        wpr.processing_status,
                        wpr.status AS writing_peer_status
                `
                // console.log( params )
                writing.getByIdusers(idusers, params).then((result) => {
                    res.json({ status: 'ok', data: result, total:total });
                }).catch((err) => {
                    console.log(err)
                    res.json({ status: 'error' });
                });

            }
        });



    }
    catch (err) {
        console.log(err);
        res.json({ status: 'error' });
    }
});

router.post('/writingdata', (req, res) => {
    let idusers = req.userinfo.idusers;
    let iddocuments = req.body.document;
    let bindData = req.body.bindData;
    let file = ""
    file = req.body.file
    try {
        writing.saveBindData(bindData, idusers, iddocuments, file ).then((result) => {
            // console.log(result);
            if (result != null) res.json({ status: "ok" })
            else res.json({ status: "error" });
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});

router.get('/loadinfo/:loadid', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.params.loadid;
    try {
        writing.loadInfo(idusers, idwriting).then((result) => {
            // console.log( result )
            if (result != null) res.json(result)
            else res.json({ status: "error" });
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});


router.get('/loaddata/:loadid', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.params.loadid;
    try {
        writing.loadBindData(idusers, idwriting).then((result) => {
            if (result != null) res.json(result)
            else res.json({ status: "error" });
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});

router.post('/updatetitle', (req, res) => {
    let idusers = req.userinfo.idusers;
    let title = req.body.title;
    let idwriting = req.body.idwriting;
    try {
        writing.updateTitleData(title, idusers, idwriting).then((result) => {
            // console.log(result);
            if (result != null) res.json(result)
            else res.json({ status: "error" });
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});

router.post('/deletedata', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.body.idwriting;
    try {
        writing.deleteData(idusers, idwriting).then((result) => {
            console.log(result);
            if (result != null) res.json(result)
            else res.json({ status: "error" });
        });
    }
    catch (err) {
        res.json({ status: "error" });
    }
});

router.get('/download', (req, res) => {

    let idusers = req.userinfo.idusers
    let idwriting = req.query.idwriting
    let isPeer = req.query.peer || null

    try {
        writing.loadInfo(idusers, idwriting).then((result) => {
            if (result != null && result.length > 0) {
                let data = {
                    title: result[0].title || null,
                    savedFile: (!!isPeer) ? (result[0].file_name || null) : (result[0].file || null)
                }
                res.json({ status: 'ok', data: data })
            } else {
                res.json({ status: 'error' })
            }
        })
    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.post('/extension', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.body.idwriting;
    let type = req.body.type;
    if( !idusers) {
        res.json({ status:"error" });
    } else {
        try {
            writing.extensionOfTerm(idusers, idwriting, type).then((result) => {
                console.log(result);
                if (result != null) res.json(result)
                else res.json({ status: "error" });
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    }

});

router.post('/review', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.body.idwriting;
    let content = req.body.content;
    let email = req.body.email;
    if( !email || !idusers || !idwriting ){
        res.json({ status: "error" });
    } else {
        try {
            writing.review(idusers, idwriting, email, content).then((result)=> {
                if( result ) {
                    res.json({ status: "ok" });
                    let params = {
                        receiver:lawformSender,
                        msg:`[오타 수정 요청] [${req.userinfo.username}|${idusers}] [문서: ${idwriting}] [${email}]`,
                        testmode_yn:'N'
                    }
                    aligo.sendMessage(params);
                }
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    }
});

router.post('/useredit', (req, res) => {
    console.log( 'useredit', req )
    let idusers = req.userinfo.idusers;
    let idwriting = req.body.idwriting;
    let content = req.body.content;
    if( !idusers || !idwriting ){
        res.json({ status: "error" });
    } else {
        try {
            writing.useredit(idusers, idwriting, content).then((result)=> {
                if( result ) {
                    res.json({ status: "ok" });
                }
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    }
});

router.post('/loadedit', (req, res) => {
    let idusers = req.userinfo.idusers;
    let idwriting = req.body.idwriting;
    if( !idusers || !idwriting ){
        res.json({ status: "error" });
    } else {
        try {
            writing.loadedit(idusers, idwriting).then((result)=> {

                if( result.length > 0 ) {
                    res.json({ status: "ok", content:result[0].content });
                } else {
                    res.json({ status: "error", reason:"nodata" });
                }
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    }
});

router.post('/zip', (req, res) => {
    let idusers = req.userinfo.idusers;
    let files = req.body.files;
    let folder = "../client/public/print/";
    if( !idusers || !files ){
        res.json({ status: "error" });
    } else {
        try {
            var zip = new JSZip();
            files.forEach(idwriting => {
                writing.loadInfo(idusers, idwriting).then((result) => {
                    console.log( result, folder );
                    zip.folder(folder).file(idusers,folder+result[0].file);
                });
            });
            zip.generateAsync({type:"base64"})
            .then(function(base64)
            {
                console.log(base64);
                location.href="data:application/zip;base64," + base64;
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    }
});

router.post('/auth', (req, res) => {
    var deCoded = jwt.verify(req.body.token, salt);
    var exp = Number( deCoded.iat ) + 3000 // 300=5분
    if( exp > Math.floor(Date.now() / 1000)) {
        try {
            writing.loadBindData(deCoded.idusers, deCoded.idwriting).then((result) => {
                if (result != null) res.json(result)
                else res.json({ status: "error" });
            });
        }
        catch (err) {
            res.json({ status: "error" });
        }
    } else {
        res.json({ status: "error", reason:"token_expired" });
    }
})


module.exports = router;