const express = require('express');
const bodyParser = require('body-parser');

const api = express();

const eipXRouter = require('./routes/eipXRoute');

// Middleware Plugins
api.use(bodyParser.json()); // allow JSON uploads
api.use(bodyParser.urlencoded({ extended: true })); // allow Form submissions
api.use('/eipx', eipXRouter);

// Routes
api.get('/', (req, res) => {
  res.status(404).json({
    message: 'Error: Server under construction'
  });
})

module.exports = api;
