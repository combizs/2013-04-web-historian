var stubs = require("./helpers/stubs");
var htmlFetcherHelpers = require("../workers/lib/html-fetcher-helpers");
var fs = require("fs");

describe("html fetcher helpers", function(){

  it("should have a 'readUrls' function", function(){
    var urlArray = ["example1.com", "example2.com"];
    var siteListFileName = __dirname + "/testdata/sites.txt";

    fs.writeFileSync(siteListFileName, urlArray.join("\n"));

    var resultArray = [];
    var result = htmlFetcherHelpers.readUrls(siteListFileName, function(urls){
      resultArray.push(urls);
    });

    waits(200);
    runs(function(){
      expect(resultArray).toEqual(urlArray);
    });
  });

  it("should have a 'downloadUrl' function", function(){
    var result = htmlFetcherHelpers.downloadUrl;
    expect(result).toBeTruthy();
  });

});