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
	const request = new XMLHttpRequest();
    
    request.addEventListener('readystatechange', function(e) {
    	if(request.readyState == 2 && request.status == 200) {
    		// Download is being started
    	}
    	else if(request.readyState == 3) {
    		// Download is under progress
    	}
    	else if(request.readyState == 4) {
    		// Downloaing has finished

    	
    		// Set href as a local object URL
    		document.querySelector('.download').setAttribute('href', URL.createObjectURL(request.response));
    		
    		// Set name of download
    		document.querySelector('.download').setAttribute('download', 'space.jpeg');

    
        }
    });

    request.addEventListener('progress', function(e) {
    	var percent_complete = (e.loaded / e.total)*100;
    	console.log(percent_complete);
    });
    
    request.responseType = 'blob';
    
    // Downloading a JPEG file
    request.open('get', 'http://localhost:8000/files/bigSmile.jpeg'); 
    
    request.send(); 
};
