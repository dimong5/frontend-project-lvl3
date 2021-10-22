import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';
import buildURL from './buildURL';

export default (url, state) => axios
  .get(buildURL(url))
  .then((response) => {
    state.network.state = 'init';
    const parsedData = parseRSS(response.data.contents);
    const parsedPostsIdAdded = parsedData.posts.map((post) => {
      post.id = _.uniqueId();
      post.feedLink = url;
      return post;
    });

    const postsArray = [
      ...state.data.posts,
      ...parsedPostsIdAdded,
    ];

    state.data.posts = postsArray;
    parsedData.feed.feedLink = url;
    state.data.feeds.push(parsedData.feed);
    state.network.state = 'success';
  })
  .catch((networkError) => {
    switch (networkError.message) {
      case 'parse error': state.network.state = 'parserError'; break;
      case 'Network Error': state.network.state = 'networkFailure'; break;
      default: throw new Error(networkError);
    }
  });
