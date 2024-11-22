import type { ChangeStreamNameSpace, IndexDescription } from "@ldb/mongo";
import { describe, expect, it } from "vitest";
import type { TemplateNamespace } from "../types/schema.js";
import { INVALID_INDEX, isGameExcluded, mapNamespace, notInvalidIndex, parseIndexDefinition } from "./initiator-utils.js";

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

describe("[function isGameExcluded]", () => {
    it("Invalid strings", () => {
        const testCases: { type: number; expected: boolean }[] = [
            { type: 0, expected: true },
            { type: 1, expected: true },
            { type: 2, expected: false },
            { type: 3, expected: false },
            { type: 4, expected: false },
            { type: 5, expected: false },
            { type: 6, expected: false },
        ];
        for (const { type, expected } of testCases) {
            expect(isGameExcluded(type)).toBe(expected);
        }
    });
});
