import {
	AccountSASPermissions,
	AccountSASResourceTypes,
	AccountSASServices,
	generateAccountSASQueryParameters,
	SASProtocol,
	StorageSharedKeyCredential
} from '@azure/storage-blob';
import config from '../../../environment/config.js';

const createSasToken = async () => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		config.blobStorageAccountName,
		config.blobStorageAccountKey
	);

	const sasOptions = {
		services: AccountSASServices.parse('btqf').toString(),
		resourceTypes: AccountSASResourceTypes.parse('sco').toString(),
		permissions: AccountSASPermissions.parse('r'),
		protocol: SASProtocol.Https,
		startsOn: new Date(Date.now() - 60 * 1000),
		expiresOn: new Date(Date.now())
	};

	const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

	return `?${sasToken}`;
};

export default createSasToken;
