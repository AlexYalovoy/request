/*eslint-disable*/
document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const onUpload = (e) => {
    document.getElementById('uploadProgress')
      .value = e.loaded * 100 / e.total;
  };
  const reuest = new HttpRequest({
    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', {data: form, onUploadProgress: onUpload})
    .then(console.log);
};

// const reuest = new HttpRequest({
//   baseUrl: 'http://localhost:8000'
// });

// reuest.get('/ping')
//   .then(console.log)
//   .catch();


document.getElementById('downloadForm').onsubmit = function(e) {
	e.preventDefault();
  const request = new HttpRequest({
    baseUrl: 'http://localhost:8000'
  });
  const fileName = document.querySelector('input[type=text]').value;
  const onDownload = (e) => {
    document.getElementById('downloadProgress')
      .value = e.loaded * 100 / e.total;
  }

  request.get(`/files/${fileName}`, {responseType: 'blob', onDownloadProgress: onDownload })
    .then(URL.createObjectURL)
    .then(url => {
      const img = document.createElement('img');
      img.src = url;
      document.body.appendChild(img);
    });
};
