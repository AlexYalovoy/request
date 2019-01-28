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

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config = {}) {
    const { transformResponse, headers, params, responseType, onDownloadProgress } = config;
    const finalUrl = getFinalUrl(this.baseUrl, url, params);
    const customConfig = {
      method: 'GET',
      finalUrl,
      headers: { ...this.headers, ...headers },
      responseType,
      onDownloadProgress
    };

    return new Promise((resolve, reject) => {
      const xhr = getconfiguratedXHR(customConfig);

      xhr.onload = onLoad(xhr, transformResponse, resolve);
      xhr.onerror = onError(xhr, reject);

      xhr.send();
    });
  }

  post(url, config = {}) {
    const { transformResponse, headers, responseType, data, onUploadProgress } = config;
    const finalUrl = getFinalUrl(this.baseUrl, url);
    const customConfig = {
      method: 'POST',
      finalUrl,
      headers: { ...this.headers, ...headers },
      responseType,
      onUploadProgress
    };

    return new Promise((resolve, reject) => {
      const xhr = getconfiguratedXHR(customConfig);

      xhr.onload = onLoad(xhr, transformResponse, resolve);
      xhr.onerror = onError(xhr, reject);

      xhr.send(data);
    });
  }
}

/*
const reuest = new HttpRequest({
  baseUrl: 'http://localhost:3000',
});

reuest.get('/user/12345', { onDownloadProgress, headers: {contentType: undefined} })
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e)
  });

reuest.post('/save', { data: formdata, header, onUploadProgress })
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e)
  });

config = {

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer

  data: {
    firstName: 'Fred'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
}
*/
