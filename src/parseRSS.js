export default (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  if (xmlTree.querySelector('parsererror')) {
    throw new Error('Parser Error');
  }
  const items = [...xmlTree.querySelectorAll('item')];
  const feedTitle = xmlTree.querySelector('channel > title').textContent;
  const feedDescription = xmlTree.querySelector(
    'channel > description',
  ).textContent;

  const posts = items.map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return {
      title, link, description,
    };
  });
  return { feed: { feedTitle, feedDescription }, posts };
};
