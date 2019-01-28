function setHeaders(xhr, headers) {
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
}

function getFinalUrl(host, url, params) {
  const finalUrl = new URL(url, host);

  for (const key in params) {
    finalUrl.searchParams.set(key, params[key]);
  }

  return finalUrl;
}

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config = {}) {
    const { transformResponse, headers, params, responseType, onDownloadProgress } = config;
    const finalUrl = getFinalUrl(this.baseUrl, url, params);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', finalUrl);

      setHeaders({ ...this.headers, ...headers });

      xhr.onprogress = onDownloadProgress;

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        const type = xhr.getResponseHeader('Content-Type');
        const transformedResp = transformResponse
          ? transformResponse.reduce((acc, f) => f(acc), xhr.response)
          : xhr.response;

        if (xhr.status !== 200) {
          return reject(new Error(`There is ${xhr.status} code status.`));
        }

        resolve({ response: transformedResp, type });
      };
      xhr.responseType = responseType ? responseType : 'json';
      xhr.send();
    });
  }

  post(url, config = {}) {
    const { transformResponse, headers, responseType, data, onUploadProgress } = config;
    const finalUrl = getFinalUrl(this.baseUrl, url);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', finalUrl);

      setHeaders({ ...this.headers, ...headers });

      xhr.upload.onprogress = onUploadProgress;

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        const transformedResp = transformResponse
          ? transformResponse.reduce((acc, f) => f(acc), xhr.response)
          : xhr.response;

        if (xhr.status !== 200) {
          return reject(transformedResp);
        }

        resolve(transformedResp);
      };

      xhr.responseType = responseType ? responseType : 'json';
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
