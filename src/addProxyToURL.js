export default (url) => {
  const urlProxyAdded = new URL('get', 'https://hexlet-allorigins.herokuapp.com');
  urlProxyAdded.searchParams.set('disableCache', true);
  urlProxyAdded.searchParams.set('url', url);
  return urlProxyAdded.toString();
};
