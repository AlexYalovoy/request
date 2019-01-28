function downloadFile({ response, type }, fileName) {
  const blob = new Blob([response], { type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getPreviewImage(response) {
  const url = URL.createObjectURL(response);
  let figure = document.getElementsByClassName('preview')[0];
  let img = document.getElementsByClassName('preview-image')[0];

  figure = document.createElement('figure');
  figure.className = 'preview';
  img = document.createElement('img');
  img.className = 'preview-image';
  img.src = url;
  const figcaption = document.createElement('figcaption');
  figcaption.innerText = 'Preview image';
  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

function isImage(contentType) {
  const RE = (/image/);

  return RE.test(contentType);
}

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const reuest = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' }) // eslint-disable-line
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

  request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload }) // eslint-disable-line
    .then(({ response, type }) => {
      downloadFile({ response, type }, fileName);
      return { response, type };
    })
    .then(({ response, type }) => {
      if (!isImage(type)) {
        return;
      }

      if (document.querySelector('.preview')) {
        document.querySelector('.preview-image').src = URL.createObjectURL(response);
        return;
      }

      const image = getPreviewImage(response);
      document.querySelector('.main').appendChild(image);
    });
};
