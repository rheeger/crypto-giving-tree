const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

mongoose.connect('mongodb://10.128.0.4:80/forest', { useNewUrlParser: true });

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const cert = fs.readFileSync('./cert.pem');
const key = fs.readFileSync('./key.pem');
const pass = 'CharityBlock';
const credentials = { key: key, cert: cert, pass };

const server = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
server.listen(80, '10.128.0.3');
console.log('Server listening on port 80');
httpsServer.listen(8443, '10.128.0.3');
