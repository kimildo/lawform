const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        req.userinfo = null
        return next()
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if (err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (error) => {
        req.userinfo = '123123'
        //console.log(req.userinfo);
        return next()
    }

    p.then((decoded) => {
        //console.log('token decode', decoded )
        req.userinfo = decoded
        return next()
    }).catch(onError)
}

module.exports = authMiddleware
