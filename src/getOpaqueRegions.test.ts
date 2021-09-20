import { getOpaqueRegions } from "./getOpaqueRegions";
import { resolve } from "path";

describe("getOpaqueRegions", () => {
  test("default", async () => {
    await expect(getOpaqueRegions(resolve(__dirname, "../fixture/red.png")))
      .resolves.toMatchInlineSnapshot(`
            Array [
              Object {
                "x1": 0,
                "x2": 2,
                "y1": 0,
                "y2": 1,
              },
              Object {
                "x1": 4,
                "x2": 10,
                "y1": 1,
                "y2": 2,
              },
              Object {
                "x1": 0,
                "x2": 3,
                "y1": 2,
                "y2": 3,
              },
              Object {
                "x1": 5,
                "x2": 6,
                "y1": 2,
                "y2": 3,
              },
              Object {
                "x1": 7,
                "x2": 8,
                "y1": 2,
                "y2": 3,
              },
              Object {
                "x1": 9,
                "x2": 10,
                "y1": 2,
                "y2": 3,
              },
              Object {
                "x1": 0,
                "x2": 8,
                "y1": 3,
                "y2": 4,
              },
              Object {
                "x1": 9,
                "x2": 10,
                "y1": 3,
                "y2": 4,
              },
            ]
          `);
  });

  test("fill all", async () => {
    await expect(getOpaqueRegions(resolve(__dirname, "../fixture/fill.png")))
      .resolves.toMatchInlineSnapshot(`
            Array [
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 0,
                "y2": 1,
              },
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 1,
                "y2": 2,
              },
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 2,
                "y2": 3,
              },
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 3,
                "y2": 4,
              },
            ]
          `);
  });

  test("alpha pixels", async () => {
    await expect(getOpaqueRegions(resolve(__dirname, "../fixture/alpha.png")))
      .resolves.toMatchInlineSnapshot(`
            Array [
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 0,
                "y2": 1,
              },
              Object {
                "x1": 0,
                "x2": 10,
                "y1": 1,
                "y2": 2,
              },
              Object {
                "x1": 0,
                "x2": 9,
                "y1": 2,
                "y2": 3,
              },
            ]
          `);
  });

  test("transparent", async () => {
    await expect(
      getOpaqueRegions(resolve(__dirname, "../fixture/transparent.png"))
    ).resolves.toMatchInlineSnapshot(`Array []`);
  });
});
