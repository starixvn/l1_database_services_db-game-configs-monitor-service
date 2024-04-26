import type { BaseLogger } from "@ldb/base-logger";
import type { Collection } from "@ldb/mongo";
import type { ArchiveTemplate, ConfigTemplateSchema, SummaryTemplate } from "../types/schema.js";
import { ConfigInitiator } from "./config-initiator.js";

export class ArchiveInitiator extends ConfigInitiator<ArchiveTemplate> {
    constructor(archiveTemplatesCollection: Collection<ConfigTemplateSchema<ArchiveTemplate>>, logger: BaseLogger) {
        super(archiveTemplatesCollection, "archive", logger);
    }
}

export class SummaryInitiator extends ConfigInitiator<SummaryTemplate> {
    constructor(summaryTemplatesCollection: Collection<ConfigTemplateSchema<SummaryTemplate>>, logger: BaseLogger) {
        super(summaryTemplatesCollection, "summary", logger);
    }
}
