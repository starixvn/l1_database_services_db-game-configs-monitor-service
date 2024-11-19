import { type CollationOptions, type IndexDescription, type IndexDirection } from "@ldb/mongo";

export function generateIndexName(collectionName: string, indexDescription: IndexDescription): string {
    const { key, unique, sparse, partialFilterExpression, expireAfterSeconds, collation } = indexDescription;

    /** Default _id index name */
    if (JSON.stringify(key) === JSON.stringify({ _id: 1 })) {
        return "_id_";
    }

    /** Build index name */
    let name = "IX";

    /** Unique index prefix */
    name = unique ? `U${name}` : name;

    /** Sparse index prefix */
    name = sparse ? `S${name}` : name;

    /** Filter index prefix */
    name = partialFilterExpression ? `F${name}` : name;

    /** TTL index prefix */
    name = typeof expireAfterSeconds === "number" ? `TTL_${name}` : name;

    /** Index name:
     *    [TTL]_[F][S][U]IX_[CollectionName]_[Keys]_[Collation]
     */
    name = [name, collectionName, generateKeysName(key), generateCollationName(collation)].filter(Boolean).join("_");

    return `@${name}` as const;
}

function generateKeysName(key: IndexDescription["key"]): string {
    return Object.entries(key).map(mapKeyEntries).join("_");
}

function mapKeyEntries([key, value]: [string, IndexDirection]): string {
    /** - Omit value when is default IndexDirection = 1
     *  - Key entry will be mapped to "key$value" string
     */
    return [key, value === 1 ? null : value].filter(Boolean).join("$");
}

function generateCollationName(collation?: CollationOptions): string {
    /** Return empty string of no collation provided */
    if (!collation) {
        return "";
    }

    /** Collation name is a "locale_strength" string */
    return [collation.locale, collation.strength].filter(Boolean).join("_");
}
