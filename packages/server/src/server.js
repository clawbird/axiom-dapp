const api = require('./api');

const port = 7000;
app.listen(port, (error) => {
  if (error) {
    console.error('Error starting server: ', error);
  } else {
    console.log(`Success starting server http://localhost:${port}/`);
  }
})
