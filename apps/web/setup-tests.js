// Install mocks for third-party integration
import './testing/app/mocks/msal.js';
import { jest } from '@jest/globals';

jest.unstable_mockModule('@pins/blob-storage-client', () => ({
	BlobStorageClient: jest.fn().mockReturnValue({})
}));

// mock azure-ai-language client for redaction tests
jest.unstable_mockModule('./src/server/lib/azure-ai-language.js', () => ({
	getAzureTextAnalyticsClient: jest.fn().mockReturnValue({
		// @ts-ignore
		recognizePiiEntities: jest.fn().mockResolvedValue([])
	}),
	getAzureLanguageCategories() {
		return undefined;
	}
}));

jest.unstable_mockModule('./src/server/lib/ai-redaction-client', () => ({
	aiRedactionClientPost: {
		post: jest.fn().mockResolvedValue({
			// @ts-ignore
			body: { pollEndpoint: 'abc', id: '123' }
		})
	}
}));
