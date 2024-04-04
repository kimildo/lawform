import React from 'react';
import jQuery from "jquery";
import Api from './utils/apiutil.js';
import Cookies from 'js-cookie';
import 'scss/common/devcheck.scss';

window.$ = window.jQuery = jQuery;

function handleSubmit (event) {
  event.preventDefault();

  var param = {};
  param['userid'] = window.$("#userid").val();
  param['password'] = window.$("#password").val();
  Api.sendPost('/user/devlogin', param).then((res) => {
      console.log(  res )
    let status = res.data.status;
    if( status === "ok") {
        let token = res.data.token;
        if( token ) Cookies.set('devToken', token);
        window.location.href = window.location.href.split('#')[0];
    }
     else {
        window.location.reload();
    }
  })
}

const Devcheck = () => (
  <div className="devcheck">
    <div className="devcheck_box">
      <div className="title">login</div>
      <form method="post"  onSubmit={handleSubmit}>
      <div><label>username</label><input type='text' name='userid' id='userid' /></div>
      <div><label>password</label><input type='password' name='password' id='password' /></div>
      <div>
        <button type='submit' >Login</button>
      </div>
      </form>
    </div>
  </div>

);

export default Devcheck;