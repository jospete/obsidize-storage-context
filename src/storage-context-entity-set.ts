import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContextEntitySet<V, T extends StorageTransportApiMask> {

	public readonly entries: Map<string, StorageContextEntity<V, StorageContext<T>>> = new Map();

	constructor(
		public readonly context: StorageContext<T>
	) {
	}

	public getEntity(key: string): StorageContextEntity<V, StorageContext<T>> {

		let entity = this.entries.get(key);

		if (!entity) {
			entity = this.context.getKeyValuePair(key).asEntity<V>();
			this.entries.set(key, entity);
		}

		return entity;
	}
}