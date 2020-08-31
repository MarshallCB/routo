#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const Routo = require('./index.js');
// const build = require('./src/build')
require = require("esm")(module/*, options*/)

sade('routo', true)
.version(pkg.version)
.describe(pkg.description)
.example('routo -c custom.config.js')
.example('routo -w')
.option('-w, --watch', 'Watch source directories and rebuild on changes')
.option('-c, --config', 'Provide path to custom config file', 'routo.config.js')
.action((opts) => {
  let cPath = path.join(process.cwd(), opts.config)
  let config = {}
  try {
    config = require(cPath).default
  } catch(e){
    console.error("No config file found in current directory")
    return;
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