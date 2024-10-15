import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamNameSpace, Collection, Document, IndexDescription, MongoClient } from "@ldb/mongo";
import type { GameInitiator, IndexEvents, IndexInitiator } from "../initiators/index.js";
import { Dispatcher } from "../modules/dispatcher.js";
import { deployIndex } from "./collection-indexer.js";

type Initiators = IndexInitiator | GameInitiator<Document>;

export type IndexDeployEvents = {
    INDEXED: (namespace: string, indexName: string) => void;
};

export class IndexDeployer extends Dispatcher<IndexDeployEvents, keyof IndexEvents, IndexEvents, Initiators> {
    constructor(
        private readonly targetMongo: MongoClient,
        logger: BaseLogger,
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.deployIndexes = this.deployIndexes.bind(this);
    }

    private async deployIndexes(namespace: ChangeStreamNameSpace, indexes: IndexDescription[], notify: boolean) {
        const collection = this.getCollection(namespace);

        for (const index of indexes) {
            const deployedIndexName = await deployIndex(collection, index, this.logger);
            if (notify) {
                this.emit<"INDEXED">("INDEXED", collection.namespace, deployedIndexName);
            }
        }
    }

    private getCollection<T extends Document>(namespace: ChangeStreamNameSpace): Collection<T> {
        const { db, coll } = namespace;
        return this.targetMongo.db(db).collection<T>(coll);
    }

    subscribe(publisher: Initiators): boolean {
        return super.subscribe(publisher, "deployIndex", this.deployIndexes);
    }
}
