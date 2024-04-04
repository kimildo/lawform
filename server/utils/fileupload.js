// let multer = require('multer') // multer library를 사용하여 이미지 업로드
//
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../client/public/profiles/')  // 파일이 저장되는 경로
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)    // 저장되는 파일명
//                                         // lawyer/profile.js에서 FormData 생성하며 지정해준 파일명
//     }
// })
//
// let upload = multer({ storage: storage }).single('file')   // single : 하나의 파일업로드 할때
// module.exports = upload

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
    accessKeyId: 'AKIA2WUHLMAMGJTXS3HE',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
})

const storage = multerS3({
    s3: s3,
    bucket: 'lawform',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
        cb(null, 'uploads/' + file.originalname)
    }
})

let upload = multer({ storage: storage }).single('file')
module.exports = upload
