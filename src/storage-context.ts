import { StorageContextUtility } from './storage-context-utility';
import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { getDefaultStorageContextOptions, StorageContextOptions } from './storage-context-options';
import { StorageContextEntity } from './storage-context-entity';
import { StorageTransportApiMask } from './storage-transport-api-mask';
import { StorageContextEntitySet } from './storage-context-entity-set';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageContextEntityArray } from './storage-context-entity-array';

const { findOrCreateMapEntry, toArray } = StorageContextUtility;

/**
 * Simplified type for generic use-cases.
 */
export type SerializationContext = StorageContext<StorageTransportApiMask>;

/**
 * Represents an isolated context for key/value pairs and entities.
 * Here, a "context" is essentially type-enforced namespace for keys.
 * 
 * So a context with a prefix of "myFeatureStorage" would have keys like
 * - "myFeatureStorage$itemCount"
 * - "myFeatureStorage$someSubContext$item42"
 * - "myFeatureStorage$someSubContext$entityMap$length"
 */
export class StorageContext<T extends StorageTransportApiMask> implements StorageTransportApiMask {

	public static absolutePrefixSeparator: string = '$';

	private readonly mSubContexts: Map<string, StorageContext<StorageContext<T>>> = new Map();
	private readonly mKeyValuePairs: Map<string, StorageContextKeyValuePair<T>> = new Map();

	constructor(
		public readonly transport: T,
		public readonly options: StorageContextOptions = getDefaultStorageContextOptions(),
		private readonly parent: StorageContext<StorageTransportApiMask> | null = null
	) {
	}

	public getItem(key: string): Promise<string> {
		return this.transport.getItem(this.getAbsoluteKey(key));
	}

	public setItem(key: string, value: string): Promise<void> {
		return this.transport.setItem(this.getAbsoluteKey(key), value);
	}

	public removeItem(key: string): Promise<void> {
		return this.transport.removeItem(this.getAbsoluteKey(key));
	}

	public clear(): Promise<void> {
		return this.transport.clear();
	}

	public async keys(): Promise<string[]> {
		const keys = await this.transport.keys();
		const prefix = this.absoluteKeyPrefix;
		const sanitizedKeys: string[] = toArray(keys);
		return sanitizedKeys.filter(k => (k + '').startsWith(prefix));
	}

	public getAbsoluteKey(relativeKey: string): string {
		return this.createCombinedKey([this.absoluteKeyPrefix, relativeKey]);
	}

	public get absoluteKeyPrefix(): string {
		return this.generateAbsolutePrefixPath();
	}

	public getSubContext(prefix: string, options: Partial<StorageContextOptions> = {}): StorageContext<StorageContext<T>> {
		return findOrCreateMapEntry(this.mSubContexts, prefix, () => new StorageContext(this, Object.assign({}, options, { prefix }), this));
	}

	public getKeyValuePair(key: string): StorageContextKeyValuePair<T> {
		return findOrCreateMapEntry(this.mKeyValuePairs, key, () => new StorageContextKeyValuePair(this, key));
	}

	public getEntity<V>(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V, T> {
		return this.getKeyValuePair(key).asEntity<V>(options);
	}

	public createEntitySet<V>(sharedOptions?: StorageContextEntityOptions<V>): StorageContextEntitySet<V, T> {
		return new StorageContextEntitySet(this, sharedOptions);
	}

	public createEntityArray<V>(sharedOptions?: StorageContextEntityOptions<V>, sizeKey?: string): StorageContextEntityArray<V, T> {
		return this.createEntitySet<V>(sharedOptions).toSerializedArray(sizeKey);
	}

	private createCombinedKey(parts: string[]): string {
		return toArray(parts)
			.filter(v => v)
			.join(StorageContext.absolutePrefixSeparator);
	}

	private generateAbsolutePrefixPath(): string {

		let stack: StorageContext<StorageTransportApiMask>[] = [];
		let target: StorageContext<StorageTransportApiMask> | null = this;

		while (target && !stack.includes(target)) {
			stack.unshift(target);
			target = target.parent;
		}

		const keyParts = stack.map(s => s.options.prefix);
		return this.createCombinedKey(keyParts);
	}
}