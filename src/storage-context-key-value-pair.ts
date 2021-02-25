import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Represents a single key/value pair for a target context/transport.
 * This eliminates the need for manual key string referencing for each of the standard transport methods.
 */
export class StorageContextKeyValuePair<T extends StorageTransportApiMask> {

	private mValue: string = '';

	constructor(
		public readonly transport: T,
		public readonly key: string
	) {
	}

	public get value(): string {
		return this.mValue;
	}

	public asEntity<V>(options?: StorageContextEntityOptions<V>): StorageContextEntity<V, T> {
		return new StorageContextEntity(this, options);
	}

	public clear(): Promise<void> {
		return this.transport.removeItem(this.key);
	}

	public apply(): Promise<void> {
		return this.save(this.value);
	}

	public save(update: string): Promise<void> {
		this.mValue = update;
		return this.transport.setItem(this.key, this.value);
	}

	public async load(): Promise<string> {
		this.mValue = await this.transport.getItem(this.key);
		return this.value;
	}
}