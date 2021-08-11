const render = (data) => {
  console.log(data);
  // console.log(value.querySelector('channel'));
  const posts = document.querySelector('.posts');
  const feeds = document.querySelector('.feeds');

  if (posts.innerHTML === '') {
    const ulPosts = document.createElement('ul');
    posts.appendChild(ulPosts);
  }
  if (feeds.innerHTML === '') {
    const ulFeeds = document.createElement('ul');
    feeds.appendChild(ulFeeds);
  }

  const ulPosts = document.querySelector('.posts ul');
  const ulFeeds = document.querySelector('.feeds ul');

  const postItems = data.querySelectorAll('item');

  const feedTitle = data.querySelector('channel > title');
  const feedDescription = data.querySelector('channel > description');

  const liFeed = document.createElement('li');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  h3.textContent = feedTitle.textContent;
  p.textContent = feedDescription.textContent;
  liFeed.appendChild(h3);
  liFeed.appendChild(p);

  ulFeeds.appendChild(liFeed);

  postItems.forEach((postItem) => {
    // console.log(title, title.textContent);
    const title = postItem.querySelector('title');
    const link = postItem.querySelector('link');
    const a = document.createElement('a');
    a.href = link.textContent;
    a.textContent = title.textContent;

    const li = document.createElement('li');
    li.appendChild(a);
    ulPosts.appendChild(li);
  });
};
export default render;
