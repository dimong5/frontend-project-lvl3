// import axios from 'axios';
import _ from 'lodash';
import getRSS from './getRSS';
import parseRSS from './parseRSS';

const update = (watchedState) => {
  const data = watchedState.data.links;
  if (data.length !== 0) {
    const requests = data.map((url) => getRSS(url)
      .catch(() => false));
    Promise.all(requests).then((results) => {
      results.forEach((result) => {
        const old = watchedState.data.posts;
        const newParsed = parseRSS(result.data.contents);
        if (!newParsed) return;
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
          watchedState.data.posts.push(...diffIdAdded);
        }
      });
    });
  }
  setTimeout(update, 5000, watchedState);
};

export default update;
