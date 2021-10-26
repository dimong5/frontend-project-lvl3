import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';
import buildURL from './buildURL';

const updatePosts = (state) => {
  const requests = state.data.feeds.map((feed) => axios.get(buildURL(feed.feedLink))
    .then((response) => {
      const newParsed = parseRSS(response.data.contents);
      const newPosts = newParsed.posts.map((post) => {
        post.id = _.uniqueId();
        post.feedLink = feed.feedLink;
        return post;
      });
      newParsed.feed.feedLink = feed.feedLink;
      const diff = _.differenceBy(newPosts, state.data.posts, 'title');
      state.data.posts = state.data.posts.concat(diff);
    })
    .catch((e) => ({ result: 'error', error: e })));
  return Promise.all(requests)
    .then(() => setTimeout(updatePosts, 5000, state));
};

export default updatePosts;
