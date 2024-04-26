import { name, version } from "./metadata.js";

export const environment = "XD-LOCAL-0";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "https://9ea52e989cbd40458728a6b26c1107b1@sentry.lumigame.com/88",
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
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:LmnBackend";
const dbSrv = "10.10.50.12:39300,10.10.50.13:39300,10.10.50.14:39300";
const dbRepl = "GNLocal0";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
