let express = require('express')
let router = express.Router()
const model = require('../models/legalsolution')

router.post('/setSolutiondata', (req, res) => {

    let params = req.body
    try {

        if (!params.userInfo) {
            res.json({ stauts: 'error', reason: 'no user data' })
            return false
        }

        model.setSolutiondata(params).then((result) => {
            if (!!result) {
                res.json({ status: 'ok', data: result })
            }
        }).catch((err) => {
            res.json({ stauts: 'error', reason: err.message })
        })

    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/getSolutiondata', (req, res) => {

    let params = req.body
    try {

        if (!params.userInfo) {
            res.json({ stauts: 'error', reason: 'no user data' })
            return false
        }

        model.getSolutiondata(params).then((result) => {
            console.log("server result", result)
            if (!!result) {
                res.json({ status: 'ok', data: result })
            }
        }).catch((err) => {
            res.json({ stauts: 'error', reason: err.message })
        })

    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/delSolutiondata', (req, res) => {

    let params = req.body
    let idusers = req.userinfo.idusers

    try {

        if (!idusers) {
            res.json({ stauts: 'error', reason: 'no user data' })
            return false
        }

        model.delSolutiondata(params).then((result) => {
            console.log("server result", result)
            if (!!result) {
                res.json({ status: 'ok', data: result })
            }
        }).catch((err) => {
            res.json({ stauts: 'error', reason: err.message })
        })

    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/getAnswerData', (req, res) => {
    var params = req.body
    params['userInfo'] = req.userinfo
    try {
        if (!params.userInfo) {
            res.json({ stauts: 'error', reason: 'no user data' })
            return false
        }
        model.getAnswerData(params).then((result) => {
            console.log("server result", result)
            if (!!result) {
                res.json({ status: 'ok', data: result })
            }
        }).catch((err) => {
            res.json({ stauts: 'error', reason: err.message })
        })

    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/getDocuments', (req, res) => {

    let params = req.body
    try {

        if (!params.userInfo) {
            res.json({ stauts: 'error', reason: 'no user data' })
            return false
        }

        model.getDocuments(params).then((result) => {
            console.log("server result", result)
            if (!!result) {
                res.json({ status: 'ok', data: result })
            }
        }).catch((err) => {
            res.json({ stauts: 'error', reason: err.message })
        })

    } catch (err) {
        res.json({ status: 'error' })
    }

})

router.post('/addDocuments', (req, res) => {
    let params = req.body
    if (!params.userInfo) {
        res.json({ stauts: 'error', reason: 'no user data' })
        return
    }

    model.addDocuments(params).then((result) => {
        if (!result) {
            throw 'addDocuments no result'
        }
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getAvailableSoutionUser', (req, res) => {

    let idusers = null
    if (!!req.userinfo) {
        idusers = req.userinfo.idusers
    }

    if (!idusers) {
        res.json({ stauts: 'ok', data: null, reason: 'no user data' })
        return
    }

    model.getAvailableSoutionUser(idusers).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getQuestionData', (req, res) => {
    let params = req.body
    model.getQuestionData(params).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/addSolutionAnswers', (req, res) => {
    let params = req.body
    let idusers = req.userinfo.idusers

    if (!idusers) {
        res.json({ stauts: 'error', reason: 'no user data' })
        return
    }

    model.addSolutionAnswers(params, idusers).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/resetUserAnswers', (req, res) => {

    let idusers = req.userinfo.idusers
    let section = req.body.section
    if (!idusers) {
        res.json({ stauts: 'error', reason: 'no user data' })
        return
    }

    model.resetUserAnswers(idusers, section).then((result) => {
        res.json({ status: 'ok'})
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getSubQuestions', (req, res) => {
    let params = req.body
    model.getSubQuestions(params).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getUserSolutionAnswers', (req, res) => {

    let params = req.body
    let idusers = null

    console.log('req.userinfo', req.userinfo)

    if (!!req.userinfo) {
        idusers = req.userinfo.idusers
    }

    if (!idusers) {
        res.json({ stauts: 'ok', data: null, reason: 'no user data' })
        return
    }

    model.getUserSolutionAnswers(params, idusers).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getUserSolutionCompleted', (req, res) => {
    let params = req.body
    let idusers = null

    if (!!req.userinfo) {
        idusers = req.userinfo.idusers
    }

    if (!idusers) {
        res.json({ stauts: 'ok', data: null, reason: 'no user data' })
        return
    }
    model.getUserSolutionCompleted(idusers).then((result) => {
        if (!result) throw 'no result'
        // console.log(result[0].completed)
        let data = result[0].completed
        res.json({ status: 'ok', data })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})




// 마지막 수정 체크
router.post('/getUserLastModify', (req, res) => {
    let params = req.body
    let idusers = null
    if (!!req.userinfo) {
        idusers = req.userinfo.idusers
    }
    if (!idusers) {
        res.json({ stauts: 'ok', data: null, reason: 'no user data' })
        return
    }

    model.getUserLastModify(idusers).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})

router.post('/getLawissueData', (req, res) => {
    let params = req.body
    let category = (!!params.category) ? params.category : 'ST'

    model.getLawissueData(category).then((result) => {
        if (!result) throw 'no result'
        res.json({ status: 'ok', data: result })
    }).catch((err) => {
        res.json({ stauts: 'error', reason: err.message })
    })
})


module.exports = router