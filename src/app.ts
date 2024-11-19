import type { BaseLogger } from "@ldb/logger";
import { wait } from "@ldb/utils";
import type { Deployers } from "./deployers/index.js";
import type { Initiators } from "./initiators/index.js";
import { name, version } from "./metadata.js";
import type { Reporters } from "./reporters/index.js";
import type { Watchers } from "./watchers/index.js";

let exiting = false;

export class App {
    constructor(
        private readonly watchers: Watchers,
        private readonly initiators: Initiators,
        private readonly deployers: Deployers,
        private readonly reporters: Reporters,
        private readonly logger: BaseLogger,
    ) {
        this.selfBound();
        this.handleExceptions();
    }

    get className() {
        return this.constructor.name;
    }

    private selfBound() {
        this.handleUncaughtException = this.handleUncaughtException.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
    }

    private handleExceptions() {
        process.addListener("uncaughtException", this.handleUncaughtException);
        process.addListener("unhandledRejection", this.handleUnhandledRejection);
    }

    private async handleUncaughtException(error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
        this.terminate();
        while (exiting) {
            await wait(1_000);
        }

        exiting = true;
        this.logger.logFatal({ title: name, message: error }, { tags: { event: "uncaughtException" }, extra: { error, origin } });

        await wait(5_000);
        process.exit(10);
    }

    private async handleUnhandledRejection(reason: unknown, promise: Promise<unknown>) {
        this.terminate();
        while (exiting) {
            await wait(5_000);
        }

        exiting = true;
        this.logger.logFatal({ title: name, message: reason }, { tags: { event: "unhandledRejection" }, extra: { reason, promise } });

        await wait(5_000);
        process.exit(20);
    }

    initiate() {
        this.reporters.indexReporter.subscribe(this.deployers.indexDeployer);
        this.reporters.configReporter.subscribe(this.deployers.configDeployer);

        this.deployers.indexDeployer.subscribe(this.initiators.gameInitiator);
        this.deployers.indexDeployer.subscribe(this.initiators.indexInitiator);

        this.deployers.configDeployer.subscribe(this.initiators.gameInitiator);
        this.deployers.configDeployer.subscribe(this.initiators.archiveInitiator);
        this.deployers.configDeployer.subscribe(this.initiators.summaryInitiator);

        this.initiators.gameInitiator.subscribe(this.watchers.indexTemplatesWatcher);
        this.initiators.gameInitiator.subscribe(this.watchers.archiveTemplatesWatcher);
        this.initiators.gameInitiator.subscribe(this.watchers.summaryTemplatesWatcher);

        this.initiators.indexInitiator.subscribe(this.watchers.gameConfigsWatcher);
        this.initiators.archiveInitiator.subscribe(this.watchers.gameConfigsWatcher);
        this.initiators.summaryInitiator.subscribe(this.watchers.gameConfigsWatcher);

        this.logger.logWarning({ title: `${name}@${version}`, message: "App has been started." });

        this.watchers.gameConfigsWatcher.initiate();
    }

    private terminate() {
        this.reporters.indexReporter.unsubscribe(this.deployers.indexDeployer);
        this.reporters.configReporter.unsubscribe(this.deployers.configDeployer);

        this.deployers.indexDeployer.unsubscribe(this.initiators.gameInitiator);
        this.deployers.indexDeployer.unsubscribe(this.initiators.indexInitiator);

        this.deployers.configDeployer.unsubscribe(this.initiators.gameInitiator);
        this.deployers.configDeployer.unsubscribe(this.initiators.archiveInitiator);
        this.deployers.configDeployer.unsubscribe(this.initiators.summaryInitiator);

        this.initiators.gameInitiator.unsubscribe(this.watchers.indexTemplatesWatcher);
        this.initiators.gameInitiator.unsubscribe(this.watchers.archiveTemplatesWatcher);
        this.initiators.gameInitiator.unsubscribe(this.watchers.summaryTemplatesWatcher);

        this.initiators.indexInitiator.unsubscribe(this.watchers.gameConfigsWatcher);
        this.initiators.archiveInitiator.unsubscribe(this.watchers.gameConfigsWatcher);
        this.initiators.summaryInitiator.unsubscribe(this.watchers.gameConfigsWatcher);
    }
}
