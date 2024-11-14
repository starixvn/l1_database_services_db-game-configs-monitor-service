import type { BaseLogger } from "@ldb/logger";
import type { ChangeStreamNameSpace, Collection, IndexDescription } from "@ldb/mongo";
import { Dispatcher } from "@ldb/utils";
import { CATEGORY as category } from "../constants.js";
import type { GameConfigsSchema, IndexTemplatesSchema } from "../types/schema.js";
import type { GameConfigEvents, GameConfigsWatcher } from "../watchers/index.js";
import { isGameExcluded, mapNamespace, notInvalidIndex, parseIndexDefinition } from "./initiator-utils.js";

export type CollectionIndexesDefinition = { ns: ChangeStreamNameSpace; idxs: IndexDescription[] };

export type IndexEvents = {
    deployIndex: (namespace: ChangeStreamNameSpace, descriptions: IndexDescription[], notify: boolean) => Promise<void>;
};

export class IndexInitiator extends Dispatcher<IndexEvents, GameConfigEvents, GameConfigsWatcher> {
    constructor(
        private readonly indexTemplatesCollection: Collection<IndexTemplatesSchema>,
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
        if (isGameExcluded(gameConfig.type, gameConfig.gameId)) {
            return;
        }

        const definition = await this.getIndexDefinition(gameConfig);

        if (!definition) {
            return;
        }
        for (const { ns, idxs } of definition) {
            this.emit<"deployIndex">("deployIndex", ns, idxs, notify);
        }
    }

    private async getIndexDefinition(gameConfig: GameConfigsSchema): Promise<CollectionIndexesDefinition[] | null> {
        const { type, name } = gameConfig;
        const templates = await this.indexTemplatesCollection.findOne({ category, type }, { projection: { _id: 0, colls: 1 } });

        if (!templates) {
            return null;
        }

        const descriptions: CollectionIndexesDefinition[] = [];
        for (const { ns, idxs } of templates.colls) {
            const namespace = mapNamespace(ns, name);
            const indexes: IndexDescription[] = Object.values(idxs).map(parseIndexDefinition).filter(notInvalidIndex);

            descriptions.push({ ns: namespace, idxs: indexes });
        }
        return descriptions;
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
