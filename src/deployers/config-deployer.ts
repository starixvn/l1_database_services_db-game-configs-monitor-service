import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamNameSpace, Collection, Document, MongoClient } from "@ldb/mongo";
import type { ConfigEvents, ConfigInitiator, GameInitiator } from "../initiators/index.js";
import { Dispatcher } from "../modules/dispatcher.js";
import type { ConfigSchema } from "../types/schema.js";

type Initiators<T extends Document> = ConfigInitiator<T> | GameInitiator<T>;

export type ConfigDeployEvents = {
    CONFIGURED: (configType: string, gameName: string, upsertedCount: number, modifiedCount: number) => void;
};

export class ConfigDeployer<T extends Document> extends Dispatcher<ConfigDeployEvents, keyof ConfigEvents<T>, ConfigEvents<T>, Initiators<T>> {
    constructor(
        private readonly targetMongo: MongoClient,
        logger: BaseLogger,
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.deployConfigs = this.deployConfigs.bind(this);
    }

    private async deployConfigs(type: string, namespace: ChangeStreamNameSpace, filter: Document, data: ConfigSchema<T>, notify: boolean) {
        const collection = this.getCollection(namespace);

        try {
            const result = await collection.replaceOne(filter, data, { upsert: true });
            const { upsertedCount, modifiedCount } = result;
            if (notify && (upsertedCount > 0 || modifiedCount > 0)) {
                this.emit<"CONFIGURED">("CONFIGURED", type, data.gameConfigs.name, upsertedCount, modifiedCount);
            }
        } catch (error: unknown) {
            this.logger.logError({ title: this.className, message: error }, { extra: { type, namespace, filter, data } });
        }
    }

    private getCollection<X extends Document>(namespace: ChangeStreamNameSpace): Collection<X> {
        const { db, coll } = namespace;
        return this.targetMongo.db(db).collection<X>(coll);
    }

    subscribe(publisher: Initiators<T>): boolean {
        return super.subscribe(publisher, "deployConfig", this.deployConfigs);
    }
}
