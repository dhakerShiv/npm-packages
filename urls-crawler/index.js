const request       = require('request-promise-native')
const cheerio       = require('cheerio')
const writeJsonFile = require('write-json-file')
const excludeUrls   = ["#", "javascript:;", "/", "javascript:void(0)", "javascript:void(0);", "", undefined]
const AllUrls       = {}
const urlsArr       = []
let uniqueUrlsArr   = []
const deadUrls      = []
let $
let link
let tempLink 
let domainName
let websiteUrl
let webPageUrl
let htmlContent
let customRegex
let urlToStart
let testUrlPath

class Urls {
  constructor (startingUrl, regex) {
    const urlInParts = startingUrl.split("/")
    domainName       = urlInParts[2].replace(/^www./, "")
    websiteUrl       = urlInParts[0] + "//" + urlInParts[2]
    customRegex      = regex
    urlToStart       = startingUrl
    testUrlPath      = domainName + "/" + urlInParts.slice(3).join('/')
  }

  async getAllUrls () {  
    let visitedPages = []

    print(`\rStarting process...`)

    urlsArr.push(urlToStart)
    let total = 0

    while (urlsArr.length) {
      webPageUrl = urlsArr.shift()

      if (!visitedPages.includes(webPageUrl))
      {
        visitedPages.push(webPageUrl)
        
        try {
          print(`\rTotal: ${total}, crawling: ${webPageUrl}`)
          htmlContent = await this.getHtml(webPageUrl) 
          await this.getPageUrls(htmlContent)
          ++total
        }
        catch (err) {
          //Page not found - 404
          if (!deadUrls.includes(webPageUrl))
            deadUrls.push(webPageUrl)
        }
      }
    }
    // Remove dead urls from all unique urls
    uniqueUrlsArr = uniqueUrlsArr.filter( url => !deadUrls.includes(url) )
      
    AllUrls.active = uniqueUrlsArr
    AllUrls.dead   = deadUrls
    print(`\rActive urls: ${uniqueUrlsArr.length}, Dead urls: ${deadUrls.length}`)
    
    await writeJsonFile('urls.json', AllUrls);

    return AllUrls
  }

  getHtml (url) {
    const options = {
        uri: url
    }
    return request(options)
  }

  getPageUrls (html) {
    if(!html)
      return

    $             = cheerio.load(html)
    link          = ""
    let self      = this

    $('a').each( function () {
      link = $(this).attr('href')

      if (!excludeUrls.includes(link) && link.indexOf("#") == -1 )
      {
       
        tempLink      = self.getAbsoluteUrl(link)
        let regexTest = true

        if (customRegex)
          regexTest = (new RegExp(customRegex, 'gi')).test(tempLink)

        if ((new RegExp(testUrlPath, 'gi')).test(tempLink) && regexTest)
        {

          if (!uniqueUrlsArr.includes(tempLink) && !urlsArr.includes(tempLink) )
          {
            urlsArr.push(tempLink)
          }

          if (!uniqueUrlsArr.includes(tempLink))
            uniqueUrlsArr.push(tempLink)
        }
      }
    })
  }

  getAbsoluteUrl (link) {
     // Absolute urls
     if (/^www|^http|^https/i.test(link))
       return link
  
     if (link.charAt(0) != "/")
       return websiteUrl + "/" + link

     // Relative urls
     return websiteUrl + link
  }
}

function print (str) {
  process.stdout.clearLine()
  process.stdout.write(str)
}

module.exports.default = Urls