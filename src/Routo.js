var fs = require('fs')
var { promisify } = require('util');
var path = require("path")
var jeye = require("jeye")
var ora = require("ora")
var chalk = require("chalk")
var { premove } = require("premove")
var { mkdir } = require("mk-dirs/sync")
const { extname } = require("path")
require = require("esm")(module)

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

class Spinner{
  constructor(logo_art='◸/◿', loading_art=['◸-◿','◸\\◿','◸|◿','◸/◿'], error_art='◸x◿', success_art='◸✓◿'){
    Object.assign(this, { logo_art, error_art, success_art })
    this.s = ora({
    text: "initializing...",
      spinner: {
        interval: 80,
        frames: loading_art
      },
      color: 'yellow'
    })
  }
  ready(text="ready"){
    this.s.stopAndPersist({
      symbol: chalk.green(this.logo_art),
      text
    })
  }
  start(text="loading..."){
    this.s.start(text)
  }
  error(text="generic routo error"){
    this.s.stopAndPersist({
      symbol: chalk.red(this.error_art),
      text
    })
  }
  success(text="success"){
    this.s.stopAndPersist({
      symbol: chalk.green(this.success_art),
      text
    })
  }
}

class Routo{
  constructor(sources, destination, { ignore, watch, silent, config }){
    Object.assign(this, { sources, destination, silent, ignore })
    let configData = {}
    if(config && typeof config === 'string'){
      try{
        configData = require(path.join(process.cwd(), config)).default
      } catch(e){
        this.error("Invalid config path")
      }
    }
    this.config = {
      builders: [],
      transforms: [],
      ...configData
    }
    this.builders = [...this.config.builders, {
      match: (p) => {
        // returns true for style.css.js, false for robots.txt
        return /([\w-*]+)(\.[\w-*]+\.js)/g.exec(p)
      },
      build: async (p, { id }) => {
        let abs_path = path.join(process.cwd(), p)
        delete require.cache[abs_path]
        let data = await Promise.resolve(require(abs_path).default)
        // remove .js at end
        id = id.substr(0,id.length - 3)
        // if .html other than the first index, put in a folder
        if(extname(id) === '.html' && id !== '/index.html'){
          id = id.replace('.html', '/index.html')
        }
        return {
          [id]: data
        }
      }
    }]
    this.transforms = this.config.builders || []
    if(watch){
      this.spinner = new Spinner()
      this.watch()
    }
  }

  watch(){
    this.spinner.start('initializing routo...')
    jeye.watch(this.sources, { ignore: this.ignore })
      .on("change", async (p, info, changed=[]) => {
        changed.forEach(c => {
          let abs_path = path.join(process.cwd(), c)
          delete require.cache[abs_path]
        });
        if(!this.silent && !this.spinner.isSpinning){
          this.spinner.start('building...')
          this.loadStart = Date.now()
        }
        try{
          await this.buildFile(p, info)
        } catch(e){
          this.error("Error building file: " + p)
          console.log(e)
        }
        return
      })
      .on("aggregate", async (targets, changed) => {
          try{
            // await this.aggregate(targets, changed)
          } catch(e){
            this.error("Error with aggregate build")
            console.log(e)
            return;
          }
          if(!this.silent){
            let elapsed = Date.now() - this.loadStart
            let succeedMessage = () => this.spinner.success(`${changed.length} file${changed.length === 1 ? '' : 's'} changed in ${elapsed}ms`)
            if(elapsed < 300){
              setTimeout(succeedMessage, 300 - elapsed)
            } else {
              succeedMessage()
            }
          }
          return
      })
      .on("ready", (targets) => {    
        this.build().then(() => {
          if(!this.silent){
            this.spinner.ready('routo is ready')
          }
        })
      })
      .on("error", (message) => {    
        this.error(message)
      })
      .on("remove", (p) => {
        // TODO: get list of associated output paths from this source p
        // TODO: recursivevly ascend parent directories and delete if empty
        // premove(this.getOutputPaths(p))
      })
  }

  error(message){
    if(!this.silent){
      if(this.spinner){
        this.spinner.error(message)
      } else {
        console.log(`${chalk.red('◸x◿')} ${message}`)
      }
    } else {
      throw message;
    }
  }

  isBuilder(p){
    let segments = path.basename(p).split('.')
    return segments.length > 2 && segments[segments.length - 1] === 'js'
  }

  async buildFile(p, info){
      // is this a JS file or a raw file to copy over?
      // which builder should we use?
      async function copyBuilder(p, {id}){
        let data = await readFile(p)
        return { [id]: data }
      }
  
      // use builder to build file or use readFile contents
      let builder = this.builders.find(b => 
        (!b.match || (typeof b.match === 'function' && b.match(p)))
        && typeof b.build === 'function'
      )
      builder = builder ? builder.build : copyBuilder
      let output = await builder(p, info)
      let promises = Object.keys(output).map(async k => {
        let output_path = path.join(this.destination, k)
        let ensured_folder = output_path.replace(path.basename(output_path),"")
        mkdir(ensured_folder)
        await writeFile(output_path, output[k])
      })
  
      await Promise.all(promises)
    return;
  }

  async aggregate(targets, changed = null){
    if(changed === null){
      // assume all have changed
    } else {
      // only some files have changed
    }
    return;
  }

  async build(){
    try{
      let targets = await jeye.targets(this.sources, { ignore: this.ignore })
      await Promise.all(
        Object.keys(targets).map(async p => {
          try{
            await this.buildFile(p, targets[p])
          } catch(e){
            this.error(p + ": " + e)
          }
        })
      )
      await this.aggregate(targets)
      return Object.keys(targets)
    } catch(e){
      this.error(e)
    }
  }

}

module.exports = Routo