import { type ConfigTemplateEvents, ConfigTemplatesWatcher } from "./config-templates-watcher.js";
import { ArchiveTemplatesWatcher, SummaryTemplatesWatcher } from "./extend-config-templates-watcher.js";
import { type GameConfigEvents, GameConfigsWatcher } from "./game-configs-watcher.js";
import { type IndexTemplateEvents, IndexTemplatesWatcher } from "./index-templates-watcher.js";

export class Watchers {
    constructor(
        readonly gameConfigsWatcher: GameConfigsWatcher,
        readonly indexTemplatesWatcher: IndexTemplatesWatcher,
        readonly archiveTemplatesWatcher: ArchiveTemplatesWatcher,
        readonly summaryTemplatesWatcher: SummaryTemplatesWatcher
    ) {}
}

export { ArchiveTemplatesWatcher, ConfigTemplatesWatcher, GameConfigsWatcher, IndexTemplatesWatcher, SummaryTemplatesWatcher };
export type { ConfigTemplateEvents, GameConfigEvents, IndexTemplateEvents };
