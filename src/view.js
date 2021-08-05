import onChange from 'on-change';

export default (state, elements) => {
  const { input } = elements;
  const { form } = elements;

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
  });
};
