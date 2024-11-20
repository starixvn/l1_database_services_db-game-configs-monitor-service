import type { BaseLogger } from "@ldb/logger";
import type { ChangeStreamInsertDocument, ChangeStreamReplaceDocument, ChangeStreamUpdateDocument, Collection } from "@ldb/mongo";
import { Watcher } from "@ldb/watcher";
import type { IndexTemplatesSchema } from "../types/schema.js";

export type IndexTemplateEvents = {
    INDEX: (indexTemplate: IndexTemplatesSchema) => Promise<void>;
};

export class IndexTemplatesWatcher extends Watcher<IndexTemplateEvents, IndexTemplatesSchema> {
    constructor(indexTemplatesCollection: Collection<IndexTemplatesSchema>, logger: BaseLogger) {
        super(indexTemplatesCollection, [], logger);
        this.handleDocumentInsert = this.handleFullDocument;
        this.handleDocumentReplace = this.handleFullDocument;
    }

    private handleFullDocument(changeDocument: ChangeStreamInsertDocument<IndexTemplatesSchema> | ChangeStreamReplaceDocument<IndexTemplatesSchema>) {
        const { fullDocument } = changeDocument;
        const { category, type, colls } = fullDocument;

        this.emit<"INDEX">("INDEX", { category, type, colls });
    }

    protected handleDocumentUpdate(changeDocument: ChangeStreamUpdateDocument<IndexTemplatesSchema>) {
        const { fullDocument } = changeDocument;

        if (!fullDocument) {
            this.logger.logWarning(
                { title: this.className, message: "Got empty data when watching data update" },
                { extra: { namespace: this.collection.namespace, changeDocument } },
            );
            return;
        }

        const { category, type, colls } = fullDocument;
        this.emit<"INDEX">("INDEX", { category, type, colls });
    }

    protected handleDocumentReplace(changeDocument: ChangeStreamReplaceDocument<IndexTemplatesSchema>) {
        const { fullDocument } = changeDocument;

        if (!fullDocument) {
            this.logger.logWarning(
                { title: this.className, message: "Got empty data when watching data replace" },
                { extra: { namespace: this.collection.namespace, changeDocument } },
            );
            return;
        }

        const { category, type, colls } = fullDocument;
        this.emit<"INDEX">("INDEX", { category, type, colls });
    }
}
