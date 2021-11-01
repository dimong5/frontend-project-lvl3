import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import parseRSS from './parseRSS';
import addProxyToURL from './addProxyToURL';

export default (url, state) => {
  state.network.state = 'loading';
  return axios
    .get(addProxyToURL(url))
    .then((response) => {
      const parsedData = parseRSS(response.data.contents);
      const posts = parsedData.items
        .map((item) => ({ ...item, id: uniqueId(), feedLink: url }));
      state.data.posts = posts.concat(state.data.posts);
      const { description, title } = parsedData;
      state.data.feeds = [{ ...{ description, title }, link: url }]
        .concat(state.data.feeds);
      state.network.state = 'success';
    })
    .catch((error) => {
      switch (error.message) {
        case 'Parser Error': state.network.error = 'parserError'; break;
        case 'Network Error': state.network.error = 'networkError'; break;
        default: state.network.error = 'unknownError';
      }
      state.network.state = 'failure';
    });
};
