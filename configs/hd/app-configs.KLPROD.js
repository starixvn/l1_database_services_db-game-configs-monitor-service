/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */
/** @typedef {import("@ldb/mongo").ChangeStreamNameSpace} ChangeStreamNameSpace */

import { name, version } from "./metadata.js";

export const environment = "HD-KL-PROD";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://9e03285f9c3ff7b4b44903dd009f49dd@sentrypro-sc.ops-klprod.gamora.prod/22",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1002096556100,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090GANNXP1",
        },
        proxy: {
            protocol: "http",
            host: "iusqd.gamora.prod",
            port: 8801,
        },
    },
    environment,
};

const mongoCred = "hotdog_backend:%3FD%60XWko0ZI99Y2PQ%5Eu%2E9LV%2BYv%2Emj6rhH";
const mongoSrv = "10.146.34.26:39510,10.146.34.27:39510,10.146.34.30:39510,10.146.34.28:39510";
const mongoRepl = "SP-Main";

export const database = {
    mongoURI: `mongodb://${mongoCred}@${mongoSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${mongoRepl}`,
};

/** @type {Record<string, ChangeStreamNameSpace>} */
export const namespaces = {
    gameConfigsCollection: { db: "hotdog_minigame", coll: "game_configs" },
    indexTemplatesCollection: { db: "hotdog_ops_configs", coll: "index_templates" },
    archiveTemplatesCollection: { db: "hotdog_ops_configs", coll: "archive_templates" },
    summaryTemplatesCollection: { db: "hotdog_ops_configs", coll: "summary_templates" },
};
