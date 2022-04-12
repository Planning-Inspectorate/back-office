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
	status: 'available_for_inspector_pickup',
	createdAt: new Date(2022, 1, 23),
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	},
	userId: undefined
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'available_for_inspector_pickup',
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
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	},
	userId: undefined
};

const appeal_3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'available_for_inspector_pickup',
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: false
	},
	userId: undefined
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: false
	},
	userId: undefined
};

const appeal_5 = {
	id: 5,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'available_for_inspector_pickup',
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
		siteVisibleFromPublicLand: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: false
	},
	userId: 10
};

const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 }, include: { address: true, appellant: true, appealDetailsFromAppellant: true } }).returns(appeal_1);
findUniqueStub.withArgs({ where: { id: 2 }, include: { address: true, appellant: true, appealDetailsFromAppellant: true } }).returns(appeal_2);
findUniqueStub.withArgs({ where: { id: 3 }, include: { address: true, appellant: true, appealDetailsFromAppellant: true } }).returns(appeal_3);
findUniqueStub.withArgs({ where: { id: 4 }, include: { address: true, appellant: true, appealDetailsFromAppellant: true } }).returns(appeal_4);
findUniqueStub.withArgs({ where: { id: 5 }, include: { address: true, appellant: true, appealDetailsFromAppellant: true } }).returns(appeal_5);

const updateStub = sinon.stub();

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub,
				update: updateStub
			}
		};
	}
}

test.before('setup mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
	const clock = sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('assigns all appeals as they are all available', async(t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1).send([1, 2, 3]);
	t.is(resp.status, 200);
	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: { updatedAt: sinon.match.any, status: 'site_visit_not_yet_booked', user: { connect: { id: 1 } } }
	});
	sinon.assert.calledWith(updateStub, {
		where: { id: 2 },
		data: { updatedAt: sinon.match.any, status: 'site_visit_not_yet_booked', user: { connect: { id: 1 } }  }
	});
	sinon.assert.calledWith(updateStub, {
		where: { id: 3 },
		data: { updatedAt: sinon.match.any, status: 'site_visit_not_yet_booked', user: { connect: { id: 1 } }  }
	});
	t.deepEqual(resp.body, { successfullyAssigned: [{
		appealId: 1,
		reference: 'APP/Q9999/D/21/1345264',
		appealType: 'HAS',
		specialist: 'General',
		provisionalVisitType: 'access required',
		appealSite: {
			addressLine1: '96 The Avenue',
			county: 'Kent',
			town: 'Maidstone',
			postCode: 'MD21 5XY'
		},
		appealAge: 41
	}, {
		appealId: 2,
		reference: 'APP/Q9999/D/21/5463281',
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'unaccompanied',
		appealSite: {
			addressLine1: '55 Butcher Street',
			town: 'Thurnscoe',
			postCode: 'S63 0RB'
		}
	}, {
		appealId: 3,
		reference: 'APP/Q9999/D/21/5463281',
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'access required',
		appealSite: {
			addressLine1: '55 Butcher Street',
			town: 'Thurnscoe',
			postCode: 'S63 0RB'
		}
	}], unsuccessfullyAssigned: [] });
});

// test('unable to assign appeals that are not in the appropriate state', async(t) => {
// 	const resp = await request.post('/inspector/assign').set('userId', 1).send([3, 4]);
// 	t.is(resp.status, 200);
// 	sinon.assert.calledWith(updateStub, {
// 		where: { id: 3 },
// 		data: { updatedAt: sinon.match.any, status: 'site_visit_not_yet_booked', user: { connect: { id: 1 } }  }
// 	});
// 	t.deepEqual(resp.body, { successfullyAssigned: [{
// 		id: 3,
// 		reference: 'APP/Q9999/D/21/5463281'
// 	}], unsuccessfullyAssigned: [{ appealId: 4, reason: 'appeal in wrong state' }] });
// });

// test('unable to assign appeals that are already assigned to someone', async (t) => {
// 	const resp = await request.post('/inspector/assign').set('userId', 1).send([1, 5]);
// 	t.is(resp.status, 200);
// 	sinon.assert.calledWith(updateStub, {
// 		where: { id: 1 },
// 		data: { updatedAt: sinon.match.any, status: 'site_visit_not_yet_booked', user: { connect: { id: 1 } }  }
// 	});
// 	t.deepEqual(resp.body, { successfullyAssigned: [{
// 		id: 1,
// 		reference: 'APP/Q9999/D/21/1345264'
// 	}], unsuccessfullyAssigned: [{ appealId: 5, reason: 'appeal already assigned' }] });
// });

// test('throws error if no userid provided', async(t) => {
// 	const resp = await request.post('/inspector/assign').send([1]);
// 	t.is(resp.status, 400);
// 	t.deepEqual(resp.body, { error: 'Must provide userid' });
// });

// test('throws error if no appeals provided', async(t) => {
// 	const resp = await request.post('/inspector/assign').set('userId', 1);
// 	t.is(resp.status, 400);
// 	t.deepEqual(resp.body, { error: 'Must provide appeals to assign' });
// });

// test('throws error if empty array of appeals provided', async(t) => {
// 	const resp = await request.post('/inspector/assign').set('userId', 1).send([]);
// 	t.is(resp.status, 400);
// 	t.deepEqual(resp.body, { error: 'Must provide appeals to assign' });
// });
