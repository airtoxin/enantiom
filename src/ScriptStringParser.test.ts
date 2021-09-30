import { parseScriptType } from "./ScriptStringParser";

describe("parseScriptType", () => {
  it("should return function type when argument is function", () => {
    const arg = (a: number, b: number) => a + b;
    expect(parseScriptType(arg)).toEqual({ type: "function", fn: arg });
  });

  it("should return scriptFile type when argument starts with [exec-file]", () => {
    const arg = "[exec-file]=./path/to/my.js";
    expect(parseScriptType(arg)).toEqual({
      type: "scriptFile",
      path: "./path/to/my.js",
    });
  });

  it("should return setTimeout type when argument starts with [set-timeout]", () => {
    const arg = "[set-timeout]=2000";
    expect(parseScriptType(arg)).toEqual({ type: "setTimeout", timeout: 2000 });
  });

  it("should return waitForTimeout type when argument starts with [wait-timeout]", () => {
    const arg = "[wait-timeout]=5000";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForTimeout",
      timeout: 5000,
    });
  });

  it("should return waitForSelector type when argument starts with [wait-selector]", () => {
    const arg = "[wait-selector]=#test-id-foo";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForSelector",
      selector: "#test-id-foo",
    });
  });

  it("should return waitForUrl type when argument starts with [wait-url]", () => {
    const arg = "[wait-url]=https://example.com/a?foo=bar#:~:text=baz";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForUrl",
      url: "https://example.com/a?foo=bar#:~:text=baz",
    });
  });

  it("should return waitForRequest type when argument starts with [wait-request]", () => {
    const arg = "[wait-request]=https://example.com/api/resource";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForRequest",
      url: "https://example.com/api/resource",
    });
  });

  it("should return waitForResponse type when argument starts with [wait-response]", () => {
    const arg = "[wait-response]=https://example.com/api/resource";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForResponse",
      url: "https://example.com/api/resource",
    });
  });

  it("should return waitForNavigation type when argument starts with [wait-navigation]", () => {
    const arg = "[wait-navigation]=https://example.com/page/b";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForNavigation",
      url: "https://example.com/page/b",
    });
  });

  it("should return waitForLoadState type when argument starts with [wait-state]", () => {
    const arg = "[wait-state]=domcontentloaded";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForLoadState",
      event: "domcontentloaded",
    });
  });

  it("should return waitForEvent type when argument starts with [wait-event]", () => {
    const arg = "[wait-event]=scroll";
    expect(parseScriptType(arg)).toEqual({
      type: "waitForEvent",
      event: "scroll",
    });
  });

  it("should return click type when argument starts with [click]", () => {
    const arg = "[click]=#click-me";
    expect(parseScriptType(arg)).toEqual({
      type: "click",
      selector: "#click-me",
    });
  });

  it("should return dblclick type when argument starts with [dblclick]", () => {
    const arg = "[dblclick]=#click-me";
    expect(parseScriptType(arg)).toEqual({
      type: "dblclick",
      selector: "#click-me",
    });
  });

  it("should raise error when argument is unknown script string", () => {
    const arg = "[my-script]=hello";
    expect(() => parseScriptType(arg)).toThrow();
  });
});
