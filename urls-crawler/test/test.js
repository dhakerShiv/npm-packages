const assert      = require('chai').assert
const UrlsCrawler = require('../index').default
const request     = require('request-promise-native')

describe("Urls Crawling", function () {
  describe("Crawling a website with http protocol", function () {
    it("Should return active and dead urls", function(done) {
      const urlsCrawler = new UrlsCrawler("http://www.amarpura.in") 
      urlsCrawler
      .getAllUrls()
      .then( function (urls) {
        console.log(urls)
        done()
      })
      .catch( function (err) {
        console.log(err)
        done(err)
      })
    })
  })
})