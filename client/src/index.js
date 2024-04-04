import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
// import './scss/fonts.scss';
import Root from './client/root';
import * as serviceWorker from './serviceWorker';

import Devcheck from './devcheck';
import Cookies from 'js-cookie';
import Api from './utils/apiutil.js';

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
