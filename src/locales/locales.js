export default {
  mixed: {
    required: () => ({ key: 'errors.emptyField' }),
    notOneOf: () => ({ key: 'errors.alreadyExist' }),
  },
  string: {
    url: () => ({ key: 'errors.notValidURL' }),
  },
};
