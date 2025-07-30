/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "HD-LOCAL-0";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "https://42cb349f8a4fbd2297e870bb3fc41821@sentry-k8s.lumigame.com/25",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002034115006,
            slack: "B08GPPK88MS:T08ACMHMMFS:C091FAL49UG",
        },
    },
    environment,
};

const mongoCred = "lmn_backend:LmnBackend";
const mongoSrv = "10.10.50.12:39400,10.10.50.13:39400,10.10.50.14:39400";
const mongoRepl = "SPLocal0";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "hotdog_minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "hotdog_ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "hotdog_ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "hotdog_ops_configs", coll: "summary_templates" },
};
