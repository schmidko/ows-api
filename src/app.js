const express = require('express');
const path = require('path');
const v1 = require('./routes/index');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../config/.env') });
global.BASEPATH = path.join(__dirname, '../../');
global.NODE_ENV = process.env.NODE_ENV;

const app = express();

// Load Swagger JSON file
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, '../../public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Your existing routes
app.use('/v1', v1);

// Error handling middleware
app.use(errorHandler);

module.exports = app;