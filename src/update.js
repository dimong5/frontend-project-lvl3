import axios from 'axios';
import parseRSS from './parseRSS.js';

const update = (watchedState) => {
  const data = watchedState.data.links;
  if (data.length !== 0) {
    const requests = data.map((url) => {
      return axios.get(
        `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
          url
        )}`
      );
    });
    Promise.all(requests).then((results) => {
      results.forEach((result) => {
        const old = watchedState.data.posts;
        const newParsed = parseRSS(result.data.contents);
        const { feedLink } = newParsed.feed;
        const oldFilteredByLink = old.filter(
          (post) => post.feedLink === feedLink
        );
        const diff = newParsed.posts.reduce((acc, post) => {
          const dubbedPosts = oldFilteredByLink.filter((item) => {
            return item.title === post.title;
          });
          if (dubbedPosts.length === 0) {
            return [...acc, post];
          }
          return acc;
        }, []);
        if (diff.length !== 0) {
          watchedState.data.posts.push(...diff);
        }
      });
    });
  }
  setTimeout(update, 5000, watchedState);
};

export default update;
