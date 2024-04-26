import type { BaseLogger } from "@ldb/base-logger";
import type { ChangeStreamInsertDocument, Collection } from "@ldb/mongo";
import { Watcher } from "../modules/watcher.js";
import type { GameConfigsSchema } from "../types/schema.js";

export type GameConfigEvents = {
    GAME: (gameConfig: GameConfigsSchema) => Promise<void>;
    INITIATE: (gameConfig: GameConfigsSchema) => Promise<void>;
};

export class GameConfigsWatcher extends Watcher<GameConfigEvents, GameConfigsSchema> {
    constructor(gameConfigsCollection: Collection<GameConfigsSchema>, logger: BaseLogger) {
        super(gameConfigsCollection, [], logger);
    }

    protected handleDocumentInsert(changeDocument: ChangeStreamInsertDocument<GameConfigsSchema>): void {
        const { fullDocument } = changeDocument;
        const { name, gameId, type } = fullDocument;

        this.emit<"GAME">("GAME", { name, gameId, type });
    }

    async initiate() {
        const games = this.collection.find({}, { projection: { _id: 0, name: 1, gameId: 1, type: 1 } });

        for await (const { name, gameId, type } of games) {
            this.emit<"INITIATE">("INITIATE", { name, gameId, type });
        }
    }
}
