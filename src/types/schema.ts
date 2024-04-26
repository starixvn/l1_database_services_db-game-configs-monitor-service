import type { ChangeStreamNameSpace, Document } from "@ldb/mongo";

export type GameConfigsSchema = { name: string; gameId: number; type: number };

export type TemplateNamespace = { db: string; postfix: string };

export type ConfigTemplateSchema<T extends Document> = {
    category: string;
    type: number;
    targets: ChangeStreamNameSpace[];
    data: T[];
};

export type ConfigMetadata = {
    gameConfigs: { gameId: number; name: string };
    category: string;
    type: number;
};

export type ConfigSchema<T extends Document> = ConfigMetadata & T & { id: number | string };

export type ArchiveTemplate = Document;
export type SummaryTemplate = Document;

export type IndexTemplatesSchema = { category: string; type: number; colls: IndexStringTemplate[] };
export type IndexStringTemplate = { ns: TemplateNamespace; idxs: IndexString };
export type IndexString = Record<string, string>;
