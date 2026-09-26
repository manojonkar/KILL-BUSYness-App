const https = require('https');

const req = https.request('https://app.killbusyness.com/api/coach', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }));
req.end();
