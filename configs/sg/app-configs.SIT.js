import { name, version } from "./metadata.js";

export const environment = "SG-SIT";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://7820c1cec9bc47f1b52a054861b55256@10.2.190.51:9009/295",
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
        telegram: -1001859311720,
        teams: "19:a604b3e322c444978c9309497c88affa@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%4c%6d%6e%42%61%63%6b%65%6e%64%40%35%31%37";
const dbSrv = "10.99.99.53:39130,10.99.99.54:39130,10.99.99.188:39130,10.99.99.187:39130";
const dbRepl = "SabaSIT";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
