'use strict';

module.exports = async function(fastify, opts, next) {
  fastify.get('/', async function(request, reply) {
    return {root: true};
  });
};
