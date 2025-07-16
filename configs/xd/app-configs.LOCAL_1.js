/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "XD-LOCAL-1";
export const healthcheckPort = 5000;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "https://eacc58fec0768b74e8ce04af770fc783@sentry-k8s.lumigame.com/23",
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
const mongoSrv = "10.10.50.12:39301,10.10.50.13:39301,10.10.50.14:39301";
const mongoRepl = "GNLocal1";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

export const namespaces = {
    gameConfigsCollection: { db: "minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "ops_configs", coll: "summary_templates" },
};
