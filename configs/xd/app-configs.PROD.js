import { name, version } from "./metadata.js";

export const environment = "XD-PROD";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://9326bb3634924b3baf140399926a6df3@10.2.189.50:9009/170",
    environment,
    initialScope: {
        tags: { service: name },
    },
    release: `${name}@${version}`,
};
export const sentryOptions = {};

export const skynexSeverityLevel = "warning";
export const skynexOptions = {
    conversationIds: {
        telegram: -1002053007604,
        teams: "19:e2ffe52fe7e846749e5632042ca821b1@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%51%37%34%7e%54%30%76%4b%36%25%67%4d%4f%3a%49%49%60%4c%5d%4d%78%63%2c%52%5e%28%49%68%78%70%41%74";
const dbSrv = "10.99.99.53:39410,10.99.99.54:39410,10.99.99.188:39410,10.99.99.187:39410";
const dbRepl = "SN-Main";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
