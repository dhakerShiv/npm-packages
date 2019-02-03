
# Html Attributes Remover 

#### About this Package
Provide a list of attributes you need to remove from provided html or selective tags of html

Install:
```
npm install html-attributes-remover

```
Remove html attributes like style, class from div tags
```
const AttributeRemover = require('html-attributes-remover').default
const attributeRemover   = new AttributeRemover({
  "htmlTags": ["div"],
  "attributes": ["style", "class"]
})

let html    = "<div class='row' style='color:red;'><p><span style='font-size:100;'>Hello there!</span></p></div>"
let newHtml = attributeRemover.remove(html)
console.log(newHtml) // "<div><p><span style='font-size:100;'>Hello there!</span></p></div>"

```

If you want to remove attributes from all html tags then do not mention any htmlTags while initializing the AttributeRemover class

```