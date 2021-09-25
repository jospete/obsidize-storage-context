import { BrowserStorageTransport, StorageContext } from '../src';

describe('README Example', () => {

	it('can run the readme example', async () => {

		const browserTransport = new BrowserStorageTransport(localStorage);
		const baseContext = new StorageContext(browserTransport);
		const context = baseContext.getSubContext('namespace_for_your_feature');

		const userEmail = context.getKeyValuePair('userEmail');
		console.log(userEmail.absoluteKey); // 'namespace_for_your_feature$userEmail';

		const userId = context.createEntity<number>('userId');
		console.log(userId.keyValuePair.absoluteKey); // 'namespace_for_your_feature$userId';

		const emailValue = await userEmail.load('Does Not Exist');
		console.log(emailValue); // 'Does Not Exist'

		await userEmail.save('test@test.org');
		const emailValue2 = await userEmail.load('Does Not Exist');
		console.log(emailValue2); // 'test@test.org'

		const userIdValue = await userId.load(-1);
		console.log(userIdValue); // -1

		await userId.save(42);
		const userIdValue2 = await userId.load(-1);
		console.log(userIdValue2); // 42
		console.log(typeof userIdValue2); // 'number'
	});
});