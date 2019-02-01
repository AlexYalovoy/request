const inputFile = document.getElementsByName('sampleFile')[0];
const downloadInput = document.getElementsByClassName('download-input')[0];
const uploadForm = document.getElementsByClassName('uploadForm')[0];
const downloadForm = document.getElementsByClassName('downloadForm')[0];
const listBtn = document.querySelector('.dir-list-btn');
const uploadButton = document.getElementsByClassName('upload-btn')[0];
const uploadLabel = document.getElementsByClassName('custom-file-label')[0];
const downloadBtn = document.getElementsByClassName('download-btn')[0];
const listContainer = document.querySelector('.dir-list');

function checkUploadInput(e) {
  const { files } = e.target;

  if (files.length === 0) {
    return;
  }

  uploadButton.disabled = false;
  uploadLabel.innerHTML = `${files[0].name}`;
}

function checkDownloadInput(e) {
  if (!e.target.value) {
    downloadBtn.disabled = true;
    return;
  }

  downloadBtn.disabled = false;
}

function sendUploadRequest(e) {
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
}

function sendDownloadRequest(e) {
  e.preventDefault();

  const fileName = document.querySelector('input[type=text]').value;
  const request = new HttpRequest({ // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });

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
}

function sendListRequest(e) {
  const request = new HttpRequest({  // eslint-disable-line
    baseUrl: 'http://localhost:8000'
  });
  request.get('/list')
    .then(response => {
      const ul = getFilledList(response); // eslint-disable-line

      listContainer.innerHTML = '';
      ul.appendChild(getExitButton()); // eslint-disable-line
      listContainer.appendChild(ul);
    });
}

inputFile.onchange = checkUploadInput;
downloadInput.oninput = checkDownloadInput;
uploadForm.onsubmit = sendUploadRequest;
downloadForm.onsubmit = sendDownloadRequest;
listBtn.onclick = sendListRequest;
