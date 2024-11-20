import { expect, jest } from "@jest/globals";
import type { ChangeStreamNameSpace, IndexDescription } from "@ldb/mongo";
import { INVALID_INDEX, mapNamespace, notInvalidIndex, parseIndexDefinition } from "../../../src/initiators/initiator-utils";
import type { TemplateNamespace } from "../../../src/types/schema";

afterAll(() => {
    jest.clearAllMocks();
});

describe("Initiator utilities", () => {
    describe("[function mapNamespace]", () => {
        it("coll = baseName + postfix", () => {
            const testCases: [TemplateNamespace, string, ChangeStreamNameSpace][] = [
                [{ db: "minigame", postfix: "_rounds" }, "game", { db: "minigame", coll: "game_rounds" }],
                [{ db: "log", postfix: "" }, "bets", { db: "log", coll: "bets" }],
            ];
            for (const [template, name, expectResult] of testCases) {
                expect(mapNamespace(template, name)).toStrictEqual(expectResult);
            }
        });
    });
    describe("[function notInvalidIndex]", () => {
        it("return false only if INVALID_INDEX", () => {
            expect(notInvalidIndex(INVALID_INDEX)).toBe(false);
        });
        it("return true otherwise", () => {
            const testCases: [IndexDescription, boolean][] = [
                [{ key: {} }, true],
                [{ key: { field: 1 } }, true],
            ];
            for (const [index, expectResult] of testCases) {
                expect(notInvalidIndex(index)).toBe(expectResult);
            }
        });
    });
    describe("[function parseIndexDefinition]", () => {
        it("Invalid strings", () => {
            const testCases: [string][] = [[""], ["."], ["{key:{field:1}}"]];
            for (const [indexString] of testCases) {
                expect(parseIndexDefinition(indexString)).toBe(INVALID_INDEX);
            }
        });
        it("Return correct value", () => {
            const testCases: [string, IndexDescription][] = [
                ['{"key":{}}', { key: {} }],
                ['{"key":{"field":1}}', { key: { field: 1 } }],
            ];
            for (const [indexString, expectResult] of testCases) {
                expect(parseIndexDefinition(indexString)).toStrictEqual(expectResult);
            }
        });
        it("Should not return invalid value", () => {
            const testCases: [string, IndexDescription][] = [['{"key":{}}', INVALID_INDEX]];
            for (const [indexString, expectResult] of testCases) {
                expect(parseIndexDefinition(indexString)).not.toBe(expectResult);
            }
        });
    });
});
