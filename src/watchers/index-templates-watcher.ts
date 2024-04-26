import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamInsertDocument, ChangeStreamReplaceDocument, ChangeStreamUpdateDocument, Collection } from "@ldb/mongo";
import { Watcher } from "../modules/watcher.js";
import type { IndexTemplatesSchema } from "../types/schema.js";

export type IndexTemplateEvents = {
    INDEX: (indexTemplate: IndexTemplatesSchema) => Promise<void>;
};

export class IndexTemplatesWatcher extends Watcher<IndexTemplateEvents, IndexTemplatesSchema> {
    constructor(indexTemplatesCollection: Collection<IndexTemplatesSchema>, logger: BaseLogger) {
        super(indexTemplatesCollection, [], logger);
    }

    protected handleDocumentInsert(changeDocument: ChangeStreamInsertDocument<IndexTemplatesSchema>): void {
        const { fullDocument } = changeDocument;
        const { category, type, colls } = fullDocument;

        this.emit<"INDEX">("INDEX", { category, type, colls });
    }

    protected handleDocumentUpdate(changeDocument: ChangeStreamUpdateDocument<IndexTemplatesSchema>): void {
        const { fullDocument } = changeDocument;

        if (!fullDocument) {
            this.logger.logWarning(
                { title: this.className, message: "Got empty data when watching data update" },
                { extra: { namespace: this.collection.namespace, changeDocument } }
            );
            return;
        }

        const { category, type, colls } = fullDocument;
        this.emit<"INDEX">("INDEX", { category, type, colls });
    }

    protected handleDocumentReplace(changeDocument: ChangeStreamReplaceDocument<IndexTemplatesSchema>): void {
        const {
            fullDocument: { category, type, colls },
        } = changeDocument;

        this.emit<"INDEX">("INDEX", { category, type, colls });
    }
}
