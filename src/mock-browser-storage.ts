/**
 * Utility for faking localstorage objects as needed.
 */
export class MockBrowserStorage implements Storage {

	[name: string]: any;

	public readonly content: Map<string, string> = new Map();

	public get length(): number {
		return this.content.size;
	}

	public key(index: number): string {
		return this.keys()[index];
	}

	public getItem(key: string): string | null {
		return this.content.get(key) || null;
	}

	public setItem(key: string, value: string): void {
		this.content.set(key, value);
	}

	public removeItem(key: string): void {
		this.content.delete(key);
	}

	public clear(): void {
		this.content.clear();
	}

	public keys(): string[] {
		return Array.from(this.content.keys());
	}
}