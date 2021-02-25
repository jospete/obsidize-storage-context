import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { StorageContextOptions } from './storage-context-options';
import { StorageContextEntity } from './storage-context-entity';
import { StorageTransportApiMask } from './storage-transport-api-mask';

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

	constructor(
		public readonly transport: T,
		public readonly options: StorageContextOptions,
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
		const sanitizedKeys: string[] = [].slice.call(keys);
		return sanitizedKeys.filter(k => k && k.startsWith(prefix));
	}

	public getAbsoluteKey(relativeKey: string): string {
		return this.absoluteKeyPrefix + relativeKey;
	}

	public get absoluteKeyPrefix(): string {
		return this.generateAbsolutePrefixPath();
	}

	public createSubContext(prefix: string, options: Partial<StorageContextOptions> = {}): StorageContext<StorageContext<T>> {
		return new StorageContext(this, Object.assign({}, options, { prefix }), this);
	}

	public getKeyValuePair(key: string): StorageContextKeyValuePair<StorageContext<T>> {
		return new StorageContextKeyValuePair(this, key);
	}

	public getEntity<V>(key: string): StorageContextEntity<V, StorageContext<T>> {
		return this.getKeyValuePair(key).asEntity<V>();
	}

	private generateAbsolutePrefixPath(): string {

		let stack: StorageContext<StorageTransportApiMask>[] = [];
		let target: StorageContext<StorageTransportApiMask> | null = this;

		while (target && !stack.includes(target)) {
			stack.unshift(target);
			target = target.parent;
		}

		return stack
			.map(s => s.options.prefix)
			.join(StorageContext.absolutePrefixSeparator);
	}
}