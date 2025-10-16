// /api/auth.js

const { createVercelBegin, createVercelComplete } = require('decap-cms-oauth-provider-vercel');

// This is the function that Vercel will run.
// It handles both the start of the login process and the completion.
export default async function handler(req, res) {
  if (req.query.provider === 'github' && req.query.code) {
    // This part runs after GitHub sends the user back.
    await createVercelComplete({
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    })(req, res);
  } else {
    // This part runs when the user first tries to log in.
    await createVercelBegin({
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    })(req, res);
  }
}
