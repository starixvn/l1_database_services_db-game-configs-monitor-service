import { name, version } from "./metadata.js";

export const environment = "VG-PROD";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "http://bb368dd4964d4f28bdeec2494d4742bf@10.2.189.50:9009/169",
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
        telegram: -1001984905269,
        teams: "19:28b8ff43d39b464e96188166e23ad223@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

const dbCred = "lmn_backend:%21%23%78%39%37%25%75%59%5a%76%2a%5e%25%3e%7c%2a%71%67%40%45%37%46%48%69%3f%39%6c%7b%39%72%3c%4b";
const dbSrv = "10.99.99.53:39210,10.99.99.54:39210,10.99.99.188:39210,10.99.99.187:39210";
const dbRepl = "L2_SabaMain";

export const database = {
    targetUrl: `mongodb://${dbCred}@${dbSrv}/admin?authSource=admin&appName=${encodeURIComponent(name)}&replicaSet=${dbRepl}`,
};
