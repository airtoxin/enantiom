# Enantiom Config JSON

The name of the configuration file can be anything you want.  
JSON file can have those fields.

# Top level fields

## artifact_path

**required** `String`

Path to result report output directory.  
Allow both of path: absolute or relative from current directory (not from this json file).

```json5
{
  artifact_path: "./dist",
}
```

or, you can also specify the S3 bucket directly.  
In this case, you need to have the appropriate AWS credential information set as an environment variable such as `AWS_ACCESS_KEY_ID` etc.  
The artifacts will be uploaded directly to the S3 bucket, and the metadata with the past execution history will also be automatically synchronized from the relevant S3 bucket.

```json5
{
  artifact_path: "s3://example_bucket/report",
}
```

## base_path

**optional** `String`
**default value `"/"`**

Specifies the path to be appended as a prefix to all paths in the report HTML.  
This will match the path from the root directory of the serve to the output directory of the report when statically serving the final output report HTML.

```json5
{
  artifact_path: "./dist",
  base_path: "/enantiom/report",
}
```

In the above example, the HTML report will be output to the `dist` directory created in the directory where you ran the CLI.  
The report contains images and links to other report files, All of these start path from `/enantiom/report/...`.  
If you are serving this report statically, for example in the `/www` directory, and you want to include its report there.  
You will need to serve the artifacts in the `dist` directory as the `report` directory in `/www/enantiom/report`.

## screenshots

**required** `Array<String | ScreenshotConfigObject>`

Array of URLs to take screenshots.  
Accepts a simple URL string `https://example.com`.  
Or you can use more complex configurable [ScreenshotConfigObject](#ScreenshotConfigObject).

```json5
{
  screenshots: [
    "https://example.com/simple", // Simple url string
    {
      // ScreenshotConfigObject
      url: "https://example.com/object",
      browsers: ["firefox", "webkit"],
      size: { width: 500, height: 500 },
    },
  ],
}
```

## sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: `{ "width": 800, "height": 600 }`**

Specifies the browser screen size.  
If size is an array, screenshot of each URL will be taken for each of those sizes.

```json5
{
  sizes: [
    { width: 600, height: 400 },
    { width: 1200, height: 800 },
  ],
}
```

## browsers

**optional** `BrowserType | BrowserConfigObject | Array<BrowserType | BrowserConfigObject>`  
**default value: `"chromium"`**

Specifies the browser type to be used for taking screenshots.  
Valid browser types are `"chromium"`, `"firefox"` or `"webkit"`.
If you want to configure more details of browser, use [BrowserConfigObject](#BrowserConfigObject) instead of simple browser type string.  
If the browser type is an array, screenshot of each URL will be taken for each of those browsers.

```json5
{
  browsers: [
    "chromium", // Simple
    {
      // BrowserConfigObject
      browser: "firefox",
      size: { width: 500, height: 500 },
    },
  ],
}
```

## scripting

**optional** `ScriptingConfigObject`

See [more details](./SCRIPTING.md).

```json5
{
  scripting: {
    context_scripts: [],
    pre_scripts: [],
    post_scripts: [],
  },
}
```

## concurrency

**optional** `Number`  
**default value: `1`**

Concurrency of screenshot taking.

## retry

**optional** `Number`  
**default value: `0`**

Num of retry count if error occurred in screenshot taking.

## diff_options

**optional** `ODiffOptions`  
**default value: `{ "outputDiffMask": true }`**

Options of calculating diff image.  
It pass-through to [odiff](https://github.com/dmtrKovalenko/odiff) library that internally uses.  
[ODiffOptions](https://github.com/dmtrKovalenko/odiff#nodejs-1)

# ScreenshotConfigObject

```json5
{
  url: "https://example.com",
  browsers: [
    "chromium",
    {
      browser: "firefox",
      sizes: [
        { width: 500, height: 500 },
        { width: 1200, height: 800 },
      ],
    },
  ],
  sizes: { width: 800, height: 600 },
}
```

Above settings takes those screenshots

- example.com in 800x600 sized chromium
- example.com in 500x500 sized firefox
- example.com in 1200x800 sized firefox

## ScreenshotConfigObject.url

**required** `String`

The URL to take screenshots.  
Only accepts simple string URL.

## ScreenshotConfigObject.sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: top level `"sizes"` field value**

Specifies the browser screen size.  
Same interface of top level [sizes](#sizes) field.

## ScreenshotConfigObject.browsers

**optional** `BrowserType | BrowserConfigObject | Array<BrowserType | BrowserConfigObject>`  
**default value: ScreenshotConfigObject.sizes field value**

Specifies the browser type to be used for taking screenshot.  
Same interface of top level [browsers](#browsers) field.

## ScreenshotConfigObject.diff_options

**optional** `ODiffOptions`  
**default value: top level `"diff_options"` field value**

Options of calculating diff image.  
Same interface of top level [diff_options](#diff_options) field.

## ScreenshotConfigObject.scripting

**optional** `ScriptingConfigObject`
**default value: top level `"scripting"` field value**

See [more details](./SCRIPTING.md).

# BrowserConfigObject

```json5
{
  browser: "firefox",
  sizes: [
    { width: 500, height: 500 },
    { width: 1200, height: 800 },
  ],
}
```

Above BrowserConfigObject takes those screenshots

- URL in 500x500 sized firefox
- URL in 1200x800 sized firefox

## BrowserConfigObject.browser

**required** `BrowserType`

The browser type to take screenshot.  
Only accepts BrowserType string.  
Valid browser types are `"chromium"`, `"firefox"` or `"webkit"`.

## BrowserConfigObject.sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: parent (top level or ScreenshotConfigObject) `"sizes"` field value**

Specifies the browser screen size.  
Same interface of top level [sizes](#sizes) field.
