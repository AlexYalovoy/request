document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const onUpload = e => {
    document.getElementById('uploadProgress')
      .value = e.loaded * 100 / e.total;
  };

  const reuest = new HttpRequest({  // eslint-disable-line

    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', { data: form, onUploadProgress: onUpload })
    .then(console.log); // eslint-disable-line
};

// const reuest = new HttpRequest({
//   baseUrl: 'http://localhost:8000'
// });

// reuest.get('/ping')
//   .then(console.log)
//   .catch();


document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();
  const request = new HttpRequest({ // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });
  const fileName = document.querySelector('input[type=text]').value;
  const onDownload = e => {
    document.getElementById('downloadProgress')
      .value = e.loaded * 100 / e.total;
  };

  request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload })
    .then(({ response, isImage }) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      return { response, isImage };
    })
    .then(({ response, isImage }) => {
      if (!isImage) {
        return;
      }

      const url = URL.createObjectURL(response);
      const img = document.createElement('img');
      img.src = url;
      document.body.appendChild(img);
    });
};
