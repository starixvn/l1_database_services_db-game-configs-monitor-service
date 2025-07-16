/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "SG-PROD";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://dfda4d5e4eabf49adb8dbb4b0c54bc48@sentrypro-sc.nebula.prod/19",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1001893615808,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090VPU8KFF",
        },
        proxy: {
            protocol: "http",
            host: "lisasqd.nebula.prod",
            port: 8801,
        },
    },
    environment,
};

const mongoCred = "lmn_backend:%4d%37%4b%34%74%74%48%2a%74%5a%33%6d%6c%3f%29%7c%41%5d%6a%4e%34%3f%4c%42%68%77%46%26%36%49%4f%3c";
const mongoSrv = "10.99.99.53:39110,10.99.99.54:39110,10.99.99.188:39110";
const mongoRepl = "SabaMain";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "ops_configs", coll: "summary_templates" },
};
