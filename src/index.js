import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Demo from './table';
import * as serviceWorker from './serviceWorker';

let directory = "./config";

let Settings = "hi";

fetch('./../settings.json')
.then(res => {
    console.log("res");
    console.log(res);
    Settings = "test";
})
.then(env => ReactDOM.render(<Demo directory={directory} settings={Settings}/>, document.getElementById('root')));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
