import { name, version } from "./metadata.js";

export const environment = "SG-PROD";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://d84f2c9daa5044c48bca9930aa7e98b0@10.2.189.50:9009/168",
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
        telegram: -1001950959384,
        teams: "19:be24943049994d4fbd7263af53a8c07d@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%4d%37%4b%34%74%74%48%2a%74%5a%33%6d%6c%3f%29%7c%41%5d%6a%4e%34%3f%4c%42%68%77%46%26%36%49%4f%3c";
const dbSrv = "10.99.99.53:39110,10.99.99.54:39110,10.99.99.188:39110,10.99.99.187:39110";
const dbRepl = "SabaMain";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
