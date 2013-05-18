exports.datadir = __dirname + "data/sites.txt"; // tests will need to override this.
var url = require("url");


fs = require("fs");

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
headers["Content-Type"] = "text/html";

exports.handleRequest = function (req, res) {
  console.log('-----------------------------------------');

  // remove leading '/' character from url
  var parsedUrl = url.parse(req.url);
  var urlString = parsedUrl.pathname;
  if(urlString[0] === "/") {
    urlString = urlString.substr(1);
  }

  console.log('urlString', urlString);

  var statusCode = 200;
  var body;

  if(req.method === "GET") {
    body = '<html><input></html>';

  }

  if(req.method === "POST") {

    statusCode = 302;
    req.setEncoding('utf8');

    var messageData = '';

    req.on('data', function(data) {
      messageData += data;
    });

    req.on('end', function() {
    messageData = JSON.parse('{"' + decodeURI(messageData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    fs.writeFileSync(exports.datadir, messageData.url + '\n');
    console.log(messageData.url);

    });

    console.log('post request url header', req.header);
  }

  res.writeHead(statusCode, headers);
  res.end(body);

  console.log('handleRequest complete', exports.datadir);
};
