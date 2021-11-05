export default (xmlString) => {
  const parser = new DOMParser();
  const xmlTree = parser.parseFromString(xmlString, 'application/xml');
  const parserError = xmlTree.querySelector('parsererror');
  if (parserError) {
    const error = new Error(parserError.textContent);
    error.isParserError = true;
    throw error;
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
