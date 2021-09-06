# [<img alt="enantiom logo" src="https://raw.githubusercontent.com/airtoxin/enantiom/master/docs/enantiom_logo.svg" height="200px" />](https://github.com/airtoxin/enantiom)

All-in-one web page screenshot testing tool.

![console](./docs/console.png)

## ✨ Features

- Take screenshot and compare with previous one
- Create static HTML report
- Change browser type / screen size
- Browser scripting

## 📦 Usage

Install the cli via **NPM**:

```
npm i -g enantiom
```

Install the cli via **Yarn**:

```
yarn global add enantiom
```

Create `enantiom.config.json`.

```json
{
  "artifact_path": "./dist",
  "screenshots": [
    "https://example.com",
    "https://time.is"
  ]
}
```

Then, run enantiom cli with config option.

```shell
$ enantiom --config enantiom.config.json
```

One more time, run same command to calculate pixel diff from previous result. 

```shell
$ enantiom --config enantiom.config.json
```

Static result report output to `dist` directory.  
Open it!

```shell
$ npx serve dist
```

## ⚙ Config

- [enantiom CLI options](./docs/CLI_OPTIONS.md)
- [enantiom.config.json](./docs/CONFIG_JSON.md)

examples are exists in [example](./example) directory.

## Development

Setup: just run `yarn`

### Tool development

```shell
$ yarn build
$ yarn link
$ enantiom --config example/enantiom.config.json
$ npx serve dist
```

### React console development

```shell
$ yarn dev --config example/enantiom.config.json
$ yarn site:dev
```

## Feature TODOs

- Debug mode
- Support AWS S3 url in artifact_path
- Minimum diff threshold
- More script hooks
- Reuse browser object option
- Verbose option in CLI
- Show configuration of screenshot in result report
- No result report (json output only) mode
- Friendly CLI help
