import { name, version } from "./metadata.js";

export const environment = "SG-LOCAL-1";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "https://098a0c6ad1d74e8eb39ec7df895e59e0@sentry.lumigame.com/76",
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
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:LmnBackend";
const dbSrv = "10.10.50.12:39101,10.10.50.13:39101,10.10.50.14:39101";
const dbRepl = "L1pLocal";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
