import express from 'express';
import bodyParser from 'body-parser';

const app = express();

import eipXRouter from './routes/eipXRoute';

// Middleware Plugins
app.use(bodyParser.json()); // allow JSON uploads
app.use(bodyParser.urlencoded({ extended: true })); // allow Form submissions
app.use('/eipx', eipXRouter);

// Routes
app.get('/', (req: any, res: any) => {
  res.status(404).json({
    message: 'Error: Server under construction'
  });
})

export {
  app,
}
