import { name, version } from "./metadata.js";

export const environment = "VG-SIT";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://4d147849b1a44d53844166ff9487dd6b@10.2.190.51:9009/296",
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
        telegram: -1001806296262,
        teams: "19:b922d6e3550145368d69cfb67fc8d471@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%4c%6d%6e%42%61%63%6b%65%6e%64%40%35%31%37";
const dbSrv = "10.99.99.53:39230,10.99.99.54:39230,10.99.99.188:39230,10.99.99.187:39230";
const dbRepl = "SabaL2SIT";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
