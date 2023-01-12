import {
	BlobServiceClient,
	ContainerSASPermissions,
	generateBlobSASQueryParameters,
	SASProtocol
} from '@azure/storage-blob';
import config from '../../../environment/config.js';

/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@azure/storage-blob').ServiceGetUserDelegationKeyResponse} DelegationKey */

const sasTokenStartTime = () => new Date(Date.now() - 60 * 1000);
const sasTokenExpirationTime = () => new Date(Date.now());

const { blobStorageUrl, blobStorageAccountName } = config;

/**
 * Get the Azure user delegation key
 *
 * @param {AccessToken} accessToken
 * @returns {Promise<DelegationKey>}
 */
const createDelegationKey = async (accessToken) => {
	const credentials = {
		getToken: () => Promise.resolve(accessToken)
	};

	const blobServiceClient = new BlobServiceClient(blobStorageUrl, credentials);

	return blobServiceClient.getUserDelegationKey(sasTokenStartTime(), sasTokenExpirationTime());
};

/**
 * Generate a user delegation SAS token
 *
 * @param {AccessToken} accessToken
 * @param {string} containerName
 * @param {string} blobName
 * @returns {Promise<string>}
 */
const createSasToken = async (accessToken, containerName, blobName) => {
	// Use the AD access token to get a "delegation key"
	const userDelegationKey = await createDelegationKey(accessToken);

	const sasOptions = {
		// specific containerName
		containerName,
		// specific blobName
		blobName,
		// read only
		permissions: ContainerSASPermissions.parse('r'),
		protocol: SASProtocol.Https,
		// token starts a few seconds in the past
		startsOn: sasTokenStartTime(),
		// expires immediately but due to server latency could take up to 40s
		expiresOn: sasTokenExpirationTime()
	};

	// generate a "user delegation SAS token",
	// i.e. a SAS token based on user credentials rather than azure account
	const sasToken = generateBlobSASQueryParameters(
		sasOptions,
		userDelegationKey,
		blobStorageAccountName
	).toString();

	return `?${sasToken}`;
};

export default createSasToken;
