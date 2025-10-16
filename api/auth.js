// api/auth.js

const { createVercelComplete } = require('decap-cms-oauth-provider-vercel');

module.exports = createVercelComplete({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
});
