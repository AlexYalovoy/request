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

  array.every((el, i) => {
    if (typeof el === 'function') {
      return true;
    }
    throw new Error(`${i} element of transformResponse array isn't a function`);
  });

  return true;
}

function onLoad({ xhr, transformResponse, resolve, reject }) {
  return () => {
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
}

function onError(xhr, reject) {
  return () => reject(new Error(`There is ${xhr.status} code status. ${xhr.statusText}.`));
}
