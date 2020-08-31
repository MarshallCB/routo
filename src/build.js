var { build, sources, destination } = require('./helpers')
var fs = require('fs-extra')
var walk = require('klaw-sync')
var path = require('path')



module.exports = function(){
  fs.emptyDirSync(destination);

  let sourcePaths = []
  sources.forEach(source => {
    sourcePaths = sourcePaths.concat(
      walk(source, {nodir: true})
      .map(x => x.path)
      .filter(p => {
        let firstChar = path.basename(p)[0]
        return firstChar[0] != "_" && firstChar[0] != "."
      })
    )
  });

  sourcePaths.forEach(p => { 
    build(p)
  })
}