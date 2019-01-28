document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
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

  const reuest = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' })
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
      .style.width = `${e.loaded * 100 / e.total}%`;

    if (e.loaded === e.total && e.total !== 0) {
      setTimeout(() => {
        document.getElementById('downloadProgress')
          .style.width = 0;
      }, 1000);
    }
  };

  request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload })
    .then(({ response, type }) => {
      const blob = new Blob([response], { type });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      return { response, type };
    })
    .then(({ response, type }) => {
      if (type !== 'image/jpeg') {
        return;
      }

      const url = URL.createObjectURL(response);
      let figure = document.getElementsByClassName('preview')[0];
      let img = document.getElementsByClassName('preview-image')[0];

      if (figure) {
        img.src = url;
        return;
      }

      figure = document.createElement('figure');
      figure.className = 'preview';
      img = document.createElement('img');
      img.className = 'preview-image';
      img.src = url;
      const figcaption = document.createElement('figcaption');
      figcaption.innerText = 'Preview image';
      figure.appendChild(img);
      figure.appendChild(figcaption);

      document.getElementsByClassName('main')[0].appendChild(figure);
    });
};
