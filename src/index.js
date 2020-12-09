var Routo = require('./Routo')
var { red } = require('kleur')

let default_config = {
  silent: false,
  ignore: /(^|[\/\\])[\._]./,
  builders: [],
  transforms: [],
  destination: "public",
  // no default source for now...
}

function checkConfig({ source, destination }){
  if(!source){
    // TODO: check to see if each source is a valid directory
    console.log(`${red('◸x◿')} routo: Missing 'sources' argument`)
    return false;
  }
  if(!destination){
    console.log(`${red('◸x◿')} routo: Missing 'destination' argument`)
    return false;
  }
  // TODO: check validity of other parameters for nice error messages
  return true;
}

function watch(config={}){
  config = { 
    ...default_config,
    ...config
  }
  if(checkConfig(config)){
    let r = new Routo(config);
    r.watch()
    return r;
  }
}

async function build(config={}){
  config = { 
    ...default_config,
    ...config
  }
  if(checkConfig(config)){
    let routo = new Routo(config)
    let targets = await routo.build()
    return targets;
  }
}

module.exports = { watch, build }