import { Result, State } from "./State";
import { readJson, writeJson } from "fs-extra";

const DEFAULT: State = {
  stateVersion: "1",
  results: [],
};

export class StateFileService {
  constructor(private readonly filepath: string) {}

  public async appendSave(result: Result): Promise<State> {
    const state = await this.load();
    const newState = {
      ...state,
      results: [result].concat(state.results),
    };
    return this.overwriteSave(newState);
  }

  public async overwriteSave(state: State): Promise<State> {
    await writeJson(this.filepath, state, {
      spaces: 2,
      encoding: "utf8",
    });
    return state;
  }

  public async load(): Promise<State> {
    try {
      const file = await readJson(this.filepath, { encoding: "utf8" });
      return State.parse(file);
    } catch {
      return DEFAULT;
    }
  }
}
