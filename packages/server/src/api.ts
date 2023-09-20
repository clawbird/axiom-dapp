import express from 'express';
import bodyParser from 'body-parser';

const api = express();

import eipXRouter from './routes/eipXRoute';

// Middleware Plugins
api.use(bodyParser.json()); // allow JSON uploads
api.use(bodyParser.urlencoded({ extended: true })); // allow Form submissions
api.use('/eipx', eipXRouter);

// Routes
api.get('/', (req: any, res: any) => {
  res.status(404).json({
    message: 'Error: Server under construction'
  });
})

export {
  api,
}
