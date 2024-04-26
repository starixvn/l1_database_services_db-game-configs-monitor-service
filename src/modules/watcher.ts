/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BaseLogger } from "@ldb/base-logger";
import type {
    ChangeStream,
    ChangeStreamDeleteDocument,
    ChangeStreamDocument,
    ChangeStreamInsertDocument,
    ChangeStreamOptions,
    ChangeStreamReplaceDocument,
    ChangeStreamUpdateDocument,
    Collection,
    Document,
    EventsDescription,
} from "@ldb/mongo";
import { TypedEventEmitter } from "@ldb/types";

const CHANGE_STREAM_OPTIONS = { fullDocument: "updateLookup", maxTimeMS: 0 } as const satisfies ChangeStreamOptions;

export class Watcher<Events extends EventsDescription, Schema extends Document = Document> extends TypedEventEmitter<Events> {
    private changeStream: ChangeStream<Schema>;

    constructor(protected readonly collection: Collection<Schema>, pipeline: Document[] = [], protected readonly logger: BaseLogger) {
        super();
        this.changeStream = this.collection.watch(pipeline, CHANGE_STREAM_OPTIONS);
        this.selfBound();
        this.startListening();
    }

    get className() {
        return this.constructor.name;
    }

    private selfBound() {
        this.handleChange = this.handleChange.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    private startListening() {
        this.changeStream.on<"change">("change", this.handleChange);
        this.changeStream.on<"error">("error", this.handleError);
    }

    private handleChange(changeDocument: ChangeStreamDocument<Schema>) {
        const { operationType } = changeDocument;

        switch (operationType) {
            case "insert":
                return this.handleDocumentInsert(changeDocument);
            case "update":
                return this.handleDocumentUpdate(changeDocument);
            case "replace":
                return this.handleDocumentReplace(changeDocument);
            case "delete":
                return this.handleDocumentDelete(changeDocument);
        }
    }

    protected handleDocumentInsert(changeDocument: ChangeStreamInsertDocument<Schema>) {}
    protected handleDocumentUpdate(changeDocument: ChangeStreamUpdateDocument<Schema>) {}
    protected handleDocumentReplace(changeDocument: ChangeStreamReplaceDocument<Schema>) {}
    protected handleDocumentDelete(changeDocument: ChangeStreamDeleteDocument<Schema>) {}

    protected handleError(error: Error) {
        this.logger.logError({ title: this.className, message: error });
    }
}
