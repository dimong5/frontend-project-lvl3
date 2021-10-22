import 'bootstrap';
import { setLocale } from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import _ from 'lodash';
import * as yup from 'yup';
import watcher from './view';
import resources from './locales';
import getRSS from './getRSS';
import updatePosts from './update';

const init = () => {
  const state = {
    form: {
      state: 'init',
      error: null,
    },
    uiState: {
      openedPostsIds: new Set(),
    },
    data: {
      links: [],
      posts: [],
      feeds: [],
      modalId: '',
    },
    network: {
      state: 'init',
      error: null,
    },
  };

  const i18nextInstance = i18next.createInstance();
  return i18nextInstance
    .init({
      lng: 'ru',
      resources,
    })
    .then(() => {
      setLocale(resources.locales);

      const form = document.querySelector('.rss-form');
      const input = document.querySelector('input[name=url]');

      const watchedState = onChange(state, (...params) => {
        watcher(watchedState, i18nextInstance, form, input, ...params);
      });

      const validateUrl = (url, links) => {
        const schema = yup.string().required().url().notOneOf(links);
        return schema
          .validate(url);
      };

      updatePosts(watchedState);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const links = _.uniq(watchedState.data.posts.map((post) => post.feedLink));
        watchedState.form.state = 'init';
        watchedState.form.error = null;
        validateUrl(input.value, links)
          .then((value) => {
            watchedState.form.state = 'valid';
            watchedState.form.error = null;
            watchedState.network.state = 'loading';
            getRSS(value, watchedState);
          }).catch((err) => {
            watchedState.form.error = err.message;
            watchedState.form.state = 'invalid';
          });
      });
    });
};
export default init;
