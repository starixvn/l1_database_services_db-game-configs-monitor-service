import type { BaseLogger } from "@ldb/logger";
import type { Collection, Document, IndexDescription } from "@ldb/mongo";
import { Dispatcher, type EventsDescription, type Intersection, type TypedEventEmitter } from "@ldb/utils";
import type { ConfigMetadata, ConfigTemplateSchema, GameConfigsSchema, IndexTemplatesSchema } from "../types/schema.js";
import type { ConfigTemplateEvents, IndexTemplateEvents } from "../watchers/index.js";
import { ConfigTemplatesWatcher, IndexTemplatesWatcher } from "../watchers/index.js";
import type { CollectionIndexesDefinition, ConfigEvents, IndexEvents } from "./index.js";
import { isGameExcluded, mapNamespace, notInvalidIndex, parseIndexDefinition } from "./initiator-utils.js";

type Events<T extends Document> = IndexTemplateEvents | ConfigTemplateEvents<T>;

type WrapEmitter<E> = E extends infer T ? (T extends EventsDescription ? TypedEventEmitter<T> : never) : never;

type Watchers<T extends Document> = IndexTemplatesWatcher | ConfigTemplatesWatcher<T>;

export type GameEvents<T extends Document> = IndexEvents & ConfigEvents<T>;

export class GameInitiator<T extends Document> extends Dispatcher<GameEvents<T>, Events<T>, WrapEmitter<Events<T>> | TypedEventEmitter<Intersection<Events<T>>>> {
    constructor(
        private readonly gameConfigsCollection: Collection<GameConfigsSchema>,
        logger: BaseLogger,
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.handleIndex = this.handleIndex.bind(this);
        this.handleConfig = this.handleConfig.bind(this);
    }

    private async handleIndex(indexTemplate: IndexTemplatesSchema) {
        const definitions = await this.getIndexDefinition(indexTemplate);
        for (const { ns, idxs } of definitions) {
            this.emit<"deployIndex">("deployIndex", ns, idxs, true);
        }
    }

    private async getIndexDefinition(indexTemplate: IndexTemplatesSchema): Promise<CollectionIndexesDefinition[]> {
        const { type, colls } = indexTemplate;
        const games = this.getGameByType(type);

        const definitions: CollectionIndexesDefinition[] = [];
        for await (const { gameId, name } of games) {
            if (isGameExcluded(type, gameId)) {
                continue;
            }

            for (const { ns, idxs } of colls) {
                const namespace = mapNamespace(ns, name);
                const indexes: IndexDescription[] = Object.values(idxs).map(parseIndexDefinition).filter(notInvalidIndex);

                definitions.push({ ns: namespace, idxs: indexes });
            }
        }
        return definitions;
    }

    private async handleConfig(configType: string, configTemplate: ConfigTemplateSchema<T>) {
        const { targets } = configTemplate;
        const definitions = await this.getConfigDefinition(configTemplate);

        for (const target of targets) {
            for (const definition of definitions) {
                const { gameConfigs, id } = definition;
                const data = Object.assign({}, { _id: { gameConfigs, id } }, definition);
                this.emit<"deployConfig">("deployConfig", configType, target, { gameConfigs, id }, data, true);
            }
        }
    }

    private async getConfigDefinition(configTemplate: ConfigTemplateSchema<T>) {
        const { category, type, data } = configTemplate;
        const games = this.getGameByType(type);

        const definitions = [];
        for await (const { gameId, name } of games) {
            if (isGameExcluded(type, gameId)) {
                continue;
            }

            const metadata: ConfigMetadata = {
                gameConfigs: { gameId, name },
                category,
                type,
            };

            for (const config of data) {
                const { id = 0 } = config;
                definitions.push({ ...config, ...metadata, id });
            }
        }

        return definitions;
    }

    private getGameByType(type: number) {
        return this.gameConfigsCollection.find({ type }, { projection: { _id: 0, gameId: 1, name: 1 } });
    }

    subscribe(publisher: Watchers<T>): boolean {
        if (publisher instanceof IndexTemplatesWatcher) {
            return super.subscribe<"INDEX">(publisher, "INDEX", this.handleIndex);
        }
        if (publisher instanceof ConfigTemplatesWatcher) {
            return super.subscribe<"CONFIG">(publisher, "CONFIG", this.handleConfig);
        }
        return false;
    }

    unsubscribe(publisher: Watchers<T>): boolean {
        if (publisher instanceof IndexTemplatesWatcher) {
            return super.unsubscribe<"INDEX">(publisher, "INDEX", this.handleIndex);
        }
        if (publisher instanceof ConfigTemplatesWatcher) {
            return super.unsubscribe<"CONFIG">(publisher, "CONFIG", this.handleConfig);
        }
        return false;
    }
}
