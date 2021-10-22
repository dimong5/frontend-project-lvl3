// import axios from 'axios';
import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';
import buildURL from './buildURL';

const updatePosts = (state) => {
  const links = _.uniq(state.data.posts.map((post) => post.feedLink));
  if (links.length !== 0) {
    const requests = links.map((url) => axios.get(buildURL(url))
      .catch(() => false));
    Promise.all(requests).then((results) => {
      results.forEach((result, i) => {
        const old = state.data.posts;
        const newParsed = parseRSS(result.data.contents);
        newParsed.feed.feedLink = links[i];
        const { feedLink } = newParsed.feed;
        const newParsedIdAdded = newParsed.posts.map((post) => {
          post.id = _.uniqueId();
          post.feedLink = feedLink;
          return post;
        });
        const oldAndNewMerged = _.uniqBy([...old, ...newParsedIdAdded], 'title');
        const diff = _.differenceBy(oldAndNewMerged, old, 'title');
        state.data.posts.push(...diff);
      });
    });
  }
  setTimeout(updatePosts, 5000, state);
};

export default updatePosts;
