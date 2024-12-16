const express = require('express');
const path = require('path');
const v1 = require('./routes/index');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
dotenv.config({ path: path.join(__dirname, '../config/.env') });
require('dotenv').config({path: __dirname + '/.env'});
global.BASEPATH = path.join(__dirname, '../../');
global.NODE_ENV = process.env.NODE_ENV;

const app = express();

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use('/v1', v1);

app.use(errorHandler);


module.exports = app;
