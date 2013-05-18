exports.datadir = __dirname + "data/sites.txt"; // tests will need to override this.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/plain"
};

exports.handleRequest = function (req, res) {
  console.log('-----------------------------------------');

  var statusCode = 200;
  var body;

  if(req.method === "GET") {
    body = '<html><input></html>';

  }

  if(req.method === "POST") {

  }

  res.writeHead(statusCode, headers);
  res.end(body);

  console.log('handleRequest complete', exports.datadir);
};
