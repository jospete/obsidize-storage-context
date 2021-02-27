import { SerializedEntity, StorageContextEntity } from './storage-context-entity';
import { StorageContextEntitySet } from './storage-context-entity-set';
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
		public readonly entitySet: StorageContextEntitySet<V, T>,
		sizeKey: string = 'length'
	) {
		this.sizeEntity = this.entitySet.context.getEntity<number>(sizeKey);
	}

	public get(index: number): StorageContextEntity<V, T> {
		return this.entitySet.getEntity(index + '');
	}

	public async load(defaultValue?: V): Promise<V[]> {

		const size = await this.sizeEntity.load(0);
		const result: V[] = [];

		for (let i = 0; i < size; i++) {
			result[i] = await this.get(i).load(defaultValue);
		}

		return result;
	}

	public async save(values: V[]): Promise<V[]> {

		const safeValues: V[] = [].slice.call(values);
		const targetLength = safeValues.length;
		await this.sizeEntity.save(targetLength);

		for (let i = 0; i < targetLength; i++) {
			await this.get(i).save(safeValues[i]);
		}

		return safeValues;
	}
}