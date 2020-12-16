var fs = require('fs')
var { promisify } = require('util');
var path = require("path")
var jeye = require("jeye")
var { green, blue, bold, dim, red, yellow } = require('kleur')
var { premove } = require("premove")
var { mkdir } = require("mk-dirs/sync")
const { extname } = require("path")
require = require("esm")(module)

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)


class Routo{
  constructor({ source, destination, ignore, silent, builders, transforms }){
    Object.assign(this, { source, destination, silent, ignore })
    this.builders = builders || []
    this.transforms = transforms || []
    this.write = this.write.bind(this)
  }

  watch(){
    jeye.watch(this.source, { ignore: this.ignore, cache: require.cache })
      .on("change", async (p, info) => {
        this.loadStart = Date.now()
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
            await this.aggregate(targets, changed)
          } catch(e){
            this.error("Error with aggregate build")
            console.log(e)
            return;
          }
          if(!this.silent){
            let elapsed = Date.now() - this.loadStart
            let succeedMessage = () => this.success(`${changed.length} file${changed.length === 1 ? '' : 's'} changed in ${elapsed}ms`)
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
            this.success('routo is ready')
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
      console.log(`${red('◸x◿')} ${message}`)
    } else {
      throw message;
    }
  }
  success(message){
    if(!this.silent){
      console.log(`${green('◸✓◿')} ${message}`)
    } else {
      throw message;
    }
  }
  warn(message){
    if(!this.silent){
      console.log(`${yellow('◸!◿')} ${message}`)
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

    async function defaultBuilder(p, { id }){
      let data = await Promise.resolve(require(path.join(process.cwd(), p)).default)
      return { [id]: data }
    }

    let match = /([\w-*]+\.([\w-*]+))\.js/g.exec(p)
    let builder
    if(match){
      // use builder from config if it exists, otherwise use default builder
      builder = this.builders[match[2]] || defaultBuilder
    } else {
      builder = copyBuilder
    }
    // remove .js if it's a "builder" path
    info = { ...info, id: match ? info.id.substring(0,info.id.length-3) : info.id }
    let output = await builder(p, info)
    if(typeof output !== 'object'){
      output = { [info.id]: output }
    }
    await this.write(output)
  }

  write(output){
    let { destination, transforms } = this
    return Promise.all(Object.keys(output).map(async k => {
      let output_path = path.join(destination, k)
      let data = output[k]

      let applicable_transforms = transforms[path.extname(k).substr(1)] || []
      for(let i = 0; i < applicable_transforms.length; i++){
        data = await applicable_transforms[i](data)
      }
      // using sync to avoid simultaneous directory creation (executed in parallel)
      mkdir(path.dirname(output_path))
      await writeFile(path.join(process.cwd(), output_path), data)
    })).catch(e => {
      console.log("Error writing output files")
      console.log(e)
    })
  }

  async aggregate(targets, changed = null){

    // Object.keys(targets).forEach(p => {
    //   targets[p] = {
    //     ...targets[p],
    //     id: targets[p].id.substr(0,targets[p].id.length - 3)
    //   }
    // })

    // if(changed === null){
    //   // assume all have changed
    //   changed = Object.keys(targets)
    // }
    // let aggregates = new Set()
    // // go through each builder

    // changed.forEach(p => {
    //   let id = targets[p].id
    //   id = id.substr(0,id.length - 3)
    //   let relevant_builder = this.builders[path.extname(id)]
    //   if(relevant_builder && typeof relevant_builder.aggregate === 'function'){
    //     aggregates.add(relevant_builder)
    //   }
    // })

    // let promises = []
    // // for each triggered aggregate builder
    // aggregates.forEach(async (builder) => {
    //   // filter all possible targets to only those matched by aggregate builder
    //   let filtered_targets = {}
    //   Object.keys(targets).forEach(p => {

    //     if(match(p)){
    //       filtered_targets[p] = targets[p]
    //     }
    //   })
    //   // add async promise of aggregate builder
    //   promises.push(aggregate(filtered_targets))
    // })

    // let outputs = await Promise.all(promises)

    // await Promise.all(outputs.map(this.write))

    return;
  }

  async build(){
    try{
      let targets = await jeye.targets(this.source, { ignore: this.ignore })
      await Promise.all(
        Object.keys(targets).map(async p => {
          try{
            await this.buildFile(p, targets[p])
          } catch(e){
            this.error(p + ": " + e)
            console.log(e)
          }
        })
      )
      await this.aggregate(targets)
      return Object.keys(targets)
    } catch(e){
      this.error(e)
      console.log(e)
    }
  }

}

module.exports = Routo