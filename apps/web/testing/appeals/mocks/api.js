import nock from 'nock';
import { appealData, appealsNationalList } from '../../app/fixtures/referencedata.js';

/**
 * @returns {{ destroy: () => void }}
 */
export function installMockAppealsService() {
	// national list
	nock('http://test/').get('/appeals/').reply(200, appealsNationalList).persist();

	// appeal details
	nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData).persist();

	nock('http://test/').get('/appeals/0').reply(500).persist();

	return {
		destroy: () => {
			nock.cleanAll();
		}
	};
}
