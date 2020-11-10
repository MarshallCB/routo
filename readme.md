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

## Features

- Copies static files from source directories to output directory
- Generates files with JS
  - `src/index.html.js` --> `out/index.html`
  - `src/styles.css.js` --> `out/styles.css`
  - `src/data.json.js` --> `out/data.json`
  - `src/sprite-sheet.png.js` --> `out/sprite-sheet.png`
- Watches files *and their dependencies* for changes thanks to [`jeye`](https://github.com/marshallcb/jeye)
- Add filetype-specific transformers for compilation, minification, and compression
- Add aggregate builders for bundling components, styles, or any other multi-file bundle
- Pairs nicely with [`serve`](https://github.com/vercel/serve) for local development

## Overview

![Routo flow](https://github.com/marshallcb/routo/raw/main/docs/routo-flow.png "Overview")

## Installation

```sh
npm install routo
```

## Example

`routo pages,assets public -w & serve public` will watch all files in `/pages` and `/assets`, build them to `/public`, and serve to a local webserver

- - -

# Roadmap

- More config options for builds/transforms
- Better error handling

## Acknowledgements
- Inspired by [Next.js](https://nextjs.org/) and [Sapper](https://sapper.svelte.dev/) (and others) for their filesystem-based routing and build system

## License

MIT © [Marshall Brandt](https://m4r.sh)
