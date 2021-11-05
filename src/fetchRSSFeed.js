import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import parseRSS from './parseRSS';
import addProxyToURL from './addProxyToURL';

const getErrorType = (err) => {
  if (err.isAxiosError) {
    return 'networkError';
  }
  if (err.isParserError) {
    return 'parserError';
  }
  return 'unknownError';
};

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
      state.network.error = getErrorType(error);
      state.network.state = 'failure';
    });
};
