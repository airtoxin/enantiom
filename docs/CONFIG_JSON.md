## Enantiom Config JSON

The name of the configuration file can be anything you want.  
JSON file can have those fields.

## Top level fields

### artifact_path

**required** `String`

Path to result report output directory.  
Allow both of path: absolute or relative from current directory (not from this json file).

```json
{
  "artifact_path": "./dist"
}
```

### screenshots

**required** `Array<String | ScreenshotConfigObject>`

Array of URLs to take screenshots.  
Accepts a simple URL string `https://example.com`.  
Or you can use more complex configurable [ScreenshotConfigObject](#ScreenshotConfigObject).

```json5
{
  "screenshots": [
    "https://example.com/simple", // Simple url string
    { // ScreenshotConfigObject
      "url": "https://example.com/object",
      "browsers": ["firefox", "webkit"],
      "size": { "width": 500, "height": 500 }
    }
  ]
}
```

### sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: `{ width: 800, height: 600 }`**

Specifies the browser screen size.  
If size is an array, screenshot of each URL will be taken for each of those sizes.

```json5
{
  "sizes": [
    { "width": 600, "height": 400 },
    { "width": 1200, "height": 800 }
  ]
}
```

### browsers

**optional** `BrowserType | BrowserConfigObject | Array<BrowserType | BrowserConfigObject>`  
**default value: `"chromium"`**

Specifies the browser type to be used for taking screenshots.  
Valid browser types are `"chromium"`, `"firefox"` or `"webkit"`.
If you want to configure more details of browser, use [BrowserConfigObject](#BrowserConfigObject) instead of simple browser type string.  
If the browser type is an array, screenshot of each URL will be taken for each of those browsers.

```json5
{
  "browsers": [
    "chromium", // Simple 
    { // BrowserConfigObject
      "browser": "firefox", 
      "size": { "width": 500, "height": 500 }
    }
  ]
}
```

### pre_script_path

**optional** `String`

Path to script js file.  
Allow both of path: absolute or relative from current directory (not from this json file).  
[example script](../example/scrollToBottom.js)

Script file should export one default async function.  

```typescript
(
  page: PlaywrightPage, 
  browser: PlaywrightBrowser, 
  context: PlaywrightBrowserContext
) => Promise<void>
```

[PlaywrightPage class](https://playwright.dev/docs/api/class-page)  
[PlaywrightBrowser class](https://playwright.dev/docs/api/class-browser)  
[PlaywrightBrowserContext class](https://playwright.dev/docs/api/class-browsercontext)

### concurrency

**optional** `Number`  
**default value: `1`**

Concurrency of screenshot taking.

### retry

**optional** `Number`  
**default value: `0`**

Num of retry count if error occurred in screenshot taking.

## ScreenshotConfigObject

```json5
{
  "url": "https://example.com",
  "browsers": [
    "chromium", 
    { 
      "browser": "firefox", 
      "sizes": [
        { "width": 500, "height": 500 },
        { "width": 1200, "height": 800 }
      ]
    }
  ],
  "sizes": { "width": 800, "height": 600 }
}
```

Above settings takes those screenshots

- example.com in 800x600 sized chromium
- example.com in 500x500 sized firefox
- example.com in 1200x800 sized firefox

### ScreenshotConfigObject.url

**required** `String`

The URL to take screenshots.  
Only accepts simple string URL.

### ScreenshotConfigObject.sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: top level `"sizes"` field value**

Specifies the browser screen size.  
Same interface of top level [sizes](#sizes) field.


### ScreenshotConfigObject.browsers

**optional** `BrowserType | BrowserConfigObject | Array<BrowserType | BrowserConfigObject>`  
**default value: ScreenshotConfigObject.sizes field value**

Specifies the browser type to be used for taking screenshot.  
Same interface of top level [browsers](#browsers) field.

## BrowserConfigObject

### BrowserConfigObject.browser

**required** `BrowserType`

The browser type to take screenshot.  
Only accepts BrowserType string.  
Valid browser types are `"chromium"`, `"firefox"` or `"webkit"`.

### BrowserConfigObject.sizes

**optional** `WidthAndHeight | Array<WidthAndHeight>`  
**default value: parent (top level or ScreenshotConfigObject) `"sizes"` field value**

Specifies the browser screen size.  
Same interface of top level [sizes](#sizes) field.
