/*eslint-disable*/
document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  console.log(e.target.sampleFile.files[0])
  form.append('sampleFile', e.target.sampleFile.files[0]);
  const reuest = new HttpRequest({
    baseUrl: 'http://localhost:8000/upload'
  });
  reuest.post('', {data: form}).then(console.log);
  // const reuest = new HttpRequest({
  //   baseUrl: 'http://localhost:8000/ping'
  // });
  // reuest.post().then(console.log);
};

const reuest = new HttpRequest({
  baseUrl: 'http://localhost:8000'
});

reuest.get('/ping')
  .then(console.log)
  .catch();


document.getElementById('downloadForm').onsubmit = function(e) {
	e.preventDefault();
  const request = new HttpRequest({
    baseUrl: 'http://localhost:8000'
  });
  const fileName = document.querySelector('input[type=text]').value;
  request.get(`/files/${fileName}`, {responseType: 'blob'})
    .then(URL.createObjectURL)
    .then(url => {
      const img = document.createElement('img');
      img.src = url;
      document.body.appendChild(img);
    });
};
