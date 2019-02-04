/* eslint-disable wrap-iife */
(function() {
  const uploadProgressBar = document.getElementsByClassName('uploadProgress')[0];
  const downloadProgressBar = document.getElementsByClassName('downloadProgress')[0];
  const initTitle = document.title;

  function onProgress(node) {
    return e => {
      node.style.width = `${e.loaded * 100 / e.total}%`;
      document.title = `${parseInt(e.loaded * 100 / e.total, 10)}% ${initTitle}`;

      if (e.loaded === e.total) {
        setTimeout(() => {
          node.classList.remove('visible');
          node.classList.add('not-visible');
          document.title = initTitle;
        }, 500);
        setTimeout(() => {
          node.classList.remove('not-visible');
          node.classList.add('visible');
        }, 1500);
      }
    };
  }

  window.onUpload = onProgress(uploadProgressBar);
  window.onDownload = onProgress(downloadProgressBar);
})();
