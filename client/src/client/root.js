import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../shared/app';

const Root = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default Root;