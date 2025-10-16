// /api/auth.js - Dependency-free version

const https = require('https');

// Read the secrets from Vercel Environment Variables
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const GITHUB_HOSTNAME = 'github.com';

// This is the main function Vercel will run
module.exports = (req, res) => {
    // Check if the "code" is in the query string, which means GitHub has redirected the user back
    const code = req.query.code;

    // If there's no code, it's the first step: redirect the user to GitHub to authorize
    if (!code) {
        const authUrl = `https://${GITHUB_HOSTNAME}/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&scope=repo`;
        res.writeHead(302, { Location: authUrl });
        res.end();
        return;
    }

    // If there is a code, it's the second step: exchange the code for an access token
    const postData = JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: code,
    });

    const options = {
        hostname: GITHUB_HOSTNAME,
        port: 443,
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Accept': 'application/json',
        },
    };

    const tokenReq = https.request(options, (tokenRes) => {
        let data = '';
        tokenRes.on('data', (chunk) => { data += chunk; });
        tokenRes.on('end', () => {
            try {
                const tokenData = JSON.parse(data);
                const accessToken = tokenData.access_token;

                if (!accessToken) {
                    res.status(401).send(`Authentication failed: ${JSON.stringify(tokenData)}`);
                    return;
                }

                // This is the final HTML page that communicates the token back to the Decap CMS popup
                const responseHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Authorizing...</title>
                    </head>
                    <body>
                        <script>
                            // Pass the token to the Decap CMS window and close this popup
                            window.opener.postMessage(
                                'authorization:github:success:${JSON.stringify({
                                    token: accessToken,
                                    provider: 'github'
                                })}',
                                window.location.origin
                            );
                            window.close();
                        </script>
                    </body>
                    </html>
                `;

                res.setHeader('Content-Type', 'text/html');
                res.status(200).send(responseHtml);
            } catch (e) {
                res.status(500).send('Error parsing GitHub response.');
            }
        });
    });

    tokenReq.on('error', (e) => {
        console.error(e);
        res.status(500).send('Authentication request failed.');
    });

    tokenReq.write(postData);
    tokenReq.end();
};
