# Scripting

## ScriptingConfigObject

ScriptingConfigObject has those fields `context_scripts`, `pre_scripts`, and `post_scripts`.  
Each field can have a special string `ScriptString` to specify an operation by a script.
If you specify multiple of these ScriptString, those scripting operations will be executed in order from first one.

```json5
{
  scripting: {
    context_scripts: ["..."],
    pre_scripts: ["..."],
    post_scripts: ["..."],
  },
}
```

### ScriptString

ScriptString is used for operates internally used page or browser.  
All of ScriptString should be formed with `[op_name]=...`  
ScriptString can be one of the following

- `[wait-timeout]=time`: Waits for the given `time` in milliseconds. [details](https://playwright.dev/docs/api/class-page/#page-wait-for-timeout).
- `[wait-selector]=selector`: Waits until the result of the querying `selector` becomes available. [details](https://playwright.dev/docs/api/class-page/#page-wait-for-selector).
- `[wait-url]=url`: Waits for the transition to the given `url`. [details](https://playwright.dev/docs/api/class-page#page-wait-for-url).
- `[wait-request]=url`: Waits for the matching `url` request. [details](https://playwright.dev/docs/api/class-page#page-wait-for-request).
- `[wait-response]=url`: Waits for the matching `url` response. [details](https://playwright.dev/docs/api/class-page#page-wait-for-response).
- `[wait-navigation]=url`: Waits for the main frame navigation to `url`. [details](https://playwright.dev/docs/api/class-page#page-wait-for-navigation).
- `[wait-state]=event`: Waits for the required load state `event` has been reached. Available events are `load`, `domcontentloaded`, `networkidle`. [details](https://playwright.dev/docs/api/class-page#page-wait-for-load-state).
- `[wait-event]=event`: Waits for given `event` fired. [details](https://playwright.dev/docs/api/class-page#page-wait-for-event).
- `[set-timeout]=time`: Set given `time` as milliseconds to page scripting timeout. [details](https://playwright.dev/docs/api/class-page#page-set-default-timeout)
- `[click]=selector`: Click given `selector` element. [details](https://playwright.dev/docs/api/class-page#page-click)
- `[dblclick]=selector`: Double-click given `selector` element. [details](https://playwright.dev/docs/api/class-page#page-dblclick)
- `[exec-file]=path`: Executes JavaScript file on `path`. File must export default function that have below interface.

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
