import { seq } from "./utils";

describe("seq", () => {
  it("should return number sequences", () => {
    expect(seq(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("should return empty array when argument number is 0", () => {
    expect(seq(0)).toEqual([]);
  });
});
