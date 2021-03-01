import { StorageContextUtility } from './storage-context-utility';
import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityArray } from './storage-context-entity-array';
import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

const { findOrCreateMapEntry } = StorageContextUtility;

/**
 * Simplified type for generic use-cases.
 */
export type SerializedEntitySet<V> = StorageContextEntityMap<V, StorageTransportApiMask>;

/**
 * Represents a collection of StorageContextEntity instances of the same value type.
 */
export class StorageContextEntityMap<V, T extends StorageTransportApiMask> {

	public readonly content: Map<string, StorageContextEntity<V, T>> = new Map();

	constructor(
		public readonly context: StorageContext<T>,
		public readonly sharedOptions: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public getEntity(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V, T> {
		return findOrCreateMapEntry(this.content, key, () => this.context.createEntity<V>(key, options));
	}

	public entries(): StorageContextEntity<V, T>[] {
		return Array.from(this.content.values());
	}

	public toSerializedArray(sizeKey?: string): StorageContextEntityArray<V, T> {
		return new StorageContextEntityArray(this, sizeKey);
	}

	public reloadAllValues(): Promise<V[]> {
		return Promise.all(this.entries().map(entity => entity.load()));
	}
}