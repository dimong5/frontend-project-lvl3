export default (url) => {
  const urlProxyAdded = new URL('https://hexlet-allorigins.herokuapp.com/get?');
  urlProxyAdded.searchParams.set('disableCache', 'true');
  urlProxyAdded.searchParams.set('url', url);
  return urlProxyAdded;
};
