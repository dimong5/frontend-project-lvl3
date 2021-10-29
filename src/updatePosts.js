import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import differenceBy from 'lodash/differenceBy';
import parseRSS from './parseRSS';
import addProxyToURL from './addProxyToURL';

const updatePosts = (state) => {
  const requests = state.data.feeds.map((feed) => axios.get(addProxyToURL(feed.feedLink))
    .then((response) => {
      const newParsed = parseRSS(response.data.contents);
      const newPosts = newParsed
        .posts.map((post) => ({ ...post, id: uniqueId(), feedLink: feed.feedLink }));
      const diff = differenceBy(newPosts, state.data.posts, 'title');
      state.data.posts = state.data.posts.concat(diff);
    })
    .catch(() => null));
  return Promise.all(requests)
    .then(() => setTimeout(updatePosts, 5000, state));
};

export default updatePosts;
