class Attribute {
  constructor (options = {}) {
    this.htmlTags   = options.htmlTags
    this.attributes = options.attributes
    this.cheerio    = require('cheerio')
  }

  remove (html) {

    if (!html)
      return ""

    let $  = this.cheerio.load(html)
    let dom = $('body')

    const htmlTags   = this.htmlTags   || this.getHtmlTags(dom, $)
    const attributes = this.attributes || ['style']

    htmlTags.forEach( tagName => {
      attributes.forEach( attribute => {
        dom.find(tagName).removeAttr(attribute)
      })
    })
    
    html = $(dom).html()
    return html
  }

  getHtmlTags (dom, $) {
    let tagName
    const matchedHtmlTags = dom.html().match(/<[a-zA-Z]+(>|.*?[^?]>)/g)

    if(!matchedHtmlTags || !matchedHtmlTags.length)
      return []

    return matchedHtmlTags.reduce( (accumulatedTags, htmlTag) => {
      tagName = $(htmlTag).prop("tagName")
  
      if(!accumulatedTags.includes(tagName))
        accumulatedTags.push(tagName)
  
      return accumulatedTags
    }, [])
  }
}

module.exports.default = Attribute