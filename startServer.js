// startServer.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

let server;

async function startServer(mongoUri, port = process.env.PORT || 3000) {
  if (!mongoUri) {
    // fallback to your original DB string if no mongoUri passed
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD,
    );
    mongoUri = DB;
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });

  return server;
}

async function stopServer() {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  }
  await mongoose.disconnect();
}

module.exports = { startServer, stopServer };
