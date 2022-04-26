// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';
import formatAddress from '../../utils/address-formatter.js';

const request = supertest(app);

const appeal_1 = appealFactoryForTests(1, [{
	status: 'awaiting_lpa_questionnaire',
	valid: true
}], 'HAS', {}, { createdAt: new Date(2022, 1, 23), startedAt: new Date(2022, 4, 18) });

const appeal_2 = appealFactoryForTests(2, [{
	status: 'received_lpa_questionnaire',
	valid: true
}], 'HAS', {}, { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 4, 22) });

const appeal_3 = appealFactoryForTests(3, [{
	status: 'overdue_lpa_questionnaire',
	valid: true
}], 'HAS', {}, { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 4, 22) });

const appeal_4 = appealFactoryForTests(4, [{
	status: 'incomplete_lpa_questionnaire',
	valid: true
}], 'HAS', {}, { createdAt: new Date(2021, 12, 12), startedAt: new Date(2022, 3, 20) });

const findManyStub = sinon.stub();
findManyStub.returns([appeal_1, appeal_2, appeal_3, appeal_4]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: findManyStub
			}
		};
	}
}

test('gets the appeals information with received questionnaires', async (t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
	const resp = await request.get('/case-officer');
	const appealExample = [{
		AppealId : 1,
		AppealReference: appeal_1.reference,
		QuestionnaireDueDate: '01 Jun 2022',
		AppealSite: formatAddress(appeal_1.address),
		QuestionnaireStatus: 'awaiting'
	},
	{
		AppealId : 2,
		AppealReference: appeal_2.reference,
		QuestionnaireDueDate: '05 Jun 2022',
		AppealSite: formatAddress(appeal_2.address),
		QuestionnaireStatus: 'received'
	},
	{
		AppealId: 3,
		AppealReference: appeal_3.reference,
		AppealSite: formatAddress(appeal_3.address),
		QuestionnaireDueDate: '05 Jun 2022',
		QuestionnaireStatus: 'overdue',
	},
	{
		AppealId: 4,
		AppealReference: appeal_4.reference,
		AppealSite: formatAddress(appeal_4.address),
		QuestionnaireDueDate: '04 May 2022',
		QuestionnaireStatus: 'incomplete_lpa_questionnaire',
	}];
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExample);
});

