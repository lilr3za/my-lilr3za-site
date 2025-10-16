// /api/auth.js

const { factory, vercel } = require('decap-cms-oauth-provider-vercel');

module.exports = vercel(
  factory({
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
  })
);
