import 'bootstrap';
import './scss/styles.scss';
import onChange from 'on-change';
import * as yup from 'yup';

const schema = yup.string().required().url();
const input = document.querySelector('input');
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
      // console.log(schema.validateSync(value[value.length - 1]));
    }
    if (path === 'queryForm.state') {
      switch (value) {
        case 'valid':
          console.log('valid');
          if (input.classList.contains('is-invalid'))
            input.classList.remove('is-invalid');
          break;
        case 'invalid':
          console.log('invalid');

          input.classList.add('is-invalid');
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
    const validation = schema
      .validate(queryField.value)
      .then((value) => {
        watchedState.queryForm.state = 'valid';
      })
      .catch((e) => console.log(e));
    if (validation === queryField.value) {
      watchedState.queryForm.state = 'valid';
    } else {
      watchedState.queryForm.state = 'invalid';
    }
    watchedState.queryForm.data.push(form.elements.url.value);
    console.log(watchedState.queryForm.state);
  });
  // queryField.addEventListener('input', () => {
  //   watchedState.queryForm.state = 'filling';
  // });
};
engine();
