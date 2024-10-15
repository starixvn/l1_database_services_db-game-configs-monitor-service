import { ConfigReporter } from "./config-reporter.js";
import { IndexReporter } from "./index-reporter.js";

export class Reporters {
    constructor(
        readonly configReporter: ConfigReporter,
        readonly indexReporter: IndexReporter,
    ) {}
}

export { ConfigReporter, IndexReporter };
