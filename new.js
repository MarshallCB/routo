var fs = require("fs-extra")
var path = require("path")
var jeye = require("jeye")
var ora = require("ora")
var { green, blue, red, yellow, aqua, gray, bold, underline } = require("kleur")
require = require("esm")(module)
var { log } = console

const jeye_options = {
  ignore: /(^|[\/\\])[\._]./
}

let builders = {}

async function buildFile(source_path, { code, exports, id, js } = {}, destination){
  // is this a JS file or a raw file to copy over?
  // which builder should we use?
  let output_path = path.join(process.cwd(), destination, id)
  let segments = path.basename(id).split('.')
  // file like index.html
  if(segments.length == 2){
    output = await fs.readFile(source_path)
  }
  // files with builders
  if(segments.length > 2 && segments[segments.length - 1] === 'js' && exports.includes('default')){
    segments.pop() // remove .js
    output_path = output_path.substr(0, output_path.length - 3) // remove .js from output_path
    let builder_type = segments.pop() // get "html" from file.html.js
    let abs_path = path.join(process.cwd(), source_path)
    delete require.cache[abs_path]
    let data = await Promise.resolve(require(abs_path).default)
    if(typeof data === 'function'){
      log("FUNCTION WAS EXPORTED")
    }
    else {
      let builder = builders[builder_type]
      if(builder){
        output = await builder(data)
      } else {
        output = data
      }
    }
  }
  await fs.ensureFile(output_path)
  await fs.writeFile(output_path, output)
  return true;
}

// ◤⟋◢
// ◤ ̷◢  // this one is sketchy and yet very nice looking

const spinner = ora({
  text: "building...",
  spinner: {
    interval: 80,
    frames: ['◤-◢','◤\\◢','◤|◢','◤ ̷◢']
  }
})

function watch(source, destination){
  spinner.start()
  jeye.watch(source, jeye_options)
    .on("change", (p, info) => {
      spinner.start()
      buildFile(p, info, destination)
    })
    .on("aggregate", (targets, changed) => {
      setTimeout(() => {
        spinner.stopAndPersist({
          symbol: green('◤ ̷◢'),
          text: `${changed.length} file${changed.length === 1 ? '' : 's'} changed`
        })
      }, 200)
    })
    .on("ready", (targets) => {    
      Object.keys(targets).forEach(p => {
        buildFile(p, targets[p], destination)
      })
      spinner.stopAndPersist({
        symbol: green('◤ ̷◢'),
        text: `routo is ready`
      })
    })
    .on("remove", (p) => {
      console.log(p)
      // TODO: extract the computed filename by abstracting that logic into its own method
      // fs.removeSync(path.join(process.cwd(), destination, id))
    })
}

async function build(source, destination){
  let targets = await jeye.targets(source, jeye_options)
  Object.keys(targets).forEach(p => {
    buildFile(p, targets[p])
  });
  return Object.keys(targets)
}

watch('test', 'out')