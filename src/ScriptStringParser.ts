import { z } from "zod";

export type ScriptFunc = (...args: any[]) => unknown;

export const parseScriptType = (arg: string | ScriptFunc): ScriptType => {
  if (typeof arg === "function") {
    return { type: "function", fn: arg };
  }
  if (arg.startsWith("[exec-file]=")) {
    return { type: "scriptFile", path: arg.slice("[exec-file]=".length) };
  } else if (arg.startsWith("[set-timeout]=")) {
    return {
      type: "setTimeout",
      timeout: Number.parseFloat(arg.slice("[set-timeout]=".length)),
    };
  } else if (arg.startsWith("[wait-timeout]=")) {
    return {
      type: "waitForTimeout",
      timeout: Number.parseFloat(arg.slice("[wait-timeout]=".length)),
    };
  } else if (arg.startsWith("[wait-selector]=")) {
    return {
      type: "waitForSelector",
      selector: arg.slice("[wait-selector]=".length),
    };
  } else if (arg.startsWith("[wait-url]=")) {
    return {
      type: "waitForUrl",
      url: arg.slice("[wait-url]=".length),
    };
  } else if (arg.startsWith("[wait-request]=")) {
    return {
      type: "waitForRequest",
      url: arg.slice("[wait-request]=".length),
    };
  } else if (arg.startsWith("[wait-response]=")) {
    return {
      type: "waitForResponse",
      url: arg.slice("[wait-response]=".length),
    };
  } else if (arg.startsWith("[wait-navigation]=")) {
    return {
      type: "waitForNavigation",
      url: arg.slice("[wait-navigation]=".length),
    };
  } else if (arg.startsWith("[wait-state]=")) {
    return {
      type: "waitForLoadState",
      event: LoadStateEvent.parse(arg.slice("[wait-state]=".length)),
    };
  } else if (arg.startsWith("[wait-event]=")) {
    return { type: "waitForEvent", event: arg.slice("[wait-event]=".length) };
  } else if (arg.startsWith("[click]=")) {
    return { type: "click", selector: arg.slice("[click]=".length) };
  } else if (arg.startsWith("[dblclick]=")) {
    return { type: "dblclick", selector: arg.slice("[dblclick]=".length) };
  }

  throw new Error(`Unsupported script string: ${arg}.`);
};

export type ScriptType = z.infer<typeof ScriptType>;
export const ScriptType = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("function"),
      fn: z.function().args(z.any(), z.any(), z.any()),
    }),
    z.object({ type: z.literal("scriptFile"), path: z.string() }),
    z.object({ type: z.literal("setTimeout"), timeout: z.number() }),
    z.object({ type: z.literal("waitForTimeout"), timeout: z.number() }),
    z.object({ type: z.literal("waitForSelector"), selector: z.string() }),
    z.object({ type: z.literal("waitForUrl"), url: z.string() }),
    z.object({ type: z.literal("waitForRequest"), url: z.string() }),
    z.object({ type: z.literal("waitForResponse"), url: z.string() }),
    z.object({ type: z.literal("waitForNavigation"), url: z.string() }),
    z.object({
      type: z.literal("waitForLoadState"),
      event: LoadStateEvent,
    }),
    z.object({ type: z.literal("waitForEvent"), event: z.string() }),
    z.object({ type: z.literal("click"), selector: z.string() }),
    z.object({ type: z.literal("dblclick"), selector: z.string() }),
  ])
);

export type LoadStateEvent = z.infer<typeof LoadStateEvent>;
export const LoadStateEvent = z.lazy(() =>
  z.union([
    z.literal("domcontentloaded"),
    z.literal("load"),
    z.literal("networkidle"),
  ])
);
