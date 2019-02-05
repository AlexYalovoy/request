/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
const inputFile = document.getElementsByName('sampleFile')[0];
const downloadInput = document.getElementsByClassName('download-input')[0];
const uploadForm = document.getElementsByClassName('uploadForm')[0];
const downloadForm = document.getElementsByClassName('downloadForm')[0];
const listBtn = document.querySelector('.dir-list-btn');
const uploadButton = document.getElementsByClassName('upload-btn')[0];
const uploadLabel = document.getElementsByClassName('custom-file-label')[0];
const downloadBtn = document.getElementsByClassName('download-btn')[0];
const listContainer = document.querySelector('.dir-list');
const previewFigure = document.getElementsByClassName('preview')[0];
const host = 'https://localhost:8000';
const list = new List(listContainer, `${host}/list`);
const xhr = new HttpRequest({ baseUrl: host });

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
  const file = e.target.sampleFile.files[0];

  form.append('sampleFile', file);
  xhr.post('/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' })
    .then(() => showMessage('Success: File was uploaded'));
}

function sendDownloadRequest(e) {
  e.preventDefault();
  const fileName = document.querySelector('input[type=text]').value;

  xhr.get(`/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload })
    .then(response => {
      showMessage('Success: File was downloaded');
      saveFile(response, fileName);
      return response;
    })
    .then(response => {
      if (isImage(response.type)) {
        setPreviewImage(response, previewFigure);
      }
    })
    .catch(showMessage);
}

function sendListRequest() {
  list.update();
}

inputFile.onchange = checkUploadInput;
downloadInput.oninput = checkDownloadInput;
uploadForm.onsubmit = sendUploadRequest;
downloadForm.onsubmit = sendDownloadRequest;
listBtn.onclick = sendListRequest;