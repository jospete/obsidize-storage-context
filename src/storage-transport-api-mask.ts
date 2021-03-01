/**
 * Promise-based variant of the standard Storage interface:
 * https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
 */
export interface StorageTransportApiMask {
	getItem(key: string): Promise<string | null | undefined>;
	setItem(key: string, value: string): Promise<void>;
	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;
	keys(): Promise<string[]>;
}