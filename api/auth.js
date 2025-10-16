// api/auth.js

import { createVercelBegin, createVercelComplete } from 'decap-cms-oauth-provider-vercel';

const client_id = process.env.OAUTH_CLIENT_ID;
const client_secret = process.env.OAUTH_CLIENT_SECRET;

export default createVercelComplete({ client_id, client_secret });