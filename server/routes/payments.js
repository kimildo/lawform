let express = require('express');
let router = express.Router();
let documents = require('../models/documents');
let writing = require('../models/writing');
let payments = require('../models/payments');
const { Iamporter, IamporterError } = require('iamporter');
const iamporter = new Iamporter({
    apiKey: '2635832336210506',
    secret: '4OvnVlW90jHRHXa4DrgIXmpSv3OxFZoJNT6Ie2Sfmz63xh8bJoTGLizglnN0nbJa5QSkTLzflGjSXr4G'
});

function expireInfo() {
    let expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 6); // DEBUG!! 그날 자정 까지 가능하도록 추후 수정

    let editableDate = new Date();
    editableDate.setDate(editableDate.getDate() + 7);
    return {expireDate, editableDate};
}

registerToWriting = (data, res) =>{
    let {expireDate, editableDate} = expireInfo();
    documents.getTemplateInfo(data.iddocuments).then((result) => {
        let wi = {
            idusers: data.idusers,
            iddocuments: data.iddocuments,
            template_id: result[0].template_id,
            title: result[0].template_data.title,
            binddata: data.bindData,
            expiredate: expireDate,
            editabledate: editableDate,
            etc: !!data.etc?data.etc:null
        }
        writing.register(wi).then((result_wi) => {
            // console.log( 'wi r',result )
            // res.json({ status: 'ok', result:result_wi });
            return result_wi;
        }).catch((err) => {
            // res.json({ status: 'error' });
            // console.log(err);
        });
    });
}

mutipleRegisterToWriting = (req, res) => {
    let {expireDate, editableDate} = expireInfo();
    let bindData = (!!req.bindData)?req.bindData:null;
    try {
        req.iddocuments.forEach(function (documentId) {
            documents.getTemplateInfo(documentId).then((result) => {
                if( documentId === req.iddocument ) bindData = bindData;
                else bindData = null;
                let writingInfo = {
                    idusers: req.idusers,
                    iddocuments: documentId,
                    idpayments: req.idpayments,
                    template_id: result[0].template_id,
                    title: result[0].template_data.title,
                    binddata: bindData,
                    expiredate: expireDate,
                    editabledate: editableDate,
                    etc: !!req.etc?req.etc:null
                };
                writing.register(writingInfo).then((result)=>{
                    res.json({ status: 'ok', result:result });
                });
            })
        });
        // res.json({ status: 'ok' });
    } catch (e) {
        res.json({status: 'error'});
    }
};

serviceProcess = (req, res) =>{
    // console.log( 'serviceProcess', req );


}


getAmount = (req, res) => {
    return new Promise((resolve, reject) => {
        // 문서 전체 구매
        if (req.packageId === 1) {
            let documentsPack = [20,50,31,32,33,34,35,36,37,38,39];
            if (documentsPack.length !== req.iddocuments.length) return res.json({status: 'error'});
            if (documentsPack.filter(function (el) {
                return req.iddocuments.includes(el);
            }).length !== documentsPack.length) {
                return res.json({status: 'error'});
            }

            return resolve(99000);
        } else {
            // 문서당 할인된 가격으로 구매 (기본할인가에서 개당 할인율로 계산)
            let iddocuments = req.iddocuments;
            let IncreaseRatePer = 2;
            let basicDiscountRate = 50;
            let discountRate = (basicDiscountRate + ((iddocuments.length - 1) * IncreaseRatePer)) / 100;
            payments.primeAmount(iddocuments).then((amountData) => {
                // console.log( 'amountData' , amountData );
                let primeAmount = amountData.price;
                return resolve((Math.round((primeAmount - (primeAmount * discountRate)) / 100) * 100) - amountData.extraDcPrice);
            });
        }
    });
};

router.post('/', (req, res) => {
    try {
        let data = req.body;
        data.idusers = req.userinfo.idusers;
        data.product_type = 'documents';
        if (data.isFree === true && data.iddocuments) {
            documents.isFree(data.iddocuments).then((result)=> {
                if (result === true) registerToWriting(data,res);
            })
        }
        else {
            iamporter.findByImpUid(data.imp_uid).then((impData) => {
                let impUid = impData.data.imp_uid;
                if (data.imp_uid !== impUid || ( Number(data.paid_amount) !== Number(impData.data.amount))) {
                    return res.json({status: 'error', reason: 'IMPUID_NOT_MATCH'});
                }
                payments.amount_check( data.iddocument ).then( (docInfo ) => {
                    // console.log( 'docInfo', docInfo )
                    if( parseInt(docInfo[0].dataRow) === parseInt( parseInt( data.paid_amount ) + parseInt( data.discount) )  ){
                        payments.imp_uid_check(impUid).then((existUid) => {
                            // console.log( 'existUid' ,existUid, existUid.length )
                            if (existUid.length > 0) return res.json({status: 'ok', reason: 'IMPUID_EXIST', insertId: existUid[0].idwriting});
                            else {
                                payments.register(data, impData.data).then((paymentUid) => {
                                    if( !!data.discountCode ){
                                        payments.freePromotion_use( {code:data.discountCode, idusers: data.idusers} ).then((result_use) => {
                                            // console.log( result_use )
                                        });
                                    }
                                    data.idpayments = paymentUid
                                    if( !!data.paycode ) {
                                        payments.get_temp( { paycode: data.paycode,idusers: data.idusers} ).then((result) => {
                                            data.bindData = JSON.parse( result.binddata );
                                            return mutipleRegisterToWriting(data, res);
                                        });
                                    } else {
                                        return mutipleRegisterToWriting(data, res);
                                    }
                                })
                            }
                        })
                    } else {
                        return res.json({status: 'error', reason: 'AMOUNT_AND_DISCOUNT_NOT_MATCH' });
                    }

                } );
            })
        }
    }
    catch (err) {
        // console.log(err);
        res.json({ status: 'error' });
    }
});

router.get('/history', (req, res) => {
    try {
        let idusers = req.userinfo.idusers
        if (!idusers) { return res.json({ status: 'error' }) }
        // console.log("history")
        // console.log(idusers)

        let total_params = {
            where: ' status != \'D\' ',
            select: ' count(*) as total '
        }
        let total = payments.history(idusers, total_params).then((result) => {
            total = result[0].total
            // console.log('total : ',result[0].total);
            if (!total) {
                return res.json({ status: 'error', reason: 'notfound' })
            } else {
                let params = req.query
                if (!params.page) params.page = 1
                if (!params.per) params.per = 15
                let start = 0
                start = ((params.page - 1) * params.per)
                // console.log( "start : ", start );
                if (!params.offset) params.offset = start + ',' + params.per
                params.select = 'IF(p.`name` IS NOT NULL , p.`name` , d.title) AS `name`, p.paid_amount, p.registerdate, d.idcategory_1 as category, p.status AS payment_status, p.refund_date, receipt_url, imp_uid'
                payments.history(idusers, params).then((result) => {
                    res.json({ status: 'ok', data: result, total: total })
                }).catch((err) => {
                    console.log(err)
                    res.json({ status: 'error' })
                })
            }

        })
    } catch (err) {
        // console.log(err);
        res.json({ status: 'error' })
    }
})

router.post('/freepromotioncheck', (req, res) => {
    try {
        let param = req.body
        let idusers = req.userinfo.idusers;
        param.idusers = idusers;
        payments.freePromotion_check( param ).then((result) => {
                res.json( result );
        });
    }
    catch (err) {
        // console.log(err);
        res.json({ status: 'error' });
    }
});



router.post('/freepromotion', (req, res) => {
    try {
        let param = req.body
        let idusers = req.userinfo.idusers;
        param.idusers = idusers;
        // console.log( 'freepromotion', param )
        payments.promotion( param ).then((promo) => {
            // console.log(promo)
            param.common = promo.data[0].common
            payments.freePromotion_check( param ).then((result) => {
                if( result.status === 'ok' ){
                    payments.freePromotion_use( param ).then((result_use) => {
                        // console.log( 'result_use' , result_use )
                        let data = {}
                        data.idusers = idusers;
                        data.product_type = 'documents';
                        data.iddocuments = [param.iddocuments];
                        data.name = param.name;
                        data.bindData = param.bindData;
                        data.etc = result_use;
                        res.json( registerToWriting(data, req, res) )
                    });
                } else  {
                        res.json({ status: 'error', reason: 'used' });
                }
            });
        })

    }
    catch (err) {
        console.log(err);
        res.json({ status: 'error' });
    }
});

router.post('/promotion', (req, res) => {
    try {
        let param = req.body
        let idusers = req.userinfo.idusers;
        param.idusers = idusers;
        payments.promotion_check( param ).then((result) => {
            if( result.length > 0 ){
                if( result[0].use === 'N' ) {
                    let data = {}
                    data.idusers = idusers;
                    data.product_type = 'documents';
                    data.iddocuments = param.iddocuments;
                    data.name = param.name;
                    return registerToWriting(data, req, res)
                }
                else
                {
                    res.json({ status: 'error' });
                }
            } else {
                    res.json({ status: 'error' });
            }
        });
    }
    catch (err) {
        // console.log(err);
        res.json({ status: 'error' });
    }
});


router.post('/temp', (req, res) => {
    var params = req.body;
    let idusers = req.userinfo.idusers;
        params.idusers = idusers;
        params.bindData = JSON.stringify( params.bindData );
        // console.log( "temp" , params )
    try {
        payments.temp( params ).then((result) => {
            res.json({ status: 'ok', data: result });
        });
    }
    catch (err) {
        // console.log(err);
        res.json({ status: 'error' });
    }
});

router.post('/gettemp', (req, res) => {
    var params = req.body;
    let idusers = req.userinfo.idusers;
        params.idusers = idusers;
    try {
        payments.get_temp( params ).then((result) => {
            res.json({ status: 'ok', data: result });
        });
    }
    catch (err) {
        // console.log(err);
        res.json({ status: 'error' });
    }
});

router.post('/service', (req, res) => {
    var params = req.body
    try {
        iamporter.findByImpUid(params.imp_uid).then((impData) => {
            if (impData.status === 200) {
                let data = impData.data
                if (data.imp_uid === params.imp_uid) {
                    payments.serviceInfo({ idx: params.serviceidx }).then((result) => {
                        if (result[0].price === data.amount) {
                            payments.imp_uid_check(data.imp_uid).then((existUid) => {
                                if (existUid.length > 0) { return res.json({ status: 'error', reason: 'IMPUID_EXIST' }) }
                                else {
                                    params.idusers = req.userinfo.idusers
                                    params.product_type = 'service'
                                    payments.register(params, data).then((paymentUid) => {
                                        if (!!paymentUid) {
                                            res.json({ status: 'ok', data: { paymentUid: paymentUid } })
                                        }
                                    })
    
                                }
                            })

                        } else {
                            res.json({ status: 'error', reason: 'AMOUNT_NOT_MATCH' })
                        }
                    })
                } else {
                    res.json({ status: 'error', reason: 'IMPUID_NOT_MATCH' })
                }
            } else {
                res.json({ status: 'error', reason: 'IMPUID_NOT_FOUND' })
            }
        })

    } catch (err) {
        res.json({ status: 'error' })
    }
})

router.get('/service/:idx', (req, res) => {
    var params = {
        idx: req.params.idx
    };
    try {
        payments.serviceInfo( params ).then((result) => {
            res.json({ status: 'ok', data: result });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/service/options', (req, res) => {
    var params = req.body;
    try {
        payments.serviceOptions( params ).then((result) => {
            res.json({ status: 'ok', data: result });
        });
    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/count', (req, res) => {
    try {
        let params = req.body
        let idusers = req.userinfo.idusers;
        params.idusers = idusers;
        payments.count( params ).then((result) => {
            res.json({ status: 'ok', data:result });
        });
    }
    catch (err) {
        console.log(err);
        res.json({ status: 'error' });
    }
});


router.post('/usecode', (req, res) => {
    try {
        let params = req.body
        let idusers = req.userinfo.idusers;
        params.idusers = idusers;
        // checkPromotion 
        payments.promotion( params ).then((result) => {
            // console.log( 'promotion', result, params )
            if( result.status === true) {
                params.common = result.data[0].common
                payments.freePromotion_check( params ).then((chk) => {
                    result.data[0].chk=chk
                    res.json( result.data[0] )
                })
            } else {
                // console.log( 'promotion status', false )
                    res.json( {status:'error'} )
            }
        });
        
    }
    catch (err) {
        console.log(err);
        res.json({ status: 'error' });
    }
});

router.post('/plan', (req, res) => {
    var params = req.body;
    try {
        iamporter.findByImpUid(params.imp_uid).then((impData) => {
            if( impData.status === 200 ) {
                var data = impData.data;
                if (data.imp_uid === params.imp_uid) {
                    payments.planInfo( {idx:params.plan} ).then((result) => {
                        if( result[0].price === data.amount ) {
                            payments.imp_uid_check(data.imp_uid).then((existUid) => {
                                if (existUid.length > 0) 
                                {
                                    return res.json({status: 'ok', reason: 'IMPUID_EXIST', data: {}});
                                } else {
                                    params.idusers = req.userinfo.idusers;
                                    params.product_type = 'plan';
                                    payments.register(params, data).then((paymentUid) => {
                                        if( !!paymentUid ) {
                                            params.payment = paymentUid
                                            payments.planDisable( params ).then(disabled=>{
                                                if( disabled === 'ok' ){
                                                    payments.planRegister( params ).then( planResult => {
                                                        res.json({ status: 'ok', data: {sub_idx:planResult.insertId} });
                                                    })
                                                }
                                            })

                                        }

                                    });
                                }
                            });

                        } else {
                            res.json({ status: 'error', reason: 'AMOUNT_NOT_MATCH' });
                        }
                    });
                } else {
                    res.json({status: 'error', reason: 'IMPUID_NOT_MATCH'});
                }
            } else {
                res.json({status: 'error', reason: 'IMPUID_NOT_FOUND'});
            }
        });


    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/callback', (req, res) => {
    var params = req.body;
    // console.log( "request", req.connection.remoteAddress )
    // console.log( "callback", params )
    var data = {
        success: true,
        currency: 'KRW',
        pg_provider: 'kicc',
        pg_type: 'payment',
        pg_tid: null,
        apply_num: null,
        buyer_name: null,
        buyer_email: null,
        buyer_tel: '02-6925-0227',
        buyer_addr: '서울특별시 강남구 테헤란로 126 GT 대공빌딩 11층',
        buyer_postcode: '123-456',
        custom_data: null,
        receipt_url: '',
        card_name: null,
        bank_name: null,
        card_quota: 0,
    }

    try {
        if( params.status === 'paid' ) {
            const getTemp = async () => payments.get_temp( { paycode: params.merchant_uid.replace("merchant_","")} ).then((result) => {
                data.imp_uid = params.imp_uid
                data.pay_method =  result.paymethod
                data.merchant_uid = params.merchant_uid
                data.name = result.docname
                data.paid_amount = result.amount
                data.amount = result.amount
                data.status = params.status
                data.paid_at = new Date().getTime(),
                data.iddocuments = [ result.iddocument ],
                data.discount = 0,
                data.bindData = JSON.parse( result.binddata );
                data.iddocument = result.iddocument,
                data.idusers = result.idusers,
                data.paycode = params.merchant_uid.replace("merchant_",""),
                data.product_type = result.product_type
                data.discountCode = result.discountCode
                payments.imp_uid_check(params.imp_uid).then((existUid) => {
                    // console.log( "callback existUid",existUid )
                    if (existUid.length > 0) { return res.json({status: 'error', reason: 'IMPUID_EXIST', insertId:existUid[0].idwriting}); }
                    else
                    {
                        payments.register(data, data).then((paymentUid) => {
                            data.idpayments = paymentUid
                            // console.log("callback register", data)
                            if( data.product_type === 'documents' ) { 
                                // console.log( 'callback register documents' )
                                if( !!data.discountCode ){
                                    payments.freePromotion_use( {code:data.discountCode, idusers: data.idusers} ).then((result_use) => {
                                        // console.log( result_use )
                                    });
                                }
                                return mutipleRegisterToWriting(data, res); 
                            }
                            else 
                            if( data.product_type === 'plan' ) {
                                // console.log( 'callback register plan' )
                                payments.planDisable( {idusers:result.idusers} ).then(disabled=>{
                                    if( disabled === 'ok' ){
                                        payments.planRegister({idusers: result.idusers, plan:result.plan, payment:paymentUid}).then( planResult => {
                                            res.json({ status: 'ok', data: {sub_idx:planResult.insertId} });
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            });
            getTemp().then(r=> {
                res.json({ status: 'ok' });
            })
        }

    }
    catch (err) {
        res.json({ status: 'error' });
    }
});

module.exports = router;