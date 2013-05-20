exports.datadir = __dirname + "/../data/sites.txt"; // tests will need to override this.
var datastore = __dirname + "/../data/sites/";
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
headers["Content-Type"] = "text/html";

exports.handleRequest = function (req, res) {
  var parsedUrl = url.parse(req.url);
  var urlString = parsedUrl.pathname;
  if(urlString[0] === "/") {
    urlString = urlString.substr(1);
  }

  headers["Content-Type"] = "text/html";
  getBody = fs.readFileSync(__dirname + "/index.html", 'utf8');

  var statusCode = 200;
  if(req.method === "GET") {
    var getBody;
    if (req.url === '/style.css') {
      headers["Content-Type"] = "text/css";
      getBody = fs.readFileSync(__dirname + "/style.css", 'utf8');
    }
    else {
      if(urlString) {
        var pathName = urlString.split("/");
        var check = datastore + urlString;
        if(pathName.length  > 1){
          if (fs.existsSync(datastore + urlString)) {
            getBody += fs.readFileSync(check, 'utf8');
          }
          else {
            getBody += "Nothing found";
            statusCode = 404;
          }
        }
        else {
          var files = fs.readdirSync(datastore);
          var li = '';
          for (var i = 0; i < files.length; i++){
            if(files[i] !== ".DS_Store") {
              data = {
                file: files[i],
                pathname: pathName
              };
              if (fs.existsSync(datastore + files[i] + "/" + pathName[pathName.length-1])) {
                li += "<li><a href='" + files[i] + "/" + pathName[pathName.length-1] +"'>" + files[i] +"</a></li>";
              }
              else {
                li += "<li>Nothing Found</li>";
              }
            }
          }
          // data {
          //   file: [
          //   {
          //     header: urlString
          //     ul: li

          //   }
          //   ]
          // }
          getBody += "<h1>Searched Domain: " + urlString + "</h1>";
          getBody += "<ul>" + li + "</ul>";
        }
      }
    }
    res.writeHead(statusCode, headers);
    res.end(getBody);

  }

  if(req.method === "POST") {
    var postBody = '';
    statusCode = 200;
    req.setEncoding('utf8');
    var results;

    var messageData = '';
    var result;
    var fileContents = fs.readFileSync(exports.datadir, 'utf8');
    var siteNames = fileContents.split('\n');

    req.on('data', function(data) { messageData += data; });
    req.on('end', function() {
      messageData = querystring.parse(messageData);
      for(var sites = 0; sites < siteNames.length; sites++){
        if(siteNames[sites] === messageData.url) {
          result = true;
        }
      }
      if(result){
        var files = fs.readdirSync(datastore);
        var li = '';
        for (var i = 0, l = files.length; i < l; i++){
          if(files[i] !== ".DS_Store") {
            if (fs.existsSync(datastore + files[i] + "/" + messageData.url)) {
              li += "<li><a href='" + files[i] + "/" + messageData.url +"'>" + files[i] +"</a></li>";
            }
            else {
              li += "<li>Nothing Cached</li>";
            }
          }
        }
        postBody += "<h1>Searched Domain: " + urlString + "</h1>";
        postBody += "<ul>" + li + "</ul>";
      }
      else {
        postBody = "<h1>" + messageData.url + " is being added to the list!</h1>";
        fs.appendFileSync(exports.datadir, messageData.url + '\n', 'utf8');
      }
      res.writeHead(statusCode, headers);
      res.end(postBody);
    });
  }
};
