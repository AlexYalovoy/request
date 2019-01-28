function getFinalUrl(host, url, params) {
  const finalUrl = new URL(url, host);

  for (const key in params) {
    finalUrl.searchParams.set(key, params[key]);
  }

  return finalUrl;
}

function getconfiguratedXHR({ method, finalUrl, headers, responseType, onDownloadProgress, onUploadProgress }) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, finalUrl);
  xhr.responseType = responseType === undefined ? 'json' : responseType;

  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }

  if (method === 'GET' && onDownloadProgress !== undefined) {
    xhr.onprogress = onDownloadProgress;
  } else if (method === 'POST' && onUploadProgress !== undefined) {
    xhr.upload.onprogress = onUploadProgress;
  }

  return xhr;
}

function isFunctionsArray(array) {
  if (array === undefined) {
    return false;
  }

  array.every((el, i) => {
    if (typeof el === 'function') {
      return true;
    }
    throw new Error(`${i} element of transformResponse array isn't a function`);
  });

  return true;
}

function onLoad(xhr, transformResponse, resolve) {
  return () => {
    const type = xhr.getResponseHeader('Content-Type');
    let transformedResponse = null;

    if (isFunctionsArray(transformResponse)) {
      transformedResponse = transformResponse.reduce((acc, f) => f(acc), xhr.response);
    } else {
      transformedResponse = xhr.response;
    }

    resolve({ response: transformedResponse, type });
  };
}

function onError(xhr, reject) {
  return () => reject(new Error(`There is ${xhr.status} code status. ${xhr.statusText}.`));
}
