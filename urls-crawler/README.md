# Urls Crawler

#### About this Package
Provide a fully qualified url to fetch all urls belongs to that domain.
It will give Active and dead urls in a object as output
It will save output in a file named as urls.json


Install:
```
npm install urls-crawler

```
Fetch urls
```
const Urls = require('urls-crawler').default
let urls = new Urls("https://www.example.com/")

urls.getAllUrls()
.then( allUrls => {
  let activeUrls = allUrls.active
  let deadUrls   = allUrls.dead 
  console.log("Active urls: ", activeUrls)
  console.log("Dead urls: ", deadUrls)
})
.catch( err => console.log(err))
```

Fetch urls of a blog

```
let urls = new Urls("https://www.example.com/blog/")
```


You can Specify a regex in parameters for specific url paths, Like specifying

```
let urls = new Urls("https://www.example.com/", "/blog")
```

It will fetch all urls which have /blog in their url path