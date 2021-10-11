import 'bootstrap';
import { setLocale } from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import validateUrl from './validateUrl';
import watcher from './view';
import resources from './locales';
import getRSS from './getRSS';
import update from './update';

const init = () => {
  const state = {
    form: {
      state: 'init',
      error: null,
    },
    data: {
      links: [],
      posts: [],
      feeds: [],
      hasBeenRead: [],
      feedCount: 0,
      modalId: '',
    },
    network: {
      state: '',
      error: null,
    },
  };

  const i18nextInstance = i18next.createInstance();
  return i18nextInstance
    .init({
      lng: 'ru',
      resources,
    })
    .then((i18n) => {
      setLocale({
        mixed: {
          required: i18n('errors.emptyField'),
          notOneOf: i18n('errors.alreadyExist'),
        },
        string: {
          url: i18n('errors.notValidURL'),
        },
      });

      const form = document.querySelector('.rss-form');
      const input = document.querySelector('input[name=url]');

      const watchedState = onChange(state, (...params) => {
        watcher(watchedState, i18nextInstance, form, input, ...params);
      });

      update(watchedState);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateUrl(input.value, watchedState.data.links)
          .then((value) => {
            watchedState.form.state = 'init';
            watchedState.form.state = 'valid';
            watchedState.form.error = null;
            return value;
          }).catch((err) => {
            watchedState.form.state = 'init';
            watchedState.form.error = err.errors;
            watchedState.form.state = 'invalid';
          })
          .then((value) => {
            if (watchedState.form.state !== 'valid') return;
            watchedState.network.state = 'loading';
            getRSS(value, watchedState);
          });
      });
    });
};
export default init;
