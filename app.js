'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');

module.exports = function(fastify, opts, next) {
  // MongoDB Connector to use throughout the app
  fastify.register(require('fastify-mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/db',
    useNewUrlParser: true,
  });

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  });

  fastify.get('/', function(req, reply) {
    reply.sendFile('index.html'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
  });

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: {prefix: '/api/v1'},
  });

  next();
};
