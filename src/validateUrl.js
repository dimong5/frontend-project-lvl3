import * as yup from 'yup';

const validateUrl = (url, links) => {
  const schema = yup.string().required().url().notOneOf(links);
  return schema
    .validate(url);
};
export default validateUrl;
