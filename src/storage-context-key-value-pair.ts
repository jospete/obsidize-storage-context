import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Simplified type for generic use-cases.
 */
export type SerializedKeyValuePair = StorageContextKeyValuePair<StorageTransportApiMask>;

/**
 * Represents a single key/value pair for a target context/transport.
 * This eliminates the need for manual key string referencing for each of the standard transport methods.
 */
export class StorageContextKeyValuePair<T extends StorageTransportApiMask> {

	private mValue: string = '';

	constructor(
		public readonly context: StorageContext<T>,
		public readonly key: string
	) {
	}

	public get absoluteKey(): string {
		return this.context.getAbsoluteKey(this.key);
	}

	public get value(): string {
		return this.mValue;
	}

	public asEntity<V>(options?: StorageContextEntityOptions<V>): StorageContextEntity<V, T> {
		return new StorageContextEntity(this, options);
	}

	public clear(): Promise<void> {
		return this.context.removeItem(this.key);
	}

	public apply(): Promise<void> {
		return this.save(this.value);
	}

	public save(update: string): Promise<void> {
		this.mValue = update;
		return this.context.setItem(this.key, this.value);
	}

	public async load(): Promise<string> {
		this.mValue = await this.context.getItem(this.key);
		return this.value;
	}
}