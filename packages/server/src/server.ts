import { api } from "./api";

const port = 7000;
api.listen(port, (error?: any) => {
  if (error) {
    console.error('Error starting server: ', error);
  } else {
    console.log(`Success starting server http://localhost:${port}/`);
  }
})
