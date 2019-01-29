const onUpload = e => {
  const uploadProgress = document.getElementById('uploadProgress');
  uploadProgress.style.width = `${e.loaded * 100 / e.total}%`;
  const initTitle = document.title.match(/Request$/);
  document.title = `${parseInt(e.loaded * 100 / e.total, 10)}% ${initTitle}`;

  if (e.loaded === e.total && e.total === 0) {
    uploadProgress.style.opacity = 1;
  }

  if (e.loaded === e.total && e.total !== 0) {
    setTimeout(() => {
      uploadProgress.style.opacity = 0;
      uploadProgress.style.width = 0;
      document.title = initTitle;
    }, 500);
    setTimeout(() => {
      uploadProgress.style.opacity = 1;
      document.title = initTitle;
    }, 1500);
  }
};

function onDownload(e) {
  const downloadProgress = document.getElementById('downloadProgress');
  downloadProgress.style.width = `${e.loaded * 100 / e.total}%`;
  const initTitle = document.title.match(/Request$/);
  document.title = `${parseInt(e.loaded * 100 / e.total, 10)}% ${initTitle}`;

  if (e.loaded === e.total && e.loaded !== 0) {
    setTimeout(() => {
      downloadProgress
        .style.opacity = 0;
      downloadProgress.style.width = 0;
      document.title = initTitle;
    }, 500);
    setTimeout(() => {
      downloadProgress.style.opacity = 1;
      document.title = initTitle;
    }, 1500);
  }
}