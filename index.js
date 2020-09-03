var fs = require('fs-extra')
var walk = require('klaw-sync')
var path = require('path')
var chokidar = require('chokidar')
var onExit = require('signal-exit');
require = require("esm")(module/*, options*/)

class Routo{
  constructor(config){
    const src = config.source
    this.sources = Array.isArray(src) ? src : [src];
    this.destination = config.destination
    this.cwd = config.cwd
  }

  transformPath(p){
    // Normalize path after removing cwd() prefix
    p = path.join(p.replace(this.cwd, ""))
    let id = p
    this.sources.forEach(src => {
      id = id.replace(src + "/", "")
    });
    let output = path.join(this.destination, id)
    let absolute = path.join(this.cwd, p)
    let base = path.basename(id)
    return { id, output, absolute, base }
  }

  buildFile(p){
    let { id, output, absolute, base } = this.transformPath(p)
    // Purge cache to prevent stale builds
    delete require.cache[absolute]
  
    let segs = base.split('.')
    // Retrieve type from file: [file].[type].js
    let type = segs[1]

    if(segs.length === 3 && segs[2] === 'js'){
      let mod = require(absolute)
      mod = mod && mod.__esModule ? mod.default : mod
      Promise.resolve(mod).then(m => {
        // TODO: recursively dive into object
        if(typeof m === 'object'){
          let keys = Object.keys(m)
          keys.forEach(k => {
            // Convert to [folder]/[key].[type]
            let file_output = type === 'html' ? 
              path.join(output.substr(0,output.length-4-type.length), `${k}/index.html`) :
              path.join(output.substr(0,output.length-4-type.length),`${k}.${type}`)
            fs.ensureFileSync(file_output)
            // write file after 
            // TODO: pass through transformers based on type first
            // TODO: Improve filepath generation logic (could b simpler for sure)
            fs.writeFileSync(file_output, m[k])
          })
        }
        else {
          // Remove .js from output file name: [file].type
          let file_output =  type === 'html' && base != 'index.html.js' ? 
            path.join(output.substr(0,output.length-4-type.length), '/index.html') :
            output.substr(0,output.length-3)
          fs.ensureFileSync(file_output)
          // write file after 
          // TODO: pass through transformers based on type first
          fs.writeFileSync(file_output, m)

        }
      }).catch(e => {
        console.error(e)
      })
    } else if(segs.length != 1){
      // ignore if directory
      fs.ensureFileSync(output)
      fs.copyFileSync(p, output)
    }
  }

  unlinkFile(p){
    let { output } = this.transformPath(p)
    fs.unlinkSync(output)
  }

  build(){
    fs.emptyDirSync(this.destination);

    let sourcePaths = []
    this.sources.forEach(source => {
      sourcePaths = sourcePaths.concat(
        walk(source, {nodir: true})
        .map(x => x.path)
        .filter(p => {
          // TODO: sync with regex used by Chokidar, and allow for override in config file
          let firstChar = path.basename(p)[0]
          return firstChar[0] != "_" && firstChar[0] != "."
        })
      )
    });

    sourcePaths.forEach(p => { 
      this.buildFile(p)
    })
  }

  watch(){
    this.build()
    let watcher = chokidar.watch(this.sources, { 
      ignored: /(^|[\/\\])[\._]./,
      ignoreInitial: true,
      // awaitWriteFinish: {
      //   stabilityThreshold: 1000,
      //   pollInterval: 200
      // }
    })
    watcher.on('all', (e, p) => {
      if(e === 'unlink'){
        this.unlinkFile(p)
      } else {
        this.buildFile(p)
      }
    })
    onExit(() => {
      watcher.close().then(() => {})
    })
  }
}

module.exports = Routo;