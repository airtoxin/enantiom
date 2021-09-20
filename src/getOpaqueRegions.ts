import sharp from "sharp";
import { seq } from "./utils";

export type Region = { x1: number; y1: number; x2: number; y2: number };
export const getOpaqueRegions = (imagePath: string): Promise<Region[]> =>
  sharp(imagePath)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const regions: Region[] = [];
      let size = 0;
      for (const y of seq(info.height)) {
        for (const x of seq(info.width)) {
          if (data[(y * info.width + x) * 4 + 3] !== 0) {
            size += 1;
          } else if (size !== 0) {
            regions.push({ x1: x - size, y1: y, x2: x, y2: y + 1 });
            size = 0;
          }
        }
        if (size !== 0) {
          regions.push({
            x1: info.width - size,
            y1: y,
            x2: info.width,
            y2: y + 1,
          });
          size = 0;
        }
      }
      return regions;
    });
