var fs = require('fs');
var http = require('http-get');

exports.readUrls = function(filePath, cb){
  var fileContents = fs.readFileSync(filePath, 'utf8');
  var siteNames = fileContents.split('\n');

  var createDateString = function() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return [year, month, day, hours, minutes, seconds].join("-");
  };

  // make a single dateString to be used as a foldername
  // for all our sites
  var dateString = createDateString();

  for (var i = 0; i < siteNames.length; i++) {
    cb(siteNames[i], dateString);
  }
};

exports.downloadUrl = function(url, date){
  // construct the file/folder name based on the date and url
  var targetName = __dirname + '/../../data/sites/' + date + '/';

  // creating the folder ensures that it exists
  fs.mkdir(targetName);

  // the filename is based on the url
  targetName += url;

  http.get(url, targetName , function( error, result) {
    if (error) {
     console.error(error);
    } else {
      console.log('File downloaded at: ' + result.file);
    }
  });
};