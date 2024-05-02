import { expect, jest } from "@jest/globals";
import { intersectArrays } from "../../../src/watchers/watcher-utils";

afterAll(() => {
    jest.clearAllMocks();
});

describe("Watcher utilities", () => {
    describe("[function intersectArrays]", () => {
        it("return common items of 2 arrays", () => {
            const testCases: [unknown[], unknown[], unknown[]][] = [
                [[1, 2, 3], [3, 4, 5], [3]],
                [
                    ["a", "b", "c", "d"],
                    ["d", "b", "a"],
                    ["a", "b", "d"],
                ],
            ];
            for (const [arrayA, arrayB, expectResult] of testCases) {
                expect(intersectArrays(arrayA, arrayB).sort()).toEqual(expectResult.sort());
            }
        });
        it("return empty if no common items", () => {
            const testCases: [unknown[], unknown[]][] = [
                [
                    [1, 2, 3],
                    [4, 5, 6],
                ],
                [
                    ["a", "b", "c", "d"],
                    ["", "e", "f"],
                ],
                [[{}], [{}]],
                [[[]], [[]]],
            ];
            for (const [arrayA, arrayB] of testCases) {
                expect(intersectArrays(arrayA, arrayB).sort()).toEqual([]);
            }
        });
    });
});
