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
      console.log(error.isAxiosError, error);
      if (error.isAxiosError) {
        state.network.error = 'networkError';
      }
      if (error.isParserError) {
        state.network.error = 'parserError';
      } else {
        state.network.error = 'unknownError';
      }
      state.network.state = 'failure';
    });
};
