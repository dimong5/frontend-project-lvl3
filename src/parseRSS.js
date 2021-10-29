export default (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  if (xmlTree.querySelector('parsererror')) {
    throw new Error('parse error');
  }
  const postItems = [...xmlTree.querySelectorAll('item')];
  const feedTitle = xmlTree.querySelector('channel > title').textContent;
  const feedDescription = xmlTree.querySelector(
    'channel > description',
  ).textContent;

  const posts = postItems.map((postItem) => {
    const title = postItem.querySelector('title').textContent;
    const link = postItem.querySelector('link').textContent;
    const description = postItem.querySelector('description').textContent;
    return {
      title, link, description,
    };
  });
  return { feed: { feedTitle, feedDescription }, posts };
};
