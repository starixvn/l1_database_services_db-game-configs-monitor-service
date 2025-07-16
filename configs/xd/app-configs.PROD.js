/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "XD-PROD";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://36fed42b6d2c8eab09bd46ffbd276073@sentrypro-sc.nebula.prod/21",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002096556100,
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

const mongoCred = "lmn_backend:%51%37%34%7e%54%30%76%4b%36%25%67%4d%4f%3a%49%49%60%4c%5d%4d%78%63%2c%52%5e%28%49%68%78%70%41%74";
const mongoSrv = "10.99.99.53:39410,10.99.99.54:39410,10.99.99.188:39410";
const mongoRepl = "SN-Main";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "ops_configs", coll: "summary_templates" },
};
