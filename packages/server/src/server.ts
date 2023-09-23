import { app } from './app';
import { Client } from './api/client';

let client: any;

const port = 7000;
app.listen(port, (error?: any) => {
  if (error) {
    console.error('Error starting server: ', error);
  } else {
    console.log(`Success starting server http://localhost:${port}/`);
    client = new Client();
  }
})

export {
  client
}
