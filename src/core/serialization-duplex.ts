import { StorageContextUtility } from './storage-context-utility';

/**
 * 2-way transformation definition used by pipe constructs.
 */
export interface SerializationDuplex<T> {
	serialize(value: T): string;
	deserialize(data: string, fallback?: T): T;
}

/**
 * This is a naive implementation that assumes your data is valid JSON.
 */
export const getJSONSerializationDuplex = <T>(): SerializationDuplex<T> => {
	return {
		serialize: (value: T) => {
			return StorageContextUtility.bombShield(() => JSON.stringify(value), (value + '<NonSerializable>'));
		},
		deserialize: (data: string, fallback?: T) => {
			return StorageContextUtility.bombShield(() => JSON.parse(data), StorageContextUtility.optDefined(fallback, data as any));
		}
	};
};