import { logger } from "./Logger";
import { resolve } from "path";
import { copy, ensureDir, rm } from "fs-extra";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

export class OutputSyncer {
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
    const client = new S3Client({});
    const command = new ListBucketsCommand({});
    const buckets = await client.send(command);
    console.log("@buckets", buckets);
    process.exit(0);
  }
}
