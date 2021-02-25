/**
 * Customization options for a StorageContext instance.
 */
export interface StorageContextOptions {
	prefix: string;
}

export const getDefaultStorageContextOptions = (): StorageContextOptions => {
	return {
		prefix: ''
	};
};