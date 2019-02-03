
# Urls Crawler

#### About this Package
Provide a domain and protocol to fetch all urls belongs to that domain.
It will give Active and dead urls



Install:
```
npm install urls-crawler

```
Fetch urls
```
const Urls = require('urls-crawler').default
let urls = new Urls("example.com", "https")

urls.getAllUrls()
.then( allUrls => {
  let activeUrls = allUrls.active
  let deadUrls   = allUrls.dead 
  console.log("Active urls: ", activeUrls)
  console.log("Dead urls: ", deadUrls)
})
.catch( err => console.log(err))
```


You can Specify a regex in parameters for specific url paths, Like specifying

```
let urls = new Urls("example.com", "https", "/blog")
```

It will fetch all urls which have /blog in their url path

