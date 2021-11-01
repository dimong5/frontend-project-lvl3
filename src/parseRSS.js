export default (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  if (xmlTree.querySelector('parsererror')) {
    throw new Error('Parser Error');
  }
  const itemsDOM = [...xmlTree.querySelectorAll('item')];
  const title = xmlTree.querySelector('channel > title').textContent;
  const description = xmlTree.querySelector(
    'channel > description',
  ).textContent;

  const items = itemsDOM.map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));
  return { title, description, items };
};
