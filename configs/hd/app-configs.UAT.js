import { name, version } from "./metadata.js";

export const environment = "HD-KL-UAT";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://9e03285f9c3ff7b4b44903dd009f49dd@sentrypro-sc.ops-klprod.gamora.prod/22",
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
        host: "iusqd.gamora.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "hotdog_backend:HotdogBackend%4022027";
const dbSrv = "10.146.34.28:39520";
const dbRepl = "SN-UAT";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
