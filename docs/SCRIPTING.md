# Scripting

## ScriptingConfigObject

ScriptingConfigObject has those fields `context_scripts`, `pre_scripts`, and `post_scripts`.  
Each field can have a special string `ScriptString` to specify an operation by a script.
If you specify multiple of these ScriptString, those scripting operations will be executed in order from first one.

```json5
{
  "scripting": {
    "context_scripts": ["..."],
    "pre_scripts": ["..."],
    "post_scripts": ["..."]
  }
}
```

### ScriptString

ScriptString is used for operates internally used page or browser.  
All of ScriptString should be formed with `[op_name]=...`  
ScriptString can be one of the following

- `[timeout]=time`:  Waits for the given `time` in milliseconds. Internally uses [Page.waitForTimeout](https://playwright.dev/docs/api/class-page/#page-wait-for-timeout).
- `[selector]=selector`: Waits until the result of the querying `selector` becomes available. Internally uses [Page.waitForSelector](https://playwright.dev/docs/api/class-page/#page-wait-for-selector). List of [Selectors](https://playwright.dev/docs/selectors/)
- `[url]=url`: Wait for the transition to the given `url`. Internally uses [Page.waitForURL](https://playwright.dev/docs/api/class-page#page-wait-for-url).
- `[request]=url`: Waits for the matching `url` request. Internally uses [Page.waitForRequest](https://playwright.dev/docs/api/class-page#page-wait-for-request).
- `[response]=url`: Waits for the matching `url` response. Internally uses [Page.waitForResponse](https://playwright.dev/docs/api/class-page#page-wait-for-response).
- `[navigation]=url`: Waits for the main frame navigation to `url`. Internally uses [Page.waitForNavigation](https://playwright.dev/docs/api/class-page#page-wait-for-navigation).
- `[state]=event`: Waits for the required load state `event` has been reached. Available events are `load`, `domcontentloaded`, `networkidle`. Internally uses [Page.waitForLoadState](https://playwright.dev/docs/api/class-page#page-wait-for-load-state).
- `[event]=event`: Waits for given `event` fired. Internally uses [Page.waitForEvent](https://playwright.dev/docs/api/class-page#page-wait-for-event).
- `[file]=path`: Executes JavaScript file on `path`. File must export default function that have below interface.

```typescript
import { Browser, BrowserContext, Page  } from "playwright";
(page: Page, browser: Browser, context, BrowserContext) => Promise<unknown>
```

## ScriptingConfigObject.context_scripts

**optional** `ScriptString | Array<ScriptString>`

Used for configure the browser and page.  
All ScriptStrings are executed before the page load.

## ScriptingConfigObject.pre_scripts

**optional** `ScriptString | Array<ScriptString>`

Used for manipulate elements in a page or wait for an element to appear to take a screenshot.  
All ScriptStrings are executed before taking a screenshot.

## ScriptingConfigObject.post_scripts

**optional** `ScriptString | Array<ScriptString>`

Used for clean up the page.  
All ScriptStrings are executed after taking a screenshot.
