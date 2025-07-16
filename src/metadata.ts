import type { Metadata } from "@ldb/utils";

export const name = "game-config-monitor-service" as const;
export const version = "2.1.7" as const;

export const metadata = { name, version } as const satisfies Metadata;
