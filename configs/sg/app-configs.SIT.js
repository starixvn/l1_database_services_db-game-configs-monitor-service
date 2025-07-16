/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "SG-SIT";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://a4e9d446189bcd2464e4449f67506eb3@sentryuat-sc.nebula.prod/21",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1001964283718,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090ALHP2DD",
        },
        proxy: {
            protocol: "http",
            host: "lisasqd.nebula.prod",
            port: 8801,
        },
    },
    environment,
};

const mongoCred = "lmn_backend:%4c%6d%6e%42%61%63%6b%65%6e%64%40%35%31%37";
const mongoSrv = "10.99.99.53:39130,10.99.99.54:39130,10.99.99.188:39130";
const mongoRepl = "SabaSIT";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "ops_configs", coll: "summary_templates" },
};
