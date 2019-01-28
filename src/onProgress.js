const onUpload = e => {
  document.getElementById('uploadProgress')
    .style.width = `${e.loaded * 100 / e.total}%`;

  if (e.loaded === e.total && e.total !== 0) {
    setTimeout(() => {
      document.getElementById('uploadProgress')
        .style.width = 0;
    }, 1000);
  }
};

const onDownload = e => {
  document.getElementById('downloadProgress')
    .style.width = `${e.loaded * 100 / e.total}%`;

  if (e.loaded === e.total && e.total !== 0) {
    setTimeout(() => {
      document.getElementById('downloadProgress')
        .style.width = 0;
    }, 1000);
  }
};