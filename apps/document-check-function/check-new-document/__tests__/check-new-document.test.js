import test from 'ava';
import got, { HTTPError } from 'got';
import { Readable } from 'node:stream';
import sinon from 'sinon';
import { clamAvClient } from '../clam-av-client.js';
import { checkMyBlob } from '../index.js';

const fileStream = new Readable();

// ------------------------
// Back Office API Stubbing
// ------------------------

const backOfficePatchStub = sinon.stub();

backOfficePatchStub
	.withArgs('test-api-host:3000/applications/1/documents/123-345/status', {
		json: {
			machineAction: 'check_pass'
		}
	})
	.returns({ json: sinon.stub() });
backOfficePatchStub
	.withArgs('test-api-host:3000/applications/1/documents/123-345/status', {
		json: {
			machineAction: 'check_fail'
		}
	})
	.returns({ json: sinon.stub() });
backOfficePatchStub
	.withArgs('test-api-host:3000/applications/1/documents/123-345-678/status', {
		json: {
			machineAction: 'check_fail'
		}
	})
	.returns({ json: sinon.stub() });

// doc that fails AV

const backOfficeFailedAVErrorResponse = {
	body: '{"errors":{"application":"Could not transition \'failed_virus_check\' using \'check_fail\'."}}',
	statusCode: 409
};

// @ts-ignore
const backOfficeFailedAVHttpError = new HTTPError(backOfficeFailedAVErrorResponse);

// @ts-ignore
backOfficeFailedAVHttpError.response = backOfficeFailedAVErrorResponse;

backOfficePatchStub
	.withArgs('test-api-host:3000/applications/1/documents/123-345-901/status', {
		json: {
			machineAction: 'check_fail'
		}
	})
	.throwsException(backOfficeFailedAVHttpError);

// doc that passes AV

const backOfficePassedAVErrorResponse = {
	body: '{"errors":{"application":"Could not transition \'not_user_checked\' using \'check_pass\'."}}',
	statusCode: 409
};

// @ts-ignore
const backOfficePassedAVHttpError = new HTTPError(backOfficePassedAVErrorResponse);

// @ts-ignore
backOfficePassedAVHttpError.response = backOfficePassedAVErrorResponse;

backOfficePatchStub
	.withArgs('test-api-host:3000/applications/1/documents/123-345-123/status', {
		json: {
			machineAction: 'check_pass'
		}
	})
	.throwsException(backOfficePassedAVHttpError);

// -----------------------------
// Document Storage API Stubbing
// -----------------------------

const documentStorageDeleteStub = sinon.stub();

documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345/test.pdf' }
	})
	.returns({ json: sinon.stub() });
documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345/test-that-has-been-marked-as-failed.pdf' }
	})
	.returns({ json: sinon.stub() });
documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345-901/test-that-has-been-marked-as-failed.pdf' }
	})
	.returns({ json: sinon.stub() });

const documentStorageErrorResponse = {
	body: '{"errors":{"documentPath":"Document does not exist in Blob Storage"}}',
	statusCode: 404
};
// @ts-ignore
const documentStorageHttpError = new HTTPError(documentStorageErrorResponse);

// @ts-ignore
documentStorageHttpError.response = documentStorageErrorResponse;

documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345-678/test-that-has-been-deleted.pdf' }
	})
	.throwsException(documentStorageHttpError);

const errorStub = sinon.stub();
const infoStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(got, 'patch').callsFake(backOfficePatchStub);
	sinon.stub(got, 'delete').callsFake(documentStorageDeleteStub);
});

test.serial('throws error if blob path doesnt have 4 parts', async (t) => {
	const error = await t.throwsAsync(async () => {
		await checkMyBlob(
			{ bindingData: { uri: '/applications/1/test.pdf' }, error: errorStub, info: infoStub },
			fileStream
		);
	});

	t.is(error?.message, 'Unexpected blob URI /applications/1/test.pdf');
});

test.serial(
	"if document passes AV checks, sends 'passed' machine action to back office if passed AV check",
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: false });
		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345/test.pdf' },
				error: errorStub,
				info: infoStub
			},
			fileStream
		);
		t.is(true, true);

		sinon.assert.calledWith(
			backOfficePatchStub,
			'test-api-host:3000/applications/1/documents/123-345/status',
			{
				json: { machineAction: 'check_pass' }
			}
		);
		clamAvClient.scanStream.restore();
	}
);

test.serial(
	"if document fails AV checks, sends 'failed' machine action to back office even if already deleted from blob storage",
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });
		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345-678/test-that-has-been-deleted.pdf' },
				error: errorStub,
				info: infoStub
			},
			fileStream
		);
		t.is(true, true);

		// Checks that we send a request to mark document as failed AV checks
		sinon.assert.calledWith(
			backOfficePatchStub,
			'test-api-host:3000/applications/1/documents/123-345-678/status',
			{
				json: { machineAction: 'check_fail' }
			}
		);

		clamAvClient.scanStream.restore();
	}
);

test.serial(
	'if document fails AV checks, deletes document from blob storage even if already marked as failed AV check in back office DB',
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });

		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345-901/test-that-has-been-marked-as-failed.pdf' },
				error: errorStub,
				info: infoStub
			},
			fileStream
		);
		t.is(true, true);

		// Checks that we send request to delete document
		sinon.assert.calledWith(documentStorageDeleteStub, 'http://localhost:3001/document', {
			json: { documentPath: '/applications/1/123-345-901/test-that-has-been-marked-as-failed.pdf' }
		});

		clamAvClient.scanStream.restore();
	}
);

test.serial(
	'if document passes AV checks, completes fine if already marked as passed AV checks',
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: false });

		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345-123/test-that-has-been-marked-as-passed.pdf' },
				error: errorStub,
				info: infoStub
			},
			fileStream
		);
		t.is(true, true);

		// Checks that we send request to delete document
		sinon.assert.neverCalledWith(documentStorageDeleteStub, 'http://localhost:3001/document', {
			json: { documentPath: '/applications/1/123-345-123/test-that-has-been-marked-as-passed.pdf' }
		});

		clamAvClient.scanStream.restore();
	}
);

test.serial(
	"if document fails AV checks, sends 'failed' machine action to back office and deletes from blob storage",
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });
		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345/test.pdf' },
				error: errorStub,
				info: infoStub
			},
			fileStream
		);
		t.is(true, true);

		sinon.assert.calledWith(
			backOfficePatchStub,
			'test-api-host:3000/applications/1/documents/123-345/status',
			{
				json: { machineAction: 'check_fail' }
			}
		);
		sinon.assert.calledWith(documentStorageDeleteStub, 'http://localhost:3001/document', {
			json: { documentPath: '/applications/1/123-345/test.pdf' }
		});

		clamAvClient.scanStream.restore();
	}
);
