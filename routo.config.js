// TODO: reload when any of these imports changes
// like _document.at.js

export default {
  builders: [
    {
      match: p => p.endsWith('.at.js'),
      async build(p, { id }){
        let output = ""
        let dest = id.replace('.at.js', '.html')
        return { [dest]: output }
      },
      async aggregate(targets){
        //
        return {
          'sitemap.xml': sitemap
        }
      }
    }
  ],
  transforms: [
    {
      match: p => p.endsWith('.html'),
      async transform(content){
        // perform a11y checks
        // 
        return content;
      }
    }
  ]
}