'use strict';

import _ from 'lodash';
import fs from 'fs';

fs.createReadStream('.env.example')
  .pipe(fs.createWriteStream('../.env'));

import dotenv from 'dotenv';
dotenv.load();

const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 7000
};

// Setup Node environment based on .env file else use default from hash
process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

let envConfig;
try {
  envConfig = require('./' + config.env);
  // fallback to empty object if file does not exist
  envConfig = envConfig || {};
} catch(err) {
  envConfig = {};
  console.error('Error reading .env file');
}

// Merge configs so envConfig overwrites the config object
const exportConfig = _.merge(config, envConfig);

export {
  exportConfig
}