const render = (state) => {
  const feedsWrapper = document.querySelector('.feeds');

  const { feed } = state.data;

  const templateFeeds = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">
          Фиды
        </h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
  </div>`;

  if (!feedsWrapper.hasChildNodes()) {
    feedsWrapper.innerHTML = templateFeeds;
  }

  const ulFeeds = document.querySelector('.feeds ul');

  ulFeeds.innerHTML += `<li class="list-group-item border-0 border-end-0">
  <h3 class="h6 m-0">${feed.feedTitle}</h3>
    <p class="m-0 small text-black-50">
      ${feed.feedDescription}
    </p>
</li>`;
};
export default render;
