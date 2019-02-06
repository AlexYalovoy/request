const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const https = require('https');

app.use('/form', express.static(`${__dirname}/index.html`));
app.use('/index.css', express.static(`${__dirname}/index.css`));
app.use('/background.jpg', express.static(`${__dirname}/img/background.jpg`));
app.use('/onProgress.js', express.static(`${__dirname}/src/onProgress.js`));
app.use('/main.js', express.static(`${__dirname}/src/main.js`));
app.use('/message.js', express.static(`${__dirname}/src/message.js`));
app.use('/HttpRequest.js', express.static(`${__dirname}/src/HttpRequest.js`));
app.use('/xhrInstance.js', express.static(`${__dirname}/src/xhrInstance.js`));
app.use('/list.js', express.static(`${__dirname}/src/list.js`));
app.use('/utils.js', express.static(`${__dirname}/src/utils.js`));
app.use('/files', express.static(`${__dirname}/uploads`));

// default options
app.use(fileUpload());

app.post('/ping', function(req, res) {
  res.send('pong');
});
app.get('/ping', function(req, res) {
  res.send('pong');
});
app.get('/list', function(req, res) {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.send(err);
    }
    res.send(files);
  });
});

app.post('/upload', function(req, res) {
  let uploadPath = null;

  if (Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  const { sampleFile } = req.files;

  uploadPath = `${__dirname}/uploads/${sampleFile.name}`;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(`File uploaded to ${uploadPath}`);
  });
});

const key = fs.readFileSync('./localhost.key');
const cert = fs.readFileSync('./localhost.crt');

const options = {
  key,
  cert,
  requestCert: false,
  rejectUnauthorized: false
};

https.createServer(options, app).listen(8000, function() {
  console.log('Express server listening on port 8000'); // eslint-disable-line
});