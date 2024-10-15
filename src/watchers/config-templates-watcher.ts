import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamInsertDocument, ChangeStreamReplaceDocument, ChangeStreamUpdateDocument, Collection, Document } from "@ldb/mongo";
import { Watcher } from "../modules/watcher.js";
import type { ConfigTemplateSchema } from "../types/schema.js";

export type ConfigTemplateEvents<T extends Document> = {
    CONFIG: (configType: string, configTemplate: ConfigTemplateSchema<T>) => Promise<void>;
};

export class ConfigTemplatesWatcher<T extends Document> extends Watcher<ConfigTemplateEvents<T>, ConfigTemplateSchema<T>> {
    constructor(
        configTemplatesCollection: Collection<ConfigTemplateSchema<T>>,
        private readonly configType: string,
        logger: BaseLogger,
    ) {
        super(configTemplatesCollection, [], logger);
        this.handleDocumentInsert = this.handleFullDocument;
        this.handleDocumentReplace = this.handleFullDocument;
    }

    private handleFullDocument(changeDocument: ChangeStreamInsertDocument<ConfigTemplateSchema<T>> | ChangeStreamReplaceDocument<ConfigTemplateSchema<T>>) {
        const { fullDocument } = changeDocument;
        const { category, type, targets, data } = fullDocument;

        this.emit<"CONFIG">("CONFIG", this.configType, { category, type, targets, data });
    }

    protected handleDocumentUpdate(changeDocument: ChangeStreamUpdateDocument<ConfigTemplateSchema<T>>) {
        const { fullDocument } = changeDocument;

        if (!fullDocument) {
            this.logger.logWarning(
                { title: this.className, message: "Got empty data when watching data update" },
                { extra: { namespace: this.collection.namespace, changeDocument } },
            );
            return;
        }

        const { category, type, targets, data } = fullDocument;
        this.emit<"CONFIG">("CONFIG", this.configType, { category, type, targets, data });
    }

    protected handleDocumentReplace(changeDocument: ChangeStreamReplaceDocument<ConfigTemplateSchema<T>>) {
        const { fullDocument } = changeDocument;

        if (!fullDocument) {
            this.logger.logWarning(
                { title: this.className, message: "Got empty data when watching data replace" },
                { extra: { namespace: this.collection.namespace, changeDocument } },
            );
            return;
        }

        const { category, type, targets, data } = fullDocument;
        this.emit<"CONFIG">("CONFIG", this.configType, { category, type, targets, data });
    }
}
