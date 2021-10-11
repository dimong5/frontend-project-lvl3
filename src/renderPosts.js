const renderPosts = (watchedState, i18next) => {
  const state = watchedState;
  const { posts } = state.data;
  const { hasBeenRead } = state.data;
  const postsWrapper = document.querySelector('.posts');
  const templatePosts = `<div class="card border-0">
  <div class="card-body"><h2 class="card-title h4">${i18next.t('postsHeader')}</h2></div>
    <ul class="list-group border-0 rounded-0">
    </ul>
  </div>`;
  postsWrapper.innerHTML = templatePosts;
  const ulPosts = document.querySelector('.posts ul');

  posts.forEach((post) => {
    let font;
    if (hasBeenRead.indexOf(String(post.id)) !== -1) {
      font = 'fw-normal';
    } else {
      font = 'fw-bold';
    }
    const postString = `
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
    ulPosts.innerHTML = postString + ulPosts.innerHTML;
  });
  const postsDOM = document.querySelectorAll('.posts li');
  postsDOM.forEach((post) => {
    const button = post.querySelector('button');

    button.addEventListener('click', (e) => {
      const postId = e.target.dataset.id;
      state.data.modalId = postId;
      if (state.data.hasBeenRead.indexOf(postId) === -1) {
        state.data.hasBeenRead.push(postId);
      }
    });
  });
};
export default renderPosts;
