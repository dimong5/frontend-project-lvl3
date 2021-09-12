const handlePostsChange = (posts) => {
  const postsWrapper = document.querySelector('.posts');
  // const { posts } = state.data;
  const templatePosts = `<div class="card border-0">
  <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
    <ul class="list-group border-0 rounded-0">
    </ul>
  </div>`;
  if (!postsWrapper.hasChildNodes()) {
    postsWrapper.innerHTML = templatePosts;
  }
  const ulPosts = document.querySelector('.posts ul');

  posts.forEach((post) => {
    // postCount += 1;
    const postString = `
  <li class="list-group-item d-flex justify-content-between 
    align-items-start border-0 border-end-0">
  <a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank"
    rel="noopener noreferrer">
    ${post.title}
  </a>
  <button type="button" class="btn btn-outline-primary btn-sm"
    data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">
    Просмотр
  </button>
</li>`;
    ulPosts.innerHTML = postString + ulPosts.innerHTML;
  });
};
export default handlePostsChange;
