/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "HD-SIT";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002034115006,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090ALHP2DD",
        },
    },
    environment,
};

const mongoCred = "hotdog_backend:Backend%40517";
const mongoSrv = "172.16.4.111:35301";
const mongoRepl = "SP-SIT";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "hotdog_minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "hotdog_ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "hotdog_ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "hotdog_ops_configs", coll: "summary_templates" },
};
