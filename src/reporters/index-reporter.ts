import type { BaseLogger } from "@ldb/logger";
import { Subscriber } from "@ldb/utils";
import { IndexDeployer, IndexDeployEvents } from "../deployers/index-deployer.js";
import { WAIT_TO_REPORT } from "./constants.js";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const formatMap = (list: Map<string, Set<string>>) => {
    const lines: string[] = [];
    for (const [item, indexList] of list) {
        lines.push(`${item}-${indexList.size}`);
    }
    return lines.join("  ");
};

export class IndexReporter extends Subscriber<IndexDeployEvents> {
    private waiting = false;
    private sending = false;
    private readonly indexes: Map<string, Map<string, Set<string>>> = new Map();

    constructor(logger: BaseLogger) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.reportIndex = this.reportIndex.bind(this);
    }

    private async reportIndex(namespace: string, indexName: string) {
        while (this.sending) {
            await wait(1_000);
        }

        const [group, item] = namespace.split("_");

        const groupList = this.indexes.get(group);

        if (!groupList) {
            this.indexes.set(group, new Map([[item, new Set([indexName])]]));
        } else {
            const indexList = groupList.get(item);
            if (!indexList) {
                groupList.set(item, new Set([indexName]));
            } else {
                indexList.add(indexName);
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

        if (this.sending || this.indexes.size === 0) {
            return;
        }

        this.sending = true;

        const lines: string[] = [""];
        for (const [namespace, groupList] of this.indexes.entries()) {
            lines.push(`**${namespace}**:  ${formatMap(groupList)}`);
            this.indexes.delete(namespace);
        }

        this.logger.logWarning({ title: "IndexDeployed", message: lines.join("  \n") });

        this.sending = false;
    }

    subscribe(publisher: IndexDeployer): boolean {
        return super.subscribe(publisher, "INDEXED", this.reportIndex);
    }

    unsubscribe(publisher: IndexDeployer): boolean {
        return super.unsubscribe(publisher, "INDEXED", this.reportIndex);
    }
}
