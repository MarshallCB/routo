#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const { watch, build } = require('./src/index.js');
require = require("esm")(module)

sade('routo [input] [output]', true)
.version(pkg.version)
.describe(pkg.description)
.example('routo assets,pages public -w')
.example('routo -c custom.config.js')
.option('-w, --watch', 'Watch source directories and rebuild on changes')
.option('-s, --silent', 'Don\'t output status messages to console')
.option('-c, --config', 'Provide path to custom config file')
.action((input, output, opts) => {
  let source = input ? input.split(",").map(s => s.trim()) : null
  let destination = output
  let silent = opts.s
  let config = opts.c
  if(opts.watch){
    watch(source, destination, { silent, config })
  } else {
    build(source, destination, { silent, config })
  }
})
.parse(process.argv);