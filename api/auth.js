// /api/auth.js

const { factory, vercel } = require('decap-cms-oauth-provider-vercel');

// This creates the handler function with the correct settings
const handler = factory({
  // The client ID and secret are read from the environment variables you set in Vercel
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
});

// This exports the handler in the format that Vercel expects
module.exports = vercel(handler);
