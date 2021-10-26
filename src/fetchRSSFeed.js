import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';
import buildURL from './buildURL';

export default (url, state) => {
  state.network.state = 'loading';
  axios
    .get(buildURL(url))
    .then((response) => {
      state.network.state = 'init';
      const parsedData = parseRSS(response.data.contents);
      const parsedPostsIdAdded = parsedData.posts.map((post) => {
        post.id = _.uniqueId();
        post.feedLink = url;
        return post;
      });
      state.data.posts = state.data.posts.concat(parsedPostsIdAdded);
      parsedData.feed.feedLink = url;
      state.data.feeds = state.data.feeds.concat(parsedData.feed);
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
