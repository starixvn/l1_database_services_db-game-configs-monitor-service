import type { BaseLogger } from "@ldb/logger";
import type { Collection } from "@ldb/mongo";
import type { ArchiveTemplate, ConfigTemplateSchema, SummaryTemplate } from "../types/schema.js";
import { ConfigTemplatesWatcher } from "./config-templates-watcher.js";

export class ArchiveTemplatesWatcher extends ConfigTemplatesWatcher<ArchiveTemplate> {
    constructor(archiveTemplatesCollection: Collection<ConfigTemplateSchema<ArchiveTemplate>>, logger: BaseLogger) {
        super(archiveTemplatesCollection, "archive", logger);
    }
}

export class SummaryTemplatesWatcher extends ConfigTemplatesWatcher<SummaryTemplate> {
    constructor(summaryTemplatesCollection: Collection<ConfigTemplateSchema<SummaryTemplate>>, logger: BaseLogger) {
        super(summaryTemplatesCollection, "summary", logger);
    }
}
