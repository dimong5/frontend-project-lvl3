const parse = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
};

export default parse;
