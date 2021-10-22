const render = (state, i18next) => {
  const feedsWrapper = document.querySelector('.feeds');
  const { feeds } = state.data;

  const renderFeed = (feed) => `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.feedTitle}</h3>
      <p class="m-0 small text-black-50">
        ${feed.feedDescription}
      </p>
    </li>`;

  const result = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">
          ${i18next.t('feedsHeader')}
        </h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${feeds.map(renderFeed).reverse().join('')}
      </ul>
  </div>`;

  feedsWrapper.innerHTML = result;
};
export default render;
