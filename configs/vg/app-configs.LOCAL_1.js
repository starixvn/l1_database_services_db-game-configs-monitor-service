import { name, version } from "./metadata.js";

export const environment = "VG-LOCAL-1";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "https://be2c83ae1b01424ab32f27411f22f8c5@sentry.lumigame.com/77",
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
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:LmnBackend";
const dbSrv = "10.10.50.12:39201,10.10.50.13:39201,10.10.50.14:39201";
const dbRepl = "L2pLocal";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
