import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { copy, ensureDir, ensureFile, readFile } from "fs-extra";
import { join } from "path";
import { ListObjectsOutput } from "@aws-sdk/client-s3/models/models_0";
import { Required } from "utility-types";
import { createWriteStream } from "fs";
import recursiveReadDir from "recursive-readdir";
import ReadableStream = NodeJS.ReadableStream;
import { logger } from "./Logger";

export class DirectorySyncer {
  private client = new S3Client({});

  public async sync(sourceDir: string, targetDir: string) {
    const sourceIsBucket = sourceDir.startsWith("s3://");
    const targetIsBucket = targetDir.startsWith("s3://");
    if (!sourceIsBucket && !targetIsBucket) {
      return this.localToLocal(sourceDir, targetDir);
    } else if (sourceIsBucket && targetIsBucket) {
      return this.bucketToBucket(sourceDir, targetDir);
    } else if (sourceIsBucket && !targetIsBucket) {
      return this.bucketToLocal(sourceDir, targetDir);
    } else if (!sourceIsBucket && targetIsBucket) {
      return this.localToBucket(sourceDir, targetDir);
    }
  }

  private async localToLocal(sourceDir: string, targetDir: string) {
    logger.info(
      `Sync previous result (${sourceDir}) to temporal (${targetDir}).`
    );
    await ensureDir(sourceDir);
    await ensureDir(targetDir);
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
          const filepath = join(targetDir, c.Key!);
          await ensureFile(filepath);
          const result = await this.client.send(
            new GetObjectCommand({ Bucket: bucket, Key: c.Key })
          );
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
        await this.client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: join(path, filePath),
            Body: body,
          })
        );
      })
    );
  }
}

const parseS3Uri = (uri: string) => {
  const protocolPrefix = "s3://";
  if (!uri.startsWith(protocolPrefix))
    throw new Error(`Expect S3 uri starts with s3://... but got ${uri}.`);

  const [bucket, ...paths] = uri.slice(protocolPrefix.length).split("/");
  return { bucket, path: paths.join("/") };
};

const write = (filepath: string, stream: ReadableStream): Promise<void> =>
  new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(filepath))
      .on("error", reject)
      .on("end", resolve);
  });
