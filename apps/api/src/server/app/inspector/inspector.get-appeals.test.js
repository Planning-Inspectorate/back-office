// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'decision_due',
	createdAt: new Date(2022, 1, 23),
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton',
	},
	startedAt: new Date(2022, 1, 25),
	address: {
		addressLine1: '96 The Avenue',
		town: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	siteVisit: {
		visitDate: new Date(2021, 10, 2),
		visitSlot: '1pm - 2pm',
		visitType: 'unaccompanied'
	},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	}
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'site_visit_booked',
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {
		visitDate: new Date(2022, 0, 10),
		visitSlot: '10am - 11am',
		visitType: 'accompanied'
	},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	}
};

const appeal_3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'site_visit_not_yet_booked',
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	}
};

const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'site_visit_not_yet_booked',
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: false
	}
};

const appeal_5 = {
	id: 5,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'site_visit_not_yet_booked',
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	}
};

const findManyStub = sinon.stub().returns([appeal_1, appeal_2, appeal_3, appeal_4, appeal_5]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: findManyStub
			}
		};
	}
}

test('gets all appeals assigned to inspector', async (t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));

	const clock = sinon.useFakeTimers({ now: 1_649_319_144_000 });

	const resp = await request.get('/inspector').set('userId', 1);

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			appealId: 1,
			reference: 'APP/Q9999/D/21/1345264',
			status: 'decision due',
			appealSite: {
				addressLine1: '96 The Avenue',
				county: 'Kent',
				postCode: 'MD21 5XY',
				town: 'Maidstone',
			},
			appealAge: 46,
			siteVisitType: 'unaccompanied',
			appealType: 'HAS',
			siteVisitDate: '02 Nov 2021',
			siteVisitSlot: '1pm - 2pm'
		},
		{
			appealId: 2,
			reference: 'APP/Q9999/D/21/5463281',
			status: 'booked',
			appealSite: {
				addressLine1: '55 Butcher Street',
				postCode: 'S63 0RB',
				town: 'Thurnscoe',
			},
			appealAge: 17,
			siteVisitType: 'accompanied',
			appealType: 'HAS',
			siteVisitDate: '10 Jan 2022',
			siteVisitSlot: '10am - 11am',
		},
		{
			appealAge: 17,
			appealId: 3,
			appealSite: {
				addressLine1: '55 Butcher Street',
				postCode: 'S63 0RB',
				town: 'Thurnscoe',
			},
			appealType: 'HAS',
			reference: 'APP/Q9999/D/21/5463281',
			status: 'not yet booked',
			provisionalVisitType: 'access required'
		},
		{
			appealAge: 17,
			appealId: 4,
			appealSite: {
				addressLine1: '55 Butcher Street',
				postCode: 'S63 0RB',
				town: 'Thurnscoe',
			},
			appealType: 'HAS',
			reference: 'APP/Q9999/D/21/5463281',
			status: 'not yet booked',
			provisionalVisitType: 'access required'
		},
		{
			appealAge: 17,
			appealId: 5,
			appealSite: {
				addressLine1: '55 Butcher Street',
				postCode: 'S63 0RB',
				town: 'Thurnscoe',
			},
			appealType: 'HAS',
			reference: 'APP/Q9999/D/21/5463281',
			status: 'not yet booked',
			provisionalVisitType: 'unaccompanied'
		}
	]);
	sinon.assert.calledWith(findManyStub, {
		where: {
			status: {
				in: [
					'site_visit_not_yet_booked',
					'site_visit_booked',
					'decision_due'
				]
			},
			userId: 1
		},
		include: {
			address: true,
			siteVisit: true,
			lpaQuestionnaire: true,
			appealDetailsFromAppellant: true,
			appellant: true
		}
	});
});

test('throws error if userid is not provided in the header', async(t) => {
	const resp = await request.get('/inspector');
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Must provide userid' });
});
