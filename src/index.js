import 'bootstrap';
import './scss/styles.scss';
import { setLocale } from 'yup';
import * as yup from 'yup';

import i18next from 'i18next';
import axios from 'axios';
import watcher from './view.js';
import resources from './locales';
import parseRSS from './parseRSS.js';

i18next.init({
  lng: 'ru',
  resources,
});

setLocale({
  mixed: {
    required: i18next.t('errors.emptyField'),
  },
  string: {
    url: i18next.t('errors.notValidURL'),
  },
});

const schema = yup.string().required().url();

const engine = () => {
  const state = {
    parsedData: '',
    responseData: '',
    responseState: '',
    queryForm: {
      state: 'valid',
      data: [],
    },
    errors: '',
  };

  const form = document.querySelector('form');
  const feedback = document.querySelector('p.feedback');
  const input = document.querySelector('input[name=url]');

  const watchedState = watcher(state, { input, form, feedback });
  form.addEventListener('submit', (e) => {
    watchedState.errors = '';
    e.preventDefault();
    schema
      .validate(input.value)
      .then((value) => {
        const indexURL = watchedState.queryForm.data.indexOf(value);
        if (watchedState.queryForm.data.indexOf(value) !== -1) {
          watchedState.errors = i18next.t('errors.alreadyExist');
          watchedState.queryForm.state = 'invalid';
        } else {
          watchedState.queryForm.data.push(value);
          watchedState.queryForm.state = 'valid';
          axios
            .get(
              `https://api.allorigins.win/get?disableCache=true&url=${encodeURIComponent(
                value
              )}`
            )
            .then((response) => {
              const data = parseRSS(response.data.contents);
              if (data) {
                watchedState.responseState = 'valid';
                watchedState.parsedData = parseRSS(response.data.contents);
              } else {
                console.log(indexURL);
                watchedState.queryForm.data.splice(indexURL, 1);
                watchedState.responseState = 'parserError';
              }
            })
            .catch((error) => {
              console.log(error);
              watchedState.queryForm.data.splice(indexURL, 1);
              watchedState.responseState = 'invalid';
            });
        }
      })
      .catch((err) => {
        watchedState.errors = err.errors;
        watchedState.queryForm.state = 'invalid';
      });
    console.log(watchedState);
    watchedState.responseState = 'initial';
  });
};
engine();
