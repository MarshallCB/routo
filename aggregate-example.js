const {injectManifest} = require('workbox-build');
const path = require('path')

let sw = ({ caches }) => ({
  match(p){
    if(p.endsWith('.html')){
      return true;
    }
  },
  aggregate(targets){
    const swSrc = 'src/sw.js';
    const swDest = 'build/sw.js';
    injectManifest({
      swSrc,
      swDest,
      // Other configuration options...
    }).then(({count, size}) => {
      console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
    });
  }
})

let at = ({ options }) => ({
  match: p => p.endsWith('.at.js'),
  aggregate(sources){
    let out = {}
    let routes = {}
    sources.forEach(({ data, id }) => {
      if(typeof data === 'function'){
        routes[id] = data
      } else {
        out[id] = minimize(data)
      }
    });
    out['at.js'] = rollup(routes)
    return out;
  },
  build(data){
    if(typeof data === 'function'){

    }
  }
})

export default {
  builders: [
    at({ sitemap: true })
  ],
  transforms: [
    sw({
      caches: [
        "/styles/global.css",
        "/images/*"
      ]
    }),
    compressImages(),
    inlineImg()
  ]
}