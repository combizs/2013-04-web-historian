var helpers = require('./lib/html-fetcher-helpers.js');
console.log(helpers);
var datadir = __dirname + "/../data/sites.txt";

var cronJob = require('cron').CronJob;
new cronJob('*/30 * * * * *', function() {
  helpers.readUrls(datadir, helpers.downloadUrl);
}, null, true);