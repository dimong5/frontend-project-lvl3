import onChange from 'on-change';
import render from './renderData';

export default (state, elements) => {
  const { input } = elements;
  const { form } = elements;
  const { feedback } = elements;

  return onChange(state, (path, value) => {
    if (path === 'queryForm.state') {
      switch (value) {
        case 'valid':
          if (input.classList.contains('is-invalid')) {
            input.classList.remove('is-invalid');
          }
          form.reset();
          input.focus();
          break;
        case 'invalid':
          input.classList.add('is-invalid');
          break;
        default:
          throw new Error('Unknown queryForm state');
      }
    }
    if (path === 'errors') {
      feedback.textContent = '';
      const content = state.errors.reduce((acc, error) => {
        if (acc === '') return error;
        return `${acc}\n${error}`;
      }, '');
      feedback.textContent = content;
    }
    if (path === 'parsedData') {
      render(value);
    }
  });
};
