let express = require('express')
let router = express.Router()
let board = require('../models/board')


router.post('/list',(req, res) => {
    var params = req.body
    board.list( params ).then((result) => {
        res.json({ status: 'ok', result })
    }).catch(() => {
        res.json({ status: 'error' })
    })
})

router.post('/article',(req, res) => {
    var params = req.body
    board.article( params ).then((result) => {
        res.json({ status: 'ok', result })
    }).catch(() => {
        res.json({ status: 'error' })
    })
})


router.post('/press', (req, res) => {
    var params = req.body
    board.press(params).then((result) => {
        res.json({ status: 'ok', press: result })
    }).catch(() => {
        res.json({ status: 'error' })
    })
})

router.post('/magazine', (req, res) => {
    var params = req.body
    board.magazine(params).then((result) => {
        if (!!result)
            res.json({ status: 'ok', data: result })
        else
            res.json({ status: 'error' })
    }).catch(() => {
        res.json({ status: 'error' })
    })
})

router.post('/magazine/view', (req, res) => {
    var params = req.body
    board.magazineView(params).then((result) => {
        if (!!result)
            res.json({ status: 'ok', data: result })
        else
            res.json({ status: 'error' })
    }).catch(() => {
        res.json({ status: 'error' })
    })
})

router.post('/magazine/tags', (req, res) => {
    var params = req.body
    board.magazineTags(params).then((result) => {
        if (!!result) {
            var data = Array.from(new Set(result.tags.split(','))).sort()
            res.json({ status: 'ok', data: data })
        } else {
            res.json({ status: 'error' })
        }
    })
})

module.exports = router