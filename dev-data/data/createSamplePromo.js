const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const { createSamplePromo } = require('../../controllers/promoController');

createSamplePromo().then(() => {
  console.log('Done!');
  process.exit(0);
});