var config = require('../routo.config.js')
var path = require('path')
var fs = require('fs-extra')

const { source, destination } = config

const sources = Array.isArray(source) ? source : [source];

function transformPath(p){
  p = path.join(p.replace(process.cwd(), ""))
  let id = p
  // TODO: make sure ID doesn't already exist
  sources.forEach(source => {
    console.log(source)
    id = id.replace(source + "/", "")
  });
  let output = path.join(destination, id)
  let absolute = path.join(process.cwd(), p)
  let base = path.basename(id)
  return { id, output, absolute, base }
}

function build(p){
  console.log(transformPath(p))
  let { id, output, absolute, base } = transformPath(p)
  delete require.cache[absolute]

  let segs = base.split('.')
  if(segs.length === 3 && segs[2] === 'js'){
    console.log(absolute)
    let m = require(absolute)
    // Retrieve type from file: [file].[type].js
    let type = segs[1]
    // Remove .js from output file name: [file].type
    output = output.substr(0,output.length-3)
    fs.ensureFileSync(output)
    // write file after 
    fs.writeFileSync(output, m.toString())
  } else {
    fs.ensureFileSync(output)
    fs.copyFileSync(p, output)
  }
}

function unlink(p){
  let { output } = transformPath(p)
  fs.unlinkSync(output)
}

module.exports = { sources, build, unlink, destination }