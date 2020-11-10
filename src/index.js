var Routo = require('./Routo')
var chalk = require('chalk')

let defaultOptions = {
  silent: false,
  ignore: /(^|[\/\\])[\._]./
}

function checkArguments(sources, destination, options){
  if(!sources || (Array.isArray(sources) && sources.length < 1)){
    console.log(`${chalk.red('◸x◿')} routo: Missing 'sources' argument`)
    return false;
  }
  if(!destination){
    console.log(`${chalk.red('◸x◿')} routo: Missing 'destination' argument`)
    return false;
  }
  return true;
}

function watch(sources, destination, options={}){
  if(checkArguments(...arguments)){
    return new Routo(sources, destination, { ...defaultOptions, ...options, watch: true });
  }
}

async function build(sources, destination, options={}){
  if(checkArguments(...arguments)){
    let routo = new Routo(sources, destination, { ...defaultOptions, ...options, watch: false})
    let targets = await routo.build()
    return targets;
  }
}

module.exports = { watch, build }