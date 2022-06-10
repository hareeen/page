let dark = window.matchMedia('(prefers-color-scheme: dark)').matches
const body = document.querySelector('body')

body.setAttribute('class', dark ? 'dark' : 'light');

document.querySelector('.title img').addEventListener('click', () => {
  dark = !dark;
  body.setAttribute('class', dark ? 'dark' : 'light');
})