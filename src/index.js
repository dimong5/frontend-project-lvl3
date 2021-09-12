/* eslint-disable no-param-reassign */
import 'bootstrap';
import './scss/styles.scss';
import { setLocale } from 'yup';
import * as yup from 'yup';

import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import watcher from './view.js';
import resources from './locales';
import parseRSS from './parseRSS.js';
import update from './update.js';

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

const form = document.querySelector('form');
const input = document.querySelector('input[name=url]');

const init = () => {
  const state = {
    form: {
      state: '',
      error: null,
    },
    data: {
      links: [],
      posts: [],
      feed: [],
      postCount: 0,
      feedCount: 0,
    },
    network: {
      state: '',
      error: null,
    },
  };

  const watchedState = onChange(state, (...params) => {
    watcher(watchedState, ...params);
  });

  update(watchedState);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(form);
    schema
      .validate(input.value)
      .then((value) => {
        watchedState.form.state = 'init';
        if (watchedState.data.links.findIndex((l) => l === value) !== -1) {
          watchedState.form.error = 'alreadyExist';
          watchedState.form.state = 'invalid';
        } else {
          watchedState.data.links.push(value);
          watchedState.form.state = 'valid';
          watchedState.form.error = null;
        }
        return value;
      })
      .then((value) => {
        if (watchedState.form.state === 'valid') {
          watchedState.network.state = 'loading';
          axios
            .get(
              `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
                value
              )}`
            )
            .then((response) => {
              // console.log(parseRSS(response.data.contents));
              const parsedData = parseRSS(response.data.contents);
              if (parsedData) {
                parsedData.posts.forEach((post) => {
                  post.id = watchedState.data.postCount;
                  post.feedId = parsedData.feed.feedLink;
                  watchedState.data.postCount += 1;
                });
                console.log(parsedData.posts);
                parsedData.feed.id = watchedState.data.feedCount;
                watchedState.data.feedCount += 1;
                watchedState.data.posts = [
                  ...watchedState.data.posts,
                  ...parsedData.posts,
                ];
                watchedState.data.feed = parsedData.feed;
                watchedState.network.state = 'success';
                watchedState.network.state = 'init';
              } else {
                watchedState.network.state = 'parserError';
              }
            })
            .catch((er) => {
              console.log('network error', er);
              watchedState.network.state = 'failed';
            });
        }
      })
      .catch((err) => {
        watchedState.form.state = 'init';
        watchedState.form.error = err.errors;
        console.log('error', watchedState.form.error);
        watchedState.form.state = 'invalid';
      });
  });
};
init();
