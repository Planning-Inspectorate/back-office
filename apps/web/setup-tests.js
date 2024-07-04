// Install mocks for third-party integration
import './testing/app/mocks/msal.js';
import { jest } from '@jest/globals';

jest.unstable_mockModule('@pins/blob-storage-client', () => ({
	BlobStorageClient: jest.fn().mockReturnValue({})
}));
