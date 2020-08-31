<div align="center">
  <img src="https://github.com/marshallcb/routo/raw/master/routo.png" alt="Routo" width="100" />
</div>

<h1 align="center">Routo (Work in Progress)</h1>
<div align="center">
  <a href="https://npmjs.org/package/routo">
    <img src="https://badgen.now.sh/npm/v/routo" alt="version" />
  </a>
</div>

<div align="center">Customizable static site builder</div>

## Features

- Aggregate multiple directories (`/assets` + `/pages` -> `/public`)
- Auto-build files with extension prefix `[file].[type].js` -> `[file].[type]`
- Watch source directories and dependencies for live changes
- Add conditional transforms for minification/compression
- Pairs nicely with `serve` for local development

# Usage

## Installation

```sh
npm install routo
```

## API

### Commands

### Config file options

| Property | Type | Default |
| --- | --- | --- |
| `source` | `String | [String]` | `["assets", "pages"]` |
| `destination` | `String` | `"public"` |

## Examples

Coming soon

## Details

<details>
  <summary><strong>Why I made this</strong></summary>
  <div>
    Coming soon
  </div>
</details>

- - -

# Development

### Contributing Guidelines

### Commands

### Roadmap

Coming soon

## Acknowledgements
- Inspired by Next.js and Sapper

## License

MIT © [Marshall Brandt](https://m4r.sh)
