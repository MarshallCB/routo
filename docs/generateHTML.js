const marked = require('marked')
const fs = require('fs')
const path = require('path')
let prism = require('prismjs');
let loadLanguages = require('prismjs/components/');

loadLanguages(['javascript', 'css', 'html', 'bash', 'json']);

marked.setOptions({
  highlight: function(code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  }
});
let readme = fs.readFileSync(path.join(process.cwd(), '../README.md'), 'utf8')
let html = marked.parse(readme)

console.log(html)