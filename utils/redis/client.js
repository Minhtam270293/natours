const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

module.exports = client;