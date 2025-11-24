import type { BaseLogger } from "@ldb/logger";
import type { ChangeStreamNameSpace, Collection, Document, MongoClient } from "@ldb/mongo";
import { Dispatcher } from "@ldb/utils";
import type { ConfigEvents, ConfigInitiator, GameInitiator } from "../initiators/index.js";
import type { ConfigSchema } from "../types/schema.js";

type Initiators<T extends Document> = ConfigInitiator<T> | GameInitiator<T>;

export type ConfigDeployEvents = {
    CONFIGURED: (configType: string, gameName: string, upsertedCount: number, modifiedCount: number, type: number) => void;
};

export class ConfigDeployer<T extends Document> extends Dispatcher<ConfigDeployEvents, ConfigEvents<T>> {
    constructor(
        private readonly mongo: MongoClient,
        logger: BaseLogger,
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.deployConfigs = this.deployConfigs.bind(this);
    }

    private async deployConfigs(configType: string, namespace: ChangeStreamNameSpace, filter: Document, data: ConfigSchema<T>, notify: boolean, type: number) {
        const collection = this.getCollection(namespace);

        try {
            const result = await collection.replaceOne(filter, data, { upsert: true });
            const { upsertedCount, modifiedCount } = result;
            if (notify && (upsertedCount > 0 || modifiedCount > 0)) {
                this.emit<"CONFIGURED">("CONFIGURED", configType, data.gameConfigs.name, upsertedCount, modifiedCount, type);
            }
        } catch (error: unknown) {
            this.logger.logError({ title: this.className, message: error }, { extra: { configType, namespace, filter, data, type } });
        }
    }

    private getCollection<X extends Document>(namespace: ChangeStreamNameSpace): Collection<X> {
        const { db, coll } = namespace;
        return this.mongo.db(db).collection<X>(coll);
    }

    subscribe(publisher: Initiators<T>): boolean {
        return super.subscribe(publisher, "deployConfig", this.deployConfigs);
    }

    unsubscribe(publisher: Initiators<T>): boolean {
        return super.unsubscribe(publisher, "deployConfig", this.deployConfigs);
    }
}
