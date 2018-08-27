'use strict';

// Node Module to generate a unique ID of 7-14 characters
const shortid = require('shortid');

// Short URL Generator API
module.exports = async function shorty(fastify, opts) {
  // Pointers for Mongo Collection
  const urlDB = fastify.mongo.db.collection('urls');

  // API Handler
  fastify.post('/shorty', postOpts, async (req, reply) => {
    // Generate a unique short-code for the URL
    let id = '';
    while (true) {
      id = shortid.generate(); // Generate a ID
      const exists = await urlDB.findOne({code: id}); // Validate uniqueness in DB
      if (!exists) break; // If unique, break out of loop
    }

    // Save the URL and short code to the DB
    const data = await urlDB.insertOne({code: id, url: req.body.url});
    // If save to DB failed, return an error.
    if (data.insertedCount !== 1) {
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to save to database',
      });
    }

    // Return the Short URL
    return reply.send({
      shortUrl: `${req.headers.host}/${data.ops[0].code}`,
      statsUrl: `${req.headers.host}/api/v1/stats/${data.ops[0].code}`,
    });
  });
};

/**
 * Schema for the `/shorty` endpoint.
 * Helps validate and coerce incoming / outgoing data.
 */
const postOpts = {
  schema: {
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['url'], // Required Property
      properties: {
        url: {type: 'string', format: 'url'}, // Validates input is a URL
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          shortUrl: {type: 'string'},
          statsUrl: {type: 'string'},
        },
      },
      400: {
        type: 'object',
        properties: {
          statusCode: {type: 'number'},
          error: {type: 'string'},
          message: {type: 'string'},
        },
      },
      500: {
        type: 'object',
        properties: {
          statusCode: {type: 'number'},
          error: {type: 'string'},
          message: {type: 'string'},
        },
      },
    },
  },
};
