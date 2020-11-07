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

async function buildFile(source_path, { code, exports, id } = {}){
  // is this a JS file or a raw file to copy over?
  // which builder should we use?

}

function watch(source){
  jeye.watch(source, jeye_options)
    .on("change", (p, info) => {
      log("building...")
      // buildFile(p, info)
    })
    .on("aggregate", (targets, changed) => {
      log(`${green(`routo`)}: ${bold(changed)} files changed`)
    })
    .on("ready", (p, targets) => {
      log(`${green('◤⟋◢')} ${bold('routo')} is ready`)
    })
}

async function build(source){
  let targets = await jeye.targets(source, jeye_options)
  Object.keys(targets).forEach(p => {
    // buildFile(p, targets(p))
  });
}
let frames = `

`
const spinner = ora({
  text: "initializing routo",
  spinner: {
    interval: 100,
    frames: ['◤--◢','◤\\\\◢','◤||◢','◤⟋⟋◢']
  }
}).start();
// const spinner = ora({
//   text: "augm",
//   spinner: {
//     interval: 100,
//     // frames: ['◤--◢','◤\\\\◢','◤||◢','◤⟋⟋◢']
//     frames: ['ᕳXᕲ'] //'ᕳ%ᕲ', 
//   }
// }).start();
//ᑕXᑐ
//ᑕ⤫ᑐ
// ↩
// const spinner = ora({
//   text: "componit",
//   spinner: {
//     interval: 200,
//     frames: ['⬡','⬡','⬡','⎔']
//   }
// }).start();
// let counter = 0
// let colors = ['blue','blueBright', 'blue', 'cyan', 'cyanBright', 'cyan']
// setInterval(() => {
//   spinner.color = colors[counter++ % colors.length]
// }, 200)


// log(`${green('◤◢◤◢')} ${bold('routo')} is ready`)
// log(`${green('◢◤◢◤')} ${bold('routo')} is ready`)

// watch() --> initial build + watch source directories and incrementally build

// build() --> build once

// for each file, extract name, filetype, and output typeof (Promise/Value OR Function)
// build each JS file based on config file specs
// build functions to become express-friendly functions (req,res) shit

/**
 * 
 * ⠖
 * 
 */