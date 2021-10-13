import { StorageContextUtility } from './storage-context-utility';
import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { getDefaultStorageContextOptions, StorageContextOptions } from './storage-context-options';
import { StorageContextEntity } from './storage-context-entity';
import { StorageTransportApiMask } from './storage-transport-api-mask';
import { StorageContextEntityMap } from './storage-context-entity-map';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageContextEntityArray } from './storage-context-entity-array';

/**
 * Represents an isolated context for key/value pairs and entities.
 * Here, a "context" is essentially type-enforced namespace for keys.
 * 
 * So a context with a prefix of "myFeatureStorage" would have keys like
 * - "myFeatureStorage$itemCount"
 * - "myFeatureStorage$someSubContext$item42"
 * - "myFeatureStorage$someSubContext$entityMap$length"
 */
export class StorageContext implements StorageTransportApiMask {

	public static absolutePrefixSeparator: string = '$';

	private readonly mSubContexts: Map<string, StorageContext> = new Map();
	private readonly mKeyValuePairs: Map<string, StorageContextKeyValuePair> = new Map();

	constructor(
		public readonly transport: StorageTransportApiMask,
		public readonly options: StorageContextOptions = getDefaultStorageContextOptions(),
		protected readonly parent: StorageContext | null = null
	) {
	}

	public getItem(key: string): Promise<string | null | undefined> {
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
		const sanitizedKeys: string[] = Array.from(keys);
		return sanitizedKeys.filter(k => (k + '').startsWith(prefix));
	}

	public getAbsoluteKey(relativeKey: string): string {
		return this.createCombinedKey([this.absoluteKeyPrefix, relativeKey]);
	}

	public get absoluteKeyPrefix(): string {
		return this.generateAbsolutePrefixPath();
	}

	public getSubContext(prefix: string, options: Partial<StorageContextOptions> = {}): StorageContext {
		const generator = () => new StorageContext(this.transport, Object.assign({}, options, { prefix }), this);
		return StorageContextUtility.findOrCreateMapEntry(this.mSubContexts, prefix, generator);
	}

	public getKeyValuePair(key: string): StorageContextKeyValuePair {
		const generator = () => new StorageContextKeyValuePair(this, key);
		return StorageContextUtility.findOrCreateMapEntry(this.mKeyValuePairs, key, generator);
	}

	public createEntity<V>(key: string, options?: StorageContextEntityOptions<V>): StorageContextEntity<V> {
		return this.getKeyValuePair(key).asEntity<V>(options);
	}

	public createEntityMap<V>(sharedOptions?: StorageContextEntityOptions<V>): StorageContextEntityMap<V> {
		return new StorageContextEntityMap(this, sharedOptions);
	}

	public createEntityArray<V>(sharedOptions?: StorageContextEntityOptions<V>, sizeKey?: string): StorageContextEntityArray<V> {
		return this.createEntityMap<V>(sharedOptions).toSerializedArray(sizeKey);
	}

	private createCombinedKey(parts: string[]): string {
		return Array.from(parts)
			.filter(v => v)
			.join(StorageContext.absolutePrefixSeparator);
	}

	private generateAbsolutePrefixPath(): string {

		let stack: StorageContext[] = [];
		let target: StorageContext | null = this;

		while (target && !stack.includes(target)) {
			stack.unshift(target);
			target = target.parent;
		}

		const keyParts = stack.map(s => s.options.prefix);
		return this.createCombinedKey(keyParts);
	}
}