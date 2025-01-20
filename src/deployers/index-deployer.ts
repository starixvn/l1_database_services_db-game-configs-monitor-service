import type { BaseLogger } from "@ldb/logger";
import { MongoServerError, type ChangeStreamNameSpace, type Collection, type Document, type IndexDescription, type MongoClient } from "@ldb/mongo";
import { Dispatcher } from "@ldb/utils";
import type { GameInitiator, IndexEvents, IndexInitiator } from "../initiators/index.js";
import { generateIndexName } from "./indexer-utils.js";

type Initiators = IndexInitiator | GameInitiator<Document>;

export type IndexDeployEvents = {
    INDEXED: (namespace: string, indexName: string) => void;
};

export class IndexDeployer extends Dispatcher<IndexDeployEvents, IndexEvents> {
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
        for (const index of indexes) {
            const deployedIndexName = await this.deployIndex(namespace, index);
            const collectionNamespace = `${namespace.db}.${namespace.coll}`;
            this.logger.logDebug({ title: `${this.className}@deployIndex`, message: `${collectionNamespace} - ${deployedIndexName}` });
            if (notify) {
                this.emit<"INDEXED">("INDEXED", collectionNamespace, deployedIndexName);
            }
        }
    }

    private async deployIndex(namespace: ChangeStreamNameSpace, index: IndexDescription) {
        try {
            return await this.createIndex(namespace, index);
        } catch (error) {
            if (error instanceof MongoServerError) {
                switch (error.codeName) {
                    case "IndexOptionsConflict": {
                        this.logger.logDebug({ title: `${this.className}@deployIndex`, message: error.codeName }, { extra: { namespace, index } });
                        const [, existingName] = /name: (.*)$/.exec(error.message) || [];
                        if (existingName) {
                            await this.dropIndex(namespace, existingName);
                        } else {
                            await this.dropIndex(namespace, index.key);
                        }
                        return await this.createIndex(namespace, index);
                    }
                    case "IndexKeySpecsConflict": {
                        this.logger.logDebug({ title: `${this.className}@deployIndex`, message: error.codeName }, { extra: { namespace, index } });
                        const [, existingName] = /name: "([^"]*)"$/.exec(error.message) || [];
                        if (existingName) {
                            await this.dropIndex(namespace, existingName);
                        } else if (index.name) {
                            await this.dropIndex(namespace, index.name);
                        }
                        return await this.createIndex(namespace, index);
                    }
                }
            }
            this.logger.logError({ title: `${this.className}@deployIndex`, message: error }, { extra: { namespace, index } });
        }
        return "";
    }

    private async createIndex(namespace: ChangeStreamNameSpace, index: IndexDescription) {
        const { key, ...options } = index;
        const collection = this.getCollection(namespace);
        options.name = generateIndexName(collection.collectionName, index);
        return await collection.createIndex(key, options);
    }

    private async dropIndex(namespace: ChangeStreamNameSpace, index: IndexDescription["key"] | string) {
        const { db, coll } = namespace;
        return await this.targetMongo.db(db).command({ dropIndexes: coll, index });
    }

    private getCollection<T extends Document>(namespace: ChangeStreamNameSpace): Collection<T> {
        const { db, coll } = namespace;
        return this.targetMongo.db(db).collection<T>(coll);
    }

    subscribe(publisher: Initiators): boolean {
        return super.subscribe(publisher, "deployIndex", this.deployIndexes);
    }

    unsubscribe(publisher: Initiators): boolean {
        return super.unsubscribe(publisher, "deployIndex", this.deployIndexes);
    }
}
