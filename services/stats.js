'use strict';

// Stats API
module.exports = async function shorty(fastify, opts) {
  // Pointers for Mongo Collections
  const urlDB = fastify.mongo.db.collection('urls');
  const statDB = fastify.mongo.db.collection('stats');

  // API Handler
  fastify.get('/stats/:code', statOpts, async (req, reply) => {
    // Get the original URL for the short-code
    const data = await urlDB.findOne({code: req.params.code});

    // Fetching recorded visitors to the site. Supports limit and skip.
    const queryOptions = Object.assign({}, req.query);
    const visitors = await statDB.find({code: req.params.code}, queryOptions);

    // Aggregating Stats for # of Visits / Day -- Can be used for graphing.
    const avgStats = await statDB.aggregate([
      {$match: {code: req.params.code}},
      {
        $group: {
          _id: {
            month: {$month: '$date'},
            day: {$dayOfMonth: '$date'},
            year: {$year: '$date'},
          },
          count: {$sum: 1},
        },
      },
    ]);

    // Get Data as Arrays from Mongo Cursors
    data.visits = await visitors.toArray();
    data.stats = await avgStats.toArray();

    // Delete `_id` as it's Mongo ID and not relevant to client.
    delete data._id;
    reply.send(data);
  });
};

/**
 * Schema for the `/stats/:code` endpoint. Defines options for the request
 * and the possible expected outputs.
 * Helps validate and coerce incoming / outgoing data.
 */
const statOpts = {
  schema: {
    params: {
      type: 'object',
      properties: {
        code: {type: 'string'},
      },
    },
    querystring: {
      limit: {type: 'integer'},
      skip: {type: 'integer'},
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: {type: 'string'},
        url: {type: 'string'},
        visits: {type: 'array'},
        stats: {type: 'array'},
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
};
