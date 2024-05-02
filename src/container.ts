import { Logger } from "@ldb/logger";
import type { MongoClient } from "@ldb/mongo";
import { SentryLogger } from "@ldb/sentry-logger";
import { SkynexLogger } from "@ldb/skynex-logger";
import { TerminalLogger } from "@ldb/terminal-logger";
import { asClass, asValue, createContainer, InjectionMode, type AwilixContainer, type ResolveOptions } from "awilix";
import { environment, healthcheckPort, sentryNodeOptions, sentryOptions, sentrySeverityLevel, skynexOptions, skynexSeverityLevel, terminalSeverityLevel } from "./app-configs.js";
import { App } from "./app.js";
import { ConfigDeployer, Deployers, IndexDeployer } from "./deployers/index.js";
import { HealthcheckServer } from "./healthcheck/server.js";
import { ArchiveInitiator, GameInitiator, IndexInitiator, Initiators, SummaryInitiator } from "./initiators/index.js";
import { namespaces } from "./namespaces.js";
import { ConfigReporter, IndexReporter, Reporters } from "./reporters/index.js";
import { ArchiveTemplatesWatcher, GameConfigsWatcher, IndexTemplatesWatcher, SummaryTemplatesWatcher, Watchers } from "./watchers/index.js";

export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
    }

    register() {
        this.registerLoggers().registerWatchers().registerInitiators().registerDeployers().registerReporters().registerClasses().registerHealthcheck();
        return this;
    }

    private registerLoggers() {
        this.container.register({
            terminalLogger: asClass(TerminalLogger).singleton(),
            terminalSeverityLevel: asValue(terminalSeverityLevel),
        });
        this.container.register({
            skynexLogger: asClass(SkynexLogger).singleton(),
            skynexOptions: asValue(skynexOptions),
            skynexSeverityLevel: asValue(skynexSeverityLevel),
        });
        this.container.register({
            sentryLogger: asClass(SentryLogger).singleton(),
            sentryNodeOptions: asValue(sentryNodeOptions),
            sentryOptions: asValue(sentryOptions),
            sentrySeverityLevel: asValue(sentrySeverityLevel),
        });
        this.container.register({
            logger: asClass(Logger).singleton(),
            otherLoggers: asValue(null),
            environment: asValue(environment),
        });
        return this;
    }

    private registerWatchers() {
        this.container.register({
            gameConfigsWatcher: asClass(GameConfigsWatcher).singleton(),
            indexTemplatesWatcher: asClass(IndexTemplatesWatcher).singleton(),
            archiveTemplatesWatcher: asClass(ArchiveTemplatesWatcher).singleton(),
            summaryTemplatesWatcher: asClass(SummaryTemplatesWatcher).singleton(),
            watchers: asClass(Watchers).singleton(),
        });
        return this;
    }

    private registerInitiators() {
        this.container.register({
            gameInitiator: asClass(GameInitiator).singleton(),
            indexInitiator: asClass(IndexInitiator).singleton(),
            archiveInitiator: asClass(ArchiveInitiator).singleton(),
            summaryInitiator: asClass(SummaryInitiator).singleton(),
            initiators: asClass(Initiators).singleton(),
        });
        return this;
    }

    private registerDeployers() {
        this.container.register({
            indexDeployer: asClass(IndexDeployer).singleton(),
            configDeployer: asClass(ConfigDeployer).singleton(),
            deployers: asClass(Deployers).singleton(),
        });
        return this;
    }

    private registerReporters() {
        this.container.register({
            indexReporter: asClass(IndexReporter).singleton(),
            configReporter: asClass(ConfigReporter).singleton(),
            reporters: asClass(Reporters).singleton(),
        });
        return this;
    }

    private registerClasses() {
        this.container.register({
            app: asClass(App).singleton(),
        });
        return this;
    }

    private registerHealthcheck() {
        this.container.register({
            healthcheckServer: asClass(HealthcheckServer).singleton(),
            healthcheckPort: asValue(healthcheckPort),
        });
        return this;
    }

    registerDatabases(targetMongo: MongoClient) {
        this.container.register({
            targetMongo: asValue(targetMongo),
        });

        for (const [name, { db, coll }] of Object.entries(namespaces)) {
            this.container.register({
                [name]: asValue(targetMongo.db(db).collection(coll)),
            });
        }

        return this;
    }

    resolve<N extends string>(name: N, resolveOptions?: ResolveOptions) {
        return this.container.resolve(name, resolveOptions);
    }
}
