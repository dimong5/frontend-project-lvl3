import 'bootstrap';
import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import watcher from './view';
import resources from './locales';
import fetchRSSFeed from './fetchRSSFeed';
import updatePosts from './update';

const validateUrl = (url, links) => {
  const schema = yup.string().required().url().notOneOf(links);
  return schema
    .validate(url);
};

const form = document.querySelector('.rss-form');
const input = document.querySelector('input[name=url]');
const feedback = document.querySelector('p.feedback');
const button = document.querySelector('button[type="submit"]');
const feedsWrapper = document.querySelector('.feeds');
const postsWrapper = document.querySelector('.posts');

const elements = {
  form,
  input,
  feedback,
  button,
  feedsWrapper,
  postsWrapper,
};

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
      posts: [],
      feeds: [],
    },
    modalId: '',
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
      yup.setLocale(resources.locales);

      const watchedState = onChange(state, (path, value) => {
        watcher(watchedState, i18nextInstance, elements, path, value);
      });

      updatePosts(watchedState);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const links = watchedState.data.feeds.map((feed) => feed.feedLink);
        watchedState.form.state = 'init';
        watchedState.form.error = null;
        validateUrl(input.value, links)
          .then((value) => {
            watchedState.form.state = 'valid';
            watchedState.form.error = null;
            fetchRSSFeed(value, watchedState);
          }).catch((err) => {
            watchedState.form.error = err.message.key;
            watchedState.form.state = 'invalid';
          });
      });
      postsWrapper.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) return;
        const postId = e.target.dataset.id;
        watchedState.modalId = postId;
        watchedState.uiState.openedPostsIds.add(postId);
      });
    });
};
export default init;
