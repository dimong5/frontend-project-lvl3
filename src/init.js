import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import watcher from './view';
import resources from './locales';
import fetchRSSFeed from './fetchRSSFeed';
import updatePosts from './updatePosts';

const validateUrl = (url, usedUrls) => {
  const schema = yup.string().required().url().notOneOf(usedUrls);
  return schema
    .validate(url);
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
    modalPostId: '',
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
      yup.setLocale(resources.yupLocales);

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name=url]'),
        feedback: document.querySelector('p.feedback'),
        button: document.querySelector('button[type="submit"]'),
        feedsWrapper: document.querySelector('.feeds'),
        postsWrapper: document.querySelector('.posts'),
      };

      const watchedState = watcher(state, i18nextInstance, elements);

      const updateDelay = 5000;
      setTimeout(() => updatePosts(watchedState, updateDelay), updateDelay);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const links = watchedState.data.feeds.map((feed) => feed.link);
        validateUrl(elements.input.value, links)
          .then((value) => {
            watchedState.form.state = 'valid';
            watchedState.form.error = null;
            fetchRSSFeed(value, watchedState);
          }).catch((err) => {
            watchedState.form.error = err.message.key;
            watchedState.form.state = 'invalid';
          }).then(() => {
            watchedState.form.state = 'init';
            watchedState.form.error = null;
          });
      });
      elements.postsWrapper.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-id')) {
          const postId = e.target.dataset.id;
          watchedState.modalPostId = postId;
          watchedState.uiState.openedPostsIds.add(postId);
        }
      });
    });
};
export default init;
