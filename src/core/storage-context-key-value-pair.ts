import { StorageContext } from './storage-context';
import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageContextUtility } from './storage-context-utility';

const { optFalsyValue } = StorageContextUtility;

/**
 * Represents a single key/value pair for a target context/transport.
 * This eliminates the need for manual key string referencing for each of the standard transport methods.
 */
export class StorageContextKeyValuePair {

	constructor(
		public readonly context: StorageContext,
		public readonly key: string
	) {
	}

	public get absoluteKey(): string {
		return this.context.getAbsoluteKey(this.key);
	}

	public asEntity<V>(options?: StorageContextEntityOptions<V>): StorageContextEntity<V> {
		return new StorageContextEntity(this, options);
	}

	public clear(): Promise<void> {
		return this.context.removeItem(this.key);
	}

	public save(update: string): Promise<void> {
		return this.context.setItem(this.key, update);
	}

	public async load(defaultValue?: string): Promise<string | undefined> {
		const result = await this.context.getItem(this.key);
		return optFalsyValue(result as any, defaultValue);
	}
}