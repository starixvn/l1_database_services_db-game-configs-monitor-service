import type { BaseLogger, Extras } from "@ldb/logger";
import type { ChangeStreamDeleteDocument, ChangeStreamInsertDocument, ChangeStreamReplaceDocument, ChangeStreamUpdateDocument, Collection } from "@ldb/mongo";
import { subtractArrays } from "@ldb/utils";
import { Watcher } from "@ldb/watcher";
import type { GameConfigsSchema } from "../types/schema.js";

const UNAVAILABLE = { name: "<unavailable>", gameId: NaN, type: NaN } as const satisfies GameConfigsSchema;

export type GameConfigEvents = {
    GAME: (gameConfig: GameConfigsSchema) => Promise<void>;
    INITIATE: (gameConfig: GameConfigsSchema) => Promise<void>;
};

export class GameConfigsWatcher extends Watcher<GameConfigEvents, GameConfigsSchema> {
    constructor(gameConfigsCollection: Collection<GameConfigsSchema>, logger: BaseLogger) {
        super(gameConfigsCollection, [], logger);
    }

    protected handleDocumentInsert(changeDocument: ChangeStreamInsertDocument<GameConfigsSchema>) {
        const { fullDocument } = changeDocument;
        const { name, gameId, type } = fullDocument;

        this.emit<"GAME">("GAME", { name, gameId, type });
    }

    protected handleDocumentUpdate(changeDocument: ChangeStreamUpdateDocument<GameConfigsSchema>) {
        const { updateDescription, fullDocumentBeforeChange } = changeDocument;
        const { updatedFields, removedFields } = updateDescription;

        let report = false;
        const updated: Extras = {};

        const removed = subtractArrays(["name", "gameId", "type"], removedFields ?? []);
        if (removed.length > 0) {
            updated.removedFields = removed;
            report = true;
        }

        const { name: updatedName, gameId: updatedGameId, type: updatedType } = updatedFields ?? {};
        const { name, gameId, type } = fullDocumentBeforeChange ?? UNAVAILABLE;
        if (updatedName != null) {
            updated.name = { before: name, after: updatedName };
            report = true;
        }
        if (updatedGameId != null) {
            updated.gameId = { before: gameId, after: updatedGameId };
            report = true;
        }
        if (updatedType != null) {
            updated.type = { before: type, after: updatedType };
            report = true;
        }

        updated.name = updated.name || name;
        updated.gameId = updated.gameId || gameId;
        updated.type = updated.type || type;

        if (report) {
            this.logger.logWarning({ title: this.className, message: "Dangerous update detected" }, { extra: { updated } });
        }
    }

    protected handleDocumentReplace(changeDocument: ChangeStreamReplaceDocument<GameConfigsSchema>) {
        const { fullDocumentBeforeChange, fullDocument } = changeDocument;
        const { name, gameId, type } = fullDocumentBeforeChange ?? UNAVAILABLE;
        const { name: updatedName, gameId: updatedGameId, type: updatedType } = fullDocument;

        let report = false;
        const replaced: Extras = {};

        if (name !== updatedName) {
            replaced.name = { before: name, after: updatedName };
            report = true;
        }
        if (gameId !== updatedGameId) {
            replaced.gameId = { before: gameId, after: updatedGameId };
            report = true;
        }
        if (type !== updatedType) {
            replaced.type = { before: type, after: updatedType };
            report = true;
        }

        replaced.name = replaced.name || name;
        replaced.gameId = replaced.gameId || gameId;
        replaced.type = replaced.type || type;

        if (report) {
            this.logger.logWarning({ title: this.className, message: "Dangerous replace detected" }, { extra: { replaced } });
        }
    }

    protected handleDocumentDelete(changeDocument: ChangeStreamDeleteDocument<GameConfigsSchema>): void {
        const { fullDocumentBeforeChange } = changeDocument;
        const { name, gameId, type } = fullDocumentBeforeChange ?? UNAVAILABLE;

        this.logger.logWarning({ title: this.className, message: "Dangerous delete detected" }, { extra: { deleted: { name, gameId, type } } });
    }

    async initiate() {
        const games = this.collection.find({}, { projection: { _id: 0, name: 1, gameId: 1, type: 1 } });

        for await (const { name, gameId, type } of games) {
            this.emit("INITIATE", { name, gameId, type });
        }
    }
}
