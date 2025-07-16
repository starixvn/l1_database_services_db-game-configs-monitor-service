import { BaseContainer } from "@ldb/base-container";
import type { MongoClient } from "@ldb/mongo";
import { asClass, asValue } from "awilix";
import { healthcheckPort, lumiLoggerConfig, namespaces } from "./app-configs.js";
import { App } from "./app.js";
import { ConfigDeployer, Deployers, IndexDeployer } from "./deployers/index.js";
import { ArchiveInitiator, GameInitiator, IndexInitiator, Initiators, SummaryInitiator } from "./initiators/index.js";
import { metadata } from "./metadata.js";
import { ConfigReporter, IndexReporter, Reporters } from "./reporters/index.js";
import { ArchiveTemplatesWatcher, GameConfigsWatcher, IndexTemplatesWatcher, SummaryTemplatesWatcher, Watchers } from "./watchers/index.js";

export class Container extends BaseContainer {
    constructor() {
        super();
    }

    register() {
        this.registerLogger(lumiLoggerConfig).registerHealthcheck(metadata, healthcheckPort).registerClasses();
        return this;
    }

    private registerClasses() {
        this.container.register({
            app: asClass(App).singleton(),

            gameConfigsWatcher: asClass(GameConfigsWatcher).singleton(),
            indexTemplatesWatcher: asClass(IndexTemplatesWatcher).singleton(),
            archiveTemplatesWatcher: asClass(ArchiveTemplatesWatcher).singleton(),
            summaryTemplatesWatcher: asClass(SummaryTemplatesWatcher).singleton(),
            watchers: asClass(Watchers).singleton(),

            gameInitiator: asClass(GameInitiator).singleton(),
            indexInitiator: asClass(IndexInitiator).singleton(),
            archiveInitiator: asClass(ArchiveInitiator).singleton(),
            summaryInitiator: asClass(SummaryInitiator).singleton(),
            initiators: asClass(Initiators).singleton(),

            indexDeployer: asClass(IndexDeployer).singleton(),
            configDeployer: asClass(ConfigDeployer).singleton(),
            deployers: asClass(Deployers).singleton(),

            indexReporter: asClass(IndexReporter).singleton(),
            configReporter: asClass(ConfigReporter).singleton(),
            reporters: asClass(Reporters).singleton(),
        });
        return this;
    }

    registerDatabases(mongo: MongoClient) {
        this.container.register({
            mongo: asValue(mongo),
        });

        for (const [name, { db, coll }] of Object.entries(namespaces)) {
            this.container.register({
                [name]: asValue(mongo.db(db).collection(coll)),
            });
        }

        return this;
    }
}
