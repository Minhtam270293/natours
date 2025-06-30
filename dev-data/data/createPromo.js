const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const { createPromo } = require('../../controllers/promoController');

// Create a sample promo: code 'SUMMER50', 50% discount, 10 uses
createPromo('SUMMER50', 50, '🔥 50% off all tours!', 10).then(() => {
  console.log('Done!');
  process.exit(0);
});