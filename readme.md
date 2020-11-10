<div align="center">
  <img src="https://github.com/marshallcb/routo/raw/main/routo.png" alt="Routo" width="75" />
</div>

<h1 align="center">routo</h1>
<div align="center">
  <a href="https://npmjs.org/package/routo">
    <img src="https://badgen.net/npm/v/routo" alt="version" />
  </a>
</div>

<div align="center">routing-based asset builder for static site generation</div>

<h3 align="center">:construction: Work in progress :construction:</h3>

## Overview

![Routo flow](https://github.com/marshallcb/routo/raw/main/docs/routo-flow.png "Overview")

## Features

- Copies static files from source to destination
- Generates files using `export default` in files named `[name].[filetype].js`
  - Export a string for text-based files (.html, .css, etc)
  - Export a Buffer for images and other raw data formats (.png, .gif, .pdf)
  - Export a Promise for asynchronous generation (useful for fetching remote data)
- Use modern, ES6 Syntax in Node thanks to [`esm`](https://github.com/standard-things/esm)
- Watches files *and their dependencies* for changes thanks to [`jeye`](https://github.com/marshallcb/jeye)
- Pairs nicely with [`serve`](https://github.com/vercel/serve) for local development
- Install size is minimal (**1.2MB**) compared to other builders (Snowpack: **17MB**, Parcel **65MB**, Webpack: **14MB**, Grunt **6MB**)
- **[Advanced]** Add filetype-specific transformers for compilation, minification, and compression
- **[Advanced]** Add aggregate builders for bundling components, styles, or any other multi-file bundle

- - -

# Roadmap

- More config options for builds/transforms
- Better documentation
- Better error handling

## Acknowledgements
- Inspired by [Next.js](https://nextjs.org/) and [Sapper](https://sapper.svelte.dev/) (and others) for their filesystem-based routing and build system

## License

MIT © [Marshall Brandt](https://m4r.sh)
