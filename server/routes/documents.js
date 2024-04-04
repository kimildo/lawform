let express = require('express');
let router = express.Router();
let documents = require('../models/documents');

router.get('/allinfo', (req, res) => {
    documents.getAllOrderByCategory().then((msg) => {
        let data = [];
        let last_category_1 = '';
        let last_category_2 = '';
        let idx_category_1 = -1;
        let idx_category_2 = -1;
        for (let i = 0; i < msg.length; i++) {
            let docu = msg[i];
            if (docu.category_1 !== last_category_1) {
                idx_category_1 = data.push({ title: docu.category_1, subcategory: [] }) - 1;
                idx_category_2 = data[idx_category_1].subcategory.push({ title: docu.category_2, documents: [] }) - 1;
            } else if (docu.category_2 !== last_category_2) {
                idx_category_2 = data[idx_category_1].subcategory.push({ title: docu.category_2, documents: [] }) - 1;
            }

            data[idx_category_1].subcategory[idx_category_2].documents.push(
                {
                    iddocuments: docu.iddocuments,
                    title: docu.title,
                    description: docu.des
                }
            )
            last_category_1 = docu.category_1;
            last_category_2 = docu.category_2;
        }
        res.json({ status: 'ok', category: data });
    }).catch((err) => {
        res.json({ status: 'error' });
        console.log(err);
    });
});
router.get('/info', (req, res) => {
    var params = req.query;
    if( !!req.userinfo ) {
        if( !!req.userinfo.idusers ) {
            var idusers = req.userinfo.idusers
            params.idusers = idusers
        }
    }
    documents.getDocumentsByParams(params).then((msg) => {
        let data = [];
        let last_category_1 = '';
        let last_category_2 = '';
        let idx_category_1 = -1;
        let idx_category_2 = -1;
        let likeShow = false;

        for (let i = 0; i < msg.length; i++) {
            let docu = msg[i];
            if (docu.category_1 !== last_category_1) {
                idx_category_1 = data.push({ title: docu.category_1, subcategory: [] }) - 1;
                idx_category_2 = data[idx_category_1].subcategory.push({ title: docu.category_2, documents: [] }) - 1;
            } else if (docu.category_2 !== last_category_2) {
                idx_category_2 = data[idx_category_1].subcategory.push({ title: docu.category_2, documents: [] }) - 1;
            }

            data[idx_category_1].subcategory[idx_category_2].documents.push(
                {
                    iddocuments: docu.iddocuments,
                    title: docu.title,
                    description: docu.des,
                    like: docu.like,
                    category: docu.idcategory_1
                }
            )
            last_category_1 = docu.category_1;
            last_category_2 = docu.category_2;
            //if( !!idusers ) likeShow = true  // show Like
        }
        res.json({ status: 'ok', category: data, likeShow:likeShow });
    }).catch((err) => {
        res.json({ status: 'error' });
        console.log(err);
    });
});
router.get('/like', (req, res) => {
    let idusers = req.userinfo.idusers
    documents.getLikedDocument(idusers).then((rows) => {
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push(rows[i].iddocuments);
        }
        res.json({ status: 'ok', likedDocuments: data })
    }).catch((err) => {
        res.json({ status: 'error' });
    });
});
router.post('/like', (req, res) => {
    try {
        let idusers = req.userinfo.idusers
        let iddocuments = req.body.iddocuments;
        
        documents.likeDocument(idusers, iddocuments).then((result) => {
            res.json({ status: 'ok' , like : result });
        }).catch((err)=> {
            console.log(err);
            res.json({status: 'error'});
        });
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.get('/contracts', (req, res) => {
    var t = [1, 2, 3, 4, 5];
    var testData = {
        
}

    console.log('aaaa');
    console.log(testData);
    res.json(testData);
});

router.get('/document/:iddocuments', (req, res) => {
    try {
        let idusers = 1; //DEBUG!!
        let iddocuments = req.params.iddocuments;

        documents.getDetailInfo(idusers, iddocuments).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.get('/category', (req, res) => {
    try {
        let params = ""
        documents.getDocumentsByParams(params).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.get('/category/:idcategory', (req, res) => {
    try {
        // let idusers = 1; //DEBUG!!
        let idcategory = req.params.idcategory;
        documents.getCategory(idcategory).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.get('/categorys/:category', (req, res) => { // 카테고리 목록 
    try {
        let category = req.params.category;
        documents.getCategoryDocs(category).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json({stauts: 'error'});
        });
    }
    catch (err) {

    }
});

router.get('/template/:templateid', (req, res) => {
    try {
        let templateid = req.params.templateid;

        documents.getTemplateInfo(templateid).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        console.log(err);
        res.json({status: 'error'});
    }
});

router.get('/preview/:templateid', (req, res) => {
    try {
        let templateid = req.params.templateid;
        documents.getTemplatePreview(templateid).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json({ status:'ok', data:result });
        }).catch((err) => {
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        res.json({status: 'error'});
    }
});

router.post('/prewrite/:templateid', (req, res) => {
    try {
        let templateid = req.params.templateid;
        documents.getTemplatePreWrite(templateid).then((result) => {
            if (result == null) res.json({status: 'error', msg : 'no info'});
            else res.json({ status:'ok', data:result });
        }).catch((err) => {
            res.json({stauts: 'error'});
        });
    }
    catch (err) {
        res.json({status: 'error'});
    }
});


module.exports = router;