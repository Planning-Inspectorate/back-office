import {
	TEST_API_HOST,
	TEST_BLOB_ACCOUNT,
	TEST_BLOB_PUBLISH_CONTAINER,
	TEST_BLOB_SOURCE_CONTAINER
} from '../test-utils/test-constants.js';

process.env.API_HOST = TEST_API_HOST;
process.env.BLOB_STORAGE_ACCOUNT_HOST = `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net`;
process.env.BLOB_PUBLISH_CONTAINER = TEST_BLOB_PUBLISH_CONTAINER;
process.env.BLOB_SOURCE_CONTAINER = TEST_BLOB_SOURCE_CONTAINER;
