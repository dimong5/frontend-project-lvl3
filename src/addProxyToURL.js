export default (url) => new URL(
  `/get?disableCache=true&url=${encodeURIComponent(url)}`,
  'https://hexlet-allorigins.herokuapp.com',
);
