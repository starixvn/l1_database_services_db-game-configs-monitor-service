import type { Document } from "@ldb/mongo";
import { type ConfigDeployEvents, ConfigDeployer } from "./config-deployer.js";
import { type IndexDeployEvents, IndexDeployer } from "./index-deployer.js";

export class Deployers {
    constructor(
        readonly configDeployer: ConfigDeployer<Document>,
        readonly indexDeployer: IndexDeployer,
    ) {}
}

export { ConfigDeployer, IndexDeployer };
export type { ConfigDeployEvents, IndexDeployEvents };
