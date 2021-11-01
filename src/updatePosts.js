import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import differenceBy from 'lodash/differenceBy';
import parseRSS from './parseRSS';
import addProxyToURL from './addProxyToURL';

const updatePosts = (state, updateDelay) => {
  const requests = state.data.feeds.map((feed) => axios.get(addProxyToURL(feed.link))
    .then((response) => {
      const parsedData = parseRSS(response.data.contents);
      const posts = parsedData.items
        .map((item) => ({ ...item, id: uniqueId(), feedLink: feed.link }));
      const diff = differenceBy(posts, state.data.posts, 'title');
      state.data.posts = diff.concat(state.data.posts);
    })
    .catch(() => null));
  return Promise.all(requests)
    .then(() => setTimeout(updatePosts, updateDelay, state));
};

export default updatePosts;
