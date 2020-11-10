var fs = require("fs-extra")
var path = require("path")
var jeye = require("jeye")
var ora = require("ora")
var chalk = require("chalk")
require = require("esm")(module)

// ◸ ̷◿   ◸/◿   ◤/◢

class Routo{
  constructor(sources, destination, { ignore, watch, silent }){
    Object.assign(this, { sources, destination, silent, ignore, builders:{} })
    if(watch){
      this.spinner = ora({
        text: "building...",
        spinner: {
          interval: 80,
          frames: ['◸-◿','◸\\◿','◸|◿','◸/◿']
        },
        color: 'yellow'
      })
      this.watch()
    }
  }

  watch(){
    if(!this.silent){
      this.spinner.start()
    }
    jeye.watch(this.sources, { ignore: this.ignore })
      .on("change", async (p, info) => {
        if(!this.silent && !this.spinner.isSpinning){
          this.spinner.start()
          this.loadStart = Date.now()
        }
        try{
          await this.buildFile(p, info)
        } catch(e){
          this.error("Error building file: " + p)
        }
        return
      })
      .on("aggregate", async (targets, changed) => {
          try{
            await this.aggregate(targets, changed)
          } catch(e){
            this.error("Error with aggregate build")
            return;
          }
          if(!this.silent){
            let elapsed = Date.now() - this.loadStart
            if(elapsed < 50){
              setTimeout(() => {
                this.spinner.stopAndPersist({
                  symbol: chalk.green('◸/◿'),
                  text: `${changed.length} file${changed.length === 1 ? '' : 's'} changed in ${elapsed}ms`
                })
              }, 300)
            } else {
              this.spinner.stopAndPersist({
                symbol: chalk.green('◸/◿'),
                text: `${changed.length} file${changed.length === 1 ? '' : 's'} changed ${elapsed}ms`
              })
            }
          }
          return
      })
      .on("ready", (targets) => {    
        this.build().then(() => {
          if(!this.silent){
            this.spinner.stopAndPersist({
              symbol: chalk.green('◸/◿'),
              text: `routo is ready`
            })
          }
        })
      })
      .on("error", (message) => {    
        this.error(message)
      })
      .on("remove", (p) => {
        fs.remove(this.getOutputPath(p))
      })
  }

  error(message){
    if(!this.silent){
      if(this.spinner){
        this.spinner.stopAndPersist({
          symbol: chalk.red('◸x◿'),
          text: message
        })
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
  
  getOutputPath(p){
    let id=p
    this.sources.forEach(src => {
      if(p.startsWith(src)){
        id = p.replace(src,"")
      }
    });
    let output_path = path.join(process.cwd(), this.destination, id)
    if(this.isBuilder(id)){
      return output_path.substr(0,output_path.length - 3)
    } else {
      return output_path;
    }
  }

  async buildFile(p, info){
    // is this a JS file or a raw file to copy over?
    // which builder should we use?

    let output_path = this.getOutputPath(p)
    let segments = path.basename(p).split('.')
    let output


    // file like index.html
    // files with builders
    if(this.isBuilder(p)){
      segments.pop() // remove .js
      let builder_type = segments.pop() // get "html" from file.html.js
      let abs_path = path.join(process.cwd(), p)
      delete require.cache[abs_path]
      let data = await Promise.resolve(require(abs_path).default)
      if(typeof data === 'function'){
        log("FUNCTION WAS EXPORTED")
      }
      else {
        let builder = this.builders[builder_type]
        if(builder){
          output = await builder(data)
        } else {
          output = data
        }
      }
    } else {
      output = await fs.readFile(p)
    }
    await fs.ensureFile(output_path)
    await fs.writeFile(output_path, output)
    return true;
  }

  async aggregate(targets, changed = null){
    if(changed === null){
      // assume all have changed
    } else {
      // only some files have changed
    }
  }

  async build(){
    try{
      let targets = await jeye.targets(this.sources, { ignore: this.ignore })
      await Promise.all(
        Object.keys(targets).map(async p => {
          await this.buildFile(p, targets[p])
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