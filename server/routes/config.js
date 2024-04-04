let express = require('express')
let moment = require('moment')
let router = express.Router()
let config = require('../models/config')
let board = require('../models/board');
let fs = require('fs')
var publicPath = '/home/ubuntu/lawform/client/public/'
let sitemap = require('../../client/src/json/metas.json')
if (!!process.env.SERVER_PUBLICPATH) publicPath = process.env.SERVER_PUBLICPATH

router.post('/values', (req, res) => {
    var params = req.body;
    config.values(params).then((result) => {
        res.json({status: 'ok', data: result});
    }).catch(() => {
        res.json({status: 'error'});
    })
});

router.get('/sitemap', (req, res) => {
    var data =`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`
    data += `
        <url>
            <loc>https://lawform.io/</loc>
            <lastmod>${moment(Date.now()).format('YYYY-MM-DD')}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>
    `
    for( route in sitemap) {
        if( route !== 'default' ){
        data +=`
        <url>
            <loc>https://lawform.io${route}</loc>
            <lastmod>${moment(Date.now()).format('YYYY-MM-DD')}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>`
        }
    }
    board.magazine({nolimit:true}).then((result) => {
        if(!!result)  {

        const magazineLoop = async _ => {
            for (key in result.rows) {
        data +=`
        <url>
            <loc>https://lawform.io/magazine/${result.rows[key].idx}</loc>
            <lastmod>${moment(Date.now()).format('YYYY-MM-DD')}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>`
            }
        }
        magazineLoop().then( ()=>{
    data += `
    </urlset>`
        fs.writeFile(publicPath+'sitemap.xml', data, 'utf8', function(err) {
            res.json({status: 'ok'});
        });
        } )
    }
    })
});

module.exports = router;