const http = require('http');
const handler = require('./app');
const env = require('./config/env');

const server = http.createServer((req, res) => {
  handler(req, res).catch((error) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: error.message || 'Unexpected server error' }));
  });
});

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`CivicHelp backend running on port ${env.port} (${env.nodeEnv})`);
});
