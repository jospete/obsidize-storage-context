import { findOrCreateMapEntry } from './find-or-create-map-entry';
import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContextEntitySet<V, T extends StorageTransportApiMask> {

	public readonly entityMap: Map<string, StorageContextEntity<V, StorageContext<T>>> = new Map();

	constructor(
		public readonly context: StorageContext<T>,
		public readonly sharedOptions: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public getEntity(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V, StorageContext<T>> {
		return findOrCreateMapEntry(this.entityMap, key, () => this.context.getKeyValuePair(key).asEntity<V>(options));
	}

	public keys(): string[] {
		return Array.from(this.entityMap.keys());
	}

	public values(): V[] {
		return this.entitySet().map(entity => entity.value);
	}

	public entitySet(): StorageContextEntity<V, StorageContext<T>>[] {
		return Array.from(this.entityMap.values());
	}

	public load(): Promise<V[]> {
		return Promise.all(this.entitySet().map(entity => entity.load()));
	}

	public async save(): Promise<void> {
		await Promise.all(this.entitySet().map(entity => entity.entry.apply()));
	}
}