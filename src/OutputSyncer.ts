import { logger } from "./Logger";
import { resolve } from "path";
import { copy, ensureDir, rm } from "fs-extra";
import { S3Syncer } from "./S3Syncer";

export class OutputSyncer {
  private syncer = new S3Syncer();
  constructor(
    private readonly projectPath: string,
    private readonly artifactPath: string
  ) {}

  public async syncPreviousToTemporal() {
    const temporalDir = resolve(this.projectPath, "public", "assets");
    const previousDir = resolve(process.cwd(), this.artifactPath, "assets");
    logger.debug(`Create temporal output directory: ${temporalDir}`);
    await rm(temporalDir, {
      recursive: true,
      force: true,
    });
    await ensureDir(temporalDir);
    logger.info(`Syncing previous state from ${previousDir} to ${temporalDir}`);
    try {
      await copy(previousDir, temporalDir, { overwrite: true });
    } catch {
      logger.info(`No previous state file`);
    }
    logger.info(`Sync complete.`);
  }

  public async syncPreviousS3ToTemporal() {
    await this.syncer.sync(
      resolve(this.projectPath, "dist"),
      "s3://surugaya-sentinel/a"
    );
    // const client = new S3Client({});
    // const results = await client.send(
    //   new ListObjectsCommand({
    //     Bucket: "surugaya-sentinel",
    //   })
    // );
    // console.log("@results", results);
    // const command = new GetObjectCommand({
    //   Bucket: "surugaya-sentinel",
    //   Key: "enantiom-dev/assets/1631072400442/3f6616f40fb53bf62ab468a30a7309e6f23bf6b2.png",
    // });
    // const result = await client.send(command);
    // await write(result.Body);
    process.exit(0);
  }
}

// const write = (stream: ReadableStream): Promise<void> =>
//   new Promise((resolve, reject) => {
//     stream
//       .pipe(createWriteStream("sample"))
//       .on("error", reject)
//       .on("end", resolve);
//   });
