import {
	AccountSASPermissions,
	AccountSASResourceTypes,
	AccountSASServices,
	generateAccountSASQueryParameters,
	SASProtocol,
	StorageSharedKeyCredential
} from '@azure/storage-blob';

const blobStorageService = () => {
	const constants = {
		accountName: process.env.accountName || '',
		accountKey: process.env.accountKey || ''
	};

	/**
	 *
	 */
	const createAccountSas = async () => {
		const sharedKeyCredential = new StorageSharedKeyCredential(
			constants.accountName,
			constants.accountKey
		);

		const sasOptions = {
			services: AccountSASServices.parse('btqf').toString(),
			resourceTypes: AccountSASResourceTypes.parse('sco').toString(),
			permissions: AccountSASPermissions.parse('r'),
			protocol: SASProtocol.Https,
			startsOn: new Date(Date.now() - 40_000_000),
			expiresOn: new Date(Date.now() + 100 * 60 * 1000)
		};

		const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

		return sasToken[0] === '?' ? sasToken : `?${sasToken}`;
	};

	return { createAccountSas };
};

export default blobStorageService;
