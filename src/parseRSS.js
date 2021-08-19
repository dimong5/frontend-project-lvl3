const parse = (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  if (xmlTree.querySelector('parsererror')) {
    return false;
  }
  const postItems = [...xmlTree.querySelectorAll('item')];
  const feedTitle = xmlTree.querySelector('channel > title').textContent;
  const feedDescription = xmlTree.querySelector(
    'channel > description'
  ).textContent;

  const posts = postItems.reduce((acc, postItem, index) => {
    const title = postItem.querySelector('title').textContent;
    const link = postItem.querySelector('link').textContent;
    const description = postItem.querySelector('description').textContent;
    return [...acc, { title, link, description, index }];
  }, []);

  console.log({ feed: { feedTitle, feedDescription }, posts });
  return { feed: { feedTitle, feedDescription }, posts };
};

export default parse;
