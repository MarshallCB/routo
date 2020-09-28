#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Routo = require('./index.js');
require = require("esm")(module)

sade('routo [input] [output]', true)
.version(pkg.version)
.describe(pkg.description)
.example('routo assets,pages public -w')
.example('routo -c custom.config.js')
.option('-w, --watch', 'Watch source directories and rebuild on changes')
.option('-c, --config', 'Provide path to custom config file')
.action((input, output, opts) => {
  let config = {
    source: input.split(",").map(s => s.trim()),
    destination: output
  }
  if(opts.config){
    let configPath = path.join(process.cwd(), opts.config)
    try {
      config = { ...config, ...require(configPath).default }
    } catch(e){
      console.log("Error loading config file: ", opts.config)
    }
  }
  let routo = new Routo(config)
  if(opts.watch){
    routo.watch()
  } else {
    routo.build()
  }
})
.parse(process.argv);