const onUpload = e => {
  document.getElementById('uploadProgress')
    .style.width = `${e.loaded * 100 / e.total}%`;
  const initTitle = document.title.match(/Request$/);
  document.title = `${parseInt(e.loaded * 100 / e.total, 10)}% ${initTitle}`;

  if (e.loaded === e.total && e.total !== 0) {
    setTimeout(() => {
      document.getElementById('uploadProgress')
        .style.opacity = 0;
      document.getElementById('uploadProgress')
        .style.width = 0;
      document.title = initTitle;
    }, 1000);
  }
};

const onDownload = e => {
  document.getElementById('downloadProgress')
    .style.width = `${e.loaded * 100 / e.total}%`;
  const initTitle = document.title.match(/Request$/);
  document.title = `${parseInt(e.loaded * 100 / e.total, 10)}% ${initTitle}`;

  if (e.loaded === e.total && e.total !== 0) {
    setTimeout(() => {
      document.getElementById('downloadProgress')
        .style.opacity = 0;
      document.getElementById('downloadProgress')
        .style.width = 0;
      document.title = initTitle;
    }, 1000);
  }
};