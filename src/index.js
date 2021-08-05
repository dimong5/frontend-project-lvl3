import 'bootstrap';
import './scss/styles.scss';
import * as yup from 'yup';

import watcher from './view.js';

const schema = yup.string().required().url();

const engine = () => {
  const state = {
    queryForm: {
      state: 'valid',
      data: [],
    },
    errors: [],
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input[name=url]');

  const watchedState = watcher(state, { input, form });
  form.addEventListener('submit', (e) => {
    watchedState.errors = [];
    e.preventDefault();
    schema
      .validate(input.value)
      .then((value) => {
        if (watchedState.queryForm.data.indexOf(value) !== -1) {
          watchedState.queryForm.state = 'invalid';
          watchedState.errors.push('RSS уже существует');
        } else {
          watchedState.queryForm.data.push(value);
          watchedState.queryForm.state = 'valid';
        }
        console.log('watchedState', watchedState);
      })
      .catch((err) => {
        watchedState.errors.push(err.errors);
        watchedState.queryForm.state = 'invalid';
      });
  });
};
engine();
