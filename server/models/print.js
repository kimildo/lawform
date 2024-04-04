const fs = require('fs')
const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')

const SVGtoPDF = require('svg-to-pdfkit')
var cheerio = require('cheerio')
let db = require('../utils/rdb')
let logger = require('../utils/winston_logger')

var path = '/home/ec2-user/lawform/client/public/print/'
var temp = '/home/ec2-user/lawform/client/public/print/'

if (!!process.env.SERVER_PRINTPATH) path = process.env.SERVER_PRINTPATH
if (!!process.env.SERVER_TEMPPATH) temp = process.env.SERVER_TEMPPATH

var v_margin = 85
var h_margin = 72

let print = {
    createPDF: async (html, idwriting, iddocuments, idcategory_1, bindData, filePrefix = null) => {

        let col = 'file'
        let table = 'writing'
        let whereCol = 'idwriting'

        if (filePrefix === 'peer') {
            col = 'file_name'
            table = 'writing_peer_reviews'
            whereCol = 'writing_idx'
        }

        let checkSql = `SELECT ${col} FROM ${table} WHERE ${whereCol} = ?`
        let tempUpdateSql = `UPDATE ${table} SET ${col} = 'saving' WHERE ${whereCol} = ?`
        let updateSql = `UPDATE ${table} SET ${col} = ? WHERE ${whereCol} = ?`

        let now = Math.floor(Date.now() / 1000)
        let fileName = now + ((!!filePrefix) ? '_' + filePrefix : null) + '.pdf'

        // console.log('checkSql ::', checkSql)
        // console.log('tempUpdateSql ::', tempUpdateSql)
        // console.log('updateSql ::', updateSql)

        return new Promise(async (resolve, reject) => {

            /**file exist? */
            db.query(checkSql, idwriting).then((rows) => {
                if (!!rows[0].file && rows[0].file !== 'saving') {
                    console.log('DELTE Exist File!: ', rows[0].file)
                    try {
                        fs.unlinkSync(path + rows[0].file)
                    } catch (err) {
                        console.error(err)
                    }
                }
            }).catch((err) => {
                console.error(err)
            })

            console.log('New File!: ', fileName)

            /** set saving */
            db.query(tempUpdateSql, idwriting).catch((err) => {
                console.error(err)
            })

            let $ = cheerio.load(html)
            const doc = new PDFDocument({
                size: 'A4', bufferPages: true, margins: {
                    top: v_margin,
                    bottom: v_margin,
                    left: h_margin,
                    right: h_margin
                }
            })

            doc.pipe(fs.createWriteStream(path + fileName))
            // doc.registerFont('NotoSansCJK', './print/fonts/NotoSansCJK-Regular.ttf');
            // doc.registerFont('NotoSansCJK Bold', './print/fonts/NotoSansCJK-Bold.ttf');
            // doc.registerFont('NotoSansCJK Medium', './print/fonts/NotoSansCJK-Medium.ttf');
            // doc.registerFont('NotoSerifCJK', './print/fonts/NotoSerifCJKkr-Regular.otf');
            // doc.registerFont('NanumMyeongjo', './print/fonts/NanumMyeongjo.ttf');
            // doc.registerFont('NanumMyeongjo Bold', './print/fonts/NanumMyeongjoBold.ttf');
            doc.registerFont('BareunBatang', './print/fonts/BareunBatangM.ttf')
            doc.registerFont('BareunBatang Bold', './print/fonts/BareunBatangB.ttf')
            doc.registerFont('BareunBatang Light', './print/fonts/BareunBatangL.ttf')

            doc.font('BareunBatang')

            /** 문서 제목 */
            let title = $('.autoform_output_title').text().trim()
            //console.log('title : ', title)

            // 표지 삽입.
            if (idcategory_1 === 100) { // 지급명령일때만, 임시제외 3=>100으로 변경됨. 복구시 3
                var stampPrice = ''
                var processingFee = ''
                var amountOfLitigation = ''
                if (iddocuments === 9) {
                    var interestCondition = bindData.interest_condition
                    if (interestCondition === '있음') {
                        stampPrice = bindData.stamp_price_temp_1
                        processingFee = bindData.processing_fee_1
                        amountOfLitigation = bindData.outstanding_principal_amount_1
                    } else {
                        stampPrice = bindData.stamp_price_temp_2
                        processingFee = bindData.processing_fee_2
                        amountOfLitigation = bindData.outstanding_principal_amount_2
                    }
                }
                if (iddocuments === 24) {
                    var nonPaymentLsa = bindData.non_payment_lsa
                    if (nonPaymentLsa) {
                        stampPrice = bindData.stamp_price_temp_1
                        processingFee = bindData.processing_fee_1
                        amountOfLitigation = nonPaymentLsa
                    } else {
                        stampPrice = bindData.stamp_price_temp_2
                        processingFee = bindData.processing_fee_2
                        amountOfLitigation = bindData.principle
                    }
                }
                if (iddocuments === 10) {
                    var paymentType = bindData.payment_type
                    if (paymentType === '일시금으로 받기로 함') {
                        stampPrice = bindData.stamp_price_temp_1
                        processingFee = bindData.processing_fee_1
                        amountOfLitigation = bindData.non_payment_sale_price
                    } else {
                        stampPrice = bindData.stamp_price_temp_2
                        processingFee = bindData.processing_fee_2
                        amountOfLitigation = bindData.principle
                    }
                }

                doc.polygon([20, 20], [575, 20], [575, 820], [20, 820])
                doc.stroke()
                doc.font('BareunBatang Bold', 25).text('지급명령신청서', { align: 'center', characterSpacing: 10 }, 80)
                doc.font('BareunBatang Bold', 15).text('(1) 채권자 및 채무자 정보', { align: 'left', lineGap: 10 }, 230)
                doc.font('BareunBatang', 15).list([`채권자: ${bindData.company_or_person1_name}`, `채무자: ${bindData.company_or_person2_name}`], {
                    lineGap: 10,
                    indent: 25,
                    bulletRadius: 2
                })
                doc.font('BareunBatang Bold', 15).text('(2) 용역대금 청구의 독촉사건', { align: 'left', lineGap: 10 }, 400)
                doc.font('BareunBatang', 15).list([`소가: ${amountOfLitigation}원`, `인지대: ${stampPrice}원`, `송달료: 56,400원`], { lineGap: 10, indent: 25, bulletRadius: 2 })
                var todate = new Date().toISOString().replace(/T/, '').replace(/\..+/, '').substr(0, 10).replace(/-/g, '. ')
                doc.font('BareunBatang', 15).text(todate, { align: 'center', lineGap: 20 }, 700)
                doc.font('BareunBatang Bold', 15).text('서울중앙지방법원 귀중', { align: 'center', characterSpacing: 2, lineGap: 10 })
                doc.addPage()
            }

            doc.font('BareunBatang Bold', 19).text(' ' + title, { align: 'center', characterSpacing: 10 })

            /** 문서 제목 라인 */
            let textLine = $('.textline')
            let textLineMargin = 2

            //console.log('textLine :', 1)
            //console.log('textLine :', textLine)

            /**
             * 왜 주석처리 되어있는지 히스토리를 모르겠음
             * by kimildo
             * */
            if (filePrefix === 'peer') {
                textLine.each(function () {
                    textLineMargin += 3
                    let curY = Math.round(doc.y)
                    // console.log( curY );
                    doc.moveTo(100, (curY + textLineMargin)).lineTo(500, (curY + textLineMargin)).lineWidth(0.5).stroke()
                })
            }

            doc.moveDown()
            doc.moveDown()

            /** 문서 내용 */
            doc.fontSize(12.5)
            let contents = $('.wrap_autoform_output_content > *')

            let addText = ''
            /** 텍스트 합치는 경우 사용. */
            let text = ''
            let firstStyle = {}

            for (let i = 0; i < contents.length; i++) {
                doc.fontSize(12.5)
                let item = contents[i]
                let thisTag = $(item)[0].name
                text = $(item).text().replace(/\s\s+/g, ' ') // 공백문자 정리
                //text = $(item).text()
                //console.log('text', text)
                let left = h_margin
                if (thisTag === 'p' || thisTag === 'div') {
                    let font = 'BareunBatang Light'
//                    var indentPer = 0.94;
                    let indentPer = 1
                    let font_per = 0.95
                    let style = {}
                    style.lineGap = 10
                    style.align = 'justify'
                    style.lineBreak = true
                    style.wordSpacing = 0
                    style.characterSpacing = 1
                    if (!!$(item).css('text-align')) style.align = $(item).css('text-align')
                    if (!!$(item).css('padding-left')) {
                        left = left + (($(item).css('padding-left').replace('px', '')) * indentPer)
                        if (($(item).css('padding-left').replace('px', '')) === '13') left = left + 5
                    }
                    if (!!$(item).css('font-size')) doc.fontSize($(item).css('font-size').replace('px', '') * font_per)
                    if ($(item).css('font-weight') === 'bold') font = 'BareunBatang Bold'
                    if ($(item).children('strong').length > 0) font = 'BareunBatang Bold'
                    if ($(item).children('span').length > 0) {
                        if ($(item).children('span').attr('listtype') !== undefined && idcategory_1 === 1) { // 내용증명에만.
                            switch ($(item).children('span').attr('listtype')) {
                                case 'natural':
                                    left = left + 19
                                    style.indent = -19
                                    break
                                case 'parentheses':
                                    left = left + 27
                                    style.indent = -27
                                    break
                                case 'dash':
                                    left = left + 34
                                    style.indent = -14
                                    break
                            }
                        } else {
                            if (!!$(item).children('span').css('padding-left')) left = left + (($(item).children('span').css('padding-left').replace('px', '')) * indentPer)
                            if (!!$(item).children('span').css('text-indent')) style.indent = ($(item).children('span').css('text-indent').replace('px', '')) * indentPer
                        }
                    }
                    if ($(item).css('display') === 'inline') {
                        if (addText === '') {
                            firstStyle = style
                        }
                        addText = addText + '' + text
                        let isWriteText = false

                        if (i !== contents.length - 1) {
                            nextItem = contents[i + 1]
                            if ($(nextItem).css('display') !== 'inline') {
                                isWriteText = true
                            }
                        } else {
                            isWriteText = true
                        }

                        if (isWriteText) {
                            doc.font(font).text(addText, firstStyle)
                            addText = ''
                        }
                    } else {
                        addText = ''
                        doc.font(font).text('', left).text(text, style)
                        if ($(item).children('strong').length > 0) {
                            if ($(item).children('strong').css('position') === 'absolute') {
                                doc.moveUp(1.78)
                            }
                        }
                    }
                }

                if (thisTag === 'hr') {
                    curY = Math.round(doc.y)
                    doc.moveTo(h_margin, (curY + textLineMargin)).lineTo(525, (curY + textLineMargin)).lineWidth(2).stroke()
                }
                if (thisTag === 'br') {
                    doc.moveDown()
                }
            }

            doc.end()
            // console.log(  "filename", fileName)
            //return resolve(fileName)
            db.query(updateSql, [fileName, idwriting]).catch((err) => {
                console.error(err)
            })
        })
    },
    getPdf: async (html , idcategory_1 , res) => {
        return new Promise(async (resolve, reject) => {
            var $ = cheerio.load(html)
            var doc = new PDFDocument({
                size: 'A4', bufferPages: true, margins: {
                    top: v_margin,
                    bottom: v_margin,
                    left: h_margin,
                    right: h_margin
                }
            })
            // doc.pipe(fs.createWriteStream(path + fileName));
            doc.pipe(res)
            doc.registerFont('BareunBatang', './print/fonts/BareunBatangM.ttf')
            doc.registerFont('BareunBatang Bold', './print/fonts/BareunBatangB.ttf')
            doc.registerFont('BareunBatang Light', './print/fonts/BareunBatangL.ttf')

            doc.font('BareunBatang')
            /** 문서 제목 */
            var title = $('.autoform_output_title').text()

            doc.font('BareunBatang Bold', 19).text(' ' + title, { align: 'center', characterSpacing: 10 })
            /** 문서 제목 라인 */
            var textLine = $('.textline')
            var textLineMargin = 2
            // textLine.each(function () {
            //     textLineMargin += 3;
            //     var curY = Math.round(doc.y)
            //     // console.log( curY );
            //     doc.moveTo(100, (curY + textLineMargin)).lineTo(500, (curY + textLineMargin)).lineWidth(0.5).stroke();
            // });
            doc.moveDown();
            doc.moveDown();

            /** 문서 내용 */
            doc.fontSize(12.5);
            var contents = $('.wrap_autoform_output_content > *');
            var addText = ""; /** 텍스트 합치는 경우 사용. */
            var text = ""
            let firstStyle = {};
            for (let i = 0; i < contents.length; i++) {
                doc.fontSize(12.5)
                let item = contents[i]
                var thisTag = $(item)[0].name
                text = $(item).text().replace(/\s\s+/g, ' ') // 공백문자 정리
                var left = h_margin
                if (thisTag === 'p' || thisTag === 'div') {
                    var font = 'BareunBatang Light'
//                    var indentPer = 0.94;
                    var indentPer = 1
                    var font_per = 0.95
                    var style = {}
                    style.lineGap = 10
                    style.align = 'justify'
                    style.lineBreak = true
                    style.wordSpacing = 0
                    style.characterSpacing = 1
                    if (!!$(item).css('text-align')) style.align = $(item).css('text-align')
                    if (!!$(item).css('padding-left')) {
                        left = left + (($(item).css('padding-left').replace('px', '')) * indentPer)
                        if (($(item).css('padding-left').replace('px', '')) === '13') left = left + 5
                    }
                    if (!!$(item).css('font-size')) doc.fontSize($(item).css('font-size').replace('px', '') * font_per)
                    if ($(item).css('font-weight') === 'bold') font = 'BareunBatang Bold'
                    if ($(item).children('strong').length > 0) font = 'BareunBatang Bold'
                    if ($(item).children('span').length > 0) {
                        if ($(item).children('span').attr('listtype') !== undefined && idcategory_1 === 1) { // 내용증명에만.
                            switch ($(item).children('span').attr('listtype')) {
                                case 'natural':
                                    left = left + 19
                                    style.indent = -19
                                    break
                                case 'parentheses':
                                    left = left + 27
                                    style.indent = -27
                                    break
                                case 'dash':
                                    left = left + 34
                                    style.indent = -14
                                    break
                            }
                        } else {
                            if (!!$(item).children('span').css('padding-left')) left = left + (($(item).children('span').css('padding-left').replace('px', '')) * indentPer)
                            if (!!$(item).children('span').css('text-indent')) style.indent = ($(item).children('span').css('text-indent').replace('px', '')) * indentPer
                        }
                    }
                    if ($(item).css('display') === 'inline') {
                        if (addText === '') {
                            firstStyle = style
                        }
                        addText = addText + '' + text
                        let isWriteText = false

                        if (i !== contents.length - 1) {
                            nextItem = contents[i + 1]
                            if ($(nextItem).css('display') !== 'inline') {
                                isWriteText = true
                            }
                        } else {
                            isWriteText = true
                        }

                        if (isWriteText) {
                            doc.font(font).text(addText, firstStyle)
                            addText = ''
                        }
                    } else {
                        addText = ''
                        doc.font(font).text('', left).text(text, style)
                        if ($(item).children('strong').length > 0) {
                            if ($(item).children('strong').css('position') === 'absolute') {
                                doc.moveUp(1.78)
                            }
                        }
                    }
                }
                if (thisTag === 'hr') {
                    curY = Math.round(doc.y)
                    doc.moveTo(h_margin, (curY + textLineMargin)).lineTo(525, (curY + textLineMargin)).lineWidth(2).stroke()
                }
                if (thisTag === 'br') {
                    doc.moveDown()
                }
            }

            doc.end()

        })
    }

}

module.exports = print