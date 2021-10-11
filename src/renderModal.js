import { find } from 'lodash';

export default (state, postId) => {
  // const post = find(state.data.posts, { id: Number(postId) });
  const post = find(state.data.posts, { id: postId });
  const title = document.querySelector('.modal-title');
  const body = document.querySelector('.modal-body');
  const link = document.querySelector('.modal-footer a');
  title.textContent = post.title;
  body.textContent = post.description;
  link.setAttribute('href', post.link);
};
