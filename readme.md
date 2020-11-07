<div align="center">
  <img src="https://github.com/marshallcb/routo/raw/main/routo.png" alt="Routo" width="100" />
</div>

<h1 align="center">Routo (Work in Progress)</h1>
<div align="center">
  <a href="https://npmjs.org/package/routo">
    <img src="https://badgen.now.sh/npm/v/routo" alt="version" />
  </a>
</div>

<div align="center">Lightweight custom static site builder</div>

## Features

- Aggregate multiple directories (`/assets` + `/pages` -> `/public`)
- Auto-build files with extension prefix `[file].[type].js` -> `[file].[type]`
- Watch source files + their dependencies for live changes during development
- Add conditional transforms for compilation, minification, compression
- Accepts both ES6 and CJS syntax
- Pairs nicely with `serve` for local development

## Installation

```sh
npm install routo
```

## Example

#### `routo.config.js`
```js
  export default {
    source: ["pages", "assets"],
    destination: "public"
  }
```
`routo -w & serve public` will watch all files in `/pages` and `/assets`, build them to `/public`, and serve to a local webserver

## Details

<details>
  <summary><strong>Why I made this</strong></summary>
  <div>
    I enjoy the development experience of building websites with [Next.js](https://nextjs.org/) and [Svelte](https://svelte.dev/)/[Sapper](https://sapper.svelte.dev/), but I also enjoy the minimalism and control of libraries like [µcontent](https://github.com/WebReflection/ucontent)/[µhtml](https://github.com/WebReflection/uhtml). I made `routo` to be an agnostic static site builder for projects without an all-inclusive site framework. `routo` aims to create a smooth developer experience with minimal overhead and maximum customizability.
  </div>
</details>

- - -

# Roadmap

- Incremental builds on prod environment based on git diff
- More config options for builds/transforms

## Acknowledgements
- Inspired by [Next.js](https://nextjs.org/) and [Sapper](https://sapper.svelte.dev/)

## License

MIT © [Marshall Brandt](https://m4r.sh)
