const render = (data) => {
  const postsWrapper = document.querySelector('.posts');
  const feedsWrapper = document.querySelector('.feeds');

  const { feed } = data;
  const { posts } = data;

  const templatePosts = `<div class="card border-0">
      <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
        <ul class="list-group border-0 rounded-0">
        </ul>
      </div>`;
  const templateFeeds = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">
          Фиды
        </h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
  </div>`;
  if (!postsWrapper.hasChildNodes()) {
    postsWrapper.innerHTML = templatePosts;
  }
  if (!feedsWrapper.hasChildNodes()) {
    feedsWrapper.innerHTML = templateFeeds;
  }

  const ulPosts = document.querySelector('.posts ul');
  const ulFeeds = document.querySelector('.feeds ul');

  ulFeeds.innerHTML += `<li class="list-group-item border-0 border-end-0">
  <h3 class="h6 m-0">${feed.feedTitle}</h3>
    <p class="m-0 small text-black-50">
      ${feed.feedDescription}
    </p>
</li>`;

  posts.forEach((post) => {
    const postString = `
    <li class="list-group-item d-flex justify-content-between 
      align-items-start border-0 border-end-0">
    <a href="${post.link}" class="fw-bold" data-id="${post.index}" target="_blank"
      rel="noopener noreferrer">
      ${post.title}
    </a>
    <button type="button" class="btn btn-outline-primary btn-sm"
      data-id="2" data-bs-toggle="modal" data-bs-target="#modal">
      Просмотр
    </button>
  </li>`;
    ulPosts.innerHTML += postString;
  });
};
export default render;
