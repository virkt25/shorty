'use strict';

const {test} = require('tap');
const Fastify = require('fastify');
const App = require('../../app');

test('/api/v1/shorty route', async t => {
  const fastify = Fastify();
  fastify.register(App);

  const res = await fastify.inject({
    url: '/api/v1/shorty',
    payload: {url: 'http://www.virk.cc'},
    method: 'POST',
  });

  const data = JSON.parse(res.payload);
  t.match(data, {
    shortUrl: /localhost:\d+\/\S+/,
    statsUrl: /localhost:\d+\/api\/v1\/stats\/\S+/,
  });

  fastify.close();
});
