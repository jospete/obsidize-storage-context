import { bombShield } from './bomb-shield';

/**
 * 2-way transformation definition used by pipe constructs.
 */
export interface SerializationDuplex<T> {
	serialize(value: T): string;
	deserialize(data: string): T;
}

/**
 * This is a naive implementation that assumes your data is valid JSON.
 */
export const getJSONSerializationDuplex = <T>(): SerializationDuplex<T> => {
	return {
		serialize: value => bombShield(() => JSON.stringify(value), (value + '')),
		deserialize: data => bombShield(() => JSON.parse(data), data)
	};
};