// import i18next from 'i18next';
import renderPosts from './renderPosts';
import renderFeed from './renderFeed';
import renderModal from './renderModal';

export default (state, i18next, form, input, ...params) => {
  const feedback = document.querySelector('p.feedback');
  const button = document.querySelector('button[type="submit"]');

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
        feedback.textContent = state.form.error;
        break;
      case 'init':
        feedback.textContent = '';
        break;
      default:
        throw new Error('Unknown form.state');
    }
  };

  const handleNetworkState = (value) => {
    switch (value) {
      case 'loading':
        feedback.textContent = '';
        input.setAttribute('readonly', 'readonly');
        button.disabled = true;
        break;
      case 'success':
        input.removeAttribute('readonly');
        button.disabled = false;
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18next.t('loaded');
        break;
      case 'networkFailure':
        input.removeAttribute('readonly');
        button.disabled = false;
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t('errors.loadError');
        break;
      case 'parserError':
        input.removeAttribute('readonly');
        feedback.classList.remove('text-success');
        button.disabled = false;
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t('errors.parserError');
        break;
      case 'init':
        feedback.textContent = '';
        break;
      default:
        throw new Error('unknown network state');
    }
  };

  const path = params[0];
  const value = params[1];
  switch (path) {
    case 'form.state': handleFormState(value); break;
    case 'data.posts': renderPosts(state, i18next); break;
    case 'data.feeds': renderFeed(state, i18next); break;
    case 'network.state': handleNetworkState(value); break;
    case 'data.hasBeenRead': renderPosts(state, i18next); break;
    case 'data.modalId': renderModal(state, value); break;
    default: break;
  }
};
