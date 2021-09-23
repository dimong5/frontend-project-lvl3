import init from './init.js';

const runApp = () => {
  const promise = new Promise(() => init());
  return promise;
};
runApp();
