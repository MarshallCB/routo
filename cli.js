#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Routo = require('./index.js');
require = require("esm")(module)

sade('routo', true)
.version(pkg.version)
.describe(pkg.description)
.example('routo -c custom.config.js')
.example('routo -w')
.option('-w, --watch', 'Watch source directories and rebuild on changes')
.option('-c, --config', 'Provide path to custom config file', 'routo.config.js')
.option('-i, --input', 'Provide comma-separated source directories', 'source')
.option('-o --output', 'Provide output directory', 'public')
.action((opts) => {
  let configPath = path.join(process.cwd(), opts.config)
  let config = {
    source: opts.i.split(",").map(s => s.trim()),
    destination: opts.o
  }
  try {
    config = require(configPath).default
  } catch(e){

  }
  let routo = new Routo({ cwd: process.cwd(), ...config })
  if(opts.watch){
    routo.watch()
  } else {
    routo.build()
  }
  // Program handler
})
.parse(process.argv);