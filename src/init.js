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

const init = () => {
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

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('input[name=url]');

  const state = {
    form: {
      state: '',
      error: null,
    },
    data: {
      links: [],
      posts: [],
      feed: [],
      hasBeenRead: [],
      feedCount: 0,
      modalId: '',
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
              const parsedData = parseRSS(response.data.contents);
              if (parsedData) {
                let counter = watchedState.data.posts.length + 1;
                const parsedPostsIdAdded = parsedData.posts.map((post) => {
                  const result = post;
                  result.id = counter;
                  counter += 1;
                  return result;
                });
                watchedState.data.feedCount += 1;
                const postsArray = [
                  ...watchedState.data.posts,
                  ...parsedPostsIdAdded,
                ];
                watchedState.data.posts = postsArray;
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
const promise = new Promise((resolve) => resolve());
export default promise.then(init);
