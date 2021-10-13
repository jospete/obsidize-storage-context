import { StorageContextUtility } from './storage-context-utility';
import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityArray } from './storage-context-entity-array';
import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';

/**
 * Represents a collection of StorageContextEntity instances of the same value type.
 */
export class StorageContextEntityMap<V> {

	public readonly content: Map<string, StorageContextEntity<V>> = new Map();

	constructor(
		public readonly context: StorageContext,
		public readonly sharedOptions: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public getEntity(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V> {
		return StorageContextUtility.findOrCreateMapEntry(this.content, key, () => this.context.createEntity<V>(key, options));
	}

	public entries(): StorageContextEntity<V>[] {
		return Array.from(this.content.values());
	}

	public toSerializedArray(sizeKey?: string): StorageContextEntityArray<V> {
		return new StorageContextEntityArray(this, sizeKey);
	}

	public reloadAllValues(): Promise<V[]> {
		return Promise.all(this.entries().map(entity => entity.load()));
	}
}