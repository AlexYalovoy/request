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

function getFilledList(response) {
  const ul = document.createElement('ul');
  response.forEach(el => {
    ul.innerHTML += `<li>${el}</li>`;
  });
  return ul;
}

document.getElementsByName('sampleFile')[0].onchange = function(e) {
  const uploadButton = document.getElementsByClassName('upload-btn')[0];
  uploadButton.removeAttribute('disabled');
};

document.getElementsByName('sampleFile')[0].onchange = function(e) {
  const uploadButton = document.getElementsByClassName('upload-btn')[0];
  uploadButton.removeAttribute('disabled');
};

document.getElementsByClassName('download-input')[0].oninput = function(e) {
  const downloadBtn = document.getElementsByClassName('download-btn')[0];

  if (!e.target.value) {
    downloadBtn.setAttribute('disabled', 'true');
  } else {
    downloadBtn.removeAttribute('disabled');
  }
};

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const reuest = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' }) // eslint-disable-line
};

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
      document.querySelector('.forms').appendChild(image);
    });
};

document.querySelector('.dir-list-btn').onclick = function(e) {
  const request = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });
  request.get('/list', { responseType: 'json' })
    .then(({ response }) => {
      const listContainer = document.querySelector('.dir-list');
      listContainer.innerHTML = '';
      const ul = getFilledList(response);
      listContainer.appendChild(ul);
      listContainer.style.borderWidth = '1px';
    });
};