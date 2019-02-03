/* eslint-disable no-undef */
class HttpRequest {
  static get(url, config = {}) {
    const request = new this({ baseUrl: url });

    return request.__getPromisedRequest('GET', '', config);
  }

  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  __getPromisedRequest(method, url, config) {
    const {
      transformResponse,
      headers,
      params,
      responseType,
      data,
      onUploadProgress,
      onDownloadProgress
    } = config;
    const finalUrl = getFinalUrl(this.baseUrl, url, params);  // eslint-disable-line

    const xhr = new XMLHttpRequest();
    xhr.open(method, finalUrl);
    xhr.responseType = responseType === undefined ? 'json' : responseType;

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.onprogress = onDownloadProgress;
    xhr.upload.onprogress = onUploadProgress;

    return new Promise((resolve, reject) => {
      xhr.onload = function(e) {
        if (xhr.status === 404) {
          return reject(new Error('File was not found'));
        }

        let transformedResponse = null;

        if (isFunctionsArray(transformResponse)) {
          transformedResponse = transformResponse.reduce((acc, f) => f(acc), xhr.response);
        } else {
          transformedResponse = xhr.response;
        }

        resolve(transformedResponse);
      };
      xhr.onerror = function(e) {
        reject(new Error(`There is ${xhr.status} code status. ${xhr.statusText}.`));
      };

      xhr.send(data);
    });
  }


  get(url, config = {}) {
    return this.__getPromisedRequest('GET', url, config);
  }

  post(url, config = {}) {
    return this.__getPromisedRequest('POST', url, config);
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
