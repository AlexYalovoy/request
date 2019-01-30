function downloadFile(response, fileName) {
  const blob = new Blob([response], { type: response.type });
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

  if (response.length === 0) {
    ul.innerText = 'List is empty!';
    return ul;
  }

  response.forEach(el => {
    ul.innerHTML += `<li>${el}</li>`;
  });
  return ul;
}

function getExitButton() {
  const button = document.createElement('i');
  button.classList.add('far');
  button.classList.add('fa-times-circle');
  button.classList.add('exit-btn');
  button.onclick = e => {
    const listWrapper = document.querySelector('.dir-list');
    const list = document.querySelector('.dir-list ul');
    listWrapper.removeChild(list);
  };
  return button;
}

function setPreviewImage(response) {
  if (document.querySelector('.preview')) {
    document.querySelector('.preview-image').src = URL.createObjectURL(response);
    return;
  }

  const image = getPreviewImage(response);
  document.querySelector('.forms').appendChild(image);
}