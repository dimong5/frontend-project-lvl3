import 'bootstrap';
import './scss/styles.scss';
import onChange from 'on-change';

const engine = () => {
  const state = {
    queryForm: {
      state: 'valid',
      data: [],
    },
    errors: [],
  };
  const watchedState = onChange(state, (path, value) => {
    if (path === 'queryForm.data') {
      console.log(value);
    }
    if (path === 'queryForm.state') {
      switch (value) {
        case 'valid':
          console.log(value);
          break;
        case 'filling':
          console.log(value);
          break;
        default:
          throw new Error('Unknown queryForm state');
      }
    }
  });
  const form = document.querySelector('form');
  const queryField = form.elements.url;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.queryForm.data.push(form.elements.url.value);
  });
  queryField.addEventListener('input', () => {
    watchedState.queryForm.state = 'filling';
  });
};
engine();
