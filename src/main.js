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

  form.append('sampleFile', e.target.sampleFile.files[0]);
  HttpRequest.post('http://localhost:8000/upload', { data: form, onUploadProgress: onUpload, responseType: 'blob' })
    .then(response => {
      document.querySelector('.user-message').innerHTML = 'Success: File was uploaded';
    });
}

function sendDownloadRequest(e) {
  e.preventDefault();
  const fileName = document.querySelector('input[type=text]').value;

  HttpRequest.get(`http://localhost:8000/files/${fileName}`, { responseType: 'blob', onDownloadProgress: onDownload })
    .then(response => {
      document.querySelector('.user-message').innerHTML = 'Success: File was downloaded';
      saveFile(response, fileName);
      return response;
    })
    .then(response => {
      if (!isImage(response.type)) {
        return;
      }
      setPreviewImage(response);
    })
    .catch(err => (document.querySelector('.user-message').innerHTML = err));
}

function sendListRequest() {
  const list = new List(listContainer);
  list.update();
}

inputFile.onchange = checkUploadInput;
downloadInput.oninput = checkDownloadInput;
uploadForm.onsubmit = sendUploadRequest;
downloadForm.onsubmit = sendDownloadRequest;
listBtn.onclick = sendListRequest;
