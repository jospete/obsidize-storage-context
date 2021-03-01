/**
 * Utility for faking localstorage objects as needed.
 */
export class MockBrowserStorage implements Storage {

	[name: string]: any;

	public readonly content: Map<string, string> = new Map();
	private mKeys: string[] = [];

	public get length(): number {
		return this.keys().length;
	}

	public key(index: number): string {
		return this.keys()[index];
	}

	public getItem(key: string): string | null {
		return this.content.get(key) || null;
	}

	public setItem(key: string, value: string): void {
		this.content.set(key, value);
		this.reloadKeys();
	}

	public removeItem(key: string): void {
		this.content.delete(key);
		this.reloadKeys();
	}

	public clear(): void {
		this.content.clear();
		this.reloadKeys();
	}

	public keys(): string[] {
		return this.mKeys;
	}

	private reloadKeys(): void {
		this.mKeys = this.mapKeys();
	}

	private mapKeys(): string[] {
		return Array.from(this.content.keys());
	}

	public toJSON(): { [key: string]: any } {

		const result: { [key: string]: any } = {};

		this.content.forEach((value: any, key: string) => {
			result[key] = value;
		});

		return result;
	}
}