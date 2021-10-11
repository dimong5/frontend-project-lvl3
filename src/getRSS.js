import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';

export default (url, state) => axios
  .get(
    `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`,
  )
  .then((response) => {
    state.network.state = 'init';
    const parsedData = parseRSS(response.data.contents);
    const parsedPostsIdAdded = parsedData.posts.map((post) => {
      const result = post;
      result.id = _.uniqueId();
      return result;
    });
    const postsArray = [
      ...state.data.posts,
      ...parsedPostsIdAdded,
    ];
    state.data.posts = postsArray;
    state.data.feeds.push(parsedData.feed);
    state.network.state = 'success';
    state.data.links.push(url);
  })
  .catch((networkError) => {
    if (networkError.message === 'parse error') {
      state.network.state = 'parserError';
    } else {
      state.network.state = 'networkFailure';
    }
  });
