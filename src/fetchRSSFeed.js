import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import parseRSS from './parseRSS';
import addProxyToURL from './addProxyToURL';

export default (url, state) => {
  state.network.state = 'loading';
  axios
    .get(addProxyToURL(url))
    .then((response) => {
      state.network.state = 'init';
      const parsedData = parseRSS(response.data.contents);
      const parsedPostsIdAdded = parsedData.posts
        .map((post) => ({ ...post, id: uniqueId(), feedLink: url }));
      state.data.posts = state.data.posts.concat(parsedPostsIdAdded);
      state.data.feeds = state.data.feeds.concat({ ...parsedData.feed, feedLink: url });
      state.network.state = 'success';
    })
    .catch((error) => {
      switch (error.message) {
        case 'parse error': state.network.state = 'parserError'; break;
        case 'Network Error': state.network.state = 'networkFailure'; break;
        default: throw new Error(error);
      }
    });
};
