process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { parse } = require('url');
const fetch = require('node-fetch'); // Use `node-fetch` v2 for CommonJS

// Utility function to parse cookies
const parseCookies = (cookieString) => {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
};

// Configuration
const NEXTJS_PORT = 3000; // Port where Next.js server is running
const PROXY_PORT = 4000; // Port where proxy server will run

// Create the proxy middleware
const nextjsProxy = createProxyMiddleware({
  target: `http://localhost:${NEXTJS_PORT}`,
  changeOrigin: true,
  ws: true,
});

const generateApigeeToken = async () => {
  const APIGEE_AUTH_URL = 'https://api.ciq3kgmonc-honeywell1-d3-public.model-t.cc.commerce.ondemand.com/authorizationserver/oauth/token';
  const CLIENT_ID = 'asm';
  const CLIENT_SECRET = '1234';

  const response = await fetch(APIGEE_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate Apigee token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const generateBinderToken = async () => {
  const BINDER_AUTH_URL = 'https://honeywell.bynder.com/v6/authentication/oauth2/token';
  const CLIENT_ID = 'd6aca289-4ca3-47d0-a5ed-a3e1716b062d';
  const CLIENT_SECRET = '0e07b2ae-0c90-44e9-9e94-69dd43c379a4';

  const response = await fetch(BINDER_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate Bynder token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const requestListener = async (req, res) => {
  const { method, headers, url } = req;
  const basePath = '/server1'; // Adjust this based on your setup
  const parsedUrl = parse(url);
  const apiPath = parsedUrl.pathname.replace(basePath, '');
  const queryString = parsedUrl.query ? '?' + parsedUrl.query : '';
  const fullUrl = `${apiPath}${queryString}`;

  // Get cookies from the headers
  const cookies = headers.cookie ? parseCookies(headers.cookie) : {};
  // Access specific cookies
  const token = cookies["2391-token"] || "default_token";

  if (apiPath.includes("/pif/")) {
    if (method === 'OPTIONS') {
      // CORS Preflight
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
    } else {
      const targetURL = `https://buildingsbt.stage.honeywell.com${fullUrl}`;
      const cookieVal = "2391-token=" + token;
      let requestData = '';

      req.on('data', chunk => {
        requestData += chunk;
      });

      req.on('end', () => {
        const options = {
          method: method,
          headers: {
            'Authorization': "Bearer " + token,
            'Cookie': cookieVal,
            'Content-Type': 'application/json',
          },
        };

        const request = https.request(targetURL, options, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            const contentType = response.headers['content-type'];

            if (contentType && contentType.includes('application/json')) {
              try {
                const jsonData = JSON.parse(data);
                console.log('Response data:', jsonData);

                res.writeHead(response.statusCode, {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(jsonData));
              } catch (error) {
                console.error('Parsing error:', error);
                res.writeHead(500, {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
              }
            } else {
              console.error('Unexpected response format:', data);
              res.writeHead(response.statusCode, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
              });
              res.end(data); // Send the raw response if it's not JSON
            }
          });
        });

        request.on('error', (error) => {
          console.error('Request error:', error);
          res.writeHead(500, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
        });

        request.write(requestData);
        request.end();
      });
    }
  } else if (apiPath.includes("/productDetails/")) {
    try {
      const apigee_token = await generateApigeeToken();
      const targetURL = `https://api.ciq3kgmonc-honeywell1-d3-public.model-t.cc.commerce.ondemand.com/honeywellwebservices/v2/honeywell${apiPath}${queryString}`;

      console.log('HTTP Method:', method);
      console.log('Target URL:', targetURL);
      console.log('Apigee Token:', apigee_token);

      const response = await fetch(targetURL, {
        method: method,
        headers: {
          'Authorization': "Bearer " + apigee_token,
        }
      });

      if (!response.ok) {
        console.error(`Response not OK. Status: ${response.status}. Text: ${response.statusText}`);
        res.writeHead(response.status, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: 'Error fetching data', statusText: response.statusText }));
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(data));

    } catch (error) {
      console.error('Fetch error:', error);
      res.writeHead(500, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
  } else if (apiPath.includes("/download/")) {
    try {
      const binder_token = await generateBinderToken();
      const targetURL = `https://honeywell.bynder.com/api/v4/media/DA1CA705-D8BE-434F-9C08F7A226DA6950${apiPath}${queryString}`;

      console.log('Binder Target URL:', targetURL);
      console.log('Binder Token:', binder_token);

      const response = await fetch(targetURL, {
        method: method,
        headers: {
          'Authorization': "Bearer " + binder_token,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(data));

    } catch (error) {
      console.error('Fetch error:', error);
      res.writeHead(500, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
  } else {
    // Forward all other requests to the Next.js server
    nextjsProxy(req, res, (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  }
};

const server = http.createServer(requestListener);

server.listen(PROXY_PORT, () => {
  console.log(`Proxy server is running on port ${PROXY_PORT}`);
});
