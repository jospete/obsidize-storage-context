/**
 * Customization options for a StorageContext instance.
 */
export interface StorageContextOptions {
	readonly prefix: string;
}

export const getDefaultStorageContextOptions = (): StorageContextOptions => {
	return {
		prefix: ''
	};
};