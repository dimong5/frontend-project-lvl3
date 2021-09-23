import runApp from './init.js';

const promise = new Promise((resolve) => resolve());
promise.then(() => runApp());
// runApp();
