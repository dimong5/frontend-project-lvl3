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
    queryForm: {
      state: 'valid',
      data: [],
    },
    errors: [],
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input[name=url]');
  const feedback = document.querySelector('p.feedback');
  // console.log(feedback);

  const watchedState = watcher(state, { input, form, feedback });
  form.addEventListener('submit', (e) => {
    watchedState.errors = [];
    e.preventDefault();
    schema
      .validate(input.value)
      .then((value) => {
        if (watchedState.queryForm.data.indexOf(value) !== -1) {
          watchedState.errors.push(i18next.t('errors.alreadyExist'));
          watchedState.queryForm.state = 'invalid';
        } else {
          watchedState.queryForm.data.push(value);
          watchedState.queryForm.state = 'valid';
        }
      })
      .catch((err) => {
        watchedState.errors.push(...err.errors);
        watchedState.queryForm.state = 'invalid';
      });
    console.log(input.value);
    axios
      .get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(input.value)}`
      )
      .then((response) => {
        console.log(response.data.contents);
        watchedState.parsedData = parseRSS(response.data.contents);
      })
      .catch((error) => console.log(error));
  });
};
engine();
