const parse = (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  if (xmlTree.querySelector('parsererror')) {
    return false;
  }
  const postItems = [...xmlTree.querySelectorAll('item')];
  const feedTitle = xmlTree.querySelector('channel > title').textContent;
  const feedLink = xmlTree.querySelector('channel > link').textContent;
  const feedDescription = xmlTree.querySelector(
    'channel > description'
  ).textContent;

  const posts = postItems.reduce((acc, postItem) => {
    const title = postItem.querySelector('title').textContent;
    const link = postItem.querySelector('link').textContent;
    const description = postItem.querySelector('description').textContent;
    return [...acc, { title, link, description, feedLink }];
  }, []);
  return { feed: { feedTitle, feedDescription, feedLink }, posts };
};

export default parse;
