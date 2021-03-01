import { SerializedEntity, StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityMap } from './storage-context-entity-map';
import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Simplified type for generic use-cases.
 */
export type SerializedEntityArray<V> = StorageContextEntityArray<V, StorageTransportApiMask>;

/**
 * Represents a serialized array of items of type V.
 */
export class StorageContextEntityArray<V, T extends StorageTransportApiMask> {

	public readonly sizeEntity: SerializedEntity<number>;

	constructor(
		public readonly entitySet: StorageContextEntityMap<V, T>,
		sizeKey: string = 'length'
	) {
		this.sizeEntity = this.entitySet.context.createEntity<number>(sizeKey);
	}

	public get(index: number): StorageContextEntity<V, T> {
		return this.entitySet.getEntity(index + '');
	}

	public async clear(): Promise<void> {
		await this.save([]);
	}

	public async load(defaultValue: V[] = []): Promise<V[]> {

		const size = await this.sizeEntity.load(0);
		const result: V[] = [];

		for (let i = 0; i < size; i++) {
			result[i] = await this.get(i).load(defaultValue[i]);
		}

		return result;
	}

	public async save(values: V[]): Promise<V[]> {
		const safeValues: V[] = [].slice.call(values);
		const size = safeValues.length;
		await this.sizeEntity.save(size);
		await Promise.all(safeValues.map((value: V, index: number) => this.get(index).save(value)));
		return safeValues;
	}
}