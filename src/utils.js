const userMessage = document.getElementsByClassName('user-message')[0];

function saveFile(response, fileName) {
  const blob = new Blob([response], { type: response.type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  link.click();
}

function getPreviewImage(url) {
  return `
    <img src = ${url} class = 'preview-image'>
    <figcaption>Preview image</figcaption>
  `;
}

function setPreviewImage(response, figure) {
  const figureImage = document.getElementsByClassName('preview-image')[0];
  const url = URL.createObjectURL(response);

  if (figureImage) {
    figureImage.src = url;
    return;
  }

  figure.innerHTML = getPreviewImage(url);
}

function isImage(contentType) {
  return (/image/).test(contentType);
}

function getFinalUrl(host, url, params) {
  const finalUrl = new URL(url, host);

  for (const key in params) {
    finalUrl.searchParams.set(key, params[key]);
  }

  return finalUrl;
}

function isFunctionsArray(array) {
  if (array === undefined) {
    return false;
  }

  return array.every((el, i) => {
    if (typeof el === 'function') {
      return true;
    }
    throw new Error(`${i} element of transformResponse array isn't a function`);
  });
}

function showMessage(text) {
  userMessage.innerText = text;
}