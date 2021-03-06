<div align="center">
  <img src="https://github.com/marshallcb/routo/raw/main/meta/routo.png" alt="Routo" width="60" />
</div>

<h1 align="center">routo</h1>
<div align="center">
  <a href="https://npmjs.org/package/routo">
    <img src="https://badgen.net/npm/v/routo" alt="version" />
  </a>
  <a href="https://packagephobia.com/result?p=routo">
    <img src="https://badgen.net/packagephobia/install/routo" alt="install size" />
  </a>
</div>

<h3 align="center">filesystem-routing builder for static site generation</h3>

<p align="center">:construction: Work in progress :construction:</p>

<div align="center">
  <a href="#Usage"><b>Usage</b></a> | 
  <a href="#API"><b>API</b></a> | 
  <a href="#Examples"><b>Examples</b></a> | 
  <a href="#Details"><b>Details</b></a>
</div>

# Overview

![How routo works](https://github.com/marshallcb/routo/raw/main/meta/routo-build.png "How routo works")

## How it works

- Generates files using `export default` in files named `[name].[filetype].js`
  - Export a String for text-based files (.html, .css, etc)
  - Export a Buffer for images and other raw data formats (.png, .gif, .pdf)
  - Export a Promise for asynchronous generation (useful for fetching remote data)
- Copies normal, static files from source to destination automatically

## Features

- Write modern, ES6 Syntax in Node thanks to [`esm`](https://github.com/standard-things/esm)

- Watches files *and their dependencies* for changes thanks to [`jeye`](https://github.com/marshallcb/jeye)

- Install size is minimal compared to other builders

  - ![install size](https://badgen.net/packagephobia/install/routo/?label=routo&color=1A5) ![install size](https://badgen.net/packagephobia/install/grunt/?label=grunt&color=6A3) ![install size](https://badgen.net/packagephobia/install/webpack/?label=webpack&color=B71) ![install size](https://badgen.net/packagephobia/install/snowpack/?label=snowpack&color=B71) ![install size](https://badgen.net/packagephobia/install/parcel/?label=parcel&color=921) 

- **[Advanced]** Add filetype-specific transformers for compilation, minification, and compression

- **[Advanced]** Add aggregate builders for bundling components, styles, or any other multi-file bundle

---

# Usage

![Routo overview](https://github.com/marshallcb/routo/raw/main/meta/routo-overview.png "Routo overview")

### Cloneable Template

:construction: Work in progress :construction:

### Custom Configuration

**Install `routo` & `serve`**
```bash
npm i routo && npm i -D serve
```

**Setup `dev` and `build` scripts**

```json
"scripts": {
  "dev": "routo pages,assets public -w & serve public",
  "build": "routo pages,assets public"
}
```

### Deployment

:construction: Work in progress :construction:

# API

### CLI

:construction: Work in progress :construction:

### Config File

:construction: Work in progress :construction:

## Advanced

### Builders

:construction: Work in progress :construction:

### Transforms

:construction: Work in progress :construction:

---

# Examples

- Static HTML page
- CSS Generator
- Folder of blog pages
- Spritesheet generator
- Remote data fetching

:construction: Work in progress :construction:

---

# Details

## Roadmap

- More config options for builds/transforms
- Better error handling and messages

## License

MIT © [Marshall Brandt](https://m4r.sh)
