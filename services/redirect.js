'use strict';

// Node Module to get IPv4 / IPv6 address from Incoming Request
const getIP = require('ipware')().get_ip;

// Short URL Redirect API
module.exports = async function shorty(fastify, opts) {
  // Pointers for Mongo Collections
  const urlDB = fastify.mongo.db.collection('urls');
  const statDB = fastify.mongo.db.collection('stats');

  // API Handler
  fastify.get('/:code', getOpts, async (req, reply) => {
    // Get Original URL
    const data = await urlDB.findOne({code: req.params.code});

    // If short-code not found, return a 404
    if (!data) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Resource not found',
        message: 'Short URL not found',
      });
    }

    // Save the visitor data into an object so we can redirect the user
    // and save the info to databsae after for a better UX.
    const info = Object.assign(
      {},
      {
        ip: getIP(req.raw).clientIp,
        client: req.headers['user-agent'],
        date: new Date(),
        code: req.params.code,
      },
    );

    // Redirect to the long URL
    reply.redirect(data.url);

    // Save the visitor data
    await statDB.insertOne(info);
  });
};

/**
 * Disable prefix for this route
 */
module.exports.prefixOverride = '';

/**
 * Schema for the `/:code` endpoint. No schema for redirect. Otherwise a 404.
 */
const getOpts = {
  schema: {
    params: {
      type: 'object',
      properties: {
        code: {type: 'string'},
      },
    },
  },
  response: {
    404: {
      type: 'object',
      properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'},
      },
    },
  },
};
