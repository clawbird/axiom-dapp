import { app } from './app';
import { Client } from './api/client';

let client = new Client();
console.log('client: ', client);

const port = 7000;
app.listen(port, (error?: any) => {
  if (error) {
    console.error('Error starting server: ', error);
  } else {
    console.log(`Success starting server http://localhost:${port}/`);
  }
})
