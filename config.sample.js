'use strict';

module.exports = {
  port: process.env.PORT || 4000,
  stripe: {
    // Include your Stripe secret key here
    secretKey: 'YOUR_STRIPE_SECRET_KEY'
  },
}
