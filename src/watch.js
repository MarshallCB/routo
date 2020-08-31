var { build, sources, unlink } = require('./helpers')
var fs = require('fs-extra')
var walk = require('klaw-sync')
var path = require('path')
var chokidar = require('chokidar')

chokidar.watch(sources, { 
  ignored: /(^|[\/\\])[\._]./,
  ignoreInitial: true,
  // awaitWriteFinish: {
  //   stabilityThreshold: 1000,
  //   pollInterval: 200
  // }
}).on('all', (e, p) => {
  if(e === 'unlink'){
    unlink(p)
  } else {
    build(p)
  }
})
