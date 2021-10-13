/**
 * Common static utilities for this module.
 */
export namespace StorageContextUtility {

	export function isUndefined(v: any): boolean {
		return typeof v === 'undefined';
	}

	export function isNull(value: any): boolean {
		return value === null;
	}

	export function optDefined<T>(value: T, fallback: T): T {
		return isUndefined(value) ? fallback : value;
	}

	export function optFalsyValue<T>(value: T, fallback: T): T {
		return (isUndefined(value) || isNull(value)) ? fallback : value;
	}

	export function bombShield<T>(action: () => T, fallbackValue?: T): T {

		try {
			return action();

		} catch (err) {
			return optDefined<any>(fallbackValue, err);
		}
	}

	export function findOrCreateMapEntry<K, V>(
		map: Map<K, V>,
		key: K,
		create: (key: K, map: Map<K, V>) => V
	): V {

		let entry = map.get(key);

		if (isUndefined(entry)) {
			entry = create(key, map);
			map.set(key, entry);
		}

		return entry as V;
	}
}