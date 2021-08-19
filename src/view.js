import i18next from 'i18next';
import onChange from 'on-change';
import render from './renderData';

export default (state, elements) => {
  const { input } = elements;
  const { form } = elements;
  const { feedback } = elements;

  const handleFeedback = (message, warning) => {
    if (warning) {
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
    } else {
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
    }
    feedback.textContent = message;
  };

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
      handleFeedback(state.errors, true);
      console.log('state.errors', state.errors);
      // const content = state.errors.reduce((acc, error) => {
      //   if (acc === '') return error;
      //   return `${acc}\n${error}`;
      // }, '');
      // feedback.textContent = content;
      // feedback.textContent = state.errors;
    }
    if (path === 'parsedData') {
      render(value);
    }
    if (path === 'responseState') {
      if (value === 'valid') {
        handleFeedback(i18next.t('loaded'), false);
      }
      if (value === 'invalid') {
        handleFeedback(i18next.t('errors.loadError'), true);
      }
      if (value === 'parserError') {
        handleFeedback(i18next.t('errors.parserError'), true);
      }
      if (value === 'initial') {
        handleFeedback('', true);
      }
    }
  });
};
