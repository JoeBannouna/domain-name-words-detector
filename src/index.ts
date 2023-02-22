import { findMostLikelyWordsInDomains } from './scan';

import http from 'http';
import qs from 'querystring';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

  if (req.method == 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      // if (body.length > 1e6) res.end();
    });

    let postData;

    req.on('end', function () {
      postData = JSON.parse(body);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(findMostLikelyWordsInDomains(postData)));
    });
  } else {
    // res.statusCode = 500;
    res.end();
  }
});

server.listen(8000, '0.0.0.0');
