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

mongoose.connect('mongodb://localhost:forest/forest', { useNewUrlParser: true });

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const server = http.createServer(app);
server.listen(8080);
console.log('App listening on port 8080');
const cert = fs.readFileSync('./cert.pem');
const key = fs.readFileSync('./key.pem');
const credentials = { key: key, cert: cert };

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);
