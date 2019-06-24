const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const argv = require('optimist').argv;

mongoose.connect('mongodb://' + argv.be_ip + ':80/forest', { useNewUrlParser: true });

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const server = http.createServer(app);
server.listen(8080, argv.fe_ip);
console.log('Server listening on port 8080');
