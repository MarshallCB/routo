var fs = require('fs-extra')
var path = require('path')
require = require("esm")(module)
var { watch } = require('jeye')

class Routo{
  constructor(config){
    const src = config.source
    this.sources = Array.isArray(src) ? src : [src];
    this.destination = config.destination
    this.cwd = process.cwd()
    this.ignored = /(^|[\/\\])[\._]./
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
    let segs = base.split('.')
    return { id, output, absolute, base, segs }
  }

  buildFile(p){
    let { id, output, absolute, base, segs } = this.transformPath(p)
    // Purge cache to prevent stale builds
    delete require.cache[absolute]
    // Retrieve type from file: [file].[type].js
    let type = segs[1]

    // ignore based on config and ignore directories / files without an extension
    if(p.match(this.ignored) || segs.length == 1) return;
    // Don't build files not in source directort
    if(!this.sources.some(s => p.includes(s))) return


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
            // TODO: pass through transformers based on type first
            // TODO: Improve filepath generation logic (could b simpler for sure)
            fs.writeFileSync(file_output, m[k])
          })
        }
        else {
          // Make pretty URLS by making all pages index.html of a folder
          let file_output =  type === 'html' && base != 'index.html.js' ? 
            path.join(output.substr(0,output.length-4-type.length), '/index.html') :
            output.substr(0,output.length-3)
          fs.ensureFileSync(file_output)
          // TODO: pass through builders based on type & config first
          fs.writeFileSync(file_output, m)

        }
      }).catch(e => {
        console.error(e)
      })
    } else {
      // directly copy file if not specialized JS
      // TODO: pass through transformers based on config
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

    glob(this.sourcesGlob, (err, files) => { 
      files.forEach(p => {
        this.buildFile(p)
      })
    })
  }

  devBuild(p){
    let { id } = this.transformPath(p)
    this.buildFile(p)
    let dependencies = this.getFileDependencies(p).map(d => path.join(p,'../',d))
    if(dependencies.length > 0){
      dependencies.forEach(d => {
        if(this.dependents[d]){
          this.dependents[d].add(p)
        } else {
          this.dependents[d] = new Set([p])
        }
      })
    }
    if(this.dependents[p]){
      // TODO: how to prevent double builds?????
      this.dependents[p].forEach(x => {
        this.watcher.add(this.devBuild(x))
      })
    }
    return dependencies;
  }

  watch(){
    console.log(this.sourcesGlob)
    let files = glob.sync(this.sourcesGlob)
    console.log(files)
    this.watcher = chokidar.watch(files)
    this.watcher.on('all', (e, p) => {
      if(e === 'unlink'){
        this.unlinkFile(p)
        // TODO: Remove dependencies that are unneeded now
      } else {
        this.watcher.add(this.devBuild(p))
      }
    })
  }
}

module.exports = Routo;