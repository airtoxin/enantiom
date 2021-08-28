import { parse } from "ts-command-line-args";

interface ICopyFilesArguments {
  sourcePath: string;
  targetPath: string;
  copyFiles: boolean;
  resetPermissions: boolean;
  filter?: string;
  excludePaths?: string[];
}

// args typed as ICopyFilesArguments
export const args = parse<ICopyFilesArguments>({
  sourcePath: String,
  targetPath: String,
  copyFiles: { type: Boolean, alias: "c" },
  resetPermissions: Boolean,
  filter: { type: String, optional: true },
  excludePaths: { type: String, multiple: true, optional: true },
});
