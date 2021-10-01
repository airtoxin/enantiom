import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client, } from "@aws-sdk/client-s3";
import { copy, ensureDir, ensureFile, readFile } from "fs-extra";
import { join, resolve } from "path";
import { ListObjectsOutput } from "@aws-sdk/client-s3/models/models_0";
import { Required } from "utility-types";
import { createWriteStream } from "fs";
import recursiveReadDir from "recursive-readdir";
import { logger } from "./Logger";
import mime from "mime-types";
import { s3Join } from "./utils";
import ReadableStream = NodeJS.ReadableStream;

export class DirectorySyncer {
  private client = new S3Client({});

  public async sync(sourceDir: string, targetDir: string) {
    const sourceIsBucket = sourceDir.startsWith("s3://");
    const targetIsBucket = targetDir.startsWith("s3://");
    logger.debug(`Directory syncing. source:${sourceDir}, target:${targetDir}`);

    if (!sourceIsBucket && !targetIsBucket) {
      logger.info(`Sync local to local.`);
      await this.localToLocal(sourceDir, targetDir);
    } else if (sourceIsBucket && targetIsBucket) {
      await this.bucketToBucket(sourceDir, targetDir);
      logger.info(`Sync bucket to bucket.`);
    } else if (sourceIsBucket && !targetIsBucket) {
      logger.info(`Sync bucket to local.`);
      await this.bucketToLocal(sourceDir, targetDir);
    } else if (!sourceIsBucket && targetIsBucket) {
      logger.info(`Sync local to bucket.`);
      await this.localToBucket(sourceDir, targetDir);
    }
    logger.info(`Sync complete.`);
  }

  private async localToLocal(sourceDir: string, targetDir: string) {
    logger.debug(`Ensure source directory ${sourceDir}`);
    await ensureDir(resolve(process.cwd(), sourceDir));
    logger.debug(`Ensure target directory ${targetDir}`);
    await ensureDir(resolve(process.cwd(), targetDir));
    logger.debug(`Copy source ${sourceDir} to target ${targetDir}`);
    await copy(sourceDir, targetDir, { overwrite: true, recursive: true });
  }

  private async bucketToBucket(_sourceDir: string, _targetDir: string) {
    throw new Error(`S3 to S3 sync not supported.`);
  }

  private async bucketToLocal(sourceDir: string, targetDir: string) {
    const { bucket, path } = parseS3Uri(sourceDir);
    const bucketObjects = await this.client.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: path })
    );

    type RequiredContentKey = Required<
      NonNullable<ListObjectsOutput["Contents"]>[number],
      "Key"
    >;
    await Promise.all(
      (bucketObjects.Contents ?? [])
        .filter((c): c is RequiredContentKey => !!c.Key && !c.Key.endsWith("/"))
        .map(async (c) => {
          // The Key of s3 returns full path from bucket root
          const filepath = join(resolve(process.cwd(), targetDir), c.Key!.slice(path.length));
          await ensureFile(filepath);
          logger.debug(`Fetch s3 object. s3://${s3Join(bucket, c.Key)}`);
          const result = await this.client.send(
            new GetObjectCommand({ Bucket: bucket, Key: c.Key })
          );
          logger.debug(`Copy s3://${s3Join(bucket, c.Key)} to ${filepath}`);
          await write(filepath, result.Body as any);
        })
    );
  }

  private async localToBucket(sourceDir: string, targetDir: string) {
    const { bucket, path } = parseS3Uri(targetDir);
    const filePaths = await recursiveReadDir(sourceDir).then((filePaths) =>
      filePaths.map((fp) => {
        const sPath = fp.slice(sourceDir.length);
        return sPath.startsWith("/") ? sPath.slice(1) : sPath;
      })
    );

    await Promise.all(
      filePaths.map(async (filePath) => {
        const body = await readFile(join(sourceDir, filePath));
        const s3Path = s3Join(path, filePath);
        logger.debug(
          `Upload ${join(sourceDir, filePath)} to s3://${bucket}/${s3Path}`
        );
        await this.client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: s3Path,
            Body: body,
            ContentType: mime.lookup(filePath) || undefined,
          })
        );
      })
    );
  }
}

const parseS3Uri = (uri: string) => {
  const protocolPrefix = "s3://";
  if (!uri.startsWith(protocolPrefix))
    throw new Error(`Expect S3 uri starts with s3://... but got ${uri}`);

  const [bucket, ...paths] = uri.slice(protocolPrefix.length).split("/");
  return { bucket: bucket!, path: paths.join("/") };
};

const write = (filepath: string, stream: ReadableStream): Promise<void> =>
  new Promise((resolve, reject) => {
    const ws = createWriteStream(filepath);
    stream.pipe(ws).on("error", reject).on("finish", resolve);
  });

