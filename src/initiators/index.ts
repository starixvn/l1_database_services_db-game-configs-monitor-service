import type { Document } from "@ldb/mongo";
import { type ConfigEvents, ConfigInitiator } from "./config-initiator.js";
import { ArchiveInitiator, SummaryInitiator } from "./extend-config-initiator.js";
import { type GameEvents, GameInitiator } from "./game-initiator.js";
import { type CollectionIndexesDefinition, type IndexEvents, IndexInitiator } from "./index-initiator.js";

export class Initiators {
    constructor(
        readonly gameInitiator: GameInitiator<Document>,
        readonly indexInitiator: IndexInitiator,
        readonly archiveInitiator: ArchiveInitiator,
        readonly summaryInitiator: SummaryInitiator
    ) {}
}

export { ArchiveInitiator, ConfigInitiator, GameInitiator, IndexInitiator, SummaryInitiator };
export type { CollectionIndexesDefinition, ConfigEvents, GameEvents, IndexEvents };
