import type { BaseLogger } from "@ldb/logger";
import type { ChangeStreamNameSpace, Collection, Document } from "@ldb/mongo";
import { Dispatcher } from "@ldb/utils";
import { CATEGORY as category } from "../constants.js";
import type { ConfigMetadata, ConfigSchema, ConfigTemplateSchema, GameConfigsSchema } from "../types/schema.js";
import type { GameConfigEvents, GameConfigsWatcher } from "../watchers/index.js";

export type ConfigEvents<T extends Document> = {
    deployConfig: (type: string, namespace: ChangeStreamNameSpace, filter: Document, data: ConfigSchema<T>, notify: boolean) => Promise<void>;
};

export class ConfigInitiator<T extends Document> extends Dispatcher<ConfigEvents<T>, GameConfigEvents> {
    constructor(
        private readonly configTemplateCollection: Collection<ConfigTemplateSchema<T>>,
        private readonly configType: string,
        logger: BaseLogger,
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.handleGame = this.handleGame.bind(this);
        this.handleInitiate = this.handleInitiate.bind(this);
    }

    private async handleGame(gameConfig: GameConfigsSchema) {
        this.handleGameConfig(gameConfig, true);
    }

    private async handleInitiate(gameConfig: GameConfigsSchema) {
        this.handleGameConfig(gameConfig, false);
    }

    private async handleGameConfig(gameConfig: GameConfigsSchema, notify: boolean) {
        const { gameId, name, type } = gameConfig;

        const definition = await this.getConfigDefinition(gameConfig);
        const { targets } = definition;

        const metadata: ConfigMetadata = {
            gameConfigs: { gameId, name },
            category,
            type,
        };

        for (const target of targets) {
            await this.emitDataForEachTarget(target, metadata, definition, notify);
        }
    }

    private async emitDataForEachTarget(target: ChangeStreamNameSpace, metadata: ConfigMetadata, configDefinition: ConfigTemplateSchema<T>, notify: boolean) {
        const { data } = configDefinition;
        const { gameConfigs } = metadata;

        for (const config of data) {
            const { id = 0 } = config;
            const definition = { ...config, ...metadata, id };
            const data = Object.assign({}, { _id: { gameConfigs, id } }, definition);
            this.emit<"deployConfig">("deployConfig", this.configType, target, { gameConfigs, id }, data, notify);
        }
    }

    private async getConfigDefinition(gameConfig: GameConfigsSchema): Promise<ConfigTemplateSchema<T>> {
        const { type } = gameConfig;
        const templates = await this.configTemplateCollection.findOne({ category, type }, { projection: { _id: 0 } });
        return templates || { category, type, targets: [], data: [] };
    }

    subscribe(publisher: GameConfigsWatcher): boolean {
        const game = super.subscribe(publisher, "GAME", this.handleGame);
        const initiate = super.subscribe(publisher, "INITIATE", this.handleInitiate);
        return game && initiate;
    }

    unsubscribe(publisher: GameConfigsWatcher): boolean {
        const game = super.unsubscribe(publisher, "GAME", this.handleGame);
        const initiate = super.unsubscribe(publisher, "INITIATE", this.handleInitiate);
        return game && initiate;
    }
}
