import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';


import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import authentication from './authentication';
import sequelize from './sequelize';
import mongodb from './mongodb';
import postgres from './postgres'
import neo4j from './neo4j'
import debug from './common/debug'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
console.log("\x1b[32m========= App starting =========\x1b[0m")
// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors({
    'origin': ['http://127.0.0.1:8080','http://localhost:8080'],
    'methods': 'GET,HEAD,PUT,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    credentials: true
  }));
app.use(compress());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true ,limit: '50mb'}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
//app.configure(socketio());

app.configure(sequelize);

app.configure(mongodb);
app.configure(postgres);
app.configure(debug);
app.configure(neo4j);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
//app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));
app.hooks(appHooks);
console.log("\x1b[32mConfig\x1b[0m")
console.log("\x1b[32mmongodb\x1b[0m",app.get('mongodb'))
console.log("\x1b[32mneo4j\x1b[0m",app.get('neo4j').connection)
console.log("\x1b[32mpostgres\x1b[0m",app.get('postgres'))
console.log("\x1b[32m========= App started =========\x1b[0m")

export default app;
