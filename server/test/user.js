var user = require('../models/user');
/*
let jwt = require('jsonwebtoken');
jwt.sign(
    {
        nickname: '뚱빵이',
        userid: 'Hello'
    },
    'secretami',
    {
        expiresIn: '1m',
        subject: 'userinfo'
    },
    (err, tok  en) => {
        if (err) console.log(err);
        console.log(token);
    }
);

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Iuuaseu5teydtCIsInVzZXJpZCI6IkhlbGxvIiwiaWF0IjoxNTUwMDI4MjEyLCJleHAiOjE1NTAwMjgyNzIsInN1YiI6InVzZXJpbmZvIn0.VZbRQP_FjVycCVYpuCabU27EHKLpouEbUAYhClbteSc';
jwt.verify(token, 'secretmi', (err, decoded) => {
    if (err) console.log(err);
    console.log(decoded);
});*/


let registerInfo = {
    login_id : 'iwananid',
    email : 'csh@amicuslex.net',
    password : 'abc123'
};
/*
user.register(registerInfo).then((msg) => {
    console.log(msg);
}).catch((err)=> {
    console.log(err);
});*/
/*
user.checkLogin('', 'csh@amicuslex.net', 'abc123').then((msg) => {
    console.log(msg);
}).catch((err) => {
    console.log(err);
});*/

user.getUserInfoByIdusers(1).then((msg)=> {
    console.log(msg);
}).catch((err)=> {
    console.log(err);
});
/*
var db = require('./utils/rdb');

async function hello () {
    await db.query("SELECT * FROM user LIMIT 2").then((rows)=> {
        console.log('accept');
        console.log(rows);

    }).catch((err)=> {
        //console.log(err);
        console.log('error');

    });
    console.log(`hello`);
};

hello();
*/