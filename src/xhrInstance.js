/* eslint-disable no-undef */
(() => {
  const host = 'https://localhost:8000';
  const xhr = new HttpRequest({ baseUrl: host });
  window.xhr = xhr;
})();