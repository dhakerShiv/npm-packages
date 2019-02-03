const request       = require('request-promise-native')
const cheerio       = require('cheerio')
const excludeUrls   = ["#", "javascript:;", "/", "javascript:void(0)", "javascript:void(0);", "", undefined]
const AllUrls       = {}
const urlsArr       = []
let uniqueUrlsArr   = []
const deadUrls      = []
let $
let link
let initialLength
let tempLink 
let domainName
let websiteUrl
let webPageUrl
let htmlContent
let customRegex

class Urls {
  constructor (domain, protocol, regex) {
    domainName    = domain
    websiteUrl    = protocol + "://" + domain
    customRegex   = regex
  }

  async getAllUrls () {  
    let visitedPages = []

    urlsArr.push(websiteUrl)

    while (urlsArr.length) {
      webPageUrl = urlsArr.shift()

      if (!visitedPages.includes(webPageUrl))
      {
        visitedPages.push(webPageUrl)
        
        try {
          htmlContent = await this.getHtml(webPageUrl) 
          await this.getPageUrls(htmlContent)
        }
        catch (err) {
          //Page not found - 404
          uniqueUrlsArr = uniqueUrlsArr.filter( url => url != webPageUrl )
          if (!deadUrls.includes(webPageUrl))
            deadUrls.push(webPageUrl)
        }
      }
    }

    // Remove dead urls from all unique urls
    uniqueUrlsArr = uniqueUrlsArr.filter( url => !deadUrls.includes(url) )
      
    AllUrls.active = uniqueUrlsArr
    AllUrls.dead   = deadUrls
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
    initialLength = uniqueUrlsArr.length

    $('a').each( function () {
      link = $(this).attr('href')

      if (!excludeUrls.includes(link) && link.indexOf("#") == -1 )
      {
        //console.log(uniqueUrlsArr)

        // Relative urls
        tempLink = websiteUrl + link
  
        if (link.charAt(0) != "/")
          tempLink = websiteUrl + "/" + link
  
        // Absolute urls
        if (/^www|^http|^https/i.test(link))
          tempLink = link  

        let regexTest = true

        if (customRegex)
          regexTest = (new RegExp(customRegex, 'gi')).test(tempLink)

        if ((new RegExp(domainName, 'gi')).test(tempLink) && regexTest)
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

    return uniqueUrlsArr.length - initialLength
  }
}

module.exports.default = Urls