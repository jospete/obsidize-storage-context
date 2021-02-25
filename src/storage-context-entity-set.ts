import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContextEntitySet<V, T extends StorageTransportApiMask> {

	public readonly entries: Map<string, StorageContextEntity<V, StorageContext<T>>> = new Map();

	constructor(
		public readonly context: StorageContext<T>,
		public readonly sharedOptions: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public getEntity(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V, StorageContext<T>> {

		let entity = this.entries.get(key);

		if (!entity) {
			options = options || this.sharedOptions;
			entity = this.context.getKeyValuePair(key).asEntity<V>(options);
			this.entries.set(key, entity);
		}

		return entity;
	}
}