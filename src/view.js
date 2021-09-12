import i18next from 'i18next';
import _ from 'lodash';
import renderPosts from './renderPosts';
import renderFeed from './renderFeed';

export default (state, ...params) => {
  const form = document.querySelector('form');
  const feedback = document.querySelector('p.feedback');
  const input = document.querySelector('input[name=url]');

  const handleFormState = (value) => {
    switch (value) {
      case 'valid':
        input.classList.remove('is-invalid');
        feedback.textContent = '';
        form.reset();
        input.focus();
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        if (state.form.error === 'alreadyExist') {
          feedback.textContent = i18next.t(`errors.${state.form.error}`);
        } else {
          feedback.textContent = state.form.error;
        }
        break;
      default:
        console.log('init state');
    }
  };

  const handleNetworkState = (value) => {
    switch (value) {
      case 'loading':
        feedback.textContent = '';
        break;
      case 'success':
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18next.t('loaded');
        break;
      case 'failed':
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t('errors.loadError');
        break;
      case 'parserError':
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t('errors.parserError');
        break;
      default:
        console.log('unknown network state');
    }
  };

  const path = params[0];
  const value = params[1];
  const previousValue = params[2];
  if (path === 'form.state') handleFormState(value);
  if (path === 'data.posts') {
    const feedId = value[value.length - 1].feedLink;
    const previousValueFiltered = previousValue.filter(
      ({ feedLink }) => feedLink === feedId
    );
    const valueFiltered = value.filter(({ feedLink }) => feedLink === feedId);
    const diff = _.differenceBy(valueFiltered, previousValueFiltered, 'title');
    renderPosts(diff);
  }
  if (path === 'data.feed') {
    renderFeed(state);
  }
  if (path === 'network.state') {
    handleNetworkState(value);
  }
};
