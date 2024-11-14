import type { BaseLogger } from "@ldb/logger";
import type { Document } from "@ldb/mongo";
import { Subscriber } from "@ldb/utils";
import type { ConfigDeployer, ConfigDeployEvents } from "../deployers/config-deployer.js";
import { WAIT_TO_REPORT } from "./constants.js";

type Result = { upsertedCount: number; modifiedCount: number };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const formatMap = (list: Map<string, Result>) => {
    const lines: string[] = [];
    for (const [gameName, gameCounter] of list) {
        const { upsertedCount, modifiedCount } = gameCounter;
        lines.push(`    **${gameName}**  I-${upsertedCount} M-${modifiedCount}`);
    }
    return lines.join("  \n");
};

export class ConfigReporter extends Subscriber<ConfigDeployEvents> {
    private waiting = false;
    private sending = false;
    private readonly configs: Map<string, Map<string, Result>> = new Map();

    constructor(logger: BaseLogger) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.reportConfig = this.reportConfig.bind(this);
    }

    private async reportConfig(configType: string, gameName: string, upsertedCount = 0, modifiedCount = 0) {
        while (this.sending) {
            await wait(1_000);
        }

        const config = this.configs.get(configType);

        if (!config) {
            this.configs.set(configType, new Map([[gameName, { upsertedCount, modifiedCount }]]));
        } else {
            const gameCounter = config.get(gameName);
            if (!gameCounter) {
                config.set(gameName, { upsertedCount, modifiedCount });
            } else {
                gameCounter.upsertedCount += upsertedCount;
                gameCounter.modifiedCount += modifiedCount;
            }
        }

        this.sendReport();
    }

    private async sendReport() {
        if (this.waiting || this.sending) {
            return;
        }

        this.waiting = true;
        await wait(WAIT_TO_REPORT);
        this.waiting = false;

        if (this.sending || this.configs.size === 0) {
            return;
        }

        this.sending = true;

        const lines: string[] = [""];
        for (const [configType, gameCounter] of this.configs.entries()) {
            lines.push(`\`${configType}\`:`, formatMap(gameCounter));
            this.configs.delete(configType);
        }

        this.logger.logWarning({ title: "ConfigDeployed", message: lines.join("  \n") });

        this.sending = false;
    }

    subscribe(publisher: ConfigDeployer<Document>): boolean {
        return super.subscribe(publisher, "CONFIGURED", this.reportConfig);
    }
}
