import nock from 'nock';

/**
 * @returns {{ destroy: () => void }}
 */
export function installMockApplicationsService() {
	return {
		destroy: () => {
			nock.cleanAll();
		}
	};
}
