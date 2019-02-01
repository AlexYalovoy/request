
document.getElementsByName('sampleFile')[0].onchange = function(e) {
  const { files } = e.target;

  if (files.length > 0) {
    const uploadButton = document.getElementsByClassName('upload-btn')[0];
    const label = document.getElementsByClassName('custom-file-label')[0];
    uploadButton.removeAttribute('disabled');
    label.innerHTML = `${files[0].name}`;
  }
};

document.getElementsByClassName('download-input')[0].oninput = function(e) {
  const downloadBtn = document.getElementsByClassName('download-btn')[0];

  if (!e.target.value) {
    downloadBtn.setAttribute('disabled', 'true');
  } else {
    downloadBtn.removeAttribute('disabled');
  }
};

document.getElementsByClassName('uploadForm')[0].onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const reuest = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });

  form.append('sampleFile', e.target.sampleFile.files[0]);
  reuest.post('/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' }) // eslint-disable-line
    .then(response => {
      document.querySelector('.user-message').innerHTML = 'Success: File was uploaded';
    });
};

document.getElementsByClassName('downloadForm')[0].onsubmit = function(e) {
  e.preventDefault();
  const request = new HttpRequest({ // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });
  const fileName = document.querySelector('input[type=text]').value;

  request.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload }) // eslint-disable-line
    .then(response => {
      document.querySelector('.user-message').innerHTML = 'Success: File was downloaded';
      saveFile(response, fileName); // eslint-disable-line
      return response;
    })
    .then(response => {
      if (!isImage(response.type)) { // eslint-disable-line
        return;
      }
      setPreviewImage(response); // eslint-disable-line
    })
    .catch(err => (document.querySelector('.user-message').innerHTML = err));
};

document.querySelector('.dir-list-btn').onclick = function(e) {
  const request = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });
  request.get('/list')
    .then(response => {
      const listContainer = document.querySelector('.dir-list');
      const ul = getFilledList(response); // eslint-disable-line

      listContainer.innerHTML = '';
      ul.appendChild(getExitButton()); // eslint-disable-line
      listContainer.appendChild(ul);
    });
};