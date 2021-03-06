import { Result, State } from "./State";
import { readJson, writeJson } from "fs-extra";
import { logger } from "./Logger";

const DEFAULT: State = {
  stateVersion: "1",
  results: [],
};

export class StateFileService {
  constructor(private readonly filepath: string) {
    logger.trace(`Initialize StateFileService with filepath:${filepath}`);
  }

  public async appendSave(result: Result): Promise<State> {
    logger.trace(`Append state.results with result of [${result.timestamp}]`);
    const state = await this.load();
    const newState = {
      ...state,
      results: [result].concat(state.results),
    };
    return this.overwriteSave(newState);
  }

  public async overwriteSave(state: State): Promise<State> {
    logger.trace(`Save state.json file to ${this.filepath}`);
    await writeJson(this.filepath, state, {
      spaces: 2,
      encoding: "utf8",
    });
    return state;
  }

  public async load(): Promise<State> {
    logger.trace(`Load state.json file from ${this.filepath}`);
    try {
      const file = await readJson(this.filepath, { encoding: "utf8" });
      return State.parse(file);
    } catch {
      return DEFAULT;
    }
  }
}
