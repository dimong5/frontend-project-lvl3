import { find } from 'lodash';

export default (watchedState, i18next, elements, path, value) => {
  const { form } = elements;
  const { input } = elements;
  const { feedback } = elements;
  const { button } = elements;
  const { feedsWrapper } = elements;
  const { postsWrapper } = elements;

  const handleFormState = (state) => {
    switch (state.form.state) {
      case 'valid':
        input.classList.remove('is-invalid');
        feedback.textContent = '';
        form.reset();
        input.focus();
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t(state.form.error);
        break;
      case 'init':
        feedback.textContent = '';
        break;
      default:
        throw new Error('Unknown form.state');
    }
  };

  const handleNetworkState = (state) => {
    switch (state.network.state) {
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

  const renderFeeds = (state) => {
    const { feeds } = state.data;
    const renderFeed = (feed) => `<li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.feedTitle}</h3>
        <p class="m-0 small text-black-50">
          ${feed.feedDescription}
        </p>
      </li>`;

    feedsWrapper.innerHTML = `<div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">
            ${i18next.t('feedsHeader')}
          </h2>
        </div>
        <ul class="list-group border-0 rounded-0">
          ${feeds.map(renderFeed).reverse().join('')}
        </ul>
    </div>`;
  };

  const renderPosts = (state) => {
    const { posts } = state.data;
    const renderPost = (post) => {
      const isOpenedPost = state.uiState.openedPostsIds.has(post.id);
      const font = isOpenedPost ? 'fw-normal' : 'fw-bold';
      return `
      <li class="list-group-item d-flex justify-content-between 
        align-items-start border-0 border-end-0">
      <a href="${post.link}" class="${font}" data-id="${post.id}" target="_blank"
        rel="noopener noreferrer">
        ${post.title}
      </a>
      <button type="button" class="btn btn-outline-primary btn-sm"
        data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">
        ${i18next.t('openModal')}
      </button>
    </li>`;
    };

    const result = `<div class="card border-0">
    <div class="card-body"><h2 class="card-title h4">${i18next.t('postsHeader')}</h2></div>
      <ul class="list-group border-0 rounded-0">
      ${posts.map(renderPost).reverse().join('')}
      </ul>
    </div>`;
    postsWrapper.innerHTML = result;
  };

  const renderModal = (state, postId) => {
    const post = find(state.data.posts, { id: postId });
    const title = document.querySelector('.modal-title');
    const body = document.querySelector('.modal-body');
    const link = document.querySelector('.modal-footer a');
    title.textContent = post.title;
    body.textContent = post.description;
    link.setAttribute('href', post.link);
  };

  switch (path) {
    case 'form.state': handleFormState(watchedState); break;
    case 'data.posts': renderPosts(watchedState); break;
    case 'data.feeds': renderFeeds(watchedState); break;
    case 'network.state': handleNetworkState(watchedState); break;
    case 'uiState.openedPostsIds': renderPosts(watchedState); break;
    case 'modalId': renderModal(watchedState, value); break;
    default: break;
  }
};
