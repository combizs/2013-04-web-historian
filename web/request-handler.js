exports.datadir = __dirname + "/../data/sites.txt"; // tests will need to override this.
var datastore = __dirname + "/../data/sites/";
var fs = require("fs");
var url = require("url");

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
  var body = "<html><form method='POST'><input name='url' id='url'><input type='submit'></form></html>";


  if(req.method === "GET") {

    // If we are going to the root level just return default body.
    // else, try to get the saved html from our datastore
    if(urlString) {

      // Do we have a filename in our datastore that corresponds to the path?
      var check = datastore + urlString;
      if (fs.existsSync(check)) {
        body = fs.readFileSync(check, 'utf8');
      }
      else {
        statusCode = 404;
      }
    }
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
      fs.appendFileSync(exports.datadir, messageData.url + '\n', 'utf8', function (err) {
        console.error('Failed to write to file:', exports.datadir);
        if (err) throw err;
      });
    });
  }

  res.writeHead(statusCode, headers);
  res.end(body);

  console.log('handleRequest complete', exports.datadir);
};
