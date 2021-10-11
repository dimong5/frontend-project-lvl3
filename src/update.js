// import axios from 'axios';
import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parseRSS';

const update = (state) => {
  const { links } = state.data;
  if (links.length !== 0) {
    const requests = links.map((url) => axios.get(
      `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
        url,
      )}`,
    )
      .catch(() => false));
    Promise.all(requests).then((results) => {
      results.forEach((result) => {
        const old = state.data.posts;
        const newParsed = parseRSS(result.data.contents);
        // if (!newParsed) return;
        const { feedLink } = newParsed.feed;
        const oldFilteredByLink = old.filter(
          (post) => post.feedLink === feedLink,
        );
        const diff = newParsed.posts.reduce((acc, post) => {
          const dubbedPosts = oldFilteredByLink.filter((item) => item.title === post.title);
          if (dubbedPosts.length === 0) {
            return [...acc, post];
          }
          return acc;
        }, []);
        if (diff.length !== 0) {
          const diffIdAdded = diff.map((post) => {
            const postWithId = post;
            postWithId.id = _.uniqueId();
            return postWithId;
          });
          state.data.posts.push(...diffIdAdded);
        }
      });
    }).catch(console.log);
  }
  setTimeout(update, 5000, state);
};

export default update;
