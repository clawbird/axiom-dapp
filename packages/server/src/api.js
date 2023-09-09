const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const eipXRouter = require('./routes/eipXRoute');

// Middleware Plugins
app.use(bodyParser.json()); // allow JSON uploads
app.use(bodyParser.urlencoded({ extended: true })); // allow Form submissions
app.use('/eipx', eipXRouter);

// Routes
app.get('/', (req, res) => {
  res.status(404).json({
    message: 'Error: Server under construction'
  });
})

module.exports = app;
