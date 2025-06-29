const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const { createPromo } = require('../../controllers/promoController');

createPromo().then(() => {
  console.log('Done!');
  process.exit(0);
});