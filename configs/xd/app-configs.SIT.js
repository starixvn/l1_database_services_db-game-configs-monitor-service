import { name, version } from "./metadata.js";

export const environment = "XD-SIT";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://deb8a0a2ea0e4788a8d19b9aee8b2aa9@10.2.190.51:9009/297",
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
        telegram: -1002102889843,
        teams: "19:28d5d92385834affa7ac26416f2cf55b@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%4c%6d%6e%42%61%63%6b%65%6e%64%40%35%31%37";
const dbSrv = "10.99.99.53:39430,10.99.99.54:39430,10.99.99.188:39430,10.99.99.187:39430";
const dbRepl = "SN-SIT";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
