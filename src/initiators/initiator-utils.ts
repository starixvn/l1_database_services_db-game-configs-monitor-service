import type { ChangeStreamNameSpace, IndexDescription } from "@ldb/mongo";
import { EJSON } from "@ldb/mongo";
import type { GameConfigsSchema, TemplateNamespace } from "../types/schema.js";

export const INVALID_INDEX = { key: {} } as const;

export const mapNamespace = (template: TemplateNamespace, baseName: string): ChangeStreamNameSpace => {
    const { db, postfix } = template;
    const coll = [baseName, postfix].filter(Boolean).join("");
    return { db, coll };
};

export const notInvalidIndex = (index: IndexDescription) => index !== INVALID_INDEX;

export const parseIndexDefinition = (indexString: string): IndexDescription => {
    try {
        return EJSON.parse(indexString);
    } catch {
        return INVALID_INDEX;
    }
};

export const isGameExcluded = (type: GameConfigsSchema["type"]) => {
    if ([0, 1].includes(type)) {
        return true;
    }

    return false;
};
