var fs = require('fs');
var http = require('http-get');

exports.readUrls = function(filePath, cb){
  var fileContents = fs.readFileSync(filePath, 'utf8');
  var siteNames = fileContents.split('\n');

  for (var i = 0; i < siteNames.length; i++) {
    cb(siteNames[i]);
  }
};

exports.downloadUrl = function(url){
  http.get(url, __dirname + '/../../data/sites/' + url, function( error, result) {
    if (error) {
     console.error(error);
    } else {
      console.log('File downloaded at: ' + result.file);
    }
  });
};